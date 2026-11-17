import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from backend.app.config import settings
from backend.app.main import app
from backend.app.database import db_manager
from backend.app.utils.seed_data import seed_database

@pytest_asyncio.fixture(autouse=True)
async def setup_test_db():
    # Force isolated in-memory test database for test runs
    orig_uri = settings.MONGODB_URI
    settings.MONGODB_URI = ""
    await db_manager.connect()
    await seed_database(clear_existing=True)
    yield
    await db_manager.close()
    settings.MONGODB_URI = orig_uri

@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert "database" in data

@pytest.mark.asyncio
async def test_products_crud():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. List products
        resp = await client.get("/api/products")
        assert resp.status_code == 200
        prods = resp.json()
        assert len(prods) > 0

        # 2. Create product
        new_prod = {
            "name": "Industrial Optocoupler IC",
            "sku": "IC-OPTO-TEST",
            "category": "Electronics",
            "current_stock": 50,
            "min_stock_level": 20,
            "unit_cost": 1.50,
            "selling_price": 4.00,
            "lead_time_days": 5,
            "supplier_name": "Test Components Corp",
            "supplier_email": "test@components.example"
        }
        create_resp = await client.post("/api/products", json=new_prod)
        assert create_resp.status_code == 201
        created = create_resp.json()
        assert created["sku"] == "IC-OPTO-TEST"
        prod_id = created["id"]

        # 3. Retrieve single product
        get_resp = await client.get(f"/api/products/{prod_id}")
        assert get_resp.status_code == 200
        assert get_resp.json()["name"] == "Industrial Optocoupler IC"

        # 4. Update product
        update_resp = await client.put(f"/api/products/{prod_id}", json={"selling_price": 4.50})
        assert update_resp.status_code == 200
        assert update_resp.json()["selling_price"] == 4.50

        # 5. Delete product
        del_resp = await client.delete(f"/api/products/{prod_id}")
        assert del_resp.status_code == 200
        
        # Verify 404 after delete
        not_found = await client.get(f"/api/products/{prod_id}")
        assert not_found.status_code == 404

@pytest.mark.asyncio
async def test_sales_and_stock_deduction():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Create a product with known stock of 25
        prod_payload = {
            "name": "Precision Caliper Gauge",
            "sku": "TOOL-CAL-025",
            "category": "Tools",
            "current_stock": 25,
            "min_stock_level": 10,
            "unit_cost": 12.00,
            "selling_price": 29.99,
            "lead_time_days": 6
        }
        c_res = await client.post("/api/products", json=prod_payload)
        assert c_res.status_code == 201
        prod = c_res.json()
        p_id = prod["id"]

        # 1. Record valid sale of 10 units
        sale_payload = {
            "product_id": p_id,
            "quantity": 10,
            "customer_type": "online"
        }
        sale_res = await client.post("/api/sales", json=sale_payload)
        assert sale_res.status_code == 201
        sale_data = sale_res.json()
        assert sale_data["quantity"] == 10
        assert sale_data["total_price"] == 299.90

        # Check stock was automatically decremented to 15
        p_check = await client.get(f"/api/products/{p_id}")
        assert p_check.json()["current_stock"] == 15

        # 2. Attempt sale exceeding remaining stock (16 > 15) -> Must fail with HTTP 400
        excessive_sale = {
            "product_id": p_id,
            "quantity": 16,
            "customer_type": "retail"
        }
        fail_res = await client.post("/api/sales", json=excessive_sale)
        assert fail_res.status_code == 400
        assert "Insufficient inventory" in fail_res.json()["detail"]

        # Stock remains at 15
        p_check_after = await client.get(f"/api/products/{p_id}")
        assert p_check_after.json()["current_stock"] == 15

@pytest.mark.asyncio
async def test_forecasting_and_recommendations():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Test forecasting
        f_res = await client.get("/api/forecast?horizon_days=30")
        assert f_res.status_code == 200
        f_data = f_res.json()
        assert "forecast" in f_data
        assert len(f_data["forecast"]) == 30
        assert "metrics" in f_data
        assert f_data["metrics"]["mae"] >= 0.0

        # 2. Test recommendations
        r_res = await client.get("/api/recommendations")
        assert r_res.status_code == 200
        r_data = r_res.json()
        assert "items" in r_data
        assert len(r_data["items"]) > 0
        
        # Verify recommendation calculations exist
        first_rec = r_data["items"][0]
        assert "reorder_point" in first_rec
        assert "safety_stock" in first_rec
        assert "urgency" in first_rec
        assert first_rec["urgency"] in ("critical", "high", "medium", "healthy")

@pytest.mark.asyncio
async def test_dashboard_stats_and_charts():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        stats_res = await client.get("/api/dashboard/stats")
        assert stats_res.status_code == 200
        stats = stats_res.json()
        assert stats["total_products"] > 0
        assert stats["total_stock_value"] > 0

        charts_res = await client.get("/api/dashboard/charts")
        assert charts_res.status_code == 200
        charts = charts_res.json()
        assert "sales_trend" in charts
        assert "category_distribution" in charts
        assert "stock_health" in charts

@pytest.mark.asyncio
async def test_organization_and_catalog_wipe():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Fetch organization default
        org_res = await client.get("/api/system/organization")
        assert org_res.status_code == 200
        org_data = org_res.json()
        assert "name" in org_data
        assert org_data["currency"] == "INR"
        assert org_data["currency_symbol"] == "₹"

        # 2. Update organization
        update_res = await client.put("/api/system/organization", json={
            "name": "Tata Consumer Logistics",
            "currency": "INR",
            "currency_symbol": "₹",
            "industry": "Consumer Retail & FMCG",
            "gstin": "27AABCT3518Q1Z1",
            "address": "Mumbai, Maharashtra"
        })
        assert update_res.status_code == 200
        assert update_res.json()["name"] == "Tata Consumer Logistics"

        # 3. Verify get reflects updated org
        org_res2 = await client.get("/api/system/organization")
        assert org_res2.json()["name"] == "Tata Consumer Logistics"

        # 4. Test Clear Catalog
        clear_res = await client.post("/api/system/clear-catalog")
        assert clear_res.status_code == 200
        assert clear_res.json()["success"] is True

        # Verify catalog is empty
        p_res = await client.get("/api/products")
        assert p_res.status_code == 200
        assert len(p_res.json()) == 0

        # Verify user can add their own product into empty catalog
        my_product = {
            "name": "Organic Basmati Rice (5kg)",
            "sku": "FMCG-RICE-05",
            "category": "Groceries & FMCG",
            "current_stock": 80,
            "min_stock_level": 20,
            "unit_cost": 450.00,
            "selling_price": 699.00,
            "lead_time_days": 3,
            "supplier_name": "Punjab Agro Direct",
            "supplier_email": "supply@punjabagro.example"
        }
        create_res = await client.post("/api/products", json=my_product)
        assert create_res.status_code == 201
        assert create_res.json()["name"] == "Organic Basmati Rice (5kg)"
        assert create_res.json()["selling_price"] == 699.00
