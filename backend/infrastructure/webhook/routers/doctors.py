from typing import List

import sqlalchemy.exc
from fastapi import Depends, APIRouter, HTTPException
from starlette.requests import Request

from infrastructure.database.repo.requests import RequestsRepo
from infrastructure.webhook.models import (
    Specialty,
)
from infrastructure.webhook.utils import get_repo

doctor_router = APIRouter(prefix="/doctors")
specialties_router = APIRouter(prefix="/specialties")


@doctor_router.get("/{doctor_id}")
async def get_doctor(doctor_id: int, repo: RequestsRepo = Depends(get_repo)):
    result = await repo.doctors.get_doctor(doctor_id)

    if result is None:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return {
        **result,
    }


@doctor_router.get("/")
async def get_all_doctors(repo: RequestsRepo = Depends(get_repo)):
    doctors = await repo.doctors.get_all_doctors()
    return doctors


@specialties_router.get("/", response_model=List[Specialty])
async def get_specialties(repo: RequestsRepo = Depends(get_repo)):
    specialties = await repo.doctors.get_specialties()
    return specialties


@doctor_router.post("/book_slot")
async def book_doctor_slot_endpoint(
    request: Request, repo: RequestsRepo = Depends(get_repo)
):
    payload = await request.json()

    try:
        booking_id = await repo.doctors.book_slot(payload)
    except sqlalchemy.exc.IntegrityError as e:
        await repo.session.rollback()
        if "bookings_user_id_fkey" in str(e) and payload.get("user_id"):
            await repo.users.get_or_create_user(
                user_id=payload.get("user_id"),
                full_name=payload.get('user_name', '') + " " + payload.get('user_surname', ''),
            )
            booking_id = await repo.doctors.book_slot(payload)
        else:
            raise HTTPException(status_code=400, detail="Invalid payload") from e

    return {"status": "success", "booking_id": booking_id}
