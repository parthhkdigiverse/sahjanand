from fastapi import APIRouter, HTTPException, Body
from typing import List
from ..models.product import Product, ProductCreate
from ..database import get_database
from bson import ObjectId

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[Product])
async def get_products():
    db = get_database()
    cursor = db.products.find()
    products = await cursor.to_list(1000)
    return products

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
async def create_product(product: ProductCreate = Body(...)):
    db = get_database()
    product_dict = product.dict()
    result = await db.products.insert_one(product_dict)
    product_dict["_id"] = str(result.inserted_id)
    return product_dict
