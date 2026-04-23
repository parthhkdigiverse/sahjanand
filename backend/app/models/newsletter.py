from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional

class NewsletterSubscriber(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    email: EmailStr
    created_at: datetime = Field(default_factory=datetime.now)

class NewsletterCreate(BaseModel):
    email: EmailStr
