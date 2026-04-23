import asyncio
import motor.motor_asyncio
import os
import re
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

async def cleanup_contacts():
    load_env()
    mongo_url = os.environ.get("MONGO_URL")
    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_url)
    db = client.get_database()
    
    print("Cleaning up existing contacts...")
    contacts = await db.contacts.find().to_list(1000)
    
    for c in contacts:
        message = c.get("message", "")
        updates = {}
        
        # Try to extract phone
        phone_match = re.search(r"Phone:\s*([\d\+\-\s]+)", message)
        if phone_match and not c.get("phone"):
            updates["phone"] = phone_match.group(1).strip()
            
        # Try to extract date
        date_match = re.search(r"Preferred Date:\s*([\d\-]+)", message)
        if date_match and not c.get("preferred_date"):
            updates["preferred_date"] = date_match.group(1).strip()
            
        # If we found fields, clean up the message
        if updates:
            # Remove the extracted lines from message
            new_message = re.sub(r"Phone:\s*[\d\+\-\s]+\n?", "", message)
            new_message = re.sub(r"Preferred Date:\s*[\d\-]+\n?", "", new_message)
            new_message = new_message.strip()
            updates["message"] = new_message
            
            await db.contacts.update_one({"_id": c["_id"]}, {"$set": updates})
            print(f"Updated contact: {c.get('name')}")

    print("Cleanup complete!")
    client.close()

if __name__ == "__main__":
    asyncio.run(cleanup_contacts())
