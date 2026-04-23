from fastapi import APIRouter, HTTPException, Body, Depends
from ..models.about import AboutPage, AboutData
from ..database import get_database
from ..auth import get_current_admin

router = APIRouter(prefix="/about", tags=["about"])

@router.get("/", response_model=AboutData)
async def get_about_data():
    db = get_database()
    doc = await db.about_page.find_one({"id": "about"})
    if not doc:
        # Initial Heritage Content
        initial_data = AboutData(
            hero_heading="Crafted with Care",
            hero_eyebrow="Our Story",
            hero_image="/uploads/hero-1.jpg",
            story_heading="Made by hand. Made to last.",
            story_eyebrow="Our Studio",
            story_paragraphs=[
                "Maison Aurum was started in Mumbai in 1924 by a young goldsmith who believed jewellery should outlive its wearer. Today, four generations on, we still believe the same thing.",
                "We don't follow trends and we don't make in bulk. Every piece is finished by hand by an artisan whose name is on the certificate. A quiet promise between the maker, the wearer, and time.",
                "From the gold we choose to the diamonds we set, each decision serves one idea: what you wear today should be worth passing down tomorrow."
            ],
            promise_heading="Every piece, made to last.",
            promise_eyebrow="Our Promise",
            promise_image="/uploads/insta-1.jpg",
            promises=[
                {"title": "Hallmark Certified", "description": "Every gram of gold is tested and stamped by the Bureau of Indian Standards."},
                {"title": "Conflict-Free Diamonds", "description": "All our diamonds are traced to source and certified to GIA standards."},
                {"title": "Lifetime Service", "description": "Free cleaning, polishing and re-sizing — for as long as the piece is yours."}
            ]
        )
        await db.about_page.insert_one({"id": "about", **initial_data.model_dump()})
        return initial_data
    return AboutData(**doc)

@router.put("/", response_model=AboutData)
async def update_about_data(data: AboutData = Body(...), admin: str = Depends(get_current_admin)):
    db = get_database()
    
    result = await db.about_page.find_one_and_update(
        {"id": "about"},
        {"$set": data.model_dump()},
        upsert=True,
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="About page not found")
        
    return AboutData(**result)
