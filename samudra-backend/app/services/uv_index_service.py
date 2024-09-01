import httpx
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

BASE_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"


def classify_uv_index(uv_index):
    if 0 <= uv_index < 3:
        return "Low"
    elif 3 <= uv_index < 6:
        return "Moderate"
    elif 6 <= uv_index < 8:
        return "High"
    elif 8 <= uv_index < 11:
        return "Very High"
    else:
        return "Extreme"


async def get_uv_index_data(lat: float, lon: float):
    url = f"{BASE_URL}?latitude={lat}&longitude={lon}&current=uv_index&timezone=auto"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
    except httpx.TimeoutException:
        logger.error(f"Timeout while fetching UV index data for lat: {lat}, lon: {lon}")
        raise HTTPException(status_code=503, detail="UV index data service is temporarily unavailable")
    except httpx.HTTPStatusError as exc:
        logger.error(f"HTTP error occurred: {exc}")
        raise HTTPException(status_code=503, detail="Error fetching UV index data")
    except Exception as exc:
        logger.error(f"An unexpected error occurred: {exc}")
        raise HTTPException(status_code=500, detail="Internal server error")

    data = response.json()
    uv_index = data.get("current", {}).get("uv_index", 0)
    uv_index_level = classify_uv_index(uv_index)

    return {
        "uv_index": {
            "value": uv_index,
            "unit": "index"
        },
        "uv_index_level": uv_index_level,
        "timestamp": data.get("current", {}).get("time")
    }