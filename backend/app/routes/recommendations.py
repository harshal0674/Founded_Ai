from fastapi import APIRouter
from backend.app.models.recommendation import RecommendationOverview, RecommendationResponse
from backend.app.services.inventory_service import InventoryService
from backend.app.services.replenishment_service import ReplenishmentService
from backend.app.services.sales_service import SalesService

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("", response_model=RecommendationOverview)
async def get_replenishment_recommendations():
    products = await InventoryService.list_products()
    items = []

    for prod in products:
        sales = await SalesService.get_sales_for_product(prod["id"])
        rec = ReplenishmentService.calculate_recommendation(prod, sales)
        items.append(RecommendationResponse(**rec))

    # Priority sorting: critical > high > medium > healthy, then days_until_stockout ascending
    urgency_ranks = {"critical": 0, "high": 1, "medium": 2, "healthy": 3}
    items.sort(key=lambda x: (urgency_ranks.get(x.urgency, 4), x.days_until_stockout))

    critical_count = sum(1 for i in items if i.urgency == "critical")
    high_count = sum(1 for i in items if i.urgency == "high")
    medium_count = sum(1 for i in items if i.urgency == "medium")
    healthy_count = sum(1 for i in items if i.urgency == "healthy")
    total_capital = round(sum(i.estimated_cost for i in items if i.action_required), 2)

    return {
        "total_recommendations": len(items),
        "critical_count": critical_count,
        "high_count": high_count,
        "medium_count": medium_count,
        "healthy_count": healthy_count,
        "total_capital_required": total_capital,
        "items": items
    }
