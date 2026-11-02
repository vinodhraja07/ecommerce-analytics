from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app import models
from app.services.analytics_service import _date_range, _prev_range


def generate_insights(db: Session, period: str = "30d"):
    insights = []
    start, end = _date_range(period)
    prev_start, prev_end = _prev_range(start, end)

    # ── Revenue comparison ────────────────────────────────────────────────────
    def period_revenue(s, e):
        r = db.query(func.sum(models.Sale.quantity * models.Sale.price)).filter(
            models.Sale.date >= s, models.Sale.date <= e
        ).scalar()
        return float(r or 0)

    curr_rev = period_revenue(start, end)
    prev_rev = period_revenue(prev_start, prev_end)

    if prev_rev > 0:
        change = (curr_rev - prev_rev) / prev_rev * 100
        if change > 0:
            insights.append({
                "type": "positive",
                "icon": "TrendingUp",
                "title": "Revenue Growing",
                "description": f"Revenue increased {change:.1f}% compared to the previous period.",
            })
        elif change < -5:
            insights.append({
                "type": "warning",
                "icon": "TrendingDown",
                "title": "Revenue Declined",
                "description": f"Revenue decreased {abs(change):.1f}% compared to the previous period.",
            })
        else:
            insights.append({
                "type": "neutral",
                "icon": "Minus",
                "title": "Revenue Stable",
                "description": f"Revenue is stable with a {change:.1f}% change vs previous period.",
            })

    # ── Best category ─────────────────────────────────────────────────────────
    best_cat = db.query(
        models.Sale.category,
        func.sum(models.Sale.quantity * models.Sale.price).label("rev"),
    ).filter(models.Sale.date >= start, models.Sale.date <= end
    ).group_by(models.Sale.category
    ).order_by(func.sum(models.Sale.quantity * models.Sale.price).desc()
    ).first()

    if best_cat:
        insights.append({
            "type": "positive",
            "icon": "Star",
            "title": "Top Category",
            "description": f"{best_cat.category} generated the highest revenue this period.",
        })

    # ── Best selling product ──────────────────────────────────────────────────
    best_prod = db.query(
        models.Product.name,
        func.sum(models.Sale.quantity).label("units"),
    ).join(models.Sale, models.Sale.product_id == models.Product.id
    ).filter(models.Sale.date >= start, models.Sale.date <= end
    ).group_by(models.Product.id
    ).order_by(func.sum(models.Sale.quantity).desc()
    ).first()

    if best_prod:
        insights.append({
            "type": "positive",
            "icon": "Package",
            "title": "Best Seller",
            "description": f'"{best_prod.name}" is the top-selling product with {best_prod.units:,} units sold.',
        })

    # ── Low stock alert ───────────────────────────────────────────────────────
    low_stock_count = db.query(func.count(models.Product.id)).filter(
        models.Product.stock > 0, models.Product.stock <= 10
    ).scalar() or 0
    out_of_stock_count = db.query(func.count(models.Product.id)).filter(
        models.Product.stock == 0
    ).scalar() or 0

    if out_of_stock_count > 0:
        insights.append({
            "type": "warning",
            "icon": "AlertTriangle",
            "title": "Out of Stock",
            "description": f"{out_of_stock_count} product(s) are out of stock and need restocking.",
        })
    if low_stock_count > 0:
        insights.append({
            "type": "warning",
            "icon": "AlertCircle",
            "title": "Low Inventory",
            "description": f"{low_stock_count} product(s) are running low (≤10 units remaining).",
        })

    # ── Best region ───────────────────────────────────────────────────────────
    best_region = db.query(
        models.Sale.region,
        func.sum(models.Sale.quantity * models.Sale.price).label("rev"),
    ).filter(models.Sale.date >= start, models.Sale.date <= end
    ).group_by(models.Sale.region
    ).order_by(func.sum(models.Sale.quantity * models.Sale.price).desc()
    ).first()

    if best_region:
        insights.append({
            "type": "neutral",
            "icon": "MapPin",
            "title": "Top Region",
            "description": f"{best_region.region} is the highest-performing region this period.",
        })

    # ── Best day of week ──────────────────────────────────────────────────────
    sales_rows = db.query(models.Sale).filter(
        models.Sale.date >= start, models.Sale.date <= end
    ).all()

    if len(sales_rows) >= 14:
        import pandas as pd
        df = pd.DataFrame([{"date": s.date, "revenue": s.quantity * s.price} for s in sales_rows])
        df["weekday"] = pd.to_datetime(df["date"]).dt.day_name()
        best_day = df.groupby("weekday")["revenue"].sum().idxmax()
        insights.append({
            "type": "neutral",
            "icon": "Calendar",
            "title": "Peak Sales Day",
            "description": f"{best_day} consistently generates the highest sales volume.",
        })

    # ── AOV trend ─────────────────────────────────────────────────────────────
    curr_orders = db.query(func.count(func.distinct(models.Sale.order_id))).filter(
        models.Sale.date >= start, models.Sale.date <= end
    ).scalar() or 0
    prev_orders = db.query(func.count(func.distinct(models.Sale.order_id))).filter(
        models.Sale.date >= prev_start, models.Sale.date <= prev_end
    ).scalar() or 0

    curr_aov = curr_rev / curr_orders if curr_orders > 0 else 0
    prev_aov_val = prev_rev / prev_orders if prev_orders > 0 else 0

    if prev_aov_val > 0 and curr_aov > 0:
        aov_change = (curr_aov - prev_aov_val) / prev_aov_val * 100
        if aov_change > 5:
            insights.append({
                "type": "positive",
                "icon": "DollarSign",
                "title": "Higher Order Value",
                "description": f"Average order value increased {aov_change:.1f}% to ₹{curr_aov:,.0f}.",
            })

    return insights[:8]  # max 8 insights
