import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv("../.env")

async def check():
    client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
    db = client.get_default_database()
    collections = await db.list_collection_names()
    print(f"Collections: {collections}")
    
    for coll_name in collections:
        count = await db[coll_name].count_documents({})
        print(f"Collection {coll_name}: {count} docs")
        if "contact" in coll_name:
            doc = await db[coll_name].find_one({})
            print(f"Found doc in {coll_name}: {doc}")

if __name__ == "__main__":
    asyncio.run(check())
