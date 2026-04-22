from fastapi import APIRouter, Body, HTTPException, status, Depends
from typing import List
from ..database import get_database
from ..models.hero import HeroSlide, HeroSlideCreate, HeroSlideUpdate
from ..auth import get_current_admin
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[HeroSlide])
async def get_slides():
    db = get_database()
    slides = await db.hero_slides.find().sort("order", 1).to_list(100)
    return slides

@router.post("/", response_model=HeroSlide)
async def create_slide(slide: HeroSlideCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    slide_dict = slide.model_dump()
    result = await db.hero_slides.insert_one(slide_dict)
    slide_dict["_id"] = str(result.inserted_id)
    return slide_dict

@router.put("/{slide_id}", response_model=HeroSlide)
async def update_slide(slide_id: str, slide: HeroSlideUpdate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    update_data = {k: v for k, v in slide.model_dump().items() if v is not None}
    
    if len(update_data) >= 1:
        update_result = await db.hero_slides.find_one_and_update(
            {"_id": ObjectId(slide_id)},
            {"$set": update_data},
            return_document=True
        )
        if update_result is not None:
            return update_result
            
    raise HTTPException(status_code=404, detail=f"Slide {slide_id} not found")

@router.delete("/{slide_id}")
async def delete_slide(slide_id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    delete_result = await db.hero_slides.delete_one({"_id": ObjectId(slide_id)})
    
    if delete_result.deleted_count == 1:
        return {"message": "Slide deleted successfully"}
        
    raise HTTPException(status_code=404, detail=f"Slide {slide_id} not found")
