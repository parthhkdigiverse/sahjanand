import asyncio
import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def update_first_blog():
    mongo_uri = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri)
    db = client.get_database("sahjanand")
    
    slug = "jewellery-care-tips"
    
    seo_data = {
        "meta_title": "Expert Jewellery Care Tips | Maintain Your Fine Jewellery - Sahajanand Jewellers",
        "meta_description": "Learn how to keep your gold and diamond jewellery shining for generations with our professional care guide. Best practices for cleaning and storage.",
        "keywords": "jewellery care, gold cleaning, diamond maintenance, luxury jewellery care, Sahajanand Jewellers guide"
    }
    
    result = await db.blogs.find_one_and_update(
        {"slug": slug},
        {"$set": seo_data},
        return_document=True
    )
    
    if result:
        print(f"Successfully updated SEO data for: {result['title']}")
        print(f"New Meta Title: {result.get('meta_title')}")
    else:
        print("First blog (jewellery-care-tips) not found.")

if __name__ == "__main__":
    asyncio.run(update_first_blog())
