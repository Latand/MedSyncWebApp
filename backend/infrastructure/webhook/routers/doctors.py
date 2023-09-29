from typing import List

from fastapi import Depends, APIRouter, HTTPException

from infrastructure.database.repo.requests import RequestsRepo
from infrastructure.webhook.models import (
    Doctor,
    DoctorBookingPayload,
    Booking,
    Specialty,
)
from infrastructure.webhook.utils import get_repo

doctor_router = APIRouter(prefix="/doctors")
specialties_router = APIRouter(prefix="/specialties")


@doctor_router.get("/", response_model=List[Doctor])
async def get_all_doctors(repo: RequestsRepo = Depends(get_repo)):
    doctors = await repo.doctors.get_all_doctors()
    return doctors


@specialties_router.get("/", response_model=List[Specialty])
async def get_specialties(repo: RequestsRepo = Depends(get_repo)):
    specialties = await repo.doctors.get_specialties()
    return specialties


@doctor_router.post("/book_slot", response_model=Booking)
async def book_doctor_slot_endpoint(
    payload: DoctorBookingPayload, repo: RequestsRepo = Depends(get_repo)
):
    try:
        await repo.doctors.book_slot(
            payload.doctor_slot_id,
            payload.user_full_name,
            payload.user_email,
            payload.user_phone_number,
        )
        return {
            "doctor_slot_id": payload.doctor_slot_id,
            "user_full_name": payload.user_full_name,
            "user_email": payload.user_email,
            "user_phone_number": payload.user_phone_number,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
