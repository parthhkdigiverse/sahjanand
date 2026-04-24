from pydantic import BaseModel, Field
from typing import Optional

class SettingsBase(BaseModel):
    offer_heading: str = "Handcrafted with Soul"
    offer_subheading: str = "Pure Gold • Timeless Beauty"
    offer_description: str = "A small thank-you for choosing us. Share your details and we'll send your discount code straight to your inbox."
    offer_image: str = "/uploads/offer_banner.png"
    popup_eyebrow: str = "Claim Offer"
    popup_heading: str = "Your 10% Discount"
    popup_description: str = "Just a few details and your code is yours."
    popup_button_text: str = "Send My Code"
    offer_button_text: str = "Get My Offer"
    offer_footer_text: str = "Limited time · One per customer"

    # Contact & Footer Settings
    contact_address: str = "14 Marine Drive, Mumbai · 400001, India"
    contact_phone: str = "+91 22 4000 0000"
    contact_email: str = "hello@maisonaurum.com"
    instagram_url: str = "#"
    facebook_url: str = "#"
    twitter_url: str = "#"
    youtube_url: str = "#"
    whatsapp_number: str = "+91 95123 06199"

    # Instagram Section Settings
    instagram_eyebrow: str = "@maisonaurum"
    instagram_heading: str = "Follow Us on Instagram"
    instagram_subheading: str = "A glimpse into our world"

    # Reviews Section Settings
    reviews_heading: str = "What Our Customers Say"
    reviews_subheading: str = "4.9 / 5 · Verified by Google · 2,400+ reviews"

    # Testimonials Section Settings
    testimonials_heading: str = "Real Stories"
    testimonials_subheading: str = "Our Customers"

    # Gold Price Settings
    gold_price_source: str = "manual"  # "manual" or "api"
    manual_price_24k: float = 7780.0
    manual_price_22k: float = 7140.0
    manual_price_18k: float = 5840.0
    gold_price_api_key: Optional[str] = None

    # Atelier Promise Settings
    promise_title: str = "Atelier Promise"
    promise_text: str = "Every piece is hallmarked, certified and accompanied by a lifetime care service."

class Settings(SettingsBase):
    pass
