from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from ..models.category import Category, CategoryCreate, CategoryUpdate
from ..database import get_database
from bson import ObjectId
from ..auth import get_current_admin

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/", response_model=List[Category])
async def get_categories():
    db = get_database()
    cursor = db.categories.find()
    categories = await cursor.to_list(100)
    return categories

@router.get("/{id}", response_model=Category)
async def get_category(id: str):
    db = get_database()
    category = await db.categories.find_one({"id": id})
    
    if not category:
        try:
            if ObjectId.is_valid(id):
                category = await db.categories.find_one({"_id": ObjectId(id)})
        except:
            pass
            
    if not category:
        raise HTTPException(status_code=404, detail=f"Category with ID '{id}' not found")
    return category

@router.post("/", response_model=Category)
async def create_category(category: CategoryCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    category_dict = category.dict()
    
    # Check if category with this id already exists
    existing = await db.categories.find_one({"id": category.id})
    if existing:
        raise HTTPException(status_code=400, detail="Category with this ID already exists")

    result = await db.categories.insert_one(category_dict)
    category_dict["_id"] = str(result.inserted_id)
    return category_dict

@router.put("/{id}", response_model=Category)
async def update_category(id: str, category_data: CategoryUpdate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    
    query = {"id": id}
    if ObjectId.is_valid(id):
        query = {"$or": [{"id": id}, {"_id": ObjectId(id)}]}
        
    update_data = {k: v for k, v in category_data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = await db.categories.find_one_and_update(
        query,
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Category not found")
        
    result["_id"] = str(result["_id"])
    return result

@router.delete("/{id}")
async def delete_category(id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    
    query = {"id": id}
    if ObjectId.is_valid(id):
        query = {"$or": [{"id": id}, {"_id": ObjectId(id)}]}
        
    result = await db.categories.delete_one(query)
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
        
    return {"message": "Category deleted successfully"}
