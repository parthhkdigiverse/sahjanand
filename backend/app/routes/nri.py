from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..database import get_database
from ..models.nri import NRIData, NRIPage
from ..auth import get_current_admin
from ..models.nri_lead import NRILead, NRILeadCreate, NRILeadBase
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=NRIPage)
async def get_nri_page():
    """
    Get the NRI page data.
    """
    try:
        db = get_database()
        nri_data = await db.nri_page.find_one({"id": "nri"})
        if nri_data:
            return NRIPage(**nri_data)
        # Return default data if not found
        default_data = NRIPage()
        return default_data
    except Exception as e:
        print(f"Error getting NRI page data: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting NRI page data: {str(e)}"
        )

@router.put("/", response_model=NRIPage)
async def update_nri_page(
    data: NRIData,
    admin: str = Depends(get_current_admin)
):
    """
    Update the NRI page data. Requires authentication.
    """
    try:
        db = get_database()
        update_dict = data.model_dump()
        update_dict["id"] = "nri"
        
        # Upsert the document
        await db.nri_page.update_one(
            {"id": "nri"},
            {"$set": update_dict},
            upsert=True
        )
        
        # Fetch and return the updated document
        updated_data = await db.nri_page.find_one({"id": "nri"})
        return NRIPage(**updated_data)
        
    except Exception as e:
        print(f"Error updating NRI page data: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating NRI page data: {str(e)}"
        )

# --- NRI Leads ---

@router.post("/leads", response_model=NRILead)
async def create_nri_lead(lead: NRILeadCreate):
    """
    Submit a new NRI lead/inquiry.
    """
    try:
        db = get_database()
        new_lead = NRILeadBase(**lead.model_dump())
        result = await db.nri_leads.insert_one(new_lead.model_dump())
        
        created_lead = await db.nri_leads.find_one({"_id": result.inserted_id})
        return NRILead(**created_lead)
    except Exception as e:
        print(f"Error creating NRI lead: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating NRI lead: {str(e)}"
        )

@router.get("/leads", response_model=list[NRILead])
async def get_nri_leads(admin: str = Depends(get_current_admin)):
    """
    Get all NRI leads. Requires admin authentication.
    """
    try:
        db = get_database()
        cursor = db.nri_leads.find().sort("created_at", -1)
        leads = await cursor.to_list(length=1000)
        return [NRILead(**lead) for lead in leads]
    except Exception as e:
        print(f"Error getting NRI leads: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting NRI leads: {str(e)}"
        )

@router.patch("/leads/{lead_id}/toggle-read", response_model=NRILead)
async def toggle_nri_lead_read(lead_id: str, admin: str = Depends(get_current_admin)):
    """
    Toggle the is_read status of an NRI lead. Requires admin authentication.
    """
    try:
        db = get_database()
        if not ObjectId.is_valid(lead_id):
            raise HTTPException(status_code=400, detail="Invalid lead ID")
            
        lead = await db.nri_leads.find_one({"_id": ObjectId(lead_id)})
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
            
        new_status = not lead.get("is_read", False)
        await db.nri_leads.update_one(
            {"_id": ObjectId(lead_id)},
            {"$set": {"is_read": new_status}}
        )
        
        updated_lead = await db.nri_leads.find_one({"_id": ObjectId(lead_id)})
        return NRILead(**updated_lead)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error toggling NRI lead status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error toggling NRI lead status: {str(e)}"
        )

@router.delete("/leads/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_nri_lead(lead_id: str, admin: str = Depends(get_current_admin)):
    """
    Delete an NRI lead. Requires admin authentication.
    """
    try:
        db = get_database()
        if not ObjectId.is_valid(lead_id):
            raise HTTPException(status_code=400, detail="Invalid lead ID")
            
        result = await db.nri_leads.delete_one({"_id": ObjectId(lead_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Lead not found")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting NRI lead: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting NRI lead: {str(e)}"
        )
