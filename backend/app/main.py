
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .config import settings
from .database import engine

# Routers
from .routes.health import router as health_router
from .routes.auth import router as auth_router
from .routes.admin import router as admin_router
from .routes.quiz import router as quiz_router

# =========================
# APLICAÇÃO
# =========================

app = FastAPI(
    title="Chroma API",
    version="0.1.0"
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)


# =========================
# ROUTERS
# =========================

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(quiz_router)

# =========================
# TESTE DA BASE DE DADOS
# =========================

@app.get("/api/test-db")
def test_database():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT DATABASE()"))

        return {
            "status": "ok",
            "database": result.scalar()
        }
