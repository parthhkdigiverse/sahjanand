from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from ..models.product import Product, ProductCreate
from ..database import get_database
from bson import ObjectId
from ..auth import get_current_admin

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[Product])
async def get_products():
    db = get_database()
    cursor = db.products.find().sort("order", 1)
    products = await cursor.to_list(1000)
    return products

@router.post("/reorder")
async def reorder_products(ids: List[str] = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    for index, product_id in enumerate(ids):
        await db.products.update_one(
            {"id": product_id},
            {"$set": {"order": index}}
        )
    return {"message": "Products reordered successfully"}

@router.get("/{id}", response_model=Product)
async def get_product(id: str):
    db = get_database()
    # Try finding by our custom ID (slug) first
    product = await db.products.find_one({"id": id})
    
    if not product:
        # Fallback to Mongo _id if it's a valid ObjectId
        try:
            if ObjectId.is_valid(id):
                product = await db.products.find_one({"_id": ObjectId(id)})
        except:
            pass
            
    if not product:
        raise HTTPException(status_code=404, detail=f"Product with ID '{id}' not found")
    return product

@router.post("/", response_model=Product)
async def create_product(product: ProductCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    product_dict = product.model_dump()
    
    # Set order to be the last
    last_product = await db.products.find_one(sort=[("order", -1)])
    product_dict["order"] = (last_product.get("order", 0) + 1) if last_product else 0
    
    result = await db.products.insert_one(product_dict)
    product_dict["_id"] = str(result.inserted_id)
    return product_dict

@router.put("/{id}", response_model=Product)
async def update_product(id: str, product_data: ProductCreate = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    
    # Try to find by custom id first, then ObjectId
    query = {"id": id}
    if ObjectId.is_valid(id):
        query = {"$or": [{"id": id}, {"_id": ObjectId(id)}]}
        
    result = await db.products.find_one_and_update(
        query,
        {"$set": product_data.model_dump()},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
        
    result["_id"] = str(result["_id"])
    return result

@router.delete("/{id}")
async def delete_product(id: str, admin: str = Depends(get_current_admin)):
    db = get_database()
    
    query = {"id": id}
    if ObjectId.is_valid(id):
        query = {"$or": [{"id": id}, {"_id": ObjectId(id)}]}
        
    result = await db.products.delete_one(query)
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
        
    return {"message": "Product deleted successfully"}
