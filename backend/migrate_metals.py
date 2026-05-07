
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys
import os

# Add parent directory to path to import config
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

async def migrate_metals():
    # Assuming connection string is in config or environment
    # Let's check config.py
    from app.config import settings
    
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client.get_default_database()
    products_col = db.products
    
    print("Starting migration of 'metal' field from string to list...")
    
    async for product in products_col.find({"metal": {"$type": "string"}}):
        metal_str = product.get("metal")
        if metal_str:
            # Convert string to list [string]
            await products_col.update_one(
                {"_id": product["_id"]},
                {"$set": {"metal": [metal_str]}}
            )
            print(f"Updated product {product.get('id') or product.get('_id')}: {metal_str} -> [{metal_str}]")
        else:
            await products_col.update_one(
                {"_id": product["_id"]},
                {"$set": {"metal": []}}
            )
            print(f"Updated product {product.get('id') or product.get('_id')}: None -> []")

    print("Migration complete.")

if __name__ == "__main__":
    asyncio.run(migrate_metals())
