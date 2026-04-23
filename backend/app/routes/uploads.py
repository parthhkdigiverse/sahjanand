from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import os
import uuid
import shutil
from typing import List
from ..auth import get_current_admin
from ..config import settings

router = APIRouter(prefix="/uploads", tags=["uploads"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def upload_files(files: List[UploadFile] = File(...), admin: str = Depends(get_current_admin)):
    uploaded_urls = []
    
    for file in files:
        if not file.filename:
            continue
            
        file_ext = os.path.splitext(file.filename)[1]
        new_filename = f"{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, new_filename)
        
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Since frontend serves this via api prefix currently, 
            # We'll serve files at /uploads
            uploaded_urls.append(f"http://localhost:{settings.BACKEND_PORT}/uploads/{new_filename}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload {file.filename}: {str(e)}")
            
    return {"urls": uploaded_urls}
