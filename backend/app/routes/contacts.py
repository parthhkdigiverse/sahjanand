from fastapi import APIRouter, Body, Depends, HTTPException
from typing import List
from ..models.contact import Contact, ContactCreate
from ..database import get_database
from datetime import datetime
from bson import ObjectId
from ..auth import get_current_admin

router = APIRouter(prefix="/contacts", tags=["contacts"])

def serialize_contact(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/", response_model=List[Contact], response_model_by_alias=True)
async def get_contacts(admin: str = Depends(get_current_admin)):
    db = get_database()
    contacts = await db.contacts.find().sort("created_at", -1).to_list(1000)
    return [serialize_contact(c) for c in contacts]

@router.post("/", response_model=Contact, response_model_by_alias=True)
async def create_contact(contact: ContactCreate = Body(...)):
    db = get_database()
    contact_dict = contact.model_dump()
    contact_dict["created_at"] = datetime.utcnow()
    result = await db.contacts.insert_one(contact_dict)
    created = await db.contacts.find_one({"_id": result.inserted_id})
    return serialize_contact(created)

@router.delete("/{id}")
async def delete_contact(id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    result = await db.contacts.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
        
    return {"message": "Inquiry deleted successfully"}

@router.patch("/{id}/toggle-read")
async def toggle_read(id: str, is_read: bool = Body(..., embed=True), admin: str = Depends(get_current_admin)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    result = await db.contacts.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"is_read": is_read}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
        
    return {"message": "Inquiry status updated"}
