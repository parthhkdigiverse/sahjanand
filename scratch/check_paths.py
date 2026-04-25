import os
path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
print(f"Project Root: {os.path.abspath(path)}")
frontend_uploads = os.path.join(path, "frontend", "public", "uploads")
print(f"Frontend Uploads: {os.path.abspath(frontend_uploads)}")
