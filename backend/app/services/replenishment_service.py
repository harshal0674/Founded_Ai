import math
from typing import Dict, List
from backend.app.ml.forecaster import DemandForecaster

class ReplenishmentService:
    """
    Computes intelligent reorder points, dynamic safety stocks, and actionable replenishment advice.
    Formulas:
      - Safety Stock (SS) = Z * sigma_d * sqrt(LeadTime)  [Z=1.65 for 95% service level]
      - Reorder Point (ROP) = (AvgDailyDemand * LeadTime) + SS
      - Days to Stockout = CurrentStock / max(AvgDailyDemand, 0.05)
    """

    @classmethod
    def calculate_recommendation(
        cls,
        product: Dict,
        sales_records: List[Dict],
        service_level_z: float = 1.65
    ) -> Dict:
        lead_time = max(1, int(product.get("lead_time_days", 7)))
        current_stock = int(product.get("current_stock", 0))
        unit_cost = float(product.get("unit_cost", 0.0))

        # Get demand forecast metrics
        forecast_res = DemandForecaster.forecast_product_demand(sales_records, horizon_days=30)
        daily_demand = max(0.0, float(forecast_res.get("avg_daily_demand", 0.0)))
        demand_std = max(0.0, float(forecast_res.get("demand_std", 0.0)))

        # Fallback if no sales yet: use min_stock_level as baseline hint
        if daily_demand <= 0.01:
            min_stock = int(product.get("min_stock_level", 20))
            daily_demand = max(0.5, round(min_stock / 14.0, 2))
            demand_std = round(daily_demand * 0.3, 2)

        # 1. Safety Stock
        safety_stock = int(math.ceil(service_level_z * demand_std * math.sqrt(lead_time)))
        safety_stock = max(5, safety_stock)

        # 2. Reorder Point (ROP)
        lead_time_demand = daily_demand * lead_time
        reorder_point = int(math.ceil(lead_time_demand + safety_stock))

        # 3. Days until stockout
        effective_rate = max(daily_demand, 0.1)
        days_until_stockout = round(current_stock / effective_rate, 1)

        # 4. Action determination
        action_required = current_stock <= reorder_point

        if current_stock == 0:
            urgency = "critical"
            reasoning = (
                f"STOCKOUT ACTIVE: Current inventory is 0. Supplier lead time is {lead_time} days. "
                f"Immediate replenishment of buffer stock is required to avoid ongoing lost sales."
            )
            suggested_qty = max(reorder_point + int(daily_demand * 14), 20)
        elif days_until_stockout <= lead_time:
            urgency = "critical"
            reasoning = (
                f"CRITICAL DEFICIT: Only {days_until_stockout} days of inventory remaining, which is less than "
                f"supplier lead time ({lead_time} days). A stockout is guaranteed without emergency expedite."
            )
            deficit = reorder_point - current_stock
            suggested_qty = max(deficit + int(daily_demand * 14), 15)
        elif current_stock <= reorder_point:
            urgency = "high"
            reasoning = (
                f"REORDER THRESHOLD BREACHED: Inventory ({current_stock} units) has fallen below Reorder Point "
                f"({reorder_point} units). Reorder now to maintain safety buffer of {safety_stock} units during the {lead_time}-day lead time."
            )
            deficit = reorder_point - current_stock
            suggested_qty = max(deficit + int(daily_demand * 14), 10)
        elif current_stock <= int(reorder_point * 1.35):
            urgency = "medium"
            reasoning = (
                f"MONITOR CLOSELY: Inventory ({current_stock} units) is within 35% of Reorder Point ({reorder_point}). "
                f"Stockout risk in {days_until_stockout} days based on daily velocity of {daily_demand} units/day."
            )
            suggested_qty = 0
            action_required = False
        else:
            urgency = "healthy"
            reasoning = (
                f"HEALTHY SUPPLY: Inventory covers ~{days_until_stockout} days of forecasted demand. "
                f"Safety stock buffer ({safety_stock} units) is fully secured."
            )
            suggested_qty = 0
            action_required = False

        estimated_cost = round(suggested_qty * unit_cost, 2)

        return {
            "product_id": str(product.get("_id") or product.get("id")),
            "product_name": product.get("name", "Unknown Product"),
            "sku": product.get("sku", "N/A"),
            "category": product.get("category", "General"),
            "current_stock": current_stock,
            "daily_run_rate": round(daily_demand, 2),
            "days_until_stockout": days_until_stockout,
            "lead_time_days": lead_time,
            "safety_stock": safety_stock,
            "reorder_point": reorder_point,
            "suggested_order_qty": suggested_qty,
            "estimated_cost": estimated_cost,
            "supplier_name": product.get("supplier_name", "Primary Distributor"),
            "supplier_email": product.get("supplier_email"),
            "urgency": urgency,
            "reasoning": reasoning,
            "action_required": action_required
        }
