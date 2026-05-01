import urllib.request
import json
try:
    with urllib.request.urlopen("http://127.0.0.1:8002/api/testimonials/") as response:
        print(response.getcode())
        data = json.loads(response.read().decode())
        print(json.dumps(data, indent=2))
except Exception as e:
    print(e)
