from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.beach import Beach
from app.models.user import User
from app.schemas.beach import BeachOut, BeachList
from app.schemas.user import UserInDB
from app.core.security import get_current_user
import logging

router = APIRouter()
logger = logging.getLogger("samudra_suraksha")


@router.post("/{beach_id}", response_model=UserInDB)
async def add_favorite_beach(
    beach_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a beach to user's favorites"""
    beach = db.query(Beach).filter(Beach.id == beach_id).first()
    if not beach:
        raise HTTPException(status_code=404, detail="Beach not found")

    if beach not in current_user.favorite_beaches:
        current_user.favorite_beaches.append(beach)
        db.commit()
        db.refresh(current_user)

    return current_user


@router.delete("/{beach_id}", response_model=UserInDB)
async def remove_favorite_beach(
    beach_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a beach from user's favorites"""
    beach = db.query(Beach).filter(Beach.id == beach_id).first()
    if not beach:
        raise HTTPException(status_code=404, detail="Beach not found")

    if beach in current_user.favorite_beaches:
        current_user.favorite_beaches.remove(beach)
        db.commit()
        db.refresh(current_user)

    return current_user


@router.get("/", response_model=BeachList)
async def get_favorite_beaches(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's favorite beaches"""
    beaches = current_user.favorite_beaches
    return {"total": len(beaches), "beaches": beaches}
