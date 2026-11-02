from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
import io
from datetime import datetime
from app.database import get_db
from app import models, crud
from app.routes.auth import get_current_user

router = APIRouter()

REQUIRED_COLUMNS = {"order_id", "date", "customer", "product", "category", "quantity", "price", "region"}


@router.post("/sales")
async def import_sales(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")

    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

    # Normalize columns
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {', '.join(sorted(missing))}",
        )

    imported = 0
    skipped = 0
    errors = []

    for idx, row in df.iterrows():
        row_num = idx + 2  # 1-indexed + header
        try:
            # Validate required fields
            if pd.isna(row["order_id"]) or str(row["order_id"]).strip() == "":
                errors.append(f"Row {row_num}: Missing order_id")
                skipped += 1
                continue

            # Parse date
            try:
                sale_date = pd.to_datetime(row["date"]).to_pydatetime()
            except Exception:
                errors.append(f"Row {row_num}: Invalid date '{row['date']}'")
                skipped += 1
                continue

            # Validate numbers
            try:
                quantity = int(row["quantity"])
                price = float(row["price"])
                if quantity <= 0 or price <= 0:
                    raise ValueError
            except (ValueError, TypeError):
                errors.append(f"Row {row_num}: Invalid quantity or price")
                skipped += 1
                continue

            # Find or create customer
            customer_name = str(row["customer"]).strip()
            customer = db.query(models.Customer).filter(
                models.Customer.name == customer_name
            ).first()
            if not customer:
                customer = models.Customer(
                    name=customer_name,
                    email=f"{customer_name.lower().replace(' ', '.')}@imported.com",
                    location=str(row["region"]).strip(),
                )
                db.add(customer)
                db.flush()

            # Find or create product
            product_name = str(row["product"]).strip()
            product = db.query(models.Product).filter(
                models.Product.name == product_name
            ).first()
            if not product:
                product = models.Product(
                    name=product_name,
                    category=str(row["category"]).strip(),
                    price=price,
                    stock=50,
                )
                db.add(product)
                db.flush()

            # Create sale
            sale = models.Sale(
                order_id=str(row["order_id"]).strip(),
                customer_id=customer.id,
                product_id=product.id,
                date=sale_date,
                quantity=quantity,
                price=price,
                category=str(row["category"]).strip(),
                region=str(row["region"]).strip(),
            )
            db.add(sale)
            imported += 1

        except Exception as e:
            errors.append(f"Row {row_num}: Unexpected error - {str(e)}")
            skipped += 1
            continue

    db.commit()

    return {
        "success": True,
        "data": {
            "imported": imported,
            "skipped": skipped,
            "errors": errors[:20],  # cap error list
        },
        "message": f"Import complete: {imported} rows imported, {skipped} skipped.",
    }
