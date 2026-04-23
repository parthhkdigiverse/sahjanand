import requests
import json

# Replace with a valid token if needed, but for testing the endpoint logic 
# we can just see if it hits the backend
token = "YOUR_TOKEN_HERE" 

data = {
    "hero_image": "/assets/hero-3.jpg",
    "hero_eyebrow": "Updated Eyebrow",
    "hero_heading": "Updated Heading",
    "hero_description": "Updated Description",
    "boutique_address_line1": "14 Marine Drive",
    "boutique_address_line2": "Colaba, Mumbai 400001",
    "concierge_phone": "+91 22 4000 0000",
    "inquiries_email": "hello@maisonaurum.com",
    "opening_hours_line1": "Tue – Sat · 11:00 – 19:00",
    "opening_hours_line2": "Sun & Mon · Private Appointments Only",
    "map_embed_url": "https://www.google.com/maps/embed?pb=..."
}

try:
    # Note: This will fail with 401/403 without a real token, 
    # but we can check the 422 (validation error) vs 401
    response = requests.put(
        "http://localhost:8002/api/contact-page/",
        json=data,
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
