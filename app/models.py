from datetime import datetime
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str | None
    phone: str | None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    otp_code: str | None