from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId

class BlogBase(BaseModel):
    slug: str
    title: str
    excerpt: str
    category: str
    readTime: str
    date: str
    image: str
    content: List[str]

class BlogCreate(BlogBase):
    pass

class Blog(BlogBase):
    id: Optional[str] = Field(None, alias="_id")

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True
