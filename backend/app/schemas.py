from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ── Auth ──────────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# ── User ──────────────────────────────────────────────────────────────────────
class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Customer ──────────────────────────────────────────────────────────────────
class CustomerBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(CustomerBase):
    pass

class CustomerOut(CustomerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CustomerDetail(CustomerOut):
    order_count: int = 0
    total_spent: float = 0.0
    last_purchase: Optional[datetime] = None


# ── Product ───────────────────────────────────────────────────────────────────
class ProductBase(BaseModel):
    name: str
    category: str
    price: float
    stock: int = 0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class ProductOut(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProductDetail(ProductOut):
    units_sold: int = 0
    revenue: float = 0.0
    stock_status: str = "Healthy"


# ── Sale ──────────────────────────────────────────────────────────────────────
class SaleBase(BaseModel):
    order_id: str
    customer_id: int
    product_id: int
    date: datetime
    quantity: int
    price: float
    category: str
    region: str

class SaleCreate(SaleBase):
    pass

class SaleUpdate(SaleBase):
    pass

class SaleOut(SaleBase):
    id: int
    revenue: float
    customer_name: Optional[str] = None
    product_name: Optional[str] = None

    class Config:
        from_attributes = True


# ── Dashboard ─────────────────────────────────────────────────────────────────
class KPIData(BaseModel):
    total_revenue: float
    total_orders: int
    total_customers: int
    avg_order_value: float
    revenue_change: float
    orders_change: float
    customers_change: float
    aov_change: float

class RevenuePoint(BaseModel):
    date: str
    revenue: float
    orders: int

class CategoryRevenue(BaseModel):
    category: str
    revenue: float
    percentage: float

class TopProduct(BaseModel):
    id: int
    name: str
    category: str
    units_sold: int
    revenue: float

class RecentOrder(BaseModel):
    id: int
    order_id: str
    customer_name: str
    product_name: str
    category: str
    quantity: int
    revenue: float
    date: datetime
    status: str

class InsightItem(BaseModel):
    type: str        # positive | warning | neutral
    icon: str
    title: str
    description: str

class InventoryAlert(BaseModel):
    out_of_stock: int
    low_stock: int
    healthy: int
    products: List[dict]


# ── Analytics ─────────────────────────────────────────────────────────────────
class RegionData(BaseModel):
    region: str
    revenue: float
    orders: int

class CustomerSpend(BaseModel):
    customer_id: int
    name: str
    total_spent: float
    order_count: int


# ── Settings ──────────────────────────────────────────────────────────────────
class SettingUpdate(BaseModel):
    value: str

class SettingOut(BaseModel):
    key: str
    value: str

    class Config:
        from_attributes = True


# ── CSV Import ────────────────────────────────────────────────────────────────
class ImportResult(BaseModel):
    success: bool
    imported: int
    skipped: int
    errors: List[str]
    message: str


# ── Generic Response ──────────────────────────────────────────────────────────
class APIResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None
    errors: Optional[List[str]] = None
