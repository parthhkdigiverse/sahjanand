from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import connect_to_mongo, close_mongo_connection
from .config import settings
from .routes import (
    products, 
    blogs, 
    contacts, 
    auth, 
    settings as settings_route, 
    reviews, 
    testimonials, 
    categories,
    hero,
    offer_leads,
    instagram,
    uploads,
    offers,
    about,
    gallery,
    policies as policies_route,
    contact_page,
    newsletter,
    achievements
)
import os

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
app.include_router(reviews.router, prefix="/api")
app.include_router(testimonials.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(uploads.router, prefix="/api")
app.include_router(settings_route.router, prefix="/api")
app.include_router(hero.router, prefix="/api/hero", tags=["Hero"])
app.include_router(offer_leads.router, prefix="/api/offer-leads", tags=["Offer Leads"])
app.include_router(instagram.router, prefix="/api")
app.include_router(offers.router, prefix="/api/offers", tags=["Offers"])
app.include_router(about.router, prefix="/api", tags=["About"])
app.include_router(gallery.router, prefix="/api", tags=["Gallery"])
app.include_router(policies_route.router, prefix="/api")
app.include_router(contact_page.router, prefix="/api")
app.include_router(newsletter.router, prefix="/api/newsletter", tags=["Newsletter"])
app.include_router(achievements.router, prefix="/api")

# Mount uploads directory from frontend to serve static files
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOAD_DIR = os.path.join(ROOT_DIR, "frontend", "public", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
@app.get("/")
async def root():
    return {"message": "Welcome to Sahajanand API", "status": "online"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
