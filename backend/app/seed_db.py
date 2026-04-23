import asyncio
import motor.motor_asyncio
import os
import dns.resolver
from dotenv import load_dotenv

# Fix for "cannot open /etc/resolv.conf" on some restricted environments
try:
    dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
    dns.resolver.default_resolver.nameservers = ['8.8.8.8', '8.8.4.4', '1.1.1.1']
except Exception:
    pass

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

MONGO_URL = os.getenv("MONGO_URL")

PRODUCTS = [
    {
        "id": "aurelia-halo-ring",
        "name": "Aurélia Halo Ring",
        "price": "REQUEST",
        "category": "Rings",
        "metal": "Diamond",
        "image": "/assets/aurelia-halo-ring.png",
        "images": ["/assets/aurelia-halo-ring.png", "/assets/aurelia-ring-2.png", "/assets/aurelia-ring-3.png"],
        "weight": "3.4 g",
        "material": "18K Yellow Gold · 0.85ct Diamond",
        "description": "A classic solitaire ring set in 18K gold. Hand-finished and made to last a lifetime.",
        "features": ["18K Yellow Gold", "0.85ct Diamond", "Halo Setting", "Certified Diamond", "Hand-finished"]
    },
    {
        "id": "esmeralda-emerald-pendant",
        "name": "Esmeralda Emerald Pendant",
        "price": "REQUEST",
        "category": "Necklaces",
        "metal": "Gold",
        "image": "/assets/esmeralda-emerald-pendant.png",
        "images": ["/assets/esmeralda-emerald-pendant.png", "/assets/esmeralda-pendant-2.png", "/assets/esmeralda-pendant-3.png", "/assets/esmeralda-pendant-4.png"],
        "weight": "5.1 g",
        "material": "22K Gold · 18\" chain",
        "description": "A captivating Colombian emerald set within a frame of round brilliant diamonds, suspended on a 22K gold chain.",
        "features": ["22K Gold", "Colombian Emerald", "Diamond Halo", "18 inch chain", "Gift Box included"]
    },
    {
        "id": "celeste-star-earrings",
        "name": "Celeste Star Earrings",
        "price": "REQUEST",
        "category": "Earrings",
        "metal": "Diamond",
        "image": "/assets/celeste-star-earrings.png",
        "images": ["/assets/celeste-star-earrings.png", "/assets/celeste-earrings-2.png", "/assets/celeste-earrings-3.png"],
        "weight": "1.8 g (pair)",
        "material": "18K Gold · 0.50ct total",
        "description": "Two perfectly matched diamonds in a star setting. The everyday earring.",
        "features": ["18K White Gold", "0.50ct Diamonds", "Star Shape", "Push-back closure", "IGI Certified"]
    },
    {
        "id": "polished-bangle",
        "name": "Polished Gold Bangle",
        "price": "REQUEST",
        "category": "Bracelets",
        "metal": "Gold",
        "image": "/assets/gold-bangle-1.png",
        "images": ["/assets/gold-bangle-1.png", "/assets/gold-bangle-2.png"],
        "weight": "12.6 g",
        "material": "22K Yellow Gold",
        "description": "A smooth, mirror-finish 22K gold bangle. Minimalist elegance designed to be worn alone or stacked.",
        "features": ["22K Solid Gold", "Mirror Finish", "Sleek Design", "Hallmarked", "Universal Size"]
    },
    {
        "id": "emerald-ring",
        "name": "Emerald & Diamond Ring",
        "price": 246000,
        "category": "Rings",
        "metal": "Diamond",
        "image": "/assets/emerald-ring-1.png",
        "images": ["/assets/emerald-ring-1.png", "/assets/emerald-ring-2.png"],
        "weight": "4.2 g",
        "material": "18K Gold · 1.4ct Emerald · Diamond Halo",
        "description": "A vivid Colombian emerald surrounded by a brilliant diamond halo. A timeless statement piece with vintage charm.",
        "features": ["18K Yellow Gold", "1.4ct Emerald", "Diamond Cluster", "Vintage Design", "Security Clasp"]
    },
    {
        "id": "diamond-bracelet",
        "name": "Diamond Tennis Bracelet",
        "price": "REQUEST",
        "category": "Bracelets",
        "metal": "Diamond",
        "image": "/assets/diamond-bracelet-1.png",
        "images": ["/assets/diamond-bracelet-1.png", "/assets/diamond-bracelet-2.png"],
        "weight": "4.8 g",
        "material": "18K Gold · 0.75ct Diamonds",
        "description": "A continuous line of hand-set diamonds on a slim 18K gold band. The definition of quiet luxury.",
        "features": ["18K Yellow Gold", "0.75ct Brilliant Diamonds", "Slim Profile", "Hand-set", "Luxury Finishing"]
    },
    {
        "id": "gold-hoops",
        "name": "Classic Gold Hoops",
        "price": 48600,
        "category": "Earrings",
        "metal": "Gold",
        "image": "/assets/gold-hoops-1.png",
        "images": ["/assets/gold-hoops-1.png"],
        "weight": "3.2 g (pair)",
        "material": "18K Gold",
        "description": "Refined and perfectly rounded, these polished 18K gold hoops are an essential staple for every wardrobe.",
        "features": ["18K Yellow Gold", "Polished Finish", "Lightweight Comfort", "Secure Hinge", "Daily Wear"]
    },
    {
        "id": "layered-necklace",
        "name": "Layered Gold Necklace",
        "price": 78400,
        "category": "Necklaces",
        "metal": "Gold",
        "image": "/assets/product-8.jpg",
        "images": ["/assets/product-8.jpg"],
        "weight": "6.4 g",
        "material": "18K Gold · Dual chain with diamond drops",
        "description": "Two delicate 18K gold chains layered together, accented with subtle diamond drops for a contemporary look.",
        "features": ["18K Yellow Gold", "Dual Layered Chain", "Diamond Accents", "Adjustable Length", "Modern Style"]
    }
]

