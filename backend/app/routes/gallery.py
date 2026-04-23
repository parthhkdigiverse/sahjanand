from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from ..models.gallery import GalleryItem, GalleryCreate, GallerySettings
from ..database import get_database
from bson import ObjectId
from ..auth import get_current_admin

router = APIRouter(prefix="/gallery", tags=["Gallery"])

@router.get("/settings", response_model=GallerySettings)
async def get_gallery_settings():
    db = get_database()
    settings = await db.gallery_settings.find_one({})
    if not settings:
        return GallerySettings()
    return GallerySettings(**settings)

@router.put("/settings", response_model=GallerySettings)
async def update_gallery_settings(settings: GallerySettings = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    await db.gallery_settings.update_one(
        {},
        {"$set": settings.model_dump()},
        upsert=True
    )
    return settings

@router.get("/", response_model=List[GalleryItem])
async def get_gallery_items():
    db = get_database()
    # Sort by order, then by title
    cursor = db.gallery.find().sort([("order", 1), ("title", 1)])
    items = await cursor.to_list(1000)
    return items

@router.get("/{id}", response_model=GalleryItem)
async def get_gallery_item(id: str):
    db = get_database()
    item = await db.gallery.find_one({"id": id})
    
    if not item:
        try:
            if ObjectId.is_valid(id):
                item = await db.gallery.find_one({"_id": ObjectId(id)})
        except:
            pass
            
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return item

@router.post("/", response_model=GalleryItem)
async def create_gallery_item(item: GalleryCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    item_dict = item.model_dump()
    
    # Check if id already exists
    if await db.gallery.find_one({"id": item_dict["id"]}):
        raise HTTPException(status_code=400, detail="Item with this ID already exists")
        
    result = await db.gallery.insert_one(item_dict)
    item_dict["_id"] = str(result.inserted_id)
    return item_dict

@router.put("/{id}", response_model=GalleryItem)
async def update_gallery_item(id: str, item_data: GalleryCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    
    query = {"id": id}
    if ObjectId.is_valid(id):
        query = {"$or": [{"id": id}, {"_id": ObjectId(id)}]}
        
    result = await db.gallery.find_one_and_update(
        query,
        {"$set": item_data.model_dump()},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Gallery item not found")
        
    result["_id"] = str(result["_id"])
    return result

@router.delete("/{id}")
async def delete_gallery_item(id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    
    query = {"id": id}
    if ObjectId.is_valid(id):
        query = {"$or": [{"id": id}, {"_id": ObjectId(id)}]}
        
    result = await db.gallery.delete_one(query)
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
        
    return {"message": "Gallery item deleted successfully"}
