from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from bson import ObjectId
from ..models.review import Review, ReviewCreate, ReviewUpdate
from ..database import get_database
from ..auth import get_current_admin

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.get("/", response_model=List[Review])
async def get_reviews():
    db = get_database()
    reviews = await db.reviews.find().to_list(1000)
    return reviews

@router.post("/", response_model=Review)
async def create_review(review: ReviewCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    review_dict = review.model_dump()
    result = await db.reviews.insert_one(review_dict)
    review_dict["_id"] = str(result.inserted_id)
    return review_dict

@router.put("/{id}", response_model=Review)
async def update_review(id: str, review: ReviewUpdate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    update_data = {k: v for k, v in review.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = await db.reviews.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
        
    updated_review = await db.reviews.find_one({"_id": ObjectId(id)})
    updated_review["_id"] = str(updated_review["_id"])
    return updated_review

@router.delete("/{id}")
async def delete_review(id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    result = await db.reviews.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
        
    return {"message": "Review deleted successfully"}
