from fastapi import APIRouter, HTTPException, Depends, Body
from ..models.policy import Policy, PolicyBase
from ..database import get_database
from ..auth import get_current_admin
from typing import List

router = APIRouter(prefix="/policies", tags=["policies"])

@router.get("/", response_model=List[Policy])
async def get_policies():
    db = get_database()
    return await db.policies.find().to_list(100)

@router.get("/{slug}", response_model=Policy)
async def get_policy(slug: str):
    db = get_database()
    policy = await db.policies.find_one({"slug": slug})
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy

@router.post("/", response_model=Policy)
async def create_policy(policy: PolicyBase = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    # Check if slug exists
    existing = await db.policies.find_one({"slug": policy.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    result = await db.policies.insert_one(policy.model_dump())
    new_policy = await db.policies.find_one({"_id": result.inserted_id})
    return new_policy

@router.put("/{id}", response_model=Policy)
async def update_policy(id: str, policy: PolicyBase = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    from bson import ObjectId
    
    if not ObjectId.is_valid(id):
         # Try finding by slug if ID is not valid ObjectId (for legacy support or simplified API)
         result = await db.policies.find_one_and_update(
            {"slug": id},
            {"$set": policy.model_dump()},
            return_document=True
        )
    else:
        result = await db.policies.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": policy.model_dump()},
            return_document=True
        )
        
    if not result:
        raise HTTPException(status_code=404, detail="Policy not found")
    return result

@router.delete("/{id}")
async def delete_policy(id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    from bson import ObjectId
    
    if not ObjectId.is_valid(id):
        # Try deleting by slug
        result = await db.policies.delete_one({"slug": id})
    else:
        result = await db.policies.delete_one({"_id": ObjectId(id)})
        
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Policy not found")
    return {"message": "Policy deleted"}
