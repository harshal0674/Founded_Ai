import random
from datetime import datetime, timedelta, timezone
from typing import Dict, List
from backend.app.database import db_manager

DEMO_PRODUCTS = [
    {
        "name": "Precision Hall-Effect Sensor Module",
        "sku": "SEN-HAL-010",
        "category": "Industrial Sensors",
        "current_stock": 14,
        "min_stock_level": 40,
        "unit_cost": 4.20,
        "selling_price": 9.80,
        "lead_time_days": 10,
        "supplier_name": "Nordic Microtech AB",
        "supplier_email": "orders@nordicmicro.example"
    },
    {
        "name": "Mechanical Keyboard Tactile Switch (110-Pack)",
        "sku": "SW-TAC-110",
        "category": "Computer Hardware",
        "current_stock": 65,
        "min_stock_level": 30,
        "unit_cost": 22.00,
        "selling_price": 48.50,
        "lead_time_days": 7,
        "supplier_name": "Apex Precision Switches",
        "supplier_email": "supply@apexprecision.example"
    },
    {
        "name": "Braided USB-C to C 240W Cable (2m)",
        "sku": "CAB-USBC-240",
        "category": "Electronics",
        "current_stock": 180,
        "min_stock_level": 50,
        "unit_cost": 3.10,
        "selling_price": 14.99,
        "lead_time_days": 5,
        "supplier_name": "Shenzhen LinkTech Direct",
        "supplier_email": "export@linktech-sz.example"
    },
    {
        "name": "Thermal Label Rolls 4x6 (Case of 6)",
        "sku": "LBL-THM-4X6",
        "category": "Packaging",
        "current_stock": 6,
        "min_stock_level": 25,
        "unit_cost": 18.50,
        "selling_price": 38.00,
        "lead_time_days": 4,
        "supplier_name": "Avery Logistics Supply",
        "supplier_email": "sales@averylogistics.example"
    },
    {
        "name": "Industrial Anti-Static ESD Mat (60x90cm)",
        "sku": "MAT-ESD-6090",
        "category": "Industrial Sensors",
        "current_stock": 0,
        "min_stock_level": 15,
        "unit_cost": 16.00,
        "selling_price": 34.50,
        "lead_time_days": 12,
        "supplier_name": "SafeStatic Industries",
        "supplier_email": "repairs@safestatic.example"
    },
    {
        "name": "Ergonomic Vertical Wireless Mouse",
        "sku": "MOU-ERG-W01",
        "category": "Computer Hardware",
        "current_stock": 42,
        "min_stock_level": 20,
        "unit_cost": 15.00,
        "selling_price": 39.99,
        "lead_time_days": 8,
        "supplier_name": "LogiLine Devices",
        "supplier_email": "procurement@logiline.example"
    },
    {
        "name": "Reinforced Kraft Paper Tape (70mm x 50m)",
        "sku": "TPE-KRF-7050",
        "category": "Packaging",
        "current_stock": 85,
        "min_stock_level": 30,
        "unit_cost": 4.50,
        "selling_price": 11.20,
        "lead_time_days": 3,
        "supplier_name": "EcoPack Solutions",
        "supplier_email": "b2b@ecopack.example"
    },
    {
        "name": "Ultra-Fast 65W GaN Wall Charger",
        "sku": "PWR-GAN-065W",
        "category": "Electronics",
        "current_stock": 8,
        "min_stock_level": 35,
        "unit_cost": 9.50,
        "selling_price": 28.00,
        "lead_time_days": 9,
        "supplier_name": "Shenzhen LinkTech Direct",
        "supplier_email": "export@linktech-sz.example"
    },
    {
        "name": "Adjustable Aluminum Monitor Arm",
        "sku": "ARM-DSK-ALUM",
        "category": "Office Tech",
        "current_stock": 28,
        "min_stock_level": 15,
        "unit_cost": 32.00,
        "selling_price": 79.00,
        "lead_time_days": 14,
        "supplier_name": "ErgoWorkspace Ltd",
        "supplier_email": "sales@ergoworkspace.example"
    },
    {
        "name": "Heavy-Duty Bubble Cushioning Roll 50m",
        "sku": "BBL-ROL-HD50",
        "category": "Packaging",
        "current_stock": 45,
        "min_stock_level": 20,
        "unit_cost": 11.00,
        "selling_price": 24.50,
        "lead_time_days": 4,
        "supplier_name": "EcoPack Solutions",
        "supplier_email": "b2b@ecopack.example"
    }
]

