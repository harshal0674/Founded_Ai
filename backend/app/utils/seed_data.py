import random
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional
from backend.app.database import db_manager
from backend.app.utils.auth import hash_password

DEMO_PRODUCTS = [
    {
        "name": "Precision Hall-Effect Sensor Module",
        "sku": "SEN-HAL-010",
        "category": "Industrial Sensors",
        "current_stock": 14,
        "min_stock_level": 40,
        "unit_cost": 350.00,
        "selling_price": 799.00,
        "lead_time_days": 10,
        "supplier_name": "Apex Sensors India (Pune)",
        "supplier_email": "orders@apexsensors.example"
    },
    {
        "name": "Mechanical Keyboard Tactile Switch (110-Pack)",
        "sku": "SW-TAC-110",
        "category": "Computer Hardware",
        "current_stock": 65,
        "min_stock_level": 30,
        "unit_cost": 1850.00,
        "selling_price": 3999.00,
        "lead_time_days": 7,
        "supplier_name": "Precision Switches (Bengaluru)",
        "supplier_email": "supply@precisionswitches.example"
    },
    {
        "name": "Braided USB-C to C 240W Cable (2m)",
        "sku": "CAB-USBC-240",
        "category": "Electronics",
        "current_stock": 180,
        "min_stock_level": 50,
        "unit_cost": 250.00,
        "selling_price": 899.00,
        "lead_time_days": 5,
        "supplier_name": "LinkTech Electronics (Mumbai)",
        "supplier_email": "export@linktech-in.example"
    },
    {
        "name": "Thermal Label Rolls 4x6 (Case of 6)",
        "sku": "LBL-THM-4X6",
        "category": "Packaging",
        "current_stock": 6,
        "min_stock_level": 25,
        "unit_cost": 650.00,
        "selling_price": 1499.00,
        "lead_time_days": 4,
        "supplier_name": "Avery Logistics Supply (Delhi)",
        "supplier_email": "sales@averylogistics.example"
    },
    {
        "name": "Industrial Anti-Static ESD Mat (60x90cm)",
        "sku": "MAT-ESD-6090",
        "category": "Industrial Sensors",
        "current_stock": 0,
        "min_stock_level": 15,
        "unit_cost": 1200.00,
        "selling_price": 2850.00,
        "lead_time_days": 12,
        "supplier_name": "SafeStatic Tech (Chennai)",
        "supplier_email": "repairs@safestatic.example"
    },
    {
        "name": "Ergonomic Vertical Wireless Mouse",
        "sku": "MOU-ERG-W01",
        "category": "Computer Hardware",
        "current_stock": 42,
        "min_stock_level": 20,
        "unit_cost": 1450.00,
        "selling_price": 2999.00,
        "lead_time_days": 8,
        "supplier_name": "LogiLine Devices India",
        "supplier_email": "procurement@logiline.example"
    },
    {
        "name": "Reinforced Kraft Paper Tape (70mm x 50m)",
        "sku": "TPE-KRF-7050",
        "category": "Packaging",
        "current_stock": 85,
        "min_stock_level": 30,
        "unit_cost": 220.00,
        "selling_price": 549.00,
        "lead_time_days": 3,
        "supplier_name": "EcoPack Packaging (Ahmedabad)",
        "supplier_email": "b2b@ecopack.example"
    },
    {
        "name": "Ultra-Fast 65W GaN Wall Charger",
        "sku": "PWR-GAN-065W",
        "category": "Electronics",
        "current_stock": 8,
        "min_stock_level": 35,
        "unit_cost": 850.00,
        "selling_price": 2199.00,
        "lead_time_days": 9,
        "supplier_name": "LinkTech Electronics (Mumbai)",
        "supplier_email": "export@linktech-in.example"
    },
    {
        "name": "Adjustable Aluminum Monitor Arm",
        "sku": "ARM-DSK-ALUM",
        "category": "Office Tech",
        "current_stock": 28,
        "min_stock_level": 15,
        "unit_cost": 2800.00,
        "selling_price": 5999.00,
        "lead_time_days": 14,
        "supplier_name": "ErgoWorkspace India (Hyderabad)",
        "supplier_email": "sales@ergoworkspace.example"
    },
    {
        "name": "Heavy-Duty Bubble Cushioning Roll 50m",
        "sku": "BBL-ROL-HD50",
        "category": "Packaging",
        "current_stock": 45,
        "min_stock_level": 20,
        "unit_cost": 450.00,
        "selling_price": 999.00,
        "lead_time_days": 4,
        "supplier_name": "EcoPack Packaging (Ahmedabad)",
        "supplier_email": "b2b@ecopack.example"
    }
]

