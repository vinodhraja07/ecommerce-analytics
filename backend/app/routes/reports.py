from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import datetime
import csv
import io
from app.database import get_db
from app import models
from app.routes.auth import get_current_user

router = APIRouter()


def _date_filters(q, model, date_from, date_to):
    if date_from:
        q = q.filter(model.date >= datetime.fromisoformat(date_from))
    if date_to:
        q = q.filter(model.date <= datetime.fromisoformat(date_to))
    return q


@router.get("/sales")
def sales_report(
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    category: str = Query(""),
    region: str = Query(""),
    export: bool = Query(False),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    q = db.query(models.Sale)
    q = _date_filters(q, models.Sale, date_from, date_to)
    if category:
        q = q.filter(models.Sale.category == category)
    if region:
        q = q.filter(models.Sale.region == region)
    sales = q.order_by(models.Sale.date.desc()).all()

    if export:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Order ID", "Date", "Customer", "Product", "Category", "Region", "Quantity", "Price", "Revenue"])
        for s in sales:
            writer.writerow([
                s.order_id,
                s.date.strftime("%Y-%m-%d"),
                s.customer.name if s.customer else "",
                s.product.name if s.product else "",
                s.category, s.region,
                s.quantity, f"{s.price:.2f}",
                f"{s.quantity * s.price:.2f}",
            ])
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=sales_report.csv"},
        )

    data = [{
        "id": s.id, "order_id": s.order_id,
        "customer": s.customer.name if s.customer else "",
        "product": s.product.name if s.product else "",
        "category": s.category, "region": s.region,
        "quantity": s.quantity, "price": s.price,
        "revenue": round(s.quantity * s.price, 2),
        "date": s.date.isoformat(),
    } for s in sales]
    return {"success": True, "data": data, "total": len(data)}


@router.get("/products")
def products_report(
    export: bool = Query(False),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    products = db.query(models.Product).all()
    result = []
    for p in products:
        units = db.query(func.sum(models.Sale.quantity)).filter(models.Sale.product_id == p.id).scalar() or 0
        rev = db.query(func.sum(models.Sale.quantity * models.Sale.price)).filter(models.Sale.product_id == p.id).scalar() or 0
        status = "Out of Stock" if p.stock == 0 else ("Low Stock" if p.stock <= 10 else "Healthy")
        result.append({
            "id": p.id, "name": p.name, "category": p.category,
            "price": p.price, "stock": p.stock, "stock_status": status,
            "units_sold": int(units), "revenue": round(float(rev), 2),
        })

    if export:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "Name", "Category", "Price", "Stock", "Status", "Units Sold", "Revenue"])
        for r in result:
            writer.writerow([r["id"], r["name"], r["category"], f"{r['price']:.2f}",
                             r["stock"], r["stock_status"], r["units_sold"], f"{r['revenue']:.2f}"])
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=products_report.csv"},
        )

    return {"success": True, "data": result}


@router.get("/customers")
def customers_report(
    export: bool = Query(False),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    customers = db.query(models.Customer).all()
    result = []
    for c in customers:
        stats = db.query(
            func.count(func.distinct(models.Sale.order_id)).label("orders"),
            func.sum(models.Sale.quantity * models.Sale.price).label("spent"),
            func.max(models.Sale.date).label("last"),
        ).filter(models.Sale.customer_id == c.id).first()
        result.append({
            "id": c.id, "name": c.name, "email": c.email,
            "phone": c.phone or "", "location": c.location or "",
            "order_count": int(stats.orders or 0),
            "total_spent": round(float(stats.spent or 0), 2),
            "last_purchase": stats.last.strftime("%Y-%m-%d") if stats.last else "",
        })

    if export:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "Name", "Email", "Phone", "Location", "Orders", "Total Spent", "Last Purchase"])
        for r in result:
            writer.writerow([r["id"], r["name"], r["email"], r["phone"],
                             r["location"], r["order_count"], f"{r['total_spent']:.2f}", r["last_purchase"]])
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=customers_report.csv"},
        )

    return {"success": True, "data": result}
