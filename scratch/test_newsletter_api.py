import requests
import json

BASE_URL = "http://localhost:8002/api/newsletter/"

def test_subscribe():
    payload = {"email": "test@example.com"}
    try:
        response = requests.post(BASE_URL, json=payload)
        print(f"Subscribe Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_subscribe()
