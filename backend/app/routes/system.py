from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from backend.app.database import db_manager
from backend.app.utils.auth import get_current_tenant
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
    "name": "Gada Electronics",
    "currency": "INR",
    "currency_symbol": "₹",
    "industry": "Electronics & Gadgets",
    "gstin": "27AAACB2212R1Z0",
    "address": "Mumbai, India",
    "phone": "+91 98765 43210"
}

@router.get("/organization")
async def get_organization(tenant: Dict[str, Any] = Depends(get_current_tenant)):
    orgs_col = db_manager.get_collection("organizations")
    org_id = tenant.get("org_id", "org_default")
    
    doc = await orgs_col.find_one({"_id": org_id})
    if not doc:
        doc = await orgs_col.find_one({"id": org_id})
    if not doc:
        # Check system_settings
        settings_col = db_manager.get_collection("system_settings")
        doc = await settings_col.find_one({"key": f"org_{org_id}"})
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
async def update_organization(
    payload: OrganizationProfile,
    tenant: Dict[str, Any] = Depends(get_current_tenant)
):
    orgs_col = db_manager.get_collection("organizations")
    org_id = tenant.get("org_id", "org_default")

    data = payload.model_dump()
    data["id"] = org_id
    data["_id"] = org_id

    existing = await orgs_col.find_one({"_id": org_id})
    if existing:
        await orgs_col.update_one({"_id": org_id}, {"$set": data})
    else:
        await orgs_col.insert_one(data)
    return payload

@router.post("/clear-catalog")
async def clear_catalog(tenant: Dict[str, Any] = Depends(get_current_tenant)):
    """Wipes all products, sales, and movement audit records for THIS tenant."""
    org_id = tenant.get("org_id", "org_default")
    prod_col = db_manager.get_collection("products")
    sales_col = db_manager.get_collection("sales")
    movements_col = db_manager.get_collection("inventory_movements")

    filter_query = (
        {"$or": [{"org_id": org_id}, {"org_id": {"$exists": False}}, {"org_id": None}]}
        if org_id in ("org_gada_electronics", "org_default")
        else {"org_id": org_id}
    )

    await prod_col.delete_many(filter_query)
    await sales_col.delete_many(filter_query)
    await movements_col.delete_many(filter_query)

    return {
        "success": True,
        "message": f"Inventory catalog for '{tenant.get('org_name', 'your store')}' cleared. Ready for fresh products."
    }

@router.post("/seed")
async def seed_data(tenant: Dict[str, Any] = Depends(get_current_tenant)):
    org_id = tenant.get("org_id", "org_default")
    stats = await seed_database(clear_existing=True, org_id=org_id)
    return {
        "success": True,
        "message": "Demo dataset loaded successfully.",
        "stats": stats
    }
