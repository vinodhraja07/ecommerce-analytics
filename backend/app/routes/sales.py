from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from app.database import get_db
from app import crud, schemas
from app.routes.auth import get_current_user

router = APIRouter()


@router.get("")
def list_sales(
    search: str = Query(""),
    category: str = Query(""),
    region: str = Query(""),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    skip: int = Query(0),
    limit: int = Query(50),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    df = datetime.fromisoformat(date_from) if date_from else None
    dt = datetime.fromisoformat(date_to) if date_to else None
    items, total = crud.get_sales(db, search, category, region, df, dt, skip, limit)
    result = []
    for s in items:
        result.append({
            "id": s.id,
            "order_id": s.order_id,
            "customer_id": s.customer_id,
            "product_id": s.product_id,
            "customer_name": s.customer.name if s.customer else "",
            "product_name": s.product.name if s.product else "",
            "date": s.date.isoformat(),
            "quantity": s.quantity,
            "price": s.price,
            "revenue": round(s.quantity * s.price, 2),
            "category": s.category,
            "region": s.region,
        })
    return {"success": True, "data": result, "total": total}


@router.post("")
def create_sale(data: schemas.SaleCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    sale = crud.create_sale(db, data)
    return {"success": True, "data": {"id": sale.id}, "message": "Sale created successfully"}


@router.get("/{sale_id}")
def get_sale(sale_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    sale = crud.get_sale(db, sale_id)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return {"success": True, "data": {
        "id": sale.id, "order_id": sale.order_id,
        "customer_id": sale.customer_id, "product_id": sale.product_id,
        "customer_name": sale.customer.name if sale.customer else "",
        "product_name": sale.product.name if sale.product else "",
        "date": sale.date.isoformat(), "quantity": sale.quantity,
        "price": sale.price, "revenue": round(sale.quantity * sale.price, 2),
        "category": sale.category, "region": sale.region,
    }}


@router.put("/{sale_id}")
def update_sale(sale_id: int, data: schemas.SaleUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    sale = crud.update_sale(db, sale_id, data)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return {"success": True, "message": "Sale updated successfully"}


@router.delete("/{sale_id}")
def delete_sale(sale_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    sale = crud.delete_sale(db, sale_id)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return {"success": True, "message": "Sale deleted successfully"}
