import asyncio
import motor.motor_asyncio
import os
from dotenv import load_dotenv
import json

load_dotenv()

async def inspect_blog():
    mongo_uri = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri)
    db = client.get_database("sahjanand")
    
    slug = "jewellery-care-tips"
    blog = await db.blogs.find_one({"slug": slug})
    
    if blog:
        # Convert ObjectId to string for JSON printing
        blog['_id'] = str(blog['_id'])
        print(json.dumps(blog, indent=2))
    else:
        print("Blog not found")

if __name__ == "__main__":
    asyncio.run(inspect_blog())
