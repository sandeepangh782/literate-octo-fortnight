from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.core.security import get_current_user
from app.services.expo_notification_service import expo_notification_service
from app.schemas.notification import NotificationTest, UpdateExpoTokenSchema
from typing import List

router = APIRouter()

@router.post("/update-expo-token")
async def update_expo_token(
    token_data: UpdateExpoTokenSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.expo_push_token = token_data.expo_push_token
    db.commit()
    return {"message": "Expo push token updated successfully"}

@router.post("/test-single")
async def test_single_notification(
    notification: NotificationTest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.expo_push_token:
        raise HTTPException(status_code=400, detail="User has no Expo push token")
    
    result = expo_notification_service.send_push_message(
        token=current_user.expo_push_token,
        title=notification.title,
        message=notification.message
    )
    
    if result["success"]:
        return {"message": "Test notification sent successfully", "id": result["id"]}
    else:
        raise HTTPException(status_code=500, detail=f"Failed to send notification: {result['error']}")

@router.post("/test-multiple")
async def test_multiple_notifications(
    notification: NotificationTest,
    user_ids: List[int],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only superusers can send notifications to multiple users")
    
    users = db.query(User).filter(User.id.in_(user_ids)).all()
    success_count = 0
    failed_count = 0
    
    for user in users:
        if user.expo_push_token:
            result = expo_notification_service.send_push_message(
                token=user.expo_push_token,
                title=notification.title,
                message=notification.message
            )
            if result["success"]:
                success_count += 1
            else:
                failed_count += 1
    
    return {
        "message": f"Notifications sent. Successful: {success_count}, Failed: {failed_count}",
        "total_users": len(users)
    }