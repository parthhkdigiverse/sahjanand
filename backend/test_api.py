import requests
import json

BASE_URL = "http://localhost:8002/api"

def test_update():
    # 1. Login
    login_res = requests.post(f"{BASE_URL}/auth/login", json={
        "username": "Admin",
        "password": "Admin123"
    })
    token = login_res.json()["access_token"]
    print(f"Token: {token[:10]}...")
    
    # 2. Update Contact Page
    data = {
        "hero_eyebrow": "UPDATED EYEBROW",
        "hero_heading": "UPDATED HEADING",
        "hero_description": "UPDATED DESCRIPTION",
        "boutique_address_line1": "123 UPDATED ST",
        "boutique_address_line2": "MUMBAI 400001",
        "concierge_phone": "+91 99999 99999",
        "inquiries_email": "updated@test.com",
        "opening_hours_line1": "OPEN ALL DAY",
        "opening_hours_line2": "24/7",
        "map_embed_url": "https://test.com"
    }
    
    res = requests.put(f"{BASE_URL}/contact-page/", 
                      json=data,
                      headers={"Authorization": f"Bearer {token}"})
    print(f"Status: {res.status_code}")
    print(f"Response: {res.json()}")

if __name__ == "__main__":
    test_update()
