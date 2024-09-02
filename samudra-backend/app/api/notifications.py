from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.notification import PushNotificationSchema, EmailSchema
from app.services.onesignal_service import OneSignalService
from app.services.email_service import EmailService
from app.core.security import get_current_user

router = APIRouter()


@router.post("/push")
async def send_push_notification(
    notification: PushNotificationSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.onesignal_player_id:
        raise HTTPException(status_code=400, detail="User has no OneSignal player ID")

    result = OneSignalService.send_push_notification(
        headings=notification.headings,
        contents=notification.contents,
        player_ids=[current_user.onesignal_player_id],
        data=notification.data
    )

    if result["success"]:
        return {"message": "Notification sent successfully"}
    else:
        raise HTTPException(status_code=500, detail=f"Failed to send notification: {result['error']}")


@router.post("/email")
async def send_email_notification(
    email: EmailSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = EmailService.send_email(
        to_email=current_user.email,
        subject=email.subject,
        content=email.content
    )

    if result["success"]:
        return {"message": "Email sent successfully"}
    else:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {result['error']}")


@router.post("/test")
async def test_notifications(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only superusers can test notifications")

    # Test push notification
    push_notification = PushNotificationSchema(
        headings={"en": "Test Notification"},
        contents={"en": "This is a test push notification from the Beach Safety App."},
        player_ids=[current_user.onesignal_player_id],
        data={"test": "true"}
    )
    
    background_tasks.add_task(
        OneSignalService.send_push_notification,
        headings=push_notification.headings,
        contents=push_notification.contents,
        player_ids=push_notification.player_ids,
        data=push_notification.data
    )

    # Test email notification
    email_notification = EmailSchema(
        subject="Test Email from Beach Safety App",
        content="<h1>Test Email</h1><p>This is a test email notification from the Beach Safety App.</p>"
    )
    
    background_tasks.add_task(
        EmailService.send_email,
        to_email=current_user.email,
        subject=email_notification.subject,
        content=email_notification.content
    )

    return {"message": "Test notifications (push and email) have been queued for sending."}

@router.post("/test-all")
async def test_all_notifications(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only superusers can test notifications")

    # Get all active users
    users = db.query(User).filter(User.is_active == True).all()

    # Prepare notifications
    push_notification = PushNotificationSchema(
        headings={"en": "Test Notification"},
        contents={"en": "This is a test push notification sent to all users of the Beach Safety App."},
        player_ids=[user.onesignal_player_id for user in users if user.onesignal_player_id],
        data={"test": "true"}
    )

    # Send push notifications
    background_tasks.add_task(
        OneSignalService.send_push_notification,
        headings=push_notification.headings,
        contents=push_notification.contents,
        player_ids=push_notification.player_ids,
        data=push_notification.data
    )

    # Send email notifications
    for user in users:
        email_notification = EmailSchema(
            subject="Test Email from Beach Safety App",
            content=f"<h1>Test Email</h1><p>Hello {user.full_name},</p><p>This is a test email notification sent to all users of the Beach Safety App.</p>"
        )
        background_tasks.add_task(
            EmailService.send_email,
            to_email=user.email,
            subject=email_notification.subject,
            content=email_notification.content
        )

    return {"message": f"Test notifications queued for sending to {len(users)} users."}