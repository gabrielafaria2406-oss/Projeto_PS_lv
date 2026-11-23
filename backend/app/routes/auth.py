
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from pwdlib import PasswordHash

from ..database import get_db
from ..security import (
    create_access_token,
    get_current_user,
    bearer_scheme,
    revoke_access_token
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Autenticação"]
)

password_hash = PasswordHash.recommended()


# =========================
# MODELOS
# =========================

class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# =========================
# REGISTO
# =========================

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: RegisterRequest, db: Session = Depends(get_db)):

    existing = db.execute(
        text("SELECT id FROM users WHERE email = :email"),
        {"email": str(user.email)}
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Este email já está registado."
        )

    hashed_password = password_hash.hash(user.password)

    try:
        result = db.execute(
            text("""
                INSERT INTO users (name, email, password_hash)
                VALUES (:name, :email, :password_hash)
            """),
            {
                "name": user.name,
                "email": str(user.email),
                "password_hash": hashed_password
            }
        )

        db.commit()

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Este email já está registado."
        )

    return {
        "message": "Utilizador registado com sucesso.",
        "user_id": result.lastrowid,
        "name": user.name,
        "email": str(user.email),
        "role": "user"
    }


# =========================
# LOGIN
# =========================

@router.post("/login")
def login(user: LoginRequest, db: Session = Depends(get_db)):

    result = db.execute(
        text("""
            SELECT id, name, email, password_hash, role
            FROM users
            WHERE email = :email
        """),
        {"email": str(user.email)}
    ).mappings().first()

    if not result or not password_hash.verify(
        user.password, result["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Email ou password incorretos."
        )

    token = create_access_token(result["id"])

    return {
        "message": "Login efetuado com sucesso.",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": result["id"],
            "name": result["name"],
            "email": result["email"],
            "role": result["role"]
        }
    }


# =========================
# UTILIZADOR AUTENTICADO
# =========================

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user


# =========================
# LOGOUT
# =========================

@router.post("/logout")
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):

    revoke_access_token(credentials.credentials, db)

    return {
        "message": "Logout efetuado com sucesso."
    }
