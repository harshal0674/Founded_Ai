from datetime import datetime, timezone
from fastapi import APIRouter
from backend.app.config import settings
from backend.app.database import db_manager

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "StockMind AI API",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database": {
            "mode": db_manager.mode,
            "connected": db_manager.mode in ("atlas", "in-memory")
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
