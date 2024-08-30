import requests


def get_ocean_temperature(latitude, longitude):
    # Mocking the response from the INCOIS API
    response = {"latitude": latitude, "longitude": longitude, "temperature": 28.5}
    return response


def get_wave_height(latitude, longitude):
    # Mocking the response from the INCOIS API
    response = {"latitude": latitude, "longitude": longitude, "wave_height": 2.3}
    return response


def get_current_speed(latitude, longitude):
    # Mocking the response from the INCOIS API
    response = {"latitude": latitude, "longitude": longitude, "current_speed": 0.8}
    return response


# Example usage
latitude = 12.9716
longitude = 77.5946

temperature = get_ocean_temperature(latitude, longitude)
print(f"Ocean temperature at ({latitude}, {longitude}): {temperature['temperature']}°C")

wave_height = get_wave_height(latitude, longitude)
print(f"Wave height at ({latitude}, {longitude}): {wave_height['wave_height']} meters")

current_speed = get_current_speed(latitude, longitude)
print(
    f"Current speed at ({latitude}, {longitude}): {current_speed['current_speed']} m/s"
)
