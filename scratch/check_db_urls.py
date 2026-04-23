import asyncio
import motor.motor_asyncio
import os
from pathlib import Path

def load_env():
    env_path = Path(__file__).parent.parent / ".env"
    if env_path.exists():
        with open(env_path, encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if "=" in line and not line.startswith("#"):
                    key, value = line.split("=", 1)
                    value = value.strip().strip('"').strip("'")
                    os.environ[key] = value

async def check_db():
    load_env()
    mongo_url = os.environ.get("MONGO_URL")
    if not mongo_url:
        print("MONGO_URL not found in .env")
        return
    
    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_url)
    db = client.get_database()
    
    print("--- Hero Slides ---")
    slides = await db.hero_slides.find().to_list(100)
    for s in slides:
        print(f"ID: {s['_id']}, Image: {s.get('image')}")
        
    client.close()

if __name__ == "__main__":
    asyncio.run(check_db())
