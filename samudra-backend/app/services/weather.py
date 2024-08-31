import requests
from app.core.config import OPENWEATHERMAP_API_KEY


def get_weather_data(lat, lon):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={OPENWEATHERMAP_API_KEY}"
    response = requests.get(url)
    data = response.json()

    weather_info = {
        "coord": data.get("coord", {}),
        "weather": data.get("weather", [{}])[0],
        "base": data.get("base", ""),
        "main": data.get("main", {}),
        "visibility": data.get("visibility", 0),
        "wind": data.get("wind", {}),
        "clouds": data.get("clouds", {}),
        "dt": data.get("dt", 0),
        "sys": data.get("sys", {}),
        "timezone": data.get("timezone", 0),
        "id": data.get("id", 0),
        "name": data.get("name", ""),
        "cod": data.get("cod", 0),
    }

    return weather_info
