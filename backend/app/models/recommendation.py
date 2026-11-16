from typing import List, Optional
from pydantic import BaseModel

class RecommendationResponse(BaseModel):
    product_id: str
    product_name: str
    sku: str
    category: str
    current_stock: int
    daily_run_rate: float
    days_until_stockout: float
    lead_time_days: int
    safety_stock: int
    reorder_point: int
    suggested_order_qty: int
    estimated_cost: float
    supplier_name: str
    supplier_email: Optional[str] = None
    urgency: str  # critical, high, medium, healthy
    reasoning: str
    action_required: bool

class RecommendationOverview(BaseModel):
    total_recommendations: int
    critical_count: int
    high_count: int
    medium_count: int
    healthy_count: int
    total_capital_required: float
    items: List[RecommendationResponse]
