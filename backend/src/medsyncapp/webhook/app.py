import logging

from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

from medsyncapp.webhook import routers

app = FastAPI()
prefix_router = APIRouter(prefix="/api")

log_level = logging.INFO
log = logging.getLogger(__name__)


app.add_middleware(
    CORSMiddleware,
    # allow_origins=["https://medsync.botfather.dev"],
    allow_origins=["*"],
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
    routers.doctors.doctor_router,
    routers.diagnostics.diagnostics_router,
    routers.slots.slots_router,
    routers.slots.working_hours_router,
    routers.locations.locations_router,
    routers.doctors.specialties_router,
]:
    prefix_router.include_router(router)

app.include_router(prefix_router)
