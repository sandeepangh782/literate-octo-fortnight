from onesignal_sdk.client import Client
from onesignal_sdk.error import OneSignalHTTPError
from app.core.config import settings

client = Client(app_id=settings.ONESIGNAL_APP_ID, rest_api_key=settings.ONESIGNAL_REST_API_KEY)


class OneSignalService:
    @staticmethod
    def send_push_notification(headings, contents, player_ids, data=None):
        try:
            notification_body = {
                'contents': contents,
                'headings': headings,
                'include_player_ids': player_ids,
            }
            if data:
                notification_body['data'] = data

            response = client.send_notification(notification_body)
            return {"success": True, "response": response.body}
        except OneSignalHTTPError as e:
            return {"success": False, "error": str(e)}
