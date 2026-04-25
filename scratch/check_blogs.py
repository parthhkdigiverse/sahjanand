import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def check_blogs():
    mongo_url = "mongodb+srv://HK_Digiverse:HK%40Digiverse%40123@cluster0.lcbyqbq.mongodb.net/sahjanand?retryWrites=true&w=majority&appName=Cluster0"
    client = AsyncIOMotorClient(mongo_url)
    db = client.sahjanand
    
    print("Checking blogs...")
    async for blog in db.blogs.find():
        print(f"Blog: {blog.get('title')} | Image: {blog.get('image')}")

if __name__ == "__main__":
    asyncio.run(check_blogs())
