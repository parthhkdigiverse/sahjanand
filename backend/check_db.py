import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load from root .env
load_dotenv("../.env")

async def check():
    mongo_url = os.getenv("MONGO_URL")
    print(f"Connecting to: {mongo_url}")
    client = AsyncIOMotorClient(mongo_url)
    db = client.get_default_database()
    print(f"Using database: {db.name}")
    
    doc = await db.contact_page.find_one({"id": "global"})
    print(f"Contact Page Doc: {doc}")
    
    # Also check settings just in case
    settings_doc = await db.settings.find_one({"id": "global"})
    print(f"Settings Doc: {settings_doc}")

if __name__ == "__main__":
    asyncio.run(check())
