from fastapi import APIRouter, Depends, HTTPException, Body
from ..models.contact_page import ContactPageData
from ..database import get_database
from ..auth import get_current_admin

router = APIRouter(prefix="/contact-page", tags=["Contact Page"])

@router.get("/", response_model=ContactPageData)
async def get_contact_page_data():
    db = get_database()
    doc = await db.contact_page.find_one({"id": "global"})
    if not doc:
        return ContactPageData()
    return ContactPageData(**doc)

@router.put("/", response_model=ContactPageData)
async def update_contact_page_data(data: ContactPageData = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    # Use exclude_unset=True to avoid overwriting existing data with empty defaults 
    # if the frontend only sends changed fields
    update_data = data.model_dump(exclude_unset=True)
    
    result = await db.contact_page.find_one_and_update(
        {"id": "global"},
        {"$set": update_data},
        upsert=True,
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=500, detail="Failed to update contact page")
    return ContactPageData(**result)
