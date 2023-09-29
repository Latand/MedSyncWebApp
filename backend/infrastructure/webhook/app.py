import logging

from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

from infrastructure.webhook.routers.diagnostics import diagnostics_router
from infrastructure.webhook.routers.doctors import doctor_router, specialties_router
from infrastructure.webhook.routers.slots import slots_router

app = FastAPI()
prefix_router = APIRouter(prefix="/api")

log_level = logging.INFO
log = logging.getLogger(__name__)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://medsync.botfather.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.getLogger(__name__).setLevel(logging.INFO)
logging.basicConfig(
    level=logging.INFO,
    format="%(filename)s:%(lineno)d #%(levelname)-8s [%(asctime)s] - %(name)s - %(message)s",
)


for router in [
    doctor_router,
    specialties_router,
    diagnostics_router,
    slots_router,
]:
    prefix_router.include_router(router)

app.include_router(prefix_router)
