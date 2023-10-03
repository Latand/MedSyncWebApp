"""Import all routers and add them to routers_list."""
from .bookings import profile_router
from .start import start_router
from .test_results import test_results_router
from .web_app import web_app_router

routers_list = [
    start_router,
    profile_router,
    test_results_router,
    web_app_router,
]

__all__ = [
    "routers_list",
]
