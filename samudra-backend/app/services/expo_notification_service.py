import os
import requests
from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
)
from requests.exceptions import ConnectionError, HTTPError
import logging

logger = logging.getLogger(__name__)

# Set up the session with headers
session = requests.Session()
session.headers.update({
    "Authorization": f"Bearer {os.getenv('EXPO_ACCESS_TOKEN')}",
    "accept": "application/json",
    "accept-encoding": "gzip, deflate",
    "content-type": "application/json",
})

class ExpoNotificationService:
    @staticmethod
    def send_push_message(token, title, message, extra=None):
        try:
            response = PushClient(session=session).publish(
                PushMessage(to=token,
                            title=title,
                            body=message,
                            data=extra))
            
            # We got a response back, but we don't know whether it's an error yet.
            # This call raises errors so we can handle them with normal exception flows.
            response.validate_response()
            
            return {"success": True, "id": response.id}
        
        except PushServerError as exc:
            logger.error(f"Push Server Error: {exc.errors}")
            return {"success": False, "error": "Push Server Error", "details": exc.errors}
        
        except (ConnectionError, HTTPError) as exc:
            logger.error(f"Connection or HTTP Error: {str(exc)}")
            return {"success": False, "error": "Connection Error"}
        
        except DeviceNotRegisteredError:
            logger.warning(f"Device not registered: {token}")
            return {"success": False, "error": "Device Not Registered"}
        
        except PushTicketError as exc:
            logger.error(f"Push Ticket Error: {exc.push_response}")
            return {"success": False, "error": "Push Ticket Error", "details": exc.push_response}
        
        except Exception as exc:
            logger.error(f"Unexpected error: {str(exc)}")
            return {"success": False, "error": "Unexpected Error"}

expo_notification_service = ExpoNotificationService()