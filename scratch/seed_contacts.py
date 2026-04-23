import asyncio
import motor.motor_asyncio
import os
from pathlib import Path
from datetime import datetime

def load_env():
    env_path = Path(".env")
    if env_path.exists():
        with open(env_path, encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if "=" in line and not line.startswith("#"):
                    key, value = line.split("=", 1)
                    value = value.strip().strip('"').strip("'")
                    os.environ[key] = value

async def seed_contacts():
    load_env()
    mongo_url = os.environ.get("MONGO_URL")
    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_url)
    db = client.get_database()
    
    print("Seeding inquiries...")
    await db.contacts.delete_many({})
    
    inquiries = [
        {
            "name": "Janvi Sharma",
            "email": "janvi@gmail.com",
            "subject": "Product Inquiry: Aurélia Halo Ring",
            "message": "Greetings, I am captivated by the Aurélia Halo Ring and would like to know if it's available in white gold.",
            "type": "PRODUCT",
            "product_name": "Aurélia Halo Ring",
            "created_at": datetime.utcnow()
        },
        {
            "name": "Rajiv Patel",
            "email": "rajiv@example.com",
            "subject": "Custom Design Request",
            "message": "I am looking for a custom wedding band. Do you offer bespoke services?",
            "type": "GENERAL",
            "created_at": datetime.utcnow()
        }
    ]
    
    await db.contacts.insert_many(inquiries)
    print("Seeding successful!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_contacts())
