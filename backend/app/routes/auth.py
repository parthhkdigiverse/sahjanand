from fastapi import APIRouter, HTTPException, status, Body
from pydantic import BaseModel
from ..config import settings
from ..auth import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str

@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest = Body(...)):
    if credentials.username == settings.ADMIN_ID and credentials.password == settings.ADMIN_PASSWORD:
        access_token = create_access_token(data={"sub": credentials.username})
        return {"access_token": access_token, "token_type": "bearer"}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )
