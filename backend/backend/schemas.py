from pydantic import BaseModel
from typing import List, Optional


class ChatRequest(BaseModel):
    user_id: int
    message: str


class ChatResponse(BaseModel):
    reply: str
    mood: str


class ReminderCreate(BaseModel):
    user_id: int
    title: str
    time: str


class ReminderOut(BaseModel):
    id: int
    user_id: int
    title: str
    time: str
    status: str

    class Config:
        from_attributes = True


class CaregiverSeniorSummary(BaseModel):
    senior_id: int
    name: str
    last_mood: str
    last_message: str
risk:bool
