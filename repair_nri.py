import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def repair_nri_data():
    mongo_url = os.environ.get("MONGO_URL")
    if not mongo_url:
        print("MONGO_URL not found in env")
        return
    client = AsyncIOMotorClient(mongo_url)
    db = client.get_database()
    
    # Update nri_page where hero_image or benefits_image contain the bad timestamp
    result = await db.nri_page.update_one(
        {"id": "nri"},
        {"$set": {
            "hero_image": None,
            "benefits_image": None
        }}
    )
    print(f"Repaired NRI Page Data. Matched: {result.matched_count}, Modified: {result.modified_count}")

if __name__ == "__main__":
    asyncio.run(repair_nri_data())
