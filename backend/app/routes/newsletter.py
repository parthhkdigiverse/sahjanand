from fastapi import APIRouter, HTTPException, Depends
from ..database import get_database
from ..models.newsletter import NewsletterSubscriber, NewsletterCreate
from typing import List
from ..auth import get_current_admin

router = APIRouter()

@router.post("/")
async def subscribe_newsletter(data: NewsletterCreate):
    db = get_database()
    # Check if already subscribed
    existing = await db.newsletter.find_one({"email": data.email})
    if existing:
        return {"message": "Already subscribed"}
    
    subscriber = NewsletterSubscriber(email=data.email)
    result = await db.newsletter.insert_one(subscriber.model_dump(by_alias=True, exclude={"id"}))
    return {"message": "Successfully subscribed", "id": str(result.inserted_id)}

@router.get("/", response_model=List[NewsletterSubscriber])
async def get_subscribers(admin: str = Depends(get_current_admin)):
    db = get_database()
    subscribers = await db.newsletter.find().sort("created_at", -1).to_list(1000)
    for sub in subscribers:
        sub["_id"] = str(sub["_id"])
    return subscribers

@router.delete("/{subscriber_id}")
async def delete_subscriber(subscriber_id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    from bson import ObjectId
    try:
        result = await db.newsletter.delete_one({"_id": ObjectId(subscriber_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Subscriber not found")
        return {"message": "Subscriber removed"}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")
