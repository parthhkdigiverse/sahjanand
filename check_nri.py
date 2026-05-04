import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def check_nri_data():
    mongo_url = os.environ.get("MONGO_URL")
    if not mongo_url:
        print("MONGO_URL not found in env")
        return
    client = AsyncIOMotorClient(mongo_url)
    db = client.get_database()
    nri_data = await db.nri_page.find_one({})
    print(f"NRI Page Data: {nri_data}")

if __name__ == "__main__":
    asyncio.run(check_nri_data())
