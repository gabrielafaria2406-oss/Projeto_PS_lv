
import os
import uuid
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import text
from sqlalchemy.orm import Session

from .database import get_db

from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60

bearer_scheme = HTTPBearer()


# Criar token JWT
def create_access_token(user_id: int):
    if not SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY não configurada")

    expiration = datetime.now(timezone.utc) + timedelta(
        minutes=TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": expiration,
        "jti": str(uuid.uuid4())
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# Validar token e verificar revogação
def decode_access_token(token: str, db: Session):
    if not SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY não configurada")

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = int(payload["sub"])
        token_jti = payload["jti"]

    except (jwt.PyJWTError, ValueError, KeyError, TypeError):
        raise HTTPException(
            status_code=401,
            detail="Token inválido ou expirado"
        )

    revoked = db.execute(
        text("""
            SELECT id FROM revoked_tokens
            WHERE token_jti = :jti
        """),
        {"jti": token_jti}
    ).first()

    if revoked:
        raise HTTPException(
            status_code=401,
            detail="Sessão terminada. Faça login novamente."
        )

    return payload, user_id


# Obter utilizador autenticado
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    payload, user_id = decode_access_token(
        credentials.credentials, db
    )

    user = db.execute(
       text("""
    SELECT id, name, email, role
    FROM users
    WHERE id = :id
"""),
        {"id": user_id}
    ).mappings().first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Utilizador não encontrado"
        )

    return dict(user)


# Invalidar token no logout
def revoke_access_token(token: str, db: Session):
    payload, user_id = decode_access_token(token, db)

    token_expiration = datetime.fromtimestamp(
        payload["exp"],
        timezone.utc
    ).replace(tzinfo=None)

    db.execute(
        text("""
            INSERT INTO revoked_tokens (token_jti, expires_at)
            VALUES (:jti, :expires_at)
        """),
        {
            "jti": payload["jti"],
            "expires_at": token_expiration
        }
    )

    db.commit()

    return True
