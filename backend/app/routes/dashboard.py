from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services import analytics_service, insight_service
from app.routes.auth import get_current_user

router = APIRouter()


@router.get("/kpis")
def kpis(period: str = Query("30d"), db: Session = Depends(get_db), _=Depends(get_current_user)):
    data = analytics_service.get_kpis(db, period)
    return {"success": True, "data": data}


@router.get("/revenue")
def revenue(period: str = Query("30d"), db: Session = Depends(get_db), _=Depends(get_current_user)):
    data = analytics_service.get_revenue_trend(db, period)
    return {"success": True, "data": data}


@router.get("/categories")
def categories(period: str = Query("30d"), db: Session = Depends(get_db), _=Depends(get_current_user)):
    data = analytics_service.get_category_revenue(db, period)
    return {"success": True, "data": data}


@router.get("/top-products")
def top_products(period: str = Query("30d"), limit: int = Query(10), db: Session = Depends(get_db), _=Depends(get_current_user)):
    data = analytics_service.get_top_products(db, period, limit)
    return {"success": True, "data": data}


@router.get("/recent-orders")
def recent_orders(limit: int = Query(10), db: Session = Depends(get_db), _=Depends(get_current_user)):
    data = analytics_service.get_recent_orders(db, limit)
    return {"success": True, "data": data}


@router.get("/insights")
def insights(period: str = Query("30d"), db: Session = Depends(get_db), _=Depends(get_current_user)):
    data = insight_service.generate_insights(db, period)
    return {"success": True, "data": data}


@router.get("/inventory-alerts")
def inventory_alerts(db: Session = Depends(get_db), _=Depends(get_current_user)):
    data = analytics_service.get_inventory_alerts(db)
    return {"success": True, "data": data}
