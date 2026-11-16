from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    sku: str = Field(..., min_length=1, max_length=64)
    category: str = Field(..., min_length=1, max_length=64)
    current_stock: int = Field(..., ge=0)
    min_stock_level: int = Field(default=20, ge=0)
    unit_cost: float = Field(..., ge=0.0)
    selling_price: float = Field(..., ge=0.0)
    lead_time_days: int = Field(default=7, ge=1)
    supplier_name: Optional[str] = "Global Logistics Direct"
    supplier_email: Optional[str] = "procurement@globaldirect.example"

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    category: Optional[str] = None
    current_stock: Optional[int] = Field(None, ge=0)
    min_stock_level: Optional[int] = Field(None, ge=0)
    unit_cost: Optional[float] = Field(None, ge=0.0)
    selling_price: Optional[float] = Field(None, ge=0.0)
    lead_time_days: Optional[int] = Field(None, ge=1)
    supplier_name: Optional[str] = None
    supplier_email: Optional[str] = None

class ProductResponse(ProductBase):
    id: str
    created_at: datetime
    updated_at: datetime
    stock_status: str = "in_stock"  # in_stock, low_stock, out_of_stock
    total_value: float = 0.0
