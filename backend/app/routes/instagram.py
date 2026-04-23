from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from ..models.instagram import InstagramPost, InstagramPostCreate
from ..database import get_database
from bson import ObjectId
from ..auth import get_current_admin

router = APIRouter(prefix="/instagram", tags=["instagram"])

@router.get("/", response_model=List[InstagramPost])
async def get_instagram_posts():
    db = get_database()
    cursor = db.instagram.find().sort("order", 1)
    posts = await cursor.to_list(100)
    return posts

@router.post("/", response_model=InstagramPost)
async def create_instagram_post(post: InstagramPostCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    post_dict = post.model_dump()
    result = await db.instagram.insert_one(post_dict)
    post_dict["_id"] = str(result.inserted_id)
    return post_dict

@router.put("/{id}", response_model=InstagramPost)
async def update_instagram_post(id: str, post_data: InstagramPostCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid post ID")
        
    result = await db.instagram.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": post_data.model_dump()},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Post not found")
        
    result["_id"] = str(result["_id"])
    return result

@router.delete("/{id}")
async def delete_instagram_post(id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid post ID")
        
    result = await db.instagram.delete_one({"_id": ObjectId(id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
        
    return {"message": "Post deleted successfully"}
