from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from app.core.config import settings


class EmailService:
    @staticmethod
    def send_email(to_email, subject, content):
        message = Mail(
            from_email=settings.FROM_EMAIL,
            to_emails=to_email,
            subject=subject,
            html_content=content)
        try:
            sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
            response = sg.send(message)
            return {"success": True, "status_code": response.status_code}
        except Exception as e:
            return {"success": False, "error": str(e)}
