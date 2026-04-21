from fastapi import APIRouter, HTTPException, Body
from typing import List
from ..models.blog import Blog, BlogCreate
from ..database import get_database

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
async def create_blog(blog: BlogCreate = Body(...)):
    db = get_database()
    blog_dict = blog.dict()
    result = await db.blogs.insert_one(blog_dict)
    blog_dict["_id"] = str(result.inserted_id)
    return blog_dict
