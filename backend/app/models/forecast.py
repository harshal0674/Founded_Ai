from datetime import date
from typing import Dict, List, Optional
from pydantic import BaseModel

class DailySalesData(BaseModel):
    date: str
    units: float

class DailyForecastPoint(BaseModel):
    date: str
    predicted_units: float
    lower_bound: float
    upper_bound: float

class ForecastMetrics(BaseModel):
    mae: float
    rmse: float
    mape: float
    data_points: int
    is_fallback: bool = False

class ProductForecastResponse(BaseModel):
    product_id: str
    product_name: str
    sku: str
    category: str
    model_used: str
    horizon_days: int
    metrics: ForecastMetrics
    historical_summary: Dict[str, float]
    historical: List[DailySalesData]
    forecast: List[DailyForecastPoint]
    generated_at: str
