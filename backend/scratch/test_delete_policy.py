
import requests

def test_delete_policy():
    base_url = "http://localhost:8002/api"
    
    # Login
    login_data = {"username": "Admin", "password": "Admin123"}
    res = requests.post(f"{base_url}/auth/login", json=login_data)
    if res.status_code != 200:
        print(f"Login failed: {res.status_code}")
        print(res.text)
        return
    
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Fetch policies to get an ID
    res = requests.get(f"{base_url}/policies/")
    policies = res.json()
    if not policies:
        print("No policies to delete")
        return
    
    # Try to delete the test one I saw earlier: "Title: asdfwerter, _id: 69ea10e6e41312e99f9e7987"
    target_id = "69ea10e6e41312e99f9e7987"
    print(f"Attempting to delete policy with ID: {target_id}")
    
    res = requests.delete(f"{base_url}/policies/{target_id}", headers=headers)
    if res.status_code == 200:
        print("Successfully deleted policy")
    else:
        print(f"Delete failed: {res.status_code}")
        print(res.text)

if __name__ == "__main__":
    test_delete_policy()
