from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.beach import Beach
from app.models.user import User
from app.schemas.beach import BeachOut, BeachList, BeachCreate, BeachUpdate
from typing import List, Optional
from sqlalchemy import func
from geoalchemy2 import Geometry
from app.core.security import get_current_user
import logging

router = APIRouter()
logger = logging.getLogger("samudra_suraksha")


@router.get("/", response_model=BeachList)
async def get_beaches(
    skip: int = 0,
    limit: int = 10,
    state: Optional[str] = None,
    activity: Optional[str] = None,
    db: Session = Depends(get_db)
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
async def search_beaches(
    query: str = Query(..., min_length=3),
    db: Session = Depends(get_db)
):
    """Search beaches by name or city"""
    beaches = db.query(Beach).filter(
        (func.lower(Beach.name).contains(func.lower(query))) | (func.lower(Beach.city).contains(func.lower(query)))
    ).all()
    return {"total": len(beaches), "beaches": beaches}


@router.get("/nearby", response_model=List[BeachOut])
async def get_nearby_beaches(
    lat: float,
    lon: float,
    radius: float = 10.0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get nearby beaches within a specified radius"""
    radius_meters = radius * 1000
    nearby_beaches = db.query(Beach).filter(
        func.ST_DWithin(
            Beach.geom,
            func.ST_SetSRID(func.ST_MakePoint(lon, lat), 4326),
            radius_meters
        )
    ).order_by(
        func.ST_Distance(
            Beach.geom,
            func.ST_SetSRID(func.ST_MakePoint(lon, lat), 4326)
        )
    ).limit(limit).all()
    return nearby_beaches


@router.get("/{beach_id}", response_model=BeachOut)
async def get_beach(beach_id: int, db: Session = Depends(get_db)):
    """Get details of a specific beach"""
    beach = db.query(Beach).filter(Beach.id == beach_id).first()
    if beach is None:
        raise HTTPException(status_code=404, detail="Beach not found")
    return beach


@router.post("/beaches", response_model=BeachOut, status_code=status.HTTP_201_CREATED)
async def create_beach(
    beach: BeachCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
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
    current_user: User = Depends(get_current_user)
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
    current_user: User = Depends(get_current_user)
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
    current_user: User = Depends(get_current_user)
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
        "last_updated": "2023-08-30T12:00:00Z"
    }
    return safety_info
