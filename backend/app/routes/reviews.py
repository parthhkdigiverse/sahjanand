from fastapi import APIRouter, HTTPException, Body
from typing import List
from ..models.review import Review, ReviewCreate
from ..database import get_database

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.get("/", response_model=List[Review])
async def get_reviews():
    db = get_database()
    reviews = await db.reviews.find().to_list(1000)
    return reviews

@router.post("/", response_model=Review)
async def create_review(review: ReviewCreate = Body(...)):
    db = get_database()
    review_dict = review.dict()
    result = await db.reviews.insert_one(review_dict)
    review_dict["_id"] = result.inserted_id
    return review_dict
