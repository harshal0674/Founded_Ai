from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    org_id: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=4, max_length=128)
    full_name: str = Field(..., min_length=1, max_length=120)
    business_name: str = Field(..., min_length=1, max_length=150)
    currency: Optional[str] = "INR"
    currency_symbol: Optional[str] = "₹"
    industry: Optional[str] = "Retail & Consumer Goods"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    org_id: str
    org_name: str
    role: str = "owner"
    created_at: Optional[str] = None

class OrganizationResponse(BaseModel):
    id: str
    name: str
    currency: str = "INR"
    currency_symbol: str = "₹"
    industry: str = "Retail & Consumer Goods"
    gstin: Optional[str] = ""
    address: Optional[str] = ""
    phone: Optional[str] = ""

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    organization: OrganizationResponse
