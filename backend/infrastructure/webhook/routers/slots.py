from datetime import datetime
from typing import List

from fastapi import Depends, APIRouter, HTTPException

from infrastructure.database.repo.requests import RequestsRepo
from infrastructure.webhook.models import Slot
from infrastructure.webhook.utils import get_repo

slots_router = APIRouter(prefix="/slots")


@slots_router.get("/slots/{doctor_id}/{selected_date}", response_model=List[Slot])
async def get_available_slots(
    doctor_id: int, selected_date: str, repo: RequestsRepo = Depends(get_repo)
):
    selected_date = datetime.strptime(selected_date, "%Y-%m-%d").date()
    slots = await repo.doctors.get_available_slots(doctor_id, selected_date)
    if not slots:
        raise HTTPException(status_code=404, detail="Slots not found")
    return slots
