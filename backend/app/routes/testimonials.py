from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from bson import ObjectId
from ..models.testimonial import Testimonial, TestimonialCreate
from ..database import get_database
from ..auth import get_current_admin

router = APIRouter(prefix="/testimonials", tags=["testimonials"])

@router.get("/", response_model=List[Testimonial])
async def get_testimonials():
    db = get_database()
    testimonials = await db.testimonials.find().to_list(1000)
    return testimonials

@router.post("/", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate = Body(...)):
    db = get_database()
    testimonial_dict = testimonial.model_dump()
    result = await db.testimonials.insert_one(testimonial_dict)
    testimonial_dict["_id"] = str(result.inserted_id)
    return testimonial_dict

@router.delete("/{id}")
async def delete_testimonial(id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    result = await db.testimonials.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
        
    return {"message": "Testimonial deleted successfully"}
