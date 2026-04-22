from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from bson import ObjectId
from datetime import datetime

class ContactBase(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    type: Literal["GENERAL", "PRODUCT"] = "GENERAL"
    product_id: Optional[str] = None
    product_name: Optional[str] = None

class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    id: Optional[str] = Field(None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True
