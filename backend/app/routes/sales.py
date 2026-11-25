from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query, status
from backend.app.models.sale import SaleCreate, SaleResponse
from backend.app.services.sales_service import SalesService
from backend.app.utils.auth import get_current_tenant

router = APIRouter(prefix="/sales", tags=["Sales"])

@router.get("", response_model=List[SaleResponse])
async def list_sales(
    limit: int = Query(50, ge=1, le=500),
    product_id: Optional[str] = Query(None),
    customer_type: Optional[str] = Query(None),
    tenant: Dict[str, Any] = Depends(get_current_tenant)
):
    return await SalesService.list_sales(
        limit=limit,
        product_id=product_id,
        customer_type=customer_type,
        org_id=tenant.get("org_id")
    )

@router.post("", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
async def record_sale(
    payload: SaleCreate,
    tenant: Dict[str, Any] = Depends(get_current_tenant)
):
    return await SalesService.record_sale(payload, org_id=tenant.get("org_id"))

@router.get("/summary")
async def sales_summary(tenant: Dict[str, Any] = Depends(get_current_tenant)):
    recent = await SalesService.list_sales(limit=100, org_id=tenant.get("org_id"))
    total_rev = round(sum(s["total_price"] for s in recent), 2)
    total_units = sum(s["quantity"] for s in recent)
    return {
        "recent_order_count": len(recent),
        "recent_revenue": total_rev,
        "recent_units_sold": total_units,
        "recent_sales": recent[:10]
    }
