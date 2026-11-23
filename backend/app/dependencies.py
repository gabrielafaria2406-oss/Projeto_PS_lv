
from fastapi import Depends, HTTPException, status

from .security import get_current_user


def require_admin(
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Não tens permissões para aceder a esta funcionalidade."
        )

    return current_user
