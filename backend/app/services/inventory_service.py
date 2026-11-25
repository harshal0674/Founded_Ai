from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from fastapi import HTTPException
from backend.app.database import db_manager
from backend.app.models.product import ProductCreate, ProductUpdate

class InventoryService:
    @staticmethod
    def _format_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
        if not doc:
            return doc
        d = dict(doc)
        d["id"] = str(d.pop("_id", d.get("id")))
        
        # Calculate stock status
        stock = d.get("current_stock", 0)
        min_stock = d.get("min_stock_level", 20)
        if stock <= 0:
            d["stock_status"] = "out_of_stock"
        elif stock <= min_stock:
            d["stock_status"] = "low_stock"
        else:
            d["stock_status"] = "in_stock"
            
        d["total_value"] = round(stock * d.get("unit_cost", 0.0), 2)
        return d

    @classmethod
    async def list_products(
        cls,
        search: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[str] = None,
        low_stock_only: bool = False,
        org_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        collection = db_manager.get_collection("products")
        filter_doc: Dict[str, Any] = {}

        if org_id:
            if org_id in ("org_gada_electronics", "org_default"):
                filter_doc["$or"] = [{"org_id": org_id}, {"org_id": {"$exists": False}}, {"org_id": None}]
            else:
                filter_doc["org_id"] = org_id

        if category and category.lower() != "all":
            filter_doc["category"] = category

        cursor = collection.find(filter_doc)
        docs = await cursor.to_list(length=1000)
        
        results = [cls._format_doc(d) for d in docs]

        # Apply search and status filters in memory
        if search:
            s = search.lower()
            results = [
                p for p in results 
                if s in p["name"].lower() or s in p["sku"].lower() or s in p.get("category", "").lower()
            ]

        if low_stock_only:
            results = [p for p in results if p["stock_status"] in ("low_stock", "out_of_stock")]
        elif status and status.lower() != "all":
            results = [p for p in results if p["stock_status"] == status.lower()]

        # Sort by updated_at descending
        results.sort(key=lambda x: str(x.get("updated_at", "")), reverse=True)
        return results

    @classmethod
    async def get_product(cls, product_id: str, org_id: Optional[str] = None) -> Dict[str, Any]:
        collection = db_manager.get_collection("products")
        doc = None
        try:
            doc = await collection.find_one({"_id": ObjectId(product_id)})
        except Exception:
            pass
        if not doc:
            doc = await collection.find_one({"_id": product_id})
        if not doc:
            doc = await collection.find_one({"id": product_id})

        if not doc:
            raise HTTPException(status_code=404, detail=f"Product with ID '{product_id}' not found.")
        
        if org_id and doc.get("org_id") and org_id not in ("org_gada_electronics", "org_default") and doc.get("org_id") != org_id:
            raise HTTPException(status_code=404, detail=f"Product with ID '{product_id}' not found.")

        return cls._format_doc(doc)

    @classmethod
    async def create_product(cls, payload: ProductCreate, org_id: Optional[str] = None) -> Dict[str, Any]:
        collection = db_manager.get_collection("products")
        target_org = org_id or "org_gada_electronics"
        
        # Check SKU uniqueness within this tenant
        sku_filter = {"sku": payload.sku}
        if target_org in ("org_gada_electronics", "org_default"):
            sku_filter["$or"] = [{"org_id": target_org}, {"org_id": {"$exists": False}}, {"org_id": None}]
        else:
            sku_filter["org_id"] = target_org

        existing = await collection.find_one(sku_filter)
        if existing:
            raise HTTPException(status_code=400, detail=f"A product with SKU '{payload.sku}' already exists in your inventory.")

        now = datetime.now(timezone.utc)
        doc = payload.model_dump()
        doc["org_id"] = target_org
        doc["created_at"] = now
        doc["updated_at"] = now
        
        res = await collection.insert_one(doc)
        doc["_id"] = res.inserted_id
        return cls._format_doc(doc)

    @classmethod
    async def update_product(cls, product_id: str, payload: ProductUpdate, org_id: Optional[str] = None) -> Dict[str, Any]:
        collection = db_manager.get_collection("products")
        existing = await cls.get_product(product_id, org_id=org_id)

        update_dict = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
        if not update_dict:
            return existing

        update_dict["updated_at"] = datetime.now(timezone.utc)
        
        # Check SKU uniqueness if changing SKU
        if "sku" in update_dict and update_dict["sku"] != existing["sku"]:
            target_org = org_id or existing.get("org_id", "org_gada_electronics")
            sku_filter = {"sku": update_dict["sku"]}
            if target_org in ("org_gada_electronics", "org_default"):
                sku_filter["$or"] = [{"org_id": target_org}, {"org_id": {"$exists": False}}, {"org_id": None}]
            else:
                sku_filter["org_id"] = target_org
            conflict = await collection.find_one(sku_filter)
            if conflict and str(conflict.get("_id")) != product_id:
                raise HTTPException(status_code=400, detail=f"SKU '{update_dict['sku']}' is already in use.")

        target_id = ObjectId(product_id) if ObjectId.is_valid(product_id) else product_id
        await collection.update_one({"_id": target_id}, {"$set": update_dict})
        
        return await cls.get_product(product_id, org_id=org_id)

    @classmethod
    async def delete_product(cls, product_id: str, org_id: Optional[str] = None) -> bool:
        collection = db_manager.get_collection("products")
        await cls.get_product(product_id, org_id=org_id)
        target_id = ObjectId(product_id) if ObjectId.is_valid(product_id) else product_id
        res = await collection.delete_one({"_id": target_id})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail=f"Product with ID '{product_id}' not found.")
        return True

    @classmethod
    async def deduct_stock(cls, product_id: str, quantity: int, org_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Atomically decrements stock and guarantees non-negative inventory.
        """
        collection = db_manager.get_collection("products")
        product = await cls.get_product(product_id, org_id=org_id)
        current_stock = product.get("current_stock", 0)

        if current_stock < quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient inventory for '{product['name']}'. Requested {quantity} units, but only {current_stock} currently in stock."
            )

        new_stock = current_stock - quantity
        target_id = ObjectId(product_id) if ObjectId.is_valid(product_id) else product_id
        
        await collection.update_one(
            {"_id": target_id},
            {
                "$set": {
                    "current_stock": new_stock,
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )
        
        # Record inventory movement
        movements_col = db_manager.get_collection("inventory_movements")
        await movements_col.insert_one({
            "product_id": product_id,
            "sku": product["sku"],
            "org_id": org_id or product.get("org_id", "org_gada_electronics"),
            "type": "sale_deduction",
            "quantity_delta": -quantity,
            "resulting_stock": new_stock,
            "timestamp": datetime.now(timezone.utc)
        })

        return await cls.get_product(product_id, org_id=org_id)

    @classmethod
    async def restock_product(cls, product_id: str, quantity: int, org_id: Optional[str] = None) -> Dict[str, Any]:
        collection = db_manager.get_collection("products")
        product = await cls.get_product(product_id, org_id=org_id)
        new_stock = product.get("current_stock", 0) + quantity
        target_id = ObjectId(product_id) if ObjectId.is_valid(product_id) else product_id

        await collection.update_one(
            {"_id": target_id},
            {
                "$set": {
                    "current_stock": new_stock,
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )

        movements_col = db_manager.get_collection("inventory_movements")
        await movements_col.insert_one({
            "product_id": product_id,
            "sku": product["sku"],
            "org_id": org_id or product.get("org_id", "org_gada_electronics"),
            "type": "restock_replenishment",
            "quantity_delta": quantity,
            "resulting_stock": new_stock,
            "timestamp": datetime.now(timezone.utc)
        })

        return await cls.get_product(product_id, org_id=org_id)