BLOGS = [
    {
        "slug": "jewellery-care-tips",
        "title": "Jewellery Care Tips: Keep Your Pieces Timeless",
        "excerpt": "Simple, daily habits that help your fine jewellery shine for generations.",
        "category": "Care Guide",
        "readTime": "5 min read",
        "date": "April 12, 2026",
        "image": "/assets/insta-1.jpg",
        "content": [
            "Fine jewellery is meant to be worn — but a little care goes a long way. Begin by storing each piece separately in a soft pouch or lined box. This prevents scratches between metals and stones.",
            "Avoid contact with perfume, lotion, and chlorine. Always put your jewellery on last when getting ready, and remove it first when returning home.",
            "For everyday cleaning, gently wipe pieces with a soft microfibre cloth. For a deeper clean, soak gold jewellery in warm water with a drop of mild soap, then dry with a lint-free cloth.",
            "Bring your jewellery in for a professional polish once a year. Our atelier offers complimentary cleaning and inspection for every piece purchased at Maison Aurum."
        ]
    },
    {
        "slug": "latest-trends-2026",
        "title": "Latest Trends: What's Shining in 2026",
        "excerpt": "From sculptural gold to coloured gemstones, the looks defining the new season.",
        "category": "Trends",
        "readTime": "6 min read",
        "date": "April 5, 2026",
        "image": "/assets/insta-2.jpg",
        "content": [
            "This year, jewellery is bolder, more personal, and unapologetically artistic. Sculptural gold cuffs and architectural ear cuffs are taking centre stage, replacing the delicate stacking trend of the past.",
            "Coloured gemstones — emeralds, sapphires, and pink tourmalines — are returning to bridal collections. Pair a coloured stone with a classic diamond halo for a modern heirloom feel.",
            "Mixed metals are no longer a faux pas. Layering yellow gold with rose gold and a touch of platinum creates depth and character.",
            "Most importantly, meaningful pieces are winning. Initials, birthstones, and custom engravings are turning every purchase into a story worth wearing."
        ]
    },
    {
        "slug": "buying-guide",
        "title": "The Buying Guide: How to Choose Fine Jewellery",
        "excerpt": "A short, honest guide to choosing pieces you'll treasure for life.",
        "category": "Guide",
        "readTime": "7 min read",
        "date": "March 28, 2026",
        "image": "/assets/insta-3.jpg",
        "content": [
            "Buying fine jewellery is an emotional decision — but a few simple rules help you choose with confidence. Start with purpose: is this piece for daily wear, an occasion, or a long-term investment?",
            "For daily wear, choose 18K gold. It's durable and holds gemstones securely. For investment or bridal pieces, 22K and 24K gold offer higher purity.",
            "When buying diamonds, focus on cut first — it's what gives a stone its brilliance. Carat weight matters less than how the diamond catches light.",
            "Always ask for a certificate. Every Maison Aurum piece comes with a BIS Hallmark and a detailed authenticity card listing metal, weight, and gemstone grades."
        ]
    }
]

