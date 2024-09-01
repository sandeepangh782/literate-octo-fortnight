import aiohttp

class UVIndexService:
    def __init__(self):
        self.base_url = "https://air-quality-api.open-meteo.com/v1/air-quality"

    def classify_uv_index(uv_index):
        if uv_index < 3:
            return "Low"
        elif 3 <= uv_index < 6:
            return "Moderate"
        elif 6 <= uv_index < 8:
            return "High"
        elif 8 <= uv_index < 11:
            return "Very High"
        else:
            return "Extreme"

    async def get_uv_index_data(self, lat : float, lon : float):
        url = f"{self.base_url}?latitude={lat}&longitude={lon}&current=uv_index&timezone=auto"
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                data = await response.json()

        uv_index = data.get("current", {}).get("uv_index", 0)
        uv_index_level = self.classify_uv_index(uv_index)

        uv_index_info = {
            "latitude": data.get("latitude", 0),
            "longitude": data.get("longitude", 0),
            "generationtime_ms": data.get("generationtime_ms", 0),
            "utc_offset_seconds": data.get("utc_offset_seconds", 0),
            "timezone": data.get("timezone", ""),
            "timezone_abbreviation": data.get("timezone_abbreviation", ""),
            "elevation": data.get("elevation", 0),
            "current_units": data.get("current_units", {}),
            "current": data.get("current", {}),
            "uv_index_level": uv_index_level
        }

        return uv_index_info