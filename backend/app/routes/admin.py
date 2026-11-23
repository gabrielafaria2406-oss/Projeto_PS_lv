
from fastapi import APIRouter, Depends

from ..dependencies import require_admin

router = APIRouter(
    prefix="/api/admin",
    tags=["Administração"]
)


@router.get("/dashboard")
def admin_dashboard(
    current_user: dict = Depends(require_admin)
):
    return {
        "message": "Acesso administrativo autorizado.",
        "user": current_user["name"],
        "role": current_user["role"]
    }
