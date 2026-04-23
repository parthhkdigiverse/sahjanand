from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from ..models.offer import Offer, OfferCreate
from ..database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[Offer])
async def get_offers():
    db = get_database()
    offers = await db.offers.find().to_list(1000)
    return offers

@router.post("/", response_model=Offer)
async def create_offer(offer: OfferCreate):
    db = get_database()
    offer_dict = offer.model_dump()
    offer_dict["created_at"] = datetime.utcnow()
    result = await db.offers.insert_one(offer_dict)
    created_offer = await db.offers.find_one({"_id": result.inserted_id})
    return created_offer

@router.put("/{id}", response_model=Offer)
async def update_offer(id: str, offer: OfferCreate):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    
    db = get_database()
    result = await db.offers.update_one(
        {"_id": ObjectId(id)},
        {"$set": offer.model_dump()}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Offer not found")
        
    updated_offer = await db.offers.find_one({"_id": ObjectId(id)})
    return updated_offer

@router.delete("/{id}")
async def delete_offer(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    db = get_database()
    result = await db.offers.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Offer not found")
        
    return {"message": "Offer deleted"}
