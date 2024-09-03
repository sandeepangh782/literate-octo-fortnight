from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime


class MeasurementWithUnit(BaseModel):
    value: Optional[float]
    unit: str


class DirectionWithUnit(BaseModel):
    value: Optional[str]
    unit: str = "cardinal"


class MarineConditions(BaseModel):
    wave_height: MeasurementWithUnit
    wave_direction: DirectionWithUnit
    wave_period: MeasurementWithUnit
    wind_wave_height: MeasurementWithUnit
    wind_wave_direction: DirectionWithUnit
    wind_wave_period: MeasurementWithUnit
    swell_wave_height: MeasurementWithUnit
    swell_wave_direction: DirectionWithUnit
    swell_wave_period: MeasurementWithUnit
    ocean_current_velocity: MeasurementWithUnit
    ocean_current_direction: DirectionWithUnit
    timestamp: str
    nearest_current_time: str


class WeatherConditions(BaseModel):
    temperature: MeasurementWithUnit
    feels_like: MeasurementWithUnit
    humidity: MeasurementWithUnit
    pressure: MeasurementWithUnit
    weather_description: str
    weather_icon: str
    visibility: MeasurementWithUnit
    sunrise: str
    sunset: str
    timestamp: str
    uv_index: Optional[float] = None
    uv_index_level: Optional[str] = None


class BeachBase(BaseModel):
    name: Optional[str] = None
    state: Optional[str] = None
    state_district: Optional[str]
    city: Optional[str]
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    formatted_address: Optional[str] = None
    activities: Optional[List[str]] = None


class BeachCreate(BeachBase):
    postcode: Optional[str]
    categories: Optional[List[str]]
    datasource: Optional[Dict]


class BeachUpdate(BaseModel):
    name: Optional[str]
    state: Optional[str]
    state_district: Optional[str]
    city: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    formatted_address: Optional[str]
    activities: Optional[List[str]]
    postcode: Optional[str]
    categories: Optional[List[str]]


class BeachOut(BeachBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    image_url: Optional[str] = None
    distance: Optional[float] = None  # Distance in km
    safety_status: Optional[str] = None
    marine_conditions: Optional[MarineConditions] = None
    weather_conditions: Optional[WeatherConditions] = None
    safety_points: Optional[List[str]] = None

    class Config:
        from_attributes = True


class BeachList(BaseModel):
    total: int
    beaches: List[BeachOut]


class BeachSafety(BaseModel):
    beach_id: int
    name: str
    safety_level: str
    warnings: List[str]
    last_updated: datetime
