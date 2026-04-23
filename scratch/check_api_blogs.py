import requests
import json

def test_api():
    # Use the port from .env or default 8002
    url = "http://localhost:8002/api/blogs/"
    try:
        res = requests.get(url)
        if res.ok:
            print(json.dumps(res.json(), indent=2))
        else:
            print(f"Error: {res.status_code}")
    except Exception as e:
        print(f"Failed to connect: {e}")

if __name__ == "__main__":
    test_api()
