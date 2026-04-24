from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class ContactPageData(BaseModel):
    model_config = ConfigDict(extra='ignore', populate_by_name=True)
    
    hero_image: Optional[str] = ""
    hero_eyebrow: Optional[str] = ""
    hero_heading: Optional[str] = ""
    hero_description: Optional[str] = ""
    
    # Atelier Details
    boutique_address_line1: Optional[str] = ""
    boutique_address_line2: Optional[str] = ""
    concierge_phone: Optional[str] = ""
    inquiries_email: Optional[str] = ""
    
    # Opening Hours
    opening_hours_line1: Optional[str] = ""
    
    # Map
    map_embed_url: Optional[str] = ""
