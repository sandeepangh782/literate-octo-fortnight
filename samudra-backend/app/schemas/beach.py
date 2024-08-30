from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict
from datetime import datetime


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
