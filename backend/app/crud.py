from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from typing import Optional, List
from datetime import datetime
from app import models, schemas
from app.auth import hash_password


# ── Users ─────────────────────────────────────────────────────────────────────
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, name: str, email: str, password: str, role: str = "admin"):
    user = models.User(name=name, email=email, hashed_password=hash_password(password), role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ── Customers ─────────────────────────────────────────────────────────────────
def get_customers(db: Session, search: str = "", skip: int = 0, limit: int = 100):
    q = db.query(models.Customer)
    if search:
        q = q.filter(models.Customer.name.ilike(f"%{search}%") | models.Customer.email.ilike(f"%{search}%"))
    return q.offset(skip).limit(limit).all()

def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def get_customer_by_email(db: Session, email: str):
    return db.query(models.Customer).filter(models.Customer.email == email).first()

def create_customer(db: Session, data: schemas.CustomerCreate):
    obj = models.Customer(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_customer(db: Session, customer_id: int, data: schemas.CustomerUpdate):
    obj = get_customer(db, customer_id)
    if obj:
        for k, v in data.model_dump().items():
            setattr(obj, k, v)
        db.commit()
        db.refresh(obj)
    return obj

def delete_customer(db: Session, customer_id: int):
    obj = get_customer(db, customer_id)
    if obj:
        db.delete(obj)
        db.commit()
    return obj

def count_customers(db: Session):
    return db.query(func.count(models.Customer.id)).scalar()


# ── Products ──────────────────────────────────────────────────────────────────
def get_products(db: Session, search: str = "", category: str = "", skip: int = 0, limit: int = 200):
    q = db.query(models.Product)
    if search:
        q = q.filter(models.Product.name.ilike(f"%{search}%"))
    if category:
        q = q.filter(models.Product.category == category)
    return q.offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_product_by_name(db: Session, name: str):
    return db.query(models.Product).filter(models.Product.name == name).first()

def create_product(db: Session, data: schemas.ProductCreate):
    obj = models.Product(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_product(db: Session, product_id: int, data: schemas.ProductUpdate):
    obj = get_product(db, product_id)
    if obj:
        for k, v in data.model_dump().items():
            setattr(obj, k, v)
        db.commit()
        db.refresh(obj)
    return obj

def delete_product(db: Session, product_id: int):
    obj = get_product(db, product_id)
    if obj:
        db.delete(obj)
        db.commit()
    return obj


# ── Sales ─────────────────────────────────────────────────────────────────────
def get_sales(db: Session, search: str = "", category: str = "", region: str = "",
              date_from: Optional[datetime] = None, date_to: Optional[datetime] = None,
              skip: int = 0, limit: int = 100):
    q = db.query(models.Sale)
    if search:
        q = q.join(models.Customer).join(models.Product).filter(
            models.Customer.name.ilike(f"%{search}%") |
            models.Product.name.ilike(f"%{search}%") |
            models.Sale.order_id.ilike(f"%{search}%")
        )
    if category:
        q = q.filter(models.Sale.category == category)
    if region:
        q = q.filter(models.Sale.region == region)
    if date_from:
        q = q.filter(models.Sale.date >= date_from)
    if date_to:
        q = q.filter(models.Sale.date <= date_to)
    total = q.count()
    items = q.order_by(models.Sale.date.desc()).offset(skip).limit(limit).all()
    return items, total

def get_sale(db: Session, sale_id: int):
    return db.query(models.Sale).filter(models.Sale.id == sale_id).first()

def create_sale(db: Session, data: schemas.SaleCreate):
    obj = models.Sale(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_sale(db: Session, sale_id: int, data: schemas.SaleUpdate):
    obj = get_sale(db, sale_id)
    if obj:
        for k, v in data.model_dump().items():
            setattr(obj, k, v)
        db.commit()
        db.refresh(obj)
    return obj

def delete_sale(db: Session, sale_id: int):
    obj = get_sale(db, sale_id)
    if obj:
        db.delete(obj)
        db.commit()
    return obj


# ── Settings ──────────────────────────────────────────────────────────────────
def get_setting(db: Session, key: str):
    return db.query(models.Setting).filter(models.Setting.key == key).first()

def upsert_setting(db: Session, key: str, value: str):
    obj = get_setting(db, key)
    if obj:
        obj.value = value
    else:
        obj = models.Setting(key=key, value=value)
        db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
