import asyncio
import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def list_blogs():
    mongo_uri = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri)
    db = client.get_database("sahjanand")
    blogs = await db.blogs.find().to_list(100)
    for b in blogs:
        print(f"Slug: {b['slug']}, Title: {b['title']}")

if __name__ == "__main__":
    asyncio.run(list_blogs())
