from fastapi import APIRouter, HTTPException, Depends
from ..services.gold_price import fetch_gold_price_from_api
from ..database import get_database
from typing import Dict, Any

router = APIRouter(prefix="/gold-prices", tags=["gold-prices"])

@router.get("/")
async def get_gold_prices():
    db = get_database()
    settings = await db.settings.find_one({"id": "global"})
    
    if not settings:
        # Default fallback values
        return {
            "price_24k": 7780.0,
            "price_22k": 7140.0,
            "price_18k": 5840.0,
            "change": 0.8,
            "source": "default"
        }
    
    source = settings.get("gold_price_source", "manual")
    
    if source == "api":
        api_key = settings.get("gold_price_api_key")
        prices = await fetch_gold_price_from_api(api_key)
        if prices:
            return {**prices, "source": "api"}
        else:
            # Fallback to manual if API fails
            source = "manual"
            
    if source == "manual":
        return {
            "price_24k": settings.get("manual_price_24k", 7780.0),
            "price_22k": settings.get("manual_price_22k", 7140.0),
            "price_18k": settings.get("manual_price_18k", 5840.0),
            "change": 0.0, # Manual doesn't have live change usually
            "source": "manual"
        }
        
    return {"error": "Invalid source configuration"}
