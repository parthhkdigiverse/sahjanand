import asyncio
import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def check():
    client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGO_URL"))
    db = client.get_default_database()
    print(f"Checking collection: contact_page")
    async for doc in db.contact_page.find():
        print(doc)
    client.close()

if __name__ == "__main__":
    asyncio.run(check())
