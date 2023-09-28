import logging
from datetime import datetime
from typing import List

import betterlogging as bl
from aiogram import Bot
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

from infrastructure.database.repo.requests import RequestsRepo
from infrastructure.database.setup import create_session_pool, create_engine
from infrastructure.webhook.models import Doctor, Slot, Diagnostic, Booking
from tgbot.config import load_config, Config

app = FastAPI()
log_level = logging.INFO
bl.basic_colorized_config(level=log_level)
log = logging.getLogger(__name__)

config: Config = load_config()
engine = create_engine(config.db)
session_pool = create_session_pool(engine)
bot = Bot(token=config.tg_bot.token)

app.add_middleware(
    CORSMiddleware,
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


async def get_repo():
    async with session_pool() as session:
        yield RequestsRepo(session)


@app.get("/doctors", response_model=List[Doctor])
async def get_all_doctors(repo: RequestsRepo = Depends(get_repo)):
    doctors = await repo.doctors.get_all_doctors()
    return doctors


@app.get("/diagnostics", response_model=List[Diagnostic])
async def get_all_diagnostics(repo: RequestsRepo = Depends(get_repo)):
    diagnostics = await repo.diagnostics.get_all_diagnostic_types()
    return diagnostics


@app.get("/diagnostics/{diagnostic_id}/locations", response_model=List[Diagnostic])
async def get_locations_by_type(
        diagnostic_id: int, repo: RequestsRepo = Depends(get_repo)
):
    locations = await repo.diagnostics.get_locations_by_type(diagnostic_id)
    if not locations:
        raise HTTPException(status_code=404, detail="Locations not found")
    return locations


@app.get("/slots/{doctor_id}/{selected_date}", response_model=List[Slot])
async def get_available_slots(
        doctor_id: int, selected_date: str, repo: RequestsRepo = Depends(get_repo)
):
    selected_date = datetime.strptime(selected_date, "%Y-%m-%d").date()
    slots = await repo.doctors.get_available_slots(doctor_id, selected_date)
    if not slots:
        raise HTTPException(status_code=404, detail="Slots not found")
    return slots


class DoctorBookingPayload(BaseModel):
    doctor_slot_id: int
    user_full_name: str
    user_email: str
    user_phone_number: str


@app.post("/doctors/book_slot/", response_model=Booking)
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
