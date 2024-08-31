# app/schemas/beach.py
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
    timestamp: str


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
