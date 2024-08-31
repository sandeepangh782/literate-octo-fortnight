# app/services/marine_services.py
import httpx
from fastapi import HTTPException
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


def get_cardinal_direction(degree):
    directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    index = round(degree / 45) % 8
    return directions[index]


def find_nearest_time(time_list, target_time):
    return min(time_list, key=lambda x: abs(datetime.fromisoformat(x) - target_time))


async def get_marine_data(lat: float, lon: float):
    url = f"https://marine-api.open-meteo.com/v1/marine?latitude={lat}&longitude={lon}&current=wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_direction,wind_wave_period,swell_wave_height,swell_wave_direction,swell_wave_period&hourly=ocean_current_velocity,ocean_current_direction&timezone=GMT" # noqa

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:  # Set a 10-second timeout
            response = await client.get(url)
            response.raise_for_status()  # Raise an exception for bad status codes
    except httpx.TimeoutException:
        logger.error(f"Timeout while fetching marine data for lat: {lat}, lon: {lon}")
        raise HTTPException(
            status_code=503, detail="Marine data service is temporarily unavailable"
        )
    except httpx.HTTPStatusError as exc:
        logger.error(f"HTTP error occurred: {exc}")
        raise HTTPException(status_code=503, detail="Error fetching marine data")
    except Exception as exc:
        logger.error(f"An unexpected error occurred: {exc}")
        raise HTTPException(status_code=500, detail="Internal server error")

    data = response.json()
    current_data = data.get('current', {})
    hourly_data = data.get('hourly', {})
    units = data.get('current_units', {})
    hourly_units = data.get('hourly_units', {})

    # Find the nearest time for hourly data
    current_time = datetime.utcnow()
    nearest_time = find_nearest_time(hourly_data.get('time', []), current_time)
    time_index = hourly_data['time'].index(nearest_time)

    return {
        "wave_height": {
            "value": current_data.get("wave_height"),
            "unit": units.get("wave_height"),
        },
        "wave_direction": {
            "value": get_cardinal_direction(current_data.get("wave_direction", 0)),
            "unit": "cardinal",
        },
        "wave_period": {
            "value": current_data.get("wave_period"),
            "unit": units.get("wave_period"),
        },
        "wind_wave_height": {
            "value": current_data.get("wind_wave_height"),
            "unit": units.get("wind_wave_height"),
        },
        "wind_wave_direction": {
            "value": get_cardinal_direction(current_data.get("wind_wave_direction", 0)),
            "unit": "cardinal",
        },
        "wind_wave_period": {
            "value": current_data.get("wind_wave_period"),
            "unit": units.get("wind_wave_period"),
        },
        "swell_wave_height": {
            "value": current_data.get("swell_wave_height"),
            "unit": units.get("swell_wave_height"),
        },
        "swell_wave_direction": {
            "value": get_cardinal_direction(
                current_data.get("swell_wave_direction", 0)
            ),
            "unit": "cardinal",
        },
        "swell_wave_period": {
            "value": current_data.get("swell_wave_period"),
            "unit": units.get("swell_wave_period"),
        },
        "ocean_current_velocity": {
            "value": hourly_data['ocean_current_velocity'][time_index],
            "unit": hourly_units.get('ocean_current_velocity')
        },
        "ocean_current_direction": {
            "value": get_cardinal_direction(hourly_data['ocean_current_direction'][time_index]),
            "unit": "cardinal"
        },
        "timestamp": current_data.get('time'),
        "nearest_current_time": nearest_time
    }