async def ensure_demo_accounts():
    """Seeds default customer tenant accounts for instant 1-click login and testing."""
    users_col = db_manager.get_collection("users")
    orgs_col = db_manager.get_collection("organizations")
    prod_col = db_manager.get_collection("products")

    # 1. Gada Electronics
    gada_org = await orgs_col.find_one({"_id": "org_gada_electronics"})
    if not gada_org:
        await orgs_col.insert_one({
            "_id": "org_gada_electronics",
            "id": "org_gada_electronics",
            "name": "Gada Electronics",
            "currency": "INR",
            "currency_symbol": "₹",
            "industry": "Electronics & Gadgets",
            "gstin": "27AAACB2212R1Z0",
            "address": "Powai, Mumbai, Maharashtra",
            "phone": "+91 98200 12345"
        })

    gada_user = await users_col.find_one({"email": "gada@electronics.in"})
    if not gada_user:
        await users_col.insert_one({
            "_id": "usr_gada_001",
            "id": "usr_gada_001",
            "email": "gada@electronics.in",
            "hashed_password": hash_password("password123"),
            "full_name": "Jethalal Gada",
            "org_id": "org_gada_electronics",
            "role": "owner",
            "created_at": datetime.now(timezone.utc).isoformat()
        })

    # Stamp any existing legacy products without org_id to Gada Electronics
    await prod_col.update_many(
        {"$or": [{"org_id": {"$exists": False}}, {"org_id": None}]},
        {"$set": {"org_id": "org_gada_electronics"}}
    )

    # 2. Bharat Retail Corp
    bharat_org = await orgs_col.find_one({"_id": "org_bharat_retail"})
    if not bharat_org:
        await orgs_col.insert_one({
            "_id": "org_bharat_retail",
            "id": "org_bharat_retail",
            "name": "Bharat Retail Corp",
            "currency": "INR",
            "currency_symbol": "₹",
            "industry": "Supermarket & FMCG Goods",
            "gstin": "07AAACB9999R1Z1",
            "address": "Connaught Place, New Delhi",
            "phone": "+91 98111 54321"
        })

    bharat_user = await users_col.find_one({"email": "bharat@retail.in"})
    if not bharat_user:
        await users_col.insert_one({
            "_id": "usr_bharat_001",
            "id": "usr_bharat_001",
            "email": "bharat@retail.in",
            "hashed_password": hash_password("password123"),
            "full_name": "Ramesh Kumar",
            "org_id": "org_bharat_retail",
            "role": "owner",
            "created_at": datetime.now(timezone.utc).isoformat()
        })

    # Seed FMCG sample products for Bharat Retail Corp if none exist
    bharat_count = await prod_col.count_documents({"org_id": "org_bharat_retail"})
    if bharat_count == 0:
        fmcg_products = [
            {
                "name": "Organic Royal Basmati Rice (5kg)",
                "sku": "RICE-BAS-005",
                "category": "Grains & Staples",
                "current_stock": 140,
                "min_stock_level": 35,
                "unit_cost": 450.00,
                "selling_price": 799.00,
                "lead_time_days": 4,
                "supplier_name": "Punjab Agro Mills",
                "supplier_email": "supply@punjabagro.example",
                "org_id": "org_bharat_retail"
            },
            {
                "name": "Assam CTC Premium Tea (1kg)",
                "sku": "TEA-ASM-001",
                "category": "Beverages",
                "current_stock": 85,
                "min_stock_level": 25,
                "unit_cost": 320.00,
                "selling_price": 549.00,
                "lead_time_days": 5,
                "supplier_name": "Guwahati Tea Estates",
                "supplier_email": "orders@guwahatitea.example",
                "org_id": "org_bharat_retail"
            },
            {
                "name": "Cold-Pressed Mustard Oil (5L Jar)",
                "sku": "OIL-MST-005",
                "category": "Edible Oils",
                "current_stock": 12,
                "min_stock_level": 30,
                "unit_cost": 680.00,
                "selling_price": 1099.00,
                "lead_time_days": 6,
                "supplier_name": "Rajasthan Oil Mills",
                "supplier_email": "orders@rajasthanoils.example",
                "org_id": "org_bharat_retail"
            }
        ]
        now = datetime.now(timezone.utc)
        for p in fmcg_products:
            p["created_at"] = now
            p["updated_at"] = now
            await prod_col.insert_one(p)

async def seed_database(clear_existing: bool = True, org_id: Optional[str] = None) -> Dict[str, int]:
    """Populates realistic products and 60-90 days of historical sales for an organization."""
    prod_col = db_manager.get_collection("products")
    sales_col = db_manager.get_collection("sales")
    movements_col = db_manager.get_collection("inventory_movements")
    target_org = org_id or "org_gada_electronics"

    if clear_existing:
        filter_q = {"org_id": target_org}
        await prod_col.delete_many(filter_q)
        await sales_col.delete_many(filter_q)
        await movements_col.delete_many(filter_q)

    now = datetime.now(timezone.utc)
    seeded_products = []
    
    # 1. Insert Products
    for item in DEMO_PRODUCTS:
        doc = dict(item)
        doc["org_id"] = target_org
        doc["created_at"] = now - timedelta(days=90)
        doc["updated_at"] = now
        res = await prod_col.insert_one(doc)
        doc["_id"] = res.inserted_id
        seeded_products.append(doc)

    # 2. Generate 75 days of realistic historical sales
    random.seed(42)
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

        for day_offset in range(75, 0, -1):
            sale_date = now - timedelta(days=day_offset, hours=random.randint(1, 18), minutes=random.randint(0, 59))
            day_of_week = sale_date.weekday()
            
            weekend_factor = 1.3 if day_of_week >= 5 else 0.9
            if prod["category"] in ["Industrial Sensors", "Packaging"]:
                weekend_factor = 0.6 if day_of_week >= 5 else 1.2

            noise = random.gauss(0, 1.2)
            daily_qty = max(0, int(round(base_demand * weekend_factor + noise)))
            
            if daily_qty > 0:
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
                        "org_id": target_org,
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