REVIEWS = [
    {
        "name": "Anaya Mehra",
        "initial": "A",
        "rating": 5,
        "text": "Beautiful ring, beautiful packaging, beautiful service. Every detail felt special."
    },
    {
        "name": "Vikram Shah",
        "initial": "V",
        "rating": 5,
        "text": "Bought the emerald ring for my wife's birthday. The team helped me choose remotely. Top quality."
    },
    {
        "name": "Priya Iyer",
        "initial": "P",
        "rating": 5,
        "text": "I've owned pieces from bigger brands. The finish on my bangle is in another league."
    },
    {
        "name": "Karan Bhatia",
        "initial": "K",
        "rating": 5,
        "text": "Simple, elegant, perfect. My studs go with everything. Already planning my next buy."
    },
    {
        "name": "Riya Chopra",
        "initial": "R",
        "rating": 5,
        "text": "Their team spent two hours helping me choose. No pressure, just real knowledge."
    }
]

TESTIMONIALS = [
    {
        "image": "/assets/insta-2.jpg",
        "name": "Mira & Aarav",
        "quote": "The perfect ring for our day."
    },
    {
        "image": "/assets/insta-3.jpg",
        "name": "Diya Kapoor",
        "quote": "Every gift from Aurum feels special."
    },
    {
        "image": "/assets/insta-5.jpg",
        "name": "Aarti S.",
        "quote": "I wear my rings daily. They still look new."
    },
    {
        "image": "/assets/insta-6.jpg",
        "name": "Nisha Verma",
        "quote": "A truly memorable shopping experience."
    },
    {
        "image": "/assets/insta-2.jpg",
        "name": "Riya & Karan",
        "quote": "Heirloom quality. Worth every rupee."
    },
    {
        "image": "/assets/insta-3.jpg",
        "name": "Sana Malik",
        "quote": "The detailing is simply breathtaking."
    }
]

CATEGORIES = [
    {
        "id": "rings",
        "name": "Rings",
        "description": "Timeless solitaire and halo rings crafted with precision.",
        "image": "/assets/aurelia-halo-ring.png"
    },
    {
        "id": "necklaces",
        "name": "Necklaces",
        "description": "Elegant pendants and layered chains for every occasion.",
        "image": "/assets/esmeralda-emerald-pendant.png"
    },
    {
        "id": "earrings",
        "name": "Earrings",
        "description": "From classic studs to hoops, designed for daily luxury.",
        "image": "/assets/celeste-star-earrings.png"
    },
    {
        "id": "bracelets",
        "name": "Bracelets",
        "description": "Minimalist bangles and diamond tennis bracelets.",
        "image": "/assets/gold-bangle-1.png"
    }
]

INSTAGRAM_POSTS = [
    {"image_url": "/assets/insta-1.jpg", "link": "#", "order": 0},
    {"image_url": "/assets/insta-2.jpg", "link": "#", "order": 1},
    {"image_url": "/assets/insta-3.jpg", "link": "#", "order": 2},
    {"image_url": "/assets/insta-4.jpg", "link": "#", "order": 3},
    {"image_url": "/assets/insta-5.jpg", "link": "#", "order": 4},
    {"image_url": "/assets/insta-6.jpg", "link": "#", "order": 5},
]

async def seed():
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
    db = client.get_default_database()
    
    print("Clearing existing data...")
    await db.products.delete_many({})
    await db.blogs.delete_many({})
    await db.reviews.delete_many({})
    await db.testimonials.delete_many({})
    await db.categories.delete_many({})
    await db.instagram.delete_many({})
    
    print(f"Seeding {len(PRODUCTS)} products...")
    await db.products.insert_many(PRODUCTS)
    
    print(f"Seeding {len(BLOGS)} blogs...")
    await db.blogs.insert_many(BLOGS)

    print(f"Seeding {len(REVIEWS)} reviews...")
    await db.reviews.insert_many(REVIEWS)

    print(f"Seeding {len(TESTIMONIALS)} testimonials...")
    await db.testimonials.insert_many(TESTIMONIALS)
    
    print(f"Seeding {len(CATEGORIES)} categories...")
    await db.categories.insert_many(CATEGORIES)

    print(f"Seeding {len(INSTAGRAM_POSTS)} instagram posts...")
    await db.instagram.insert_many(INSTAGRAM_POSTS)
    
    print("Seeding complete!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
