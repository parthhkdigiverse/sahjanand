
import requests
import json

def test_fetch_policies():
    try:
        response = requests.get("http://localhost:8002/api/policies/")
        if response.status_code == 200:
            policies = response.json()
            print(f"Fetched {len(policies)} policies")
            for p in policies:
                print(f"Title: {p.get('title')}, _id: {p.get('_id')}, mongo_id: {p.get('mongo_id')}")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_fetch_policies()
