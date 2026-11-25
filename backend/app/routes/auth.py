import re
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.database import db_manager
from backend.app.models.auth import (
    AuthTokenResponse,
    OrganizationResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)
from backend.app.utils.auth import (
    create_access_token,
    get_current_tenant,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["Authentication & Multi-Tenancy"])

def slugify(text: str) -> str:
    cleaned = re.sub(r"[^\w\s-]", "", text).strip().lower()
    return re.sub(r"[-\s]+", "_", cleaned)

@router.post("/register", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate):
    users_col = db_manager.get_collection("users")
    orgs_col = db_manager.get_collection("organizations")

    # Check if email is already registered
    existing_user = await users_col.find_one({"email": payload.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists. Please sign in instead."
        )

    # Create new Organization / Tenant
    base_slug = slugify(payload.business_name) or "tenant"
    org_id = f"org_{base_slug}_{uuid.uuid4().hex[:6]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    org_doc: Dict[str, Any] = {
        "_id": org_id,
        "id": org_id,
        "name": payload.business_name.strip(),
        "currency": payload.currency or "INR",
        "currency_symbol": payload.currency_symbol or "₹",
        "industry": payload.industry or "Retail & Consumer Goods",
        "gstin": "",
        "address": "",
        "phone": "",
        "created_at": now_iso
    }
    await orgs_col.insert_one(org_doc)

    # Create new User
    user_id = f"usr_{uuid.uuid4().hex[:10]}"
    user_doc: Dict[str, Any] = {
        "_id": user_id,
        "id": user_id,
        "email": payload.email.lower(),
        "hashed_password": hash_password(payload.password),
        "full_name": payload.full_name.strip(),
        "org_id": org_id,
        "role": "owner",
        "created_at": now_iso
    }
    await users_col.insert_one(user_doc)

    # Generate Token
    token_data = {
        "sub": user_id,
        "email": payload.email.lower(),
        "name": payload.full_name.strip(),
        "org_id": org_id,
        "org_name": payload.business_name.strip()
    }
    token = create_access_token(token_data)

    user_resp = UserResponse(
        id=user_id,
        email=payload.email.lower(),
        full_name=payload.full_name.strip(),
        org_id=org_id,
        org_name=payload.business_name.strip(),
        role="owner",
        created_at=now_iso
    )

    org_resp = OrganizationResponse(
        id=org_id,
        name=payload.business_name.strip(),
        currency=payload.currency or "INR",
        currency_symbol=payload.currency_symbol or "₹",
        industry=payload.industry or "Retail & Consumer Goods",
        gstin="",
        address="",
        phone=""
    )

    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=user_resp,
        organization=org_resp
    )

@router.post("/login", response_model=AuthTokenResponse)
async def login(payload: UserLogin):
    users_col = db_manager.get_collection("users")
    orgs_col = db_manager.get_collection("organizations")

    user_doc = await users_col.find_one({"email": payload.email.lower()})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    if not verify_password(payload.password, user_doc.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    org_id = user_doc.get("org_id", "org_default")
    org_doc = await orgs_col.find_one({"_id": org_id})
    if not org_doc:
        org_doc = await orgs_col.find_one({"id": org_id})

    org_name = org_doc.get("name", "Store Enterprise") if org_doc else "Store Enterprise"
    currency = org_doc.get("currency", "INR") if org_doc else "INR"
    currency_symbol = org_doc.get("currency_symbol", "₹") if org_doc else "₹"
    industry = org_doc.get("industry", "Retail & Consumer Goods") if org_doc else "Retail & Consumer Goods"

    token_data = {
        "sub": str(user_doc.get("id", user_doc.get("_id"))),
        "email": user_doc.get("email"),
        "name": user_doc.get("full_name"),
        "org_id": org_id,
        "org_name": org_name
    }
    token = create_access_token(token_data)

    user_resp = UserResponse(
        id=str(user_doc.get("id", user_doc.get("_id"))),
        email=user_doc.get("email"),
        full_name=user_doc.get("full_name"),
        org_id=org_id,
        org_name=org_name,
        role=user_doc.get("role", "owner"),
        created_at=user_doc.get("created_at")
    )

    org_resp = OrganizationResponse(
        id=org_id,
        name=org_name,
        currency=currency,
        currency_symbol=currency_symbol,
        industry=industry,
        gstin=org_doc.get("gstin", "") if org_doc else "",
        address=org_doc.get("address", "") if org_doc else "",
        phone=org_doc.get("phone", "") if org_doc else ""
    )

    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=user_resp,
        organization=org_resp
    )

@router.get("/me", response_model=AuthTokenResponse)
async def get_current_user_profile(tenant: Dict[str, Any] = Depends(get_current_tenant)):
    users_col = db_manager.get_collection("users")
    orgs_col = db_manager.get_collection("organizations")

    user_id = tenant.get("user_id")
    user_doc = await users_col.find_one({"_id": user_id})
    if not user_doc:
        user_doc = await users_col.find_one({"id": user_id})

    org_id = tenant.get("org_id", "org_default")
    org_doc = await orgs_col.find_one({"_id": org_id})
    if not org_doc:
        org_doc = await orgs_col.find_one({"id": org_id})

    org_name = org_doc.get("name", tenant.get("org_name", "Enterprise")) if org_doc else tenant.get("org_name", "Enterprise")
    currency = org_doc.get("currency", "INR") if org_doc else "INR"
    currency_symbol = org_doc.get("currency_symbol", "₹") if org_doc else "₹"
    industry = org_doc.get("industry", "Retail") if org_doc else "Retail"

    # Re-issue refreshed token
    token = create_access_token({
        "sub": user_id,
        "email": tenant.get("email"),
        "name": tenant.get("full_name"),
        "org_id": org_id,
        "org_name": org_name
    })

    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=str(user_id),
            email=tenant.get("email", ""),
            full_name=tenant.get("full_name", ""),
            org_id=org_id,
            org_name=org_name,
            role="owner"
        ),
        organization=OrganizationResponse(
            id=org_id,
            name=org_name,
            currency=currency,
            currency_symbol=currency_symbol,
            industry=industry,
            gstin=org_doc.get("gstin", "") if org_doc else "",
            address=org_doc.get("address", "") if org_doc else "",
            phone=org_doc.get("phone", "") if org_doc else ""
        )
    )

@router.get("/demo-accounts")
async def list_demo_accounts():
    """Returns pre-configured customer accounts for easy 1-click testing & switching."""
    return [
        {
            "name": "Gada Electronics",
            "email": "gada@electronics.in",
            "password": "password123",
            "owner": "Jethalal Gada",
            "industry": "Consumer Electronics & Gadgets",
            "currency": "INR (₹)",
            "description": "Pre-loaded with smartphones, laptops, audio gear, and active sales velocity."
        },
        {
            "name": "Bharat Retail Corp",
            "email": "bharat@retail.in",
            "password": "password123",
            "owner": "Ramesh Kumar",
            "industry": "Supermarket & FMCG Goods",
            "currency": "INR (₹)",
            "description": "Pre-loaded with grains, teas, spices, oils, and packaged foods."
        }
    ]
