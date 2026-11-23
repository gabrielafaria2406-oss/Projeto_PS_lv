from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Estado"])


@router.get("/health")
def health():
    return {"status": "ok", "service": "Chroma API"}
