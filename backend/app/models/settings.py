from pydantic import BaseModel, Field
from typing import Optional, List

class FormField(BaseModel):
    id: str
    name: str
    label: str
    type: str = "text"
    required: bool = False
    is_constant: bool = False

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

    # Announcement Strip
    show_announcement: bool = True
    announcement_text: str = "Discover our new Festive Collection — Handcrafted with Pure Gold and Timeless Elegance. | Complimentary shipping on all heirloom orders over ₹50,000. | Visit our Nadiad boutique for a personalized concierge experience."

    # Form Configuration
    form_fields: List[FormField] = [
        FormField(id="name", name="name", label="Name", type="text", required=True, is_constant=True),
        FormField(id="phone", name="phone", label="Phone", type="tel", required=True, is_constant=True),
        FormField(id="email", name="email", label="Email", type="email", required=True, is_constant=False),
    ]

    # Contact & Footer Settings
    contact_address: str = "14 Marine Drive, Mumbai · 400001, India"
    contact_phone: str = "+91 22 4000 0000"
    contact_email: str = "hello@sahajanandjewellers.com"
    instagram_url: str = "#"
    facebook_url: str = "#"
    twitter_url: str = "#"
    youtube_url: str = "#"
    whatsapp_number: str = "+91 95123 06199"
    videocall_url: str = ""
    chat_url: str = ""

    # Instagram Section Settings
    instagram_eyebrow: str = "@sahajanandjewellers"
    instagram_heading: str = "Follow Us on Instagram"
    instagram_subheading: str = "A glimpse into our world"

    # Reviews Section Settings
    reviews_heading: str = "What Our Customers Say"
    reviews_subheading: str = "4.9 / 5 · Verified by Google · 2,400+ reviews"

    # Testimonials Section Settings
    testimonials_heading: str = "Voices of Trust"
    testimonials_subheading: str = "Our Customers"

    # Gold Price Settings removed

    # Atelier Promise Settings
    promise_title: str = "Atelier Promise"
    promise_text: str = "Every piece is hallmarked, certified and accompanied by a lifetime care service."

class Settings(SettingsBase):
    pass
