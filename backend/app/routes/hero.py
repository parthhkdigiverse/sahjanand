from fastapi import APIRouter, Body, HTTPException, Depends
from typing import List
from ..database import get_database
from ..models.hero import HeroSlide, HeroSlideCreate, HeroSlideUpdate
from ..auth import get_current_admin
from bson import ObjectId

router = APIRouter()

def serialize_slide(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/", response_model=List[HeroSlide], response_model_by_alias=True)
async def get_slides():
    db = get_database()
    slides = await db.hero_slides.find().sort("order", 1).to_list(100)
    return [serialize_slide(s) for s in slides]

@router.post("/", response_model=HeroSlide, response_model_by_alias=True)
async def create_slide(slide: HeroSlideCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    slide_dict = slide.model_dump()
    result = await db.hero_slides.insert_one(slide_dict)
    created = await db.hero_slides.find_one({"_id": result.inserted_id})
    return serialize_slide(created)

@router.put("/{slide_id}", response_model=HeroSlide, response_model_by_alias=True)
async def update_slide(slide_id: str, slide: HeroSlideUpdate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    if not ObjectId.is_valid(slide_id):
        raise HTTPException(status_code=400, detail="Invalid slide ID")
    update_data = {k: v for k, v in slide.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    update_result = await db.hero_slides.find_one_and_update(
        {"_id": ObjectId(slide_id)},
        {"$set": update_data},
        return_document=True
    )
    if update_result is None:
        raise HTTPException(status_code=404, detail=f"Slide {slide_id} not found")
    return serialize_slide(update_result)

@router.delete("/{slide_id}")
async def delete_slide(slide_id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    if not ObjectId.is_valid(slide_id):
        raise HTTPException(status_code=400, detail="Invalid slide ID")
    delete_result = await db.hero_slides.delete_one({"_id": ObjectId(slide_id)})
    if delete_result.deleted_count == 1:
        return {"message": "Slide deleted successfully"}
    raise HTTPException(status_code=404, detail=f"Slide {slide_id} not found")
