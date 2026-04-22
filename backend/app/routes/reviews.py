from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from bson import ObjectId
from ..models.review import Review, ReviewCreate, ReviewUpdate
from ..database import get_database
from ..auth import get_current_admin

router = APIRouter(prefix="/reviews", tags=["reviews"])

def serialize_review(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/", response_model=List[Review], response_model_by_alias=True)
async def get_reviews():
    db = get_database()
    reviews = await db.reviews.find().to_list(1000)
    return [serialize_review(r) for r in reviews]

@router.post("/", response_model=Review, response_model_by_alias=True)
async def create_review(review: ReviewCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    review_dict = review.model_dump()
    result = await db.reviews.insert_one(review_dict)
    created = await db.reviews.find_one({"_id": result.inserted_id})
    return serialize_review(created)

@router.put("/{id}", response_model=Review, response_model_by_alias=True)
async def update_review(id: str, review: ReviewUpdate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    update_data = {k: v for k, v in review.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    updated = await db.reviews.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_data},
        return_document=True
    )
    
    if updated is None:
        raise HTTPException(status_code=404, detail="Review not found")
        
    return serialize_review(updated)

@router.delete("/{id}")
async def delete_review(id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    result = await db.reviews.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
        
    return {"message": "Review deleted successfully"}
