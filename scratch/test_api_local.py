import urllib.request
import json
import os
from pathlib import Path

# Load .env
env_path = Path(__file__).parent.parent / ".env"
env = {}
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if "=" in line:
                k, v = line.strip().split("=", 1)
                env[k] = v.strip('"').strip("'")

port = env.get("BACKEND_PORT", "8002")
url = f"http://127.0.0.1:{port}/api/testimonials"

print(f"Testing URL: {url}")
try:
    with urllib.request.urlopen(url, timeout=5) as response:
        status = response.getcode()
        data = json.loads(response.read().decode())
        print(f"Status Code: {status}")
        print(f"Response: {json.dumps(data, indent=2)}")
except Exception as e:
    print(f"Error: {e}")
