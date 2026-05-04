from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from bson import ObjectId
from ..models.achievement import Achievement, AchievementCreate
from ..database import get_database
from ..auth import get_current_admin

router = APIRouter(prefix="/achievements", tags=["achievements"])

def serialize_achievement(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/", response_model=List[Achievement], response_model_by_alias=True)
async def get_achievements():
    db = get_database()
    achievements = await db.achievements.find().sort("order", 1).to_list(1000)
    return [serialize_achievement(a) for a in achievements]

@router.post("/", response_model=Achievement, response_model_by_alias=True)
async def create_achievement(achievement: AchievementCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    achievement_dict = achievement.model_dump()
    result = await db.achievements.insert_one(achievement_dict)
    created = await db.achievements.find_one({"_id": result.inserted_id})
    return serialize_achievement(created)

@router.put("/{id}", response_model=Achievement, response_model_by_alias=True)
async def update_achievement(id: str, achievement_data: AchievementCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    result = await db.achievements.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": achievement_data.model_dump()},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Achievement not found")
        
    return serialize_achievement(result)

@router.delete("/{id}")
async def delete_achievement(id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    result = await db.achievements.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Achievement not found")
        
    return {"message": "Achievement deleted successfully"}
