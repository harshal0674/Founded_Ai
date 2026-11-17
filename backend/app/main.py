import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.app.config import settings
from backend.app.database import db_manager
from backend.app.routes import dashboard, forecast, health, products, recommendations, sales, system
from backend.app.utils.seed_data import seed_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("stockmind")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to DB
    logger.info("Starting up StockMind AI Engine...")
    await db_manager.connect()
    
    # Auto-seed initial demo dataset only if brand new database without custom preference
    settings_col = db_manager.get_collection("system_settings")
    mode_doc = await settings_col.find_one({"key": "catalog_mode"})
    prod_col = db_manager.get_collection("products")
    existing_count = await prod_col.count_documents({})
    
    if existing_count == 0 and (not mode_doc or mode_doc.get("mode") != "custom"):
        logger.info("Initializing baseline demo dataset for demonstration...")
        await seed_database(clear_existing=False)
        
    yield
    # Shutdown
    logger.info("Shutting down StockMind AI...")
    await db_manager.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Inventory Management, Demand Forecasting & Replenishment Optimization System",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev and preview deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred.", "error": str(exc)}
    )

# Include routers
app.include_router(health.router)
app.include_router(products.router, prefix=settings.API_V1_PREFIX)
app.include_router(sales.router, prefix=settings.API_V1_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_V1_PREFIX)
app.include_router(forecast.router, prefix=settings.API_V1_PREFIX)
app.include_router(recommendations.router, prefix=settings.API_V1_PREFIX)
app.include_router(system.router, prefix=settings.API_V1_PREFIX)

@app.get("/")
async def root():
    return {
        "service": "StockMind AI",
        "status": "operational",
        "docs": "/docs",
        "health": "/health"
    }
