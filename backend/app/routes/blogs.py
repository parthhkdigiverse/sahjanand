from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from ..models.blog import Blog, BlogCreate
from ..database import get_database
from bson import ObjectId
from ..auth import get_current_admin

router = APIRouter(prefix="/blogs", tags=["blogs"])

@router.get("/", response_model=List[Blog])
async def get_blogs():
    db = get_database()
    blogs = await db.blogs.find().to_list(1000)
    return blogs

@router.get("/{slug}", response_model=Blog)
async def get_blog(slug: str):
    db = get_database()
    blog = await db.blogs.find_one({"slug": slug})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog

@router.post("/", response_model=Blog)
async def create_blog(blog: BlogCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    blog_dict = blog.dict()
    result = await db.blogs.insert_one(blog_dict)
    blog_dict["_id"] = str(result.inserted_id)
    return blog_dict

@router.put("/{slug}", response_model=Blog)
async def update_blog(slug: str, blog_data: BlogCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    result = await db.blogs.find_one_and_update(
        {"slug": slug},
        {"$set": blog_data.dict()},
        return_document=True
    )
    if not result:
        # Fallback to id if slug not found
        if ObjectId.is_valid(slug):
            result = await db.blogs.find_one_and_update(
                {"_id": ObjectId(slug)},
                {"$set": blog_data.dict()},
                return_document=True
            )
            
    if not result:
        raise HTTPException(status_code=404, detail="Blog post not found")
        
    result["_id"] = str(result["_id"])
    return result

@router.delete("/{slug}")
async def delete_blog(slug: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    result = await db.blogs.delete_one({"slug": slug})
    
    if result.deleted_count == 0:
        if ObjectId.is_valid(slug):
            result = await db.blogs.delete_one({"_id": ObjectId(slug)})
            
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
        
    return {"message": "Blog post deleted successfully"}
