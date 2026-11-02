from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app import crud, schemas, models
from app.routes.auth import get_current_user

router = APIRouter()


@router.get("")
def list_products(
    search: str = Query(""),
    category: str = Query(""),
    stock_status: str = Query(""),
    skip: int = Query(0),
    limit: int = Query(100),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    items = crud.get_products(db, search, category, skip, limit)
    result = []
    for p in items:
        units_sold = db.query(func.sum(models.Sale.quantity)).filter(
            models.Sale.product_id == p.id
        ).scalar() or 0
        revenue = db.query(func.sum(models.Sale.quantity * models.Sale.price)).filter(
            models.Sale.product_id == p.id
        ).scalar() or 0
        if p.stock == 0:
            status = "Out of Stock"
        elif p.stock <= 10:
            status = "Low Stock"
        else:
            status = "Healthy"
        if stock_status and stock_status != status:
            continue
        result.append({
            "id": p.id, "name": p.name, "category": p.category,
            "price": p.price, "stock": p.stock,
            "units_sold": int(units_sold), "revenue": round(float(revenue), 2),
            "stock_status": status, "created_at": p.created_at.isoformat(),
        })
    return {"success": True, "data": result}


@router.post("")
def create_product(data: schemas.ProductCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    product = crud.create_product(db, data)
    return {"success": True, "data": {"id": product.id}, "message": "Product created successfully"}


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True, "data": {
        "id": product.id, "name": product.name, "category": product.category,
        "price": product.price, "stock": product.stock,
        "created_at": product.created_at.isoformat(),
    }}


@router.put("/{product_id}")
def update_product(product_id: int, data: schemas.ProductUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    product = crud.update_product(db, product_id, data)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True, "message": "Product updated successfully"}


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    product = crud.delete_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True, "message": "Product deleted successfully"}
