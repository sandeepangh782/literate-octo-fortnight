import requests
from app.core.config import settings


def get_place_image(place_name: str, location: tuple) -> str:
    base_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
    params = {
        "input": place_name,
        "inputtype": "textquery",
        "fields": "photos",
        "locationbias": f"point:{location[0]},{location[1]}",
        "key": settings.GOOGLE_PLACES_API_KEY,
    }

    response = requests.get(base_url, params=params)
    data = response.json()

    if (
        data["status"] == "OK"
        and data["candidates"]
        and "photos" in data["candidates"][0]
    ):
        photo_reference = data["candidates"][0]["photos"][0]["photo_reference"]
        return f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={settings.GOOGLE_PLACES_API_KEY}"

    return None  # Return None if no image is found
