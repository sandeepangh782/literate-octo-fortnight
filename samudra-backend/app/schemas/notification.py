from pydantic import BaseModel
from typing import Optional, Dict, List


class PushNotificationSchema(BaseModel):
    headings: Dict[str, str]
    contents: Dict[str, str]
    data: Optional[Dict[str, str]] = None
    player_ids: List[str]


class EmailSchema(BaseModel):
    subject: str
    content: str
