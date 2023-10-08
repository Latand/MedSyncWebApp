from fastapi import Depends, APIRouter

from medsyncapp.infrastructure.database.repo.requests import RequestsRepo
from medsyncapp.webhook.utils import get_repo

slots_router = APIRouter(prefix="/slots")
working_hours_router = APIRouter(prefix="/working_hours")


@slots_router.get("/doctors/{doctor_id}/{location_id}/{month_number}")
async def get_available_slots(
    doctor_id: int,
    location_id: int,
    month_number: int,
    repo: RequestsRepo = Depends(get_repo),
):
    slots = await repo.doctors.get_booked_slots(doctor_id, location_id, month_number)
    if not slots:
        return []
    return slots


@slots_router.get("/diagnostics/{diagnostic_id}/{location_id}/{month_number}")
async def get_available_slots_diagnostic(
    diagnostic_id: int,
    location_id: int,
    month_number: int,
    repo: RequestsRepo = Depends(get_repo),
):
    slots = await repo.diagnostics.get_booked_slots(
        diagnostic_id, location_id, month_number
    )
    if not slots:
        return []
    return slots


@working_hours_router.get("/{location_id}")
async def get_working_hours(
    location_id: int,
    repo: RequestsRepo = Depends(get_repo),
):
    working_hours = await repo.slots.get_working_hours(location_id)
    if not working_hours:
        return []
    return working_hours
