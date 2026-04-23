from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class PromiseItem(BaseModel):
    title: str
    description: str

class AboutData(BaseModel):
    hero_image: Optional[str] = None
    hero_heading: str = "Crafted with Care"
    hero_eyebrow: str = "Our Story"
    
    story_heading: str = "Made by hand. Made to last."
    story_eyebrow: str = "Our Studio"
    story_paragraphs: List[str] = [
        "Maison Aurum was started in Mumbai in 1924 by a young goldsmith who believed jewellery should outlive its wearer. Today, four generations on, we still believe the same thing.",
        "We don't follow trends and we don't make in bulk. Every piece is finished by hand by an artisan whose name is on the certificate. A quiet promise between the maker, the wearer, and time.",
        "From the gold we choose to the diamonds we set, each decision serves one idea: what you wear today should be worth passing down tomorrow."
    ]
    
    promise_image: Optional[str] = None
    promise_heading: str = "Every piece, made to last."
    promise_eyebrow: str = "Our Promise"
    promises: List[PromiseItem] = [
        PromiseItem(title="Hallmark Certified", description="Every gram of gold is tested and stamped by the Bureau of Indian Standards."),
        PromiseItem(title="Conflict-Free Diamonds", description="All our diamonds are traced to source and certified to GIA standards."),
        PromiseItem(title="Lifetime Service", description="Free cleaning, polishing and re-sizing — for as long as the piece is yours.")
    ]
    
    cta_text: str = "Shop the Collection"
    cta_link: str = "/shop"

    model_config = ConfigDict(
        populate_by_name=True,
        extra='ignore'
    )

class AboutPage(AboutData):
    id: str = "about"
