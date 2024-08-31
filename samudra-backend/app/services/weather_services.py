import httpx
from fastapi import HTTPException
import logging
from datetime import datetime
from app.core.config import settings

logger = logging.getLogger(__name__)


async def get_weather_data(lat: float, lon: float):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={settings.OPENWEATHERMAP_API_KEY}"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
    except httpx.TimeoutException:
        logger.error(f"Timeout while fetching weather data for lat: {lat}, lon: {lon}")
        raise HTTPException(status_code=503, detail="Weather data service is temporarily unavailable")
    except httpx.HTTPStatusError as exc:
        logger.error(f"HTTP error occurred: {exc}")
        raise HTTPException(status_code=503, detail="Error fetching weather data")
    except Exception as exc:
        logger.error(f"An unexpected error occurred: {exc}")
        raise HTTPException(status_code=500, detail="Internal server error")

    data = response.json()

    return {
        "temperature": {
            "value": data['main']['temp'],
            "unit": "°C"
        },
        "feels_like": {
            "value": data['main']['feels_like'],
            "unit": "°C"
        },
        "humidity": {
            "value": data['main']['humidity'],
            "unit": "%"
        },
        "pressure": {
            "value": data['main']['pressure'],
            "unit": "hPa"
        },
        "weather_description": data['weather'][0]['description'],
        "weather_icon": data['weather'][0]['icon'],
        "visibility": {
            "value": data['visibility'],
            "unit": "m"
        },
        "sunrise": datetime.fromtimestamp(data['sys']['sunrise']).isoformat(),
        "sunset": datetime.fromtimestamp(data['sys']['sunset']).isoformat(),
        "timestamp": datetime.fromtimestamp(data['dt']).isoformat()
    }
