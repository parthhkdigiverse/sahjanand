from fastapi import APIRouter, Body, HTTPException, status, Depends
from typing import List
from ..database import get_database
from ..models.offer_lead import OfferLead, OfferLeadCreate
from ..auth import get_current_admin
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[OfferLead])
async def get_leads(admin: str = Depends(get_current_admin)):
    db = get_database()
    leads = await db.offer_leads.find().sort("created_at", -1).to_list(1000)
    return leads

@router.post("/", response_model=OfferLead)
async def create_lead(lead: OfferLeadCreate = Body(...)):
    db = get_database()
    lead_dict = lead.model_dump()
    result = await db.offer_leads.insert_one(lead_dict)
    lead_dict["_id"] = str(result.inserted_id)
    return lead_dict

@router.delete("/{lead_id}")
async def delete_lead(lead_id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    delete_result = await db.offer_leads.delete_one({"_id": ObjectId(lead_id)})
    
    if delete_result.deleted_count == 1:
        return {"message": "Lead deleted successfully"}
        
    raise HTTPException(status_code=404, detail=f"Lead {lead_id} not found")
