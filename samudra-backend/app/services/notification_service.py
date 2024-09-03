import json
import httpx
from fastapi import BackgroundTasks
from app.core.config import settings
from app.services.onesignal_service import OneSignalService
from app.services.email_service import EmailService
from app.db.database import get_db
from app.models.user import User
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

INCOIS_API_URL = "https://sarat.incois.gov.in/incoismobileappdata/rest/incois/hwassalatestdata"


async def fetch_alert_data():
    async with httpx.AsyncClient() as client:
        response = await client.get(INCOIS_API_URL)
        response.raise_for_status()
        return response.json()


def parse_alert_data(data):
    hwa_data = json.loads(data['HWAJson'])
    ssa_data = json.loads(data['SSAJson'])
    return hwa_data + ssa_data


async def send_notifications(alerts, background_tasks: BackgroundTasks):
    db = next(get_db())
    users = db.query(User).all()

    for user in users:
        relevant_alerts = [alert for alert in alerts if alert['STATE'] == user.state]
        if relevant_alerts:
            background_tasks.add_task(send_user_notifications, user, relevant_alerts)


async def send_user_notifications(user: User, alerts):
    # Prepare notification content
    title = "Beach Safety Alert"
    content = "Important safety alerts for your area:\n\n"
    for alert in alerts:
        content += f"- {alert['Alert']} for {alert['District']}: {alert['Message']}\n\n"

    # Send push notification
    if user.onesignal_player_id:
        OneSignalService.send_push_notification(
            headings={"en": title},
            contents={"en": content},
            player_ids=[user.onesignal_player_id]
        )

    # Send email notification
    if user.email:
        EmailService.send_email(
            to_email=user.email,
            subject=title,
            content=content
        )

    # Send SMS (if implemented)
    if user.phone_number:
        # Implement SMS sending logic here
        pass


async def check_and_send_alerts(background_tasks: BackgroundTasks):
    try:
        alert_data = await fetch_alert_data()
        alerts = parse_alert_data(alert_data)
        await send_notifications(alerts, background_tasks)
    except Exception as e:
        logger.error(f"Error in check_and_send_alerts: {str(e)}")
