from datetime import datetime, timezone
from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from backend.app.ml.forecaster import DemandForecaster
from backend.app.models.forecast import ProductForecastResponse
from backend.app.services.inventory_service import InventoryService
from backend.app.services.sales_service import SalesService
from backend.app.utils.auth import get_current_tenant

router = APIRouter(prefix="/forecast", tags=["Forecasting"])

class ForecastRequest(BaseModel):
    product_id: str
    horizon_days: int = Field(30, ge=7, le=90)

@router.get("", response_model=ProductForecastResponse)
async def get_forecast(
    product_id: Optional[str] = Query(None, description="Product ID to forecast. If empty, selects first active product."),
    horizon_days: int = Query(30, ge=7, le=90),
    tenant: Dict[str, Any] = Depends(get_current_tenant)
):
    org_id = tenant.get("org_id")
    products = await InventoryService.list_products(org_id=org_id)
    if not products:
        raise HTTPException(status_code=404, detail="No products exist in your inventory to forecast. Add a product first.")

    target_product = None
    if product_id:
        for p in products:
            if p["id"] == product_id:
                target_product = p
                break
        if not target_product:
            target_product = await InventoryService.get_product(product_id, org_id=org_id)
    else:
        target_product = products[0]

    # Retrieve sales history
    sales = await SalesService.get_sales_for_product(target_product["id"], org_id=org_id)
    
    # Run ML Forecaster
    res = DemandForecaster.forecast_product_demand(sales, horizon_days=horizon_days)

    total_units_sold = sum(s.get("quantity", 0) for s in sales)
    avg_order_size = round(total_units_sold / max(1, len(sales)), 2)

    return {
        "product_id": target_product["id"],
        "product_name": target_product["name"],
        "sku": target_product["sku"],
        "category": target_product["category"],
        "model_used": res["model_used"],
        "horizon_days": horizon_days,
        "metrics": res["metrics"],
        "historical_summary": {
            "total_units_sold": total_units_sold,
            "avg_daily_demand": res["avg_daily_demand"],
            "demand_std": res["demand_std"],
            "avg_order_size": avg_order_size
        },
        "historical": res["historical"],
        "forecast": res["forecast"],
        "generated_at": datetime.now(timezone.utc).isoformat()
    }
