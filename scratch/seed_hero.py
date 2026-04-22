import pymongo
import os

# Connection string
MONGO_URL = "mongodb://HK_Digiverse:HK%40Digiverse%40123@ac-ntkpfxo-shard-00-00.lcbyqbq.mongodb.net:27017,ac-ntkpfxo-shard-00-01.lcbyqbq.mongodb.net:27017,ac-ntkpfxo-shard-00-02.lcbyqbq.mongodb.net:27017/sahjanand?ssl=true&replicaSet=atlas-moqjmh-shard-0&authSource=admin"

client = pymongo.MongoClient(MONGO_URL)
db = client.get_default_database()

# 1. Seed Hero Slides
db.hero_slides.delete_many({})
slides = [
    {
        "image": "http://localhost:8001/uploads/hero-1.jpg",
        "eyebrow": "New Collection",
        "title": "Timeless Elegance",
        "subtitle": "Beautifully crafted jewellery for every occasion.",
        "link_text": "Shop Now",
        "link_url": "/shop",
        "order": 0
    },
    {
        "image": "http://localhost:8001/uploads/hero-2.jpg",
        "eyebrow": "Bridal",
        "title": "Made to Last Forever",
        "subtitle": "Hand-finished gold pieces, designed to be passed down.",
        "link_text": "Explore",
        "link_url": "/shop",
        "order": 1
    },
    {
        "image": "http://localhost:8001/uploads/hero-3.jpg",
        "eyebrow": "New Arrivals",
        "title": "Pure & Refined",
        "subtitle": "Pearls and gold, in their most graceful form.",
        "link_text": "View All",
        "link_url": "/shop",
        "order": 2
    }
]
db.hero_slides.insert_many(slides)

# 2. Seed Offer Image in Settings
db.settings.update_one(
    {"id": "global"},
    {"$set": {"offer_image": "http://localhost:8001/uploads/offer.jpg"}},
    upsert=True
)

print("Seeding successful!")
client.close()
