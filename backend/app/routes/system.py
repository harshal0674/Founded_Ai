from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field
from backend.app.database import db_manager
from backend.app.utils.seed_data import seed_database

router = APIRouter(prefix="/system", tags=["System"])

class OrganizationProfile(BaseModel):
    name: str = Field(default="My Enterprise", min_length=1, max_length=120)
    currency: str = Field(default="INR", max_length=10)
    currency_symbol: str = Field(default="₹", max_length=5)
    industry: Optional[str] = "Retail & Consumer Goods"
    gstin: Optional[str] = ""
    address: Optional[str] = "India"
    phone: Optional[str] = ""

DEFAULT_ORGANIZATION = {
    "name": "Bharat Retail Corp",
    "currency": "INR",
    "currency_symbol": "₹",
    "industry": "Retail & E-Commerce",
    "gstin": "27AAACB2212R1Z0",
    "address": "Mumbai / New Delhi, India",
    "phone": "+91 98765 43210"
}

@router.get("/organization")
async def get_organization():
    settings_col = db_manager.get_collection("system_settings")
    doc = await settings_col.find_one({"key": "organization"})
    if not doc:
        return DEFAULT_ORGANIZATION
    return {
        "name": doc.get("name", DEFAULT_ORGANIZATION["name"]),
        "currency": doc.get("currency", DEFAULT_ORGANIZATION["currency"]),
        "currency_symbol": doc.get("currency_symbol", DEFAULT_ORGANIZATION["currency_symbol"]),
        "industry": doc.get("industry", DEFAULT_ORGANIZATION["industry"]),
        "gstin": doc.get("gstin", DEFAULT_ORGANIZATION["gstin"]),
        "address": doc.get("address", DEFAULT_ORGANIZATION["address"]),
        "phone": doc.get("phone", DEFAULT_ORGANIZATION["phone"]),
    }

@router.put("/organization")
async def update_organization(payload: OrganizationProfile):
    settings_col = db_manager.get_collection("system_settings")
    existing = await settings_col.find_one({"key": "organization"})
    data = payload.model_dump()
    data["key"] = "organization"
    if existing:
        await settings_col.update_one({"key": "organization"}, {"$set": data})
    else:
        await settings_col.insert_one(data)
    return payload

@router.post("/clear-catalog")
async def clear_catalog():
    """Wipes all products, sales, and movement audit records so the user can enter products from scratch."""
    prod_col = db_manager.get_collection("products")
    sales_col = db_manager.get_collection("sales")
    movements_col = db_manager.get_collection("inventory_movements")
    settings_col = db_manager.get_collection("system_settings")

    await prod_col.delete_many({})
    await sales_col.delete_many({})
    await movements_col.delete_many({})
    
    # Mark catalog mode as custom so auto-seeding on restart is skipped
    existing_mode = await settings_col.find_one({"key": "catalog_mode"})
    if existing_mode:
        await settings_col.update_one({"key": "catalog_mode"}, {"$set": {"mode": "custom"}})
    else:
        await settings_col.insert_one({"key": "catalog_mode", "mode": "custom"})

    return {
        "success": True,
        "message": "Inventory catalog cleared. Ready for your custom products and sales."
    }

@router.post("/seed")
async def seed_data():
    settings_col = db_manager.get_collection("system_settings")
    existing_mode = await settings_col.find_one({"key": "catalog_mode"})
    if existing_mode:
        await settings_col.update_one({"key": "catalog_mode"}, {"$set": {"mode": "demo"}})
    else:
        await settings_col.insert_one({"key": "catalog_mode", "mode": "demo"})

    stats = await seed_database(clear_existing=True)
    return {
        "success": True,
        "message": "Demo dataset loaded successfully with realistic multi-category inventory (in ₹ INR) and 75-day sales history.",
        "stats": stats
    }
