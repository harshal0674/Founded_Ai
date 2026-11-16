from typing import List, Optional
from fastapi import APIRouter, Query, status
from pydantic import BaseModel, Field
from backend.app.models.product import ProductCreate, ProductResponse, ProductUpdate
from backend.app.services.inventory_service import InventoryService

router = APIRouter(prefix="/products", tags=["Products"])

class RestockPayload(BaseModel):
    quantity: int = Field(..., gt=0)

@router.get("", response_model=List[ProductResponse])
async def list_products(
    search: Optional[str] = Query(None, description="Search term for product name or SKU"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status (in_stock, low_stock, out_of_stock)"),
    low_stock_only: bool = Query(False, description="Filter to items below reorder/min stock")
):
    return await InventoryService.list_products(
        search=search,
        category=category,
        status=status,
        low_stock_only=low_stock_only
    )

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(payload: ProductCreate):
    return await InventoryService.create_product(payload)

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    return await InventoryService.get_product(product_id)

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, payload: ProductUpdate):
    return await InventoryService.update_product(product_id, payload)

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    await InventoryService.delete_product(product_id)
    return {"success": True, "message": f"Product '{product_id}' deleted successfully."}

@router.post("/{product_id}/restock", response_model=ProductResponse)
async def restock_product(product_id: str, payload: RestockPayload):
    return await InventoryService.restock_product(product_id, payload.quantity)
