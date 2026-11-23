
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from ..database import get_db

router = APIRouter(prefix="/api", tags=["Database"])

@router.get("/database-test")
def database_test(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT DATABASE()")).scalar()
        return {
            "status": "ok",
            "database": result
        }
    except SQLAlchemyError:
        raise HTTPException(
            status_code=503,
            detail="Não foi possível ligar à base de dados"
        )
