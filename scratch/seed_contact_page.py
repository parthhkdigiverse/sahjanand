import asyncio
import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def seed_contact():
    client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGO_URL"))
    db = client.get_default_database()
    
    contact_data = {
        "id": "global",
        "hero_image": "/assets/hero-3.jpg",
        "hero_eyebrow": "Private Viewing",
        "hero_heading": "Experience the Art of Craft",
        "hero_description": "Schedule a private consultation at our Mumbai boutique. Discover our collections with dedicated assistance from our master jewelers.",
        "boutique_address_line1": "14 Marine Drive",
        "boutique_address_line2": "Colaba, Mumbai 400001",
        "concierge_phone": "+91 22 4000 0000",
        "inquiries_email": "hello@maisonaurum.com",
        "opening_hours_line1": "Tue – Sat · 11:00 – 19:00",
        "opening_hours_line2": "Sun & Mon · Private Appointments Only",
        "map_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.215577626993!2d72.82298781538337!3d18.921389787176527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1e89ce4b87f%3A0xc3ec5bf4d28dc124!2sMarine%20Drive!5e0!3m2!1sen!2sin!4v1682348572883!5m2!1sen!2sin"
    }
    
    print("Seeding contact page data...")
    await db.contact_page.update_one(
        {"id": "global"},
        {"$set": contact_data},
        upsert=True
    )
    print("Done!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_contact())
