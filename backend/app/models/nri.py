from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class BenefitItem(BaseModel):
    title: str
    description: str

class NRIData(BaseModel):
    hero_image: Optional[str] = None
    hero_heading: str = "Global Heritage, Local Roots"
    hero_eyebrow: str = "NRI Services"
    
    intro_heading: str = "Invest in Timeless Craftsmanship"
    intro_paragraphs: List[str] = [
        "For generations, Sahajanand Jewellers has been a symbol of trust and purity for families across the globe. Our dedicated NRI services ensure that distance never comes between you and your heritage.",
        "We offer specialized consultation and secure logistics to make your investment in fine jewellery seamless and secure.",
    ]
    
    benefits_image: Optional[str] = None
    benefits: List[BenefitItem] = [
        BenefitItem(
            title="Virtual Consultation", 
            description="Connect with our master jewellers via private video link to view collections and design custom pieces."
        ),
        BenefitItem(
            title="Secure Global Shipping", 
            description="Fully insured, secure delivery to your international doorstep with complete customs documentation."
        ),
        BenefitItem(
            title="Hallmark Certified", 
            description="Every piece carries internationally recognized certification for gold purity and diamond authenticity."
        ),
    ]
    
    cta_text: str = "Schedule a Virtual Consultation"
    cta_link: str = "/contact"

    model_config = ConfigDict(
        populate_by_name=True,
        extra='ignore'
    )

class NRIPage(NRIData):
    id: str = "nri"
