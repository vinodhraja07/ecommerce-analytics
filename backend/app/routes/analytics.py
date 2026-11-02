from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services import analytics_service
from app.routes.auth import get_current_user

router = APIRouter()


@router.get("/revenue")
def revenue(period: str = Query("30d"), db: Session = Depends(get_db), _=Depends(get_current_user)):
    data = analytics_service.get_revenue_trend(db, period)
    return {"success": True, "data": data}


@router.get("/categories")
def categories(period: str = Query("30d"), db: Session = Depends(get_db), _=Depends(get_current_user)):
    data = analytics_service.get_category_revenue(db, period)
    return {"success": True, "data": data}


@router.get("/products")
def products(period: str = Query("30d"), db: Session = Depends(get_db), _=Depends(get_current_user)):
    data = analytics_service.get_product_analytics(db, period)
    return {"success": True, "data": data}


@router.get("/regions")
def regions(period: str = Query("30d"), db: Session = Depends(get_db), _=Depends(get_current_user)):
    data = analytics_service.get_regional_data(db, period)
    return {"success": True, "data": data}


@router.get("/customers")
def customers(period: str = Query("30d"), db: Session = Depends(get_db), _=Depends(get_current_user)):
    data = analytics_service.get_customer_spending(db, period)
    return {"success": True, "data": data}
