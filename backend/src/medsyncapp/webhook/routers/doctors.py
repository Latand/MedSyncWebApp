from fastapi import Depends, APIRouter, HTTPException

from medsyncapp.infrastructure.database.repo.requests import RequestsRepo
from medsyncapp.webhook.utils import get_repo

doctor_router = APIRouter(prefix="/doctors")
specialties_router = APIRouter(prefix="/specialties")


@doctor_router.get("/{doctor_id}")
async def get_doctor(doctor_id: int, repo: RequestsRepo = Depends(get_repo)):
    result = await repo.doctors.get_doctor(doctor_id)

    if result is None:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return result


@doctor_router.get("/")
async def get_all_doctors(repo: RequestsRepo = Depends(get_repo)):
    doctors = await repo.doctors.get_all_doctors()
    return doctors


@specialties_router.get("/")
async def get_specialties(repo: RequestsRepo = Depends(get_repo)):
    specialties = await repo.doctors.get_specialties()
    return specialties
