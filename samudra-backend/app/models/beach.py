from sqlalchemy import Column, Integer, String, Float, JSON, ARRAY, DateTime, Table, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from app.db.database import Base

favorite_beaches = Table(
    'favorite_beaches', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('beach_id', Integer, ForeignKey('beaches.id'))
)


class Beach(Base):
    __tablename__ = "beaches"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    state = Column(String, index=True)
    state_district = Column(String)
    city = Column(String)
    postcode = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    formatted_address = Column(String)
    categories = Column(JSON)
    activities = Column(ARRAY(String))
    datasource = Column(JSON)
    geom = Column(Geometry(geometry_type="POINT", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    favorited_by = relationship("User", secondary=favorite_beaches, back_populates="favorite_beaches")
