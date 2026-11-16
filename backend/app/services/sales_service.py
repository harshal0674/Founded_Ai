from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from fastapi import HTTPException
from backend.app.database import db_manager
from backend.app.models.sale import SaleCreate
from backend.app.services.inventory_service import InventoryService

class SalesService:
    @staticmethod
    def _format_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
        if not doc:
            return doc
        d = dict(doc)
        d["id"] = str(d.pop("_id", d.get("id")))
        return d

    @classmethod
    async def record_sale(cls, payload: SaleCreate) -> Dict[str, Any]:
        # 1. Fetch product and verify existence
        product = await InventoryService.get_product(payload.product_id)
        
        # 2. Deduct stock atomically (this validates that current_stock >= payload.quantity)
        updated_product = await InventoryService.deduct_stock(payload.product_id, payload.quantity)
        
        # 3. Determine pricing
        unit_price = payload.custom_price if payload.custom_price is not None else float(product.get("selling_price", 0.0))
        total_price = round(unit_price * payload.quantity, 2)

        # 4. Save sale record
        sales_col = db_manager.get_collection("sales")
        now = datetime.now(timezone.utc)
        doc = {
            "product_id": payload.product_id,
            "product_name": product["name"],
            "sku": product["sku"],
            "quantity": payload.quantity,
            "unit_price": unit_price,
            "total_price": total_price,
            "customer_type": payload.customer_type,
            "notes": payload.notes,
            "timestamp": now
        }
        res = await sales_col.insert_one(doc)
        doc["_id"] = res.inserted_id
        return cls._format_doc(doc)

    @classmethod
    async def list_sales(
        cls,
        limit: int = 50,
        product_id: Optional[str] = None,
        customer_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        sales_col = db_manager.get_collection("sales")
        filter_doc: Dict[str, Any] = {}
        if product_id:
            filter_doc["product_id"] = product_id
        if customer_type and customer_type.lower() != "all":
            filter_doc["customer_type"] = customer_type

        cursor = sales_col.find(filter_doc).sort("timestamp", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [cls._format_doc(d) for d in docs]

    @classmethod
    async def get_sales_for_product(cls, product_id: str, limit: int = 500) -> List[Dict[str, Any]]:
        sales_col = db_manager.get_collection("sales")
        cursor = sales_col.find({"product_id": product_id}).sort("timestamp", 1)
        docs = await cursor.to_list(length=limit)
        return [cls._format_doc(d) for d in docs]

    @classmethod
    async def get_all_sales_time_series(cls) -> List[Dict[str, Any]]:
        sales_col = db_manager.get_collection("sales")
        cursor = sales_col.find({}).sort("timestamp", 1)
        docs = await cursor.to_list(length=10000)
        return [cls._format_doc(d) for d in docs]
