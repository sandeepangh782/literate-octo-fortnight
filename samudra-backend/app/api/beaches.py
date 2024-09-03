from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from app.db.database import get_db
from app.models.beach import Beach
from app.models.user import User
from app.schemas.beach import (
    BeachOut,
    BeachList,
    BeachCreate,
    BeachUpdate,
    MarineConditions,
    WeatherConditions,
)
from typing import List, Optional
from sqlalchemy import func, case
from app.core.security import get_current_user
from app.services.google_places import get_place_image
from app.services.marine_services import get_marine_data
from app.services.weather_services import get_weather_data
from app.services.llm_services import generate_safety_points
from app.services.safety_ratings import get_safety_rating
from app.services.uv_index_service import get_uv_index_data
from geoalchemy2.functions import (
    ST_SetSRID,
    ST_MakePoint,
    ST_DistanceSphere,
)
import asyncio
import logging
from datetime import datetime
from fastapi_cache.decorator import cache


router = APIRouter()
logger = logging.getLogger("samudra_suraksha")

NULL = None


@router.get("/", response_model=BeachList)
async def get_beaches(
    skip: int = 0,
    limit: int = 10,
    state: Optional[str] = None,
    activity: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get a list of beaches with optional filtering"""
    query = db.query(Beach)
    if state:
        query = query.filter(Beach.state == state)
    if activity:
        query = query.filter(Beach.activities.any(activity))

    total = query.count()
    beaches = query.offset(skip).limit(limit).all()
    return {"total": total, "beaches": beaches}


@router.get("/search", response_model=BeachList)
@cache(expire=900)
async def search_beaches(
    query: str = Query(..., min_length=3),
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    db: Session = Depends(get_db),
):
    """Search beaches by name, city, or state, with location-based sorting"""
    beaches_query = db.query(Beach).filter(
        (func.lower(Beach.name).contains(func.lower(query))) | (func.lower(Beach.city).contains(func.lower(query))) | (func.lower(Beach.state).contains(func.lower(query)))
    )

    if lat is not None and lon is not None:
        # If coordinates are provided, calculate distance and order by it
        user_location = ST_SetSRID(ST_MakePoint(lon, lat), 4326)
        beaches_query = beaches_query.add_columns(
            ST_DistanceSphere(Beach.geom, user_location).label("distance")
        ).order_by("distance")

    beaches = beaches_query.all()

    beach_list = []
    for beach, distance in beaches:
        beach_dict = BeachOut.model_validate(beach).dict()
        marine_data, _, _ = await fetch_external_data(beach)

        swell_height = marine_data.get('swell_wave_height', {}).get('value', 0)
        current_velocity = marine_data.get('ocean_current_velocity', {}).get('value', 0)
        safety_rating = get_safety_rating(swell_height, current_velocity)

        safety_status_map = {0: "Green", 1: "Orange", 2: "Red", 3: "Yellow"}
        beach_dict["safety_status"] = safety_status_map.get(safety_rating, "Unknown")

        if distance is not None:
            beach_dict["distance"] = round(distance / 1000, 2)  # Convert meters to km
        else:
            beach_dict["distance"] = None

        beach_list.append(beach_dict)

    return {"total": len(beach_list), "beaches": beach_list}


@router.get("/nearby", response_model=List[BeachOut])
@cache(expire=900)
async def get_nearby_beaches(
    lat: float,
    lon: float,
    radius: float = 10.0,  # radius in km
    limit: int = 15,
    db: Session = Depends(get_db),
):
    """Get nearby beaches within a specified radius, named beaches first"""
    radius_meters = radius * 1000
    user_location = ST_SetSRID(ST_MakePoint(lon, lat), 4326)

    nearby_beaches = (
        db.query(Beach, ST_DistanceSphere(Beach.geom, user_location).label("distance"))
        .filter(ST_DistanceSphere(Beach.geom, user_location) <= radius_meters)
        .order_by(case((Beach.name != NULL, 0), (Beach.name == NULL, 1)), "distance")
        .limit(limit)
        .all()
    )

    logger.info(f"Beaches found within {radius} km: {len(nearby_beaches)}")

    beach_list = []
    for beach, distance in nearby_beaches:
        beach_dict = BeachOut.model_validate(beach).dict()
        marine_data, _, _ = await fetch_external_data(beach)

        swell_height = marine_data.get('swell_wave_height', {}).get('value', 0)
        current_velocity = marine_data.get('ocean_current_velocity', {}).get('value', 0)
        safety_rating = get_safety_rating(swell_height, current_velocity)

        safety_status_map = {0: "Green", 1: "Orange", 2: "Red", 3: "Yellow"}
        beach_dict["safety_status"] = safety_status_map.get(safety_rating, "Unknown")
        beach_dict["distance"] = round(distance / 1000, 2)  # Convert meters to km
        beach_list.append(beach_dict)

    return beach_list


async def fetch_external_data(beach):
    try:
        marine_data_task = get_marine_data(beach.latitude, beach.longitude)
        weather_data_task = get_weather_data(beach.latitude, beach.longitude)
        image_url_task = asyncio.to_thread(get_place_image, beach.name, (beach.latitude, beach.longitude))

        marine_data, weather_data, image_url = await asyncio.gather(
            marine_data_task, weather_data_task, image_url_task
        )
    except Exception as e:
        logger.error(f"Error fetching external data: {str(e)}")
        marine_data = get_default_marine_conditions()
        weather_data = get_default_weather_conditions()
        image_url = None

    return marine_data, weather_data, image_url


@router.get("/{beach_id}", response_model=BeachOut)
@cache(expire=900)  # Cache for 10 minutes
async def get_beach(beach_id: int, db: Session = Depends(get_db)):
    """Get detailed information for a specific beach"""
    beach = db.query(Beach).options(joinedload(Beach.favorited_by)).filter(Beach.id == beach_id).first()
    if beach is None:
        raise HTTPException(status_code=404, detail="Beach not found")

    beach_dict = BeachOut.model_validate(beach).dict()

    # Fetch external data
    marine_data, weather_data, image_url = await fetch_external_data(beach)

    # Fetch UV index data
    try:
        uv_data = await get_uv_index_data(beach.latitude, beach.longitude)
    except HTTPException as exc:
        logger.error(f"Error fetching UV index data for beach {beach_id}: {str(exc)}")
        uv_data = {
            "uv_index": {"value": None, "unit": "index"},
            "uv_index_level": "Unknown",
            "timestamp": None
        }

    beach_dict["image_url"] = image_url
    beach_dict["marine_conditions"] = MarineConditions(**marine_data)

    # Combine weather data with UV index data
    combined_weather_data = {
        **weather_data,
        "uv_index": uv_data["uv_index"]["value"],
        "uv_index_level": uv_data["uv_index_level"]
    }
    beach_dict["weather_conditions"] = WeatherConditions(**combined_weather_data)

    try:
        # Generate safety points using LLM
        safety_points = await generate_safety_points(beach_dict)
        beach_dict["safety_points"] = safety_points
    except Exception as exc:
        logger.error(f"Error generating safety points for beach {beach_id}: {str(exc)}")
        beach_dict["safety_points"] = ["Always follow lifeguard instructions and beach safety signs."]

    # Calculate safety rating
    swell_height = marine_data.get('swell_wave_height', {}).get('value', 0)
    current_velocity = marine_data.get('ocean_current_velocity', {}).get('value', 0)
    safety_rating = get_safety_rating(swell_height, current_velocity)

    # Convert numeric rating to string status
    safety_status_map = {0: "Green", 1: "Orange", 2: "Red", 3: "Yellow"}
    beach_dict["safety_status"] = safety_status_map.get(safety_rating, "Unknown")

    return BeachOut(**beach_dict)


@router.post("/beaches", response_model=BeachOut, status_code=status.HTTP_201_CREATED)
async def create_beach(
    beach: BeachCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new beach (admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized to create beaches")

    db_beach = Beach(**beach.dict())
    db.add(db_beach)
    db.commit()
    db.refresh(db_beach)
    logger.info(f"New beach created: {db_beach.name}")
    return db_beach


@router.put("/beaches/{beach_id}", response_model=BeachOut)
async def update_beach(
    beach_id: int,
    beach_update: BeachUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update beach information (admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized to update beaches")

    db_beach = db.query(Beach).filter(Beach.id == beach_id).first()
    if db_beach is None:
        raise HTTPException(status_code=404, detail="Beach not found")

    for key, value in beach_update.dict(exclude_unset=True).items():
        setattr(db_beach, key, value)

    db.commit()
    db.refresh(db_beach)
    logger.info(f"Beach updated: {db_beach.name}")
    return db_beach


@router.delete("/beaches/{beach_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_beach(
    beach_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a beach (admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized to delete beaches")

    db_beach = db.query(Beach).filter(Beach.id == beach_id).first()
    if db_beach is None:
        raise HTTPException(status_code=404, detail="Beach not found")

    db.delete(db_beach)
    db.commit()
    logger.info(f"Beach deleted: {db_beach.name}")
    return None


@router.get("/{beach_id}/safety", response_model=dict)
async def get_beach_safety(
    beach_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get safety information for a specific beach"""
    beach = db.query(Beach).filter(Beach.id == beach_id).first()
    if beach is None:
        raise HTTPException(status_code=404, detail="Beach not found")
    # Placeholder response
    safety_info = {
        "beach_id": beach_id,
        "name": beach.name,
        "safety_level": "moderate",
        "warnings": ["Strong currents possible"],
        "last_updated": "2023-08-30T12:00:00Z",
    }
    return safety_info


def get_default_marine_conditions():
    return {
        "wave_height": {"value": None, "unit": "m"},
        "wave_direction": {"value": "N/A", "unit": "cardinal"},
        "wave_period": {"value": None, "unit": "s"},
        "wind_wave_height": {"value": None, "unit": "m"},
        "wind_wave_direction": {"value": "N/A", "unit": "cardinal"},
        "wind_wave_period": {"value": None, "unit": "s"},
        "swell_wave_height": {"value": None, "unit": "m"},
        "swell_wave_direction": {"value": "N/A", "unit": "cardinal"},
        "swell_wave_period": {"value": None, "unit": "s"},
        "ocean_current_velocity": {"value": None, "unit": "km/h"},
        "ocean_current_direction": {"value": "N/A", "unit": "cardinal"},
        "timestamp": datetime.utcnow().isoformat(),
        "nearest_current_time": datetime.utcnow().isoformat()
    }


def get_default_weather_conditions():
    return {
        "temperature": {"value": None, "unit": "°C"},
        "feels_like": {"value": None, "unit": "°C"},
        "humidity": {"value": None, "unit": "%"},
        "pressure": {"value": None, "unit": "hPa"},
        "weather_description": "N/A",
        "weather_icon": "N/A",
        "visibility": {"value": None, "unit": "m"},
        "sunrise": datetime.utcnow().isoformat(),
        "sunset": datetime.utcnow().isoformat(),
        "timestamp": datetime.utcnow().isoformat()
    }
