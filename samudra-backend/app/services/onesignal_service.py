import json
from onesignal_sdk.client import Client
from onesignal_sdk.error import OneSignalHTTPError
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

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
            
            logger.info(f"Sending OneSignal notification: {json.dumps(notification_body, indent=2)}")
            response = client.send_notification(notification_body)
            logger.info(f"OneSignal response: {response.body}")
            return {"success": True, "response": response.body}
        except OneSignalHTTPError as e:
            logger.error(f"OneSignal HTTP Error: {e}")
            error_details = str(e)
            try:
                error_json = json.loads(error_details)
                error_message = error_json.get('errors', [error_details])[0]
            except json.JSONDecodeError:
                error_message = error_details
            logger.error(f"OneSignal Error details: {error_message}")
            return {"success": False, "error": error_message}
        except Exception as e:
            logger.error(f"Unexpected error sending OneSignal notification: {str(e)}")
            return {"success": False, "error": str(e)}

    @staticmethod
    def send_to_all_subscribers(headings, contents, data=None):
        try:
            notification_body = {
                'contents': contents,
                'headings': headings,
                'included_segments': ['Subscribed Users'],
            }
            if data:
                notification_body['data'] = data
            
            logger.info(f"Sending OneSignal notification to all subscribers: {json.dumps(notification_body, indent=2)}")
            response = client.send_notification(notification_body)
            logger.info(f"OneSignal response: {response.body}")
            return {"success": True, "response": response.body}
        except OneSignalHTTPError as e:
            logger.error(f"OneSignal HTTP Error: {e}")
            error_details = str(e)
            try:
                error_json = json.loads(error_details)
                error_message = error_json.get('errors', [error_details])[0]
            except json.JSONDecodeError:
                error_message = error_details
            logger.error(f"OneSignal Error details: {error_message}")
            return {"success": False, "error": error_message}
        except Exception as e:
            logger.error(f"Unexpected error sending OneSignal notification to all subscribers: {str(e)}")
            return {"success": False, "error": str(e)}