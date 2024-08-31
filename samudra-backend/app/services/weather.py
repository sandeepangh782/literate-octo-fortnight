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
        "cod": data.get("cod", 0)
    }

    
    return weather_info

def get_marine_data(lat, lon):
    url = f"https://marine-api.open-meteo.com/v1/marine?latitude={lat}&longitude={lon}&current=wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_direction,wind_wave_period,wind_wave_peak_period,swell_wave_height,swell_wave_direction,swell_wave_period,swell_wave_peak_period,ocean_current_velocity,ocean_current_direction"
    response = requests.get(url)
    data = response.json()
    
    marine_info = {
        "latitude": data.get("latitude", 0),
        "longitude": data.get("longitude", 0),
        "generationtime_ms": data.get("generationtime_ms", 0),
        "utc_offset_seconds": data.get("utc_offset_seconds", 0),
        "timezone": data.get("timezone", ""),
        "timezone_abbreviation": data.get("timezone_abbreviation", ""),
        "elevation": data.get("elevation", 0),
        "current_units": data.get("current_units", {}),
        "current": data.get("current", {})
    }
    
    return marine_info