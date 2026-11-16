from fastapi import APIRouter
from backend.app.utils.seed_data import seed_database

router = APIRouter(prefix="/system", tags=["System"])

@router.post("/seed")
async def seed_data():
    stats = await seed_database(clear_existing=True)
    return {
        "success": True,
        "message": "Demo dataset loaded successfully with realistic multi-category inventory and 75-day sales history.",
        "stats": stats
    }
