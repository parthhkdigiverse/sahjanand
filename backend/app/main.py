from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import connect_to_mongo, close_mongo_connection
from .config import settings
from .routes import products, blogs, contacts, auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await connect_to_mongo()
    yield
    # Shutdown logic
    await close_mongo_connection()

app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
    debug=settings.DEBUG
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api")
app.include_router(blogs.router, prefix="/api")
app.include_router(contacts.router, prefix="/api")
app.include_router(auth.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Sahjanand API", "status": "online"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