async def seed_database(clear_existing: bool = True) -> Dict[str, int]:
    """Populates realistic products and 60-90 days of historical sales."""
    prod_col = db_manager.get_collection("products")
    sales_col = db_manager.get_collection("sales")
    movements_col = db_manager.get_collection("inventory_movements")

    if clear_existing:
        await prod_col.delete_many({})
        await sales_col.delete_many({})
        await movements_col.delete_many({})

    # Check if already seeded
    existing_count = await prod_col.count_documents()
    if existing_count > 0 and not clear_existing:
        return {"products": existing_count, "sales": await sales_col.count_documents()}

    now = datetime.now(timezone.utc)
    seeded_products = []
    
    # 1. Insert Products
    for item in DEMO_PRODUCTS:
        doc = dict(item)
        doc["created_at"] = now - timedelta(days=90)
        doc["updated_at"] = now
        res = await prod_col.insert_one(doc)
        doc["_id"] = res.inserted_id
        seeded_products.append(doc)

    # 2. Generate 75 days of realistic historical sales
    random.seed(42)  # Deterministic seed for reproducible testing
    sales_docs = []
    customer_types = ["retail", "online", "wholesale"]

    for prod in seeded_products:
        prod_id = str(prod["_id"])
        base_demand = {
            "Industrial Sensors": 3.5,
            "Computer Hardware": 4.0,
            "Electronics": 8.0,
            "Packaging": 6.5,
            "Office Tech": 2.2
        }.get(prod["category"], 4.0)

        # Iterate over past 75 days
        for day_offset in range(75, 0, -1):
            sale_date = now - timedelta(days=day_offset, hours=random.randint(1, 18), minutes=random.randint(0, 59))
            day_of_week = sale_date.weekday()
            
            # Weekend bump for consumer tech, weekday bump for packaging/industrial
            weekend_factor = 1.3 if day_of_week >= 5 else 0.9
            if prod["category"] in ["Industrial Sensors", "Packaging"]:
                weekend_factor = 0.6 if day_of_week >= 5 else 1.2

            # Random daily variation with Poisson/normal distribution
            noise = random.gauss(0, 1.2)
            daily_qty = max(0, int(round(base_demand * weekend_factor + noise)))
            
            if daily_qty > 0:
                # Distribute into 1 to 3 distinct sales orders
                orders_count = random.randint(1, min(3, daily_qty))
                remaining = daily_qty
                for o_idx in range(orders_count):
                    qty = remaining if o_idx == orders_count - 1 else random.randint(1, max(1, remaining - (orders_count - o_idx - 1)))
                    remaining -= qty
                    if qty <= 0:
                        continue
                    
                    c_type = random.choice(customer_types)
                    unit_price = prod["selling_price"]
                    if c_type == "wholesale" and qty >= 5:
                        unit_price = round(unit_price * 0.85, 2)
                    
                    sales_docs.append({
                        "product_id": prod_id,
                        "product_name": prod["name"],
                        "sku": prod["sku"],
                        "quantity": qty,
                        "unit_price": unit_price,
                        "total_price": round(unit_price * qty, 2),
                        "customer_type": c_type,
                        "timestamp": sale_date,
                        "notes": "Historical demo order"
                    })

    if sales_docs:
        await sales_col.insert_many(sales_docs)

    return {
        "products": len(seeded_products),
        "sales": len(sales_docs)
    }
