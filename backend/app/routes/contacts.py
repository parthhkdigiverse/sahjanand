from fastapi import APIRouter, Body
from ..models.contact import Contact, ContactCreate
from ..database import get_database
from datetime import datetime

router = APIRouter(prefix="/contacts", tags=["contacts"])

@router.post("/", response_model=Contact)
async def create_contact(contact: ContactCreate = Body(...)):
    db = get_database()
    contact_dict = contact.dict()
    contact_dict["created_at"] = datetime.utcnow()
    result = await db.contacts.insert_one(contact_dict)
    contact_dict["_id"] = str(result.inserted_id)
    return contact_dict
