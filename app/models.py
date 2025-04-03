from datetime import datetime
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    telegram_id: str | None
    email: str | None
    phone: str | None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    otp_code: str | None

class FeedBack(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    contact: str | None
    feedback: str