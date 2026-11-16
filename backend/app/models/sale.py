from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class SaleCreate(BaseModel):
    product_id: str = Field(..., min_length=1)
    quantity: int = Field(..., gt=0)
    customer_type: str = Field(default="retail")  # retail, wholesale, online
    notes: Optional[str] = None
    custom_price: Optional[float] = Field(None, ge=0.0)

class SaleResponse(BaseModel):
    id: str
    product_id: str
    product_name: str
    sku: str
    quantity: int
    unit_price: float
    total_price: float
    customer_type: str
    timestamp: datetime
    notes: Optional[str] = None
