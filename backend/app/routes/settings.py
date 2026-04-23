from fastapi import APIRouter, HTTPException, Body, Depends
from ..models.settings import Settings, SettingsBase
from ..database import get_database
from ..auth import get_current_admin

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("/", response_model=Settings)
async def get_settings():
    db = get_database()
    doc = await db.settings.find_one({"id": "global"})
    if not doc:
        return Settings()
    # Explicitly create model to populate defaults for new fields
    return Settings(**doc)

@router.put("/", response_model=Settings)
async def update_settings(settings_data: SettingsBase = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    
    result = await db.settings.find_one_and_update(
        {"id": "global"},
        {"$set": settings_data.model_dump()},
        upsert=True,
        return_document=True
    )
    
    return result
