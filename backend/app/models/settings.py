from pydantic import BaseModel, Field
from typing import Optional

class SettingsBase(BaseModel):
    reviews_heading: str = "What Our Customers Say"
    reviews_subheading: str = "4.9 / 5 · Verified by Google · 2,400+ reviews"
    offer_heading: str = "Get 10% Off"
    offer_subheading: str = "Welcome Offer"
    offer_description: str = "A small thank-you for choosing us. Share your details and we'll send your discount code straight to your inbox."
    offer_image: str = "/uploads/offer_banner.png"
    popup_eyebrow: str = "Claim Offer"
    popup_heading: str = "Your 10% Discount"
    popup_description: str = "Just a few details and your code is yours."
    popup_button_text: str = "Send My Code"
    offer_button_text: str = "Get My Offer"
    offer_footer_text: str = "Limited time · One per customer"

    # Gold Price Settings
    gold_price_source: str = "manual"  # "manual" or "api"
    manual_price_24k: float = 7780.0
    manual_price_22k: float = 7140.0
    manual_price_18k: float = 5840.0
    gold_price_api_key: Optional[str] = None

class Settings(SettingsBase):
    pass
