from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app import crud, schemas, models
from app.routes.auth import get_current_user

router = APIRouter()


@router.get("")
def list_customers(
    search: str = Query(""),
    skip: int = Query(0),
    limit: int = Query(100),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    customers = crud.get_customers(db, search, skip, limit)
    result = []
    for c in customers:
        stats = db.query(
            func.count(func.distinct(models.Sale.order_id)).label("orders"),
            func.sum(models.Sale.quantity * models.Sale.price).label("spent"),
            func.max(models.Sale.date).label("last"),
        ).filter(models.Sale.customer_id == c.id).first()
        result.append({
            "id": c.id, "name": c.name, "email": c.email,
            "phone": c.phone, "location": c.location,
            "created_at": c.created_at.isoformat(),
            "order_count": int(stats.orders or 0),
            "total_spent": round(float(stats.spent or 0), 2),
            "last_purchase": stats.last.isoformat() if stats.last else None,
        })
    return {"success": True, "data": result}


@router.get("/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    c = crud.get_customer(db, customer_id)
    if not c:
        raise HTTPException(status_code=404, detail="Customer not found")
    stats = db.query(
        func.count(func.distinct(models.Sale.order_id)).label("orders"),
        func.sum(models.Sale.quantity * models.Sale.price).label("spent"),
        func.max(models.Sale.date).label("last"),
    ).filter(models.Sale.customer_id == c.id).first()
    return {"success": True, "data": {
        "id": c.id, "name": c.name, "email": c.email,
        "phone": c.phone, "location": c.location,
        "created_at": c.created_at.isoformat(),
        "order_count": int(stats.orders or 0),
        "total_spent": round(float(stats.spent or 0), 2),
        "last_purchase": stats.last.isoformat() if stats.last else None,
    }}


@router.get("/{customer_id}/orders")
def customer_orders(customer_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    c = crud.get_customer(db, customer_id)
    if not c:
        raise HTTPException(status_code=404, detail="Customer not found")
    sales = db.query(models.Sale).filter(
        models.Sale.customer_id == customer_id
    ).order_by(models.Sale.date.desc()).limit(50).all()
    data = [{
        "id": s.id, "order_id": s.order_id,
        "product_name": s.product.name if s.product else "",
        "category": s.category, "quantity": s.quantity,
        "price": s.price, "revenue": round(s.quantity * s.price, 2),
        "date": s.date.isoformat(), "region": s.region,
    } for s in sales]
    return {"success": True, "data": data}
