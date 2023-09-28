"""Import all routers and add them to routers_list."""
from .echo import echo_router

routers_list = [
    echo_router,  # echo_router must be last
]

__all__ = [
    "routers_list",
]
