from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from bson import ObjectId
from ..models.testimonial import Testimonial, TestimonialCreate
from ..database import get_database
from ..auth import get_current_admin

router = APIRouter(prefix="/testimonials", tags=["testimonials"])

def serialize_testimonial(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/", response_model=List[Testimonial], response_model_by_alias=True)
async def get_testimonials():
    db = get_database()
    testimonials = await db.testimonials.find().to_list(1000)
    return [serialize_testimonial(t) for t in testimonials]

@router.post("/", response_model=Testimonial, response_model_by_alias=True)
async def create_testimonial(testimonial: TestimonialCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    testimonial_dict = testimonial.model_dump()
    result = await db.testimonials.insert_one(testimonial_dict)
    created = await db.testimonials.find_one({"_id": result.inserted_id})
    return serialize_testimonial(created)

@router.put("/{id}", response_model=Testimonial, response_model_by_alias=True)
async def update_testimonial(id: str, testimonial_data: TestimonialCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    result = await db.testimonials.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": testimonial_data.model_dump()},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Testimonial not found")
        
    return serialize_testimonial(result)

@router.delete("/{id}")
async def delete_testimonial(id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    result = await db.testimonials.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
        
    return {"message": "Testimonial deleted successfully"}
