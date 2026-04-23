import asyncio
import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def test_update():
    mongo_uri = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri)
    db = client.get_database("sahjanand")
    
    slug = "jewellery-care-tips"
    new_data = {
        "title": "Jewellery Care Tips: Keep Your Pieces Timeless (Updated)",
        "meta_title": "SEO Title Test",
        "meta_description": "SEO Description Test",
        "keywords": "test, keywords",
        # Keep other fields same as existing or provide defaults
        "slug": slug,
        "excerpt": "Learn how to care for your precious jewellery.",
        "category": "Maintenance",
        "readTime": "5 min read",
        "date": "April 23, 2026",
        "image": "/uploads/test.jpg",
        "content": ["Paragraph 1", "Paragraph 2"]
    }
    
    result = await db.blogs.find_one_and_update(
        {"slug": slug},
        {"$set": new_data},
        return_document=True
    )
    
    if result:
        print(f"Successfully updated: {result['title']}")
        print(f"Meta Title: {result.get('meta_title')}")
    else:
        print("Failed to find blog by slug.")

if __name__ == "__main__":
    asyncio.run(test_update())
