from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List
from fastapi import APIRouter, Depends
from backend.app.services.inventory_service import InventoryService
from backend.app.services.replenishment_service import ReplenishmentService
from backend.app.services.sales_service import SalesService
from backend.app.utils.auth import get_current_tenant

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
async def get_dashboard_stats(tenant: Dict[str, Any] = Depends(get_current_tenant)):
    org_id = tenant.get("org_id")
    products = await InventoryService.list_products(org_id=org_id)
    all_sales = await SalesService.get_all_sales_time_series(org_id=org_id)
    
    total_products = len(products)
    total_stock_value = round(sum(p["total_value"] for p in products), 2)
    low_stock_items = sum(1 for p in products if p["stock_status"] == "low_stock")
    out_of_stock_items = sum(1 for p in products if p["stock_status"] == "out_of_stock")

    now = datetime.now(timezone.utc)
    thirty_days_ago = now - timedelta(days=30)
    
    # Calculate 30-day revenue
    revenue_30d = 0.0
    units_30d = 0
    for s in all_sales:
        ts = s.get("timestamp")
        if isinstance(ts, str):
            try:
                dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
            except Exception:
                continue
        elif isinstance(ts, datetime):
            dt = ts if ts.tzinfo else ts.replace(tzinfo=timezone.utc)
        else:
            continue
            
        if dt >= thirty_days_ago:
            revenue_30d += float(s.get("total_price", 0.0))
            units_30d += int(s.get("quantity", 0))

    # Evaluate recommendations to count stockout risks and reorder triggers
    stockout_risks = 0
    reorders_pending = 0
    for p in products:
        p_sales = [s for s in all_sales if s.get("product_id") == p["id"]]
        rec = ReplenishmentService.calculate_recommendation(p, p_sales)
        if rec["urgency"] in ("critical", "high"):
            reorders_pending += 1
        if rec["days_until_stockout"] <= p.get("lead_time_days", 7):
            stockout_risks += 1

    return {
        "total_products": total_products,
        "total_stock_value": total_stock_value,
        "low_stock_items": low_stock_items,
        "out_of_stock_items": out_of_stock_items,
        "total_revenue_30d": round(revenue_30d, 2),
        "total_units_sold_30d": units_30d,
        "stockout_risk_count": stockout_risks,
        "reorder_pending_count": reorders_pending
    }

@router.get("/charts")
async def get_dashboard_charts(tenant: Dict[str, Any] = Depends(get_current_tenant)):
    org_id = tenant.get("org_id")
    products = await InventoryService.list_products(org_id=org_id)
    all_sales = await SalesService.get_all_sales_time_series(org_id=org_id)

    # 1. 30-Day Sales & Revenue Trend
    now = datetime.now(timezone.utc)
    dates_map = {}
    for i in range(29, -1, -1):
        d_str = (now - timedelta(days=i)).strftime("%Y-%m-%d")
        dates_map[d_str] = {"date": d_str, "sales": 0, "revenue": 0.0}

    product_sales_tally: Dict[str, Dict] = {}

    for s in all_sales:
        ts = s.get("timestamp")
        if isinstance(ts, str):
            d_key = ts[:10]
        elif isinstance(ts, datetime):
            d_key = ts.strftime("%Y-%m-%d")
        else:
            continue

        qty = int(s.get("quantity", 0))
        rev = float(s.get("total_price", 0.0))

        if d_key in dates_map:
            dates_map[d_key]["sales"] += qty
            dates_map[d_key]["revenue"] = round(dates_map[d_key]["revenue"] + rev, 2)

        p_id = s.get("product_id")
        p_name = s.get("product_name", "Unknown")
        if p_id not in product_sales_tally:
            product_sales_tally[p_id] = {"name": p_name, "quantity": 0, "revenue": 0.0}
        product_sales_tally[p_id]["quantity"] += qty
        product_sales_tally[p_id]["revenue"] = round(product_sales_tally[p_id]["revenue"] + rev, 2)

    sales_trend = list(dates_map.values())

    # 2. Category Distribution
    cat_map: Dict[str, Dict] = {}
    for p in products:
        c = p.get("category", "General")
        if c not in cat_map:
            cat_map[c] = {"category": c, "count": 0, "value": 0.0}
        cat_map[c]["count"] += 1
        cat_map[c]["value"] = round(cat_map[c]["value"] + p.get("total_value", 0.0), 2)
    category_distribution = list(cat_map.values())

    # 3. Stock Health
    stock_health = {
        "healthy": sum(1 for p in products if p["stock_status"] == "in_stock"),
        "low_stock": sum(1 for p in products if p["stock_status"] == "low_stock"),
        "out_of_stock": sum(1 for p in products if p["stock_status"] == "out_of_stock")
    }

    # 4. Top Performing Products
    top_products = sorted(product_sales_tally.values(), key=lambda x: x["revenue"], reverse=True)[:5]

    return {
        "sales_trend": sales_trend,
        "category_distribution": category_distribution,
        "stock_health": stock_health,
        "top_products": top_products
    }
