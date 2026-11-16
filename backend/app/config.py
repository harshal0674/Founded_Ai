import os
from typing import List

class Settings:
    PROJECT_NAME: str = "StockMind AI"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # MongoDB
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "stockmind_db")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        origin.strip() for origin in os.getenv(
            "CORS_ORIGINS", 
            "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://stockmind-ai.vercel.app"
        ).split(",") if origin.strip()
    ]

settings = Settings()
