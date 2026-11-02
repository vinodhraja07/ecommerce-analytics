from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud
from app.routes.auth import get_current_user

router = APIRouter()


@router.get("")
def get_settings(db: Session = Depends(get_db), _=Depends(get_current_user)):
    keys = ["revenue_goal", "store_name", "currency"]
    data = {}
    for key in keys:
        s = crud.get_setting(db, key)
        data[key] = s.value if s else None
    return {"success": True, "data": data}


@router.put("/{key}")
def update_setting(key: str, body: dict, db: Session = Depends(get_db), _=Depends(get_current_user)):
    value = body.get("value", "")
    s = crud.upsert_setting(db, key, str(value))
    return {"success": True, "data": {"key": s.key, "value": s.value}}
