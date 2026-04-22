import pymongo

# Connection string
MONGO_URL = "mongodb://HK_Digiverse:HK%40Digiverse%40123@ac-ntkpfxo-shard-00-00.lcbyqbq.mongodb.net:27017,ac-ntkpfxo-shard-00-01.lcbyqbq.mongodb.net:27017,ac-ntkpfxo-shard-00-02.lcbyqbq.mongodb.net:27017/sahjanand?ssl=true&replicaSet=atlas-moqjmh-shard-0&authSource=admin"

client = pymongo.MongoClient(MONGO_URL)
db = client.get_default_database()

db.settings.update_one(
    {"id": "global"},
    {"$set": {
        "popup_eyebrow": "Claim Offer",
        "popup_heading": "Your 10% Discount",
        "popup_description": "Just a few details and your code is yours.",
        "popup_button_text": "Send My Code"
    }},
    upsert=True
)

print("Popup settings seeded successfully!")
client.close()
