from pydantic import BaseModel
from typing import Optional, Dict, List


class NotificationTest(BaseModel):
    title: str
    message: str


class UpdateExpoTokenSchema(BaseModel):
    expo_push_token: str


class EmailSchema(BaseModel):
    subject: str
    content: str
