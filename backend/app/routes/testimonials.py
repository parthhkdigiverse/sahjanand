from fastapi import APIRouter, HTTPException, Body
from typing import List
from ..models.testimonial import Testimonial, TestimonialCreate
from ..database import get_database

router = APIRouter(prefix="/testimonials", tags=["testimonials"])

@router.get("/", response_model=List[Testimonial])
async def get_testimonials():
    db = get_database()
    testimonials = await db.testimonials.find().to_list(1000)
    return testimonials

@router.post("/", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate = Body(...)):
    db = get_database()
    testimonial_dict = testimonial.dict()
    result = await db.testimonials.insert_one(testimonial_dict)
    testimonial_dict["_id"] = result.inserted_id
    return testimonial_dict
