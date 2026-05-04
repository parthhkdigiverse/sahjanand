import asyncio
import motor.motor_asyncio
import os

async def run():
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb+srv://HK_Digiverse:HK%40Digiverse%40123@cluster0.lcbyqbq.mongodb.net/sahjanand?retryWrites=true&w=majority&appName=Cluster0')
    db = client.get_default_database()
    await db.nri_page.update_one(
        {'id': 'nri'}, 
        {'$set': {'hero_image': '/uploads/hero-2.jpg', 'benefits_image': '/uploads/insta-2.jpg'}}, 
        upsert=True
    )
    print('Done')

if __name__ == '__main__':
    asyncio.run(run())
