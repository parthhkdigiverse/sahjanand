import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from urllib.parse import unquote

MONGO_URL = "mongodb+srv://HK_Digiverse:HK%40Digiverse%40123@cluster0.lcbyqbq.mongodb.net/sahjanand?retryWrites=true&w=majority&appName=Cluster0"

async def fix_paths():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.get_default_database()
    
    collections = await db.list_collection_names()
    print(f"Checking collections: {collections}")
    
    for coll_name in collections:
        coll = db[coll_name]
        cursor = coll.find()
        async for doc in cursor:
            updates = {}
            for key, value in doc.items():
                if isinstance(value, str) and ("/uploads/" in value):
                    # Check if it's a full URL
                    if "http" in value:
                        # Extract the relative path
                        relative_path = value[value.find("/uploads/"):]
                        updates[key] = relative_path
                        print(f"Fixed {coll_name}.{key}: {value} -> {relative_path}")
                elif isinstance(value, list):
                    new_list = []
                    changed = False
                    for item in value:
                        if isinstance(item, str) and ("/uploads/" in item) and ("http" in item):
                            relative_path = item[item.find("/uploads/"):]
                            new_list.append(relative_path)
                            changed = True
                            print(f"Fixed {coll_name}.{key} (list item): {item} -> {relative_path}")
                        else:
                            new_list.append(item)
                    if changed:
                        updates[key] = new_list
            
            if updates:
                await coll.update_one({"_id": doc["_id"]}, {"$set": updates})
                
    print("Database path cleanup complete.")

if __name__ == "__main__":
    asyncio.run(fix_paths())
