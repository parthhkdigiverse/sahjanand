import httpx
from typing import Dict, Optional
import time
import logging

logger = logging.getLogger(__name__)

# Basic in-memory cache
_cache = {
    "data": None,
    "timestamp": 0
}
CACHE_DURATION = 3600  # 1 hour

async def fetch_gold_price_from_api(api_key: str) -> Optional[Dict[str, float]]:
    global _cache
    
    current_time = time.time()
    if _cache["data"] and (current_time - _cache["timestamp"] < CACHE_DURATION):
        logger.info("Returning cached gold price")
        return _cache["data"]

    if not api_key:
        logger.warning("No Gold API key provided")
        return None

    try:
        async with httpx.AsyncClient() as client:
            # GoldAPI.io endpoint for Gold in INR
            response = await client.get(
                "https://www.goldapi.io/api/XAU/INR",
                headers={"x-access-token": api_key},
                timeout=10.0
            )
            
            if response.status_code != 200:
                logger.error(f"Gold API error: {response.status_code} - {response.text}")
                return None
                
            data = response.json()
            
            # GoldAPI returns price per gram for 24k
            price_24k = data.get("price_gram_24k")
            if not price_24k:
                # Fallback if gram price is missing - price is usually per ounce
                price_oz = data.get("price")
                if price_oz:
                    price_24k = price_oz / 31.1035
            
            if not price_24k:
                return None

            prices = {
                "price_24k": round(price_24k, 2),
                "price_22k": round(price_24k * (22/24), 2),
                "price_18k": round(price_24k * (18/24), 2),
                "change": data.get("chp", 0.0) # Percentage change
            }
            
            _cache["data"] = prices
            _cache["timestamp"] = current_time
            
            return prices
            
    except Exception as e:
        logger.error(f"Failed to fetch gold price: {e}")
        return None
