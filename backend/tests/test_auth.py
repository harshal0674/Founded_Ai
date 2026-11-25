import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from backend.app.config import settings
from backend.app.database import db_manager
from backend.app.main import app

@pytest_asyncio.fixture(autouse=True)
async def setup_test_db():
    orig_uri = settings.MONGODB_URI
    settings.MONGODB_URI = ""
    await db_manager.connect()
    yield
    await db_manager.close()
    settings.MONGODB_URI = orig_uri

@pytest.mark.asyncio
async def test_auth_and_multi_tenant_isolation():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Register Customer A: "Alpha Footwear"
        res_a = await client.post("/api/auth/register", json={
            "full_name": "Alice Sharma",
            "business_name": "Alpha Footwear",
            "email": "alice@alphafootwear.in",
            "password": "secretpassword",
            "currency": "INR",
            "currency_symbol": "₹"
        })
        assert res_a.status_code == 201
        data_a = res_a.json()
        token_a = data_a["access_token"]
        assert data_a["user"]["email"] == "alice@alphafootwear.in"
        assert data_a["organization"]["name"] == "Alpha Footwear"

        # 2. Register Customer B: "Beta Watch Co"
        res_b = await client.post("/api/auth/register", json={
            "full_name": "Bob Verma",
            "business_name": "Beta Watch Co",
            "email": "bob@betawatches.in",
            "password": "secretpassword",
            "currency": "INR",
            "currency_symbol": "₹"
        })
        assert res_b.status_code == 201
        data_b = res_b.json()
        token_b = data_b["access_token"]
        assert data_b["user"]["email"] == "bob@betawatches.in"
        assert data_b["organization"]["name"] == "Beta Watch Co"

        # 3. Customer A creates a product
        headers_a = {"Authorization": f"Bearer {token_a}"}
        create_res_a = await client.post("/api/products", headers=headers_a, json={
            "name": "Air Cushion Running Shoes",
            "sku": "SHOE-RUN-01",
            "category": "Footwear",
            "current_stock": 40,
            "min_stock_level": 10,
            "unit_cost": 1200,
            "selling_price": 2499,
            "lead_time_days": 5
        })
        assert create_res_a.status_code == 201

        # 4. Customer B creates a product
        headers_b = {"Authorization": f"Bearer {token_b}"}
        create_res_b = await client.post("/api/products", headers=headers_b, json={
            "name": "Chronograph Stainless Watch",
            "sku": "WATCH-CHRONO-99",
            "category": "Watches",
            "current_stock": 25,
            "min_stock_level": 5,
            "unit_cost": 4500,
            "selling_price": 8999,
            "lead_time_days": 7
        })
        assert create_res_b.status_code == 201

        # 5. VERIFY TENANT ISOLATION:
        # Customer A only sees Alpha Footwear's product
        list_a = await client.get("/api/products", headers=headers_a)
        assert list_a.status_code == 200
        prods_a = list_a.json()
        assert len(prods_a) == 1
        assert prods_a[0]["name"] == "Air Cushion Running Shoes"
        assert prods_a[0]["sku"] == "SHOE-RUN-01"

        # Customer B only sees Beta Watch Co's product
        list_b = await client.get("/api/products", headers=headers_b)
        assert list_b.status_code == 200
        prods_b = list_b.json()
        assert len(prods_b) == 1
        assert prods_b[0]["name"] == "Chronograph Stainless Watch"
        assert prods_b[0]["sku"] == "WATCH-CHRONO-99"

        # 6. Test Login
        login_res = await client.post("/api/auth/login", json={
            "email": "alice@alphafootwear.in",
            "password": "secretpassword"
        })
        assert login_res.status_code == 200
        assert login_res.json()["user"]["full_name"] == "Alice Sharma"
        assert login_res.json()["organization"]["name"] == "Alpha Footwear"

        # 7. Test invalid password
        bad_login = await client.post("/api/auth/login", json={
            "email": "alice@alphafootwear.in",
            "password": "wrongpassword"
        })
        assert bad_login.status_code == 401
