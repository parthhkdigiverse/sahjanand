import asyncio
import motor.motor_asyncio
import os
from pathlib import Path

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

async def check_contacts():
    load_env()
    mongo_url = os.environ.get("MONGO_URL")
    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_url)
    db = client.get_database()
    
    print("\n--- contacts ---")
    docs = await db.contacts.find().to_list(100)
    for d in docs:
        print(d)
        
    client.close()

if __name__ == "__main__":
    asyncio.run(check_contacts())
