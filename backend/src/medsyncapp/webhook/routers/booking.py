import json
import logging
from contextlib import suppress

import sqlalchemy.exc
from aiogram.utils.markdown import hbold, hcode
from fastapi import Depends, HTTPException
from starlette.requests import Request

from medsyncapp.infrastructure.database.repo.requests import RequestsRepo
from medsyncapp.webhook.utils import (
    get_repo,
    validate_telegram_data,
    bot,
    parse_init_data,
)
from .diagnostics import diagnostics_router
from .doctors import doctor_router


async def get_booking_notification_text(repo, booking_id):
    booking_info = await repo.bookings.get_booking(int(booking_id))

    booking_time = booking_info.Booking.booking_time.strftime("%d %B %Y, %H:%M UTC")

    appointment_type_text = (
        f"👨‍⚕️ Doctor: {hbold(booking_info.Doctor.full_name)}\n"
        if booking_info.Doctor
        else f"🔬 Diagnostic: {hbold(booking_info.Diagnostic.type_name)}\n"
    )

    return (
        f"🎉 Congratulations! Your booking is confirmed. 🎉\n\n"
        f"📋 Booking ID: {hcode(booking_id)}\n"
        f"{appointment_type_text}"
        f"📆 Date & Time: {hbold(booking_time)}\n\n"
        f"📍 Location: {hbold(booking_info.Location.name)}: {hbold(booking_info.Location.address)}\n\n"
        f"Thank you for choosing our service! If you have any questions or need to reschedule, feel free to reach out. 📞"
    )


async def book_slot_endpoint(
    payload: dict, item_type: str, repo: RequestsRepo, parsed_data: dict = None
):
    book_repo = repo.doctors if item_type == "doctor" else repo.diagnostics

    user_info = parsed_data.get('user')
    if user_info:
        user_id = json.loads(user_info).get('id')
    else:
        user_id = None

    try:
        booking_id = await book_repo.book_slot(
            payload, user_id=user_id
        )
    except sqlalchemy.exc.IntegrityError as e:
        await repo.session.rollback()
        if "bookings_user_id_fkey" in str(e) and payload.get("user_id"):
            await repo.users.get_or_create_user(
                user_id=payload.get("user_id"),
                full_name=payload.get("user_name", "")
                + " "
                + payload.get("user_surname", ""),
            )
            booking_id = await book_repo.book_slot(payload, user_id=parsed_data.get("user_id"))
        else:
            raise HTTPException(status_code=400, detail="Invalid payload") from e

    return {"status": "success", "booking_id": booking_id}


@doctor_router.post("/book_slot")
async def book_slot(request: Request, repo: RequestsRepo = Depends(get_repo)):
    data = await request.json()

    init_data = data.get("userInitData")
    if init_data and not validate_telegram_data(init_data):
        raise HTTPException(status_code=400, detail="Invalid initData")
    parsed_data = parse_init_data(init_data)
    result = await book_slot_endpoint(data, "doctor", repo, parsed_data)

    if init_data:
        user_info = parsed_data.get("user")
        if user_info:
            user_id = json.loads(user_info).get("id")
            with suppress():
                notification = await get_booking_notification_text(
                    repo, result["booking_id"]
                )
                await bot.send_message(
                    chat_id=user_id,
                    text=notification,
                    parse_mode="HTML",
                )

    return result


@diagnostics_router.post("/book_slot")
async def book_slot(request: Request, repo: RequestsRepo = Depends(get_repo)):
    data = await request.json()

    init_data = data.get("userInitData")
    if init_data and not validate_telegram_data(init_data):
        raise HTTPException(status_code=400, detail="Invalid initData")

    parsed_data = parse_init_data(init_data)
    result = await book_slot_endpoint(data, "diagnostic", repo, parsed_data)
    # This is just for test purposes, we will create a diagnostic result here straightaway
    await repo.results.create_result(
        result["booking_id"], diagnostic_id=data["diagnostic_id"]
    )

    if init_data:
        user_info = parsed_data.get("user")
        if user_info:
            user_id = json.loads(user_info).get("id")
            with suppress():
                notification = await get_booking_notification_text(
                    repo, result["booking_id"]
                )
                await bot.send_message(
                    chat_id=user_id,
                    text=notification,
                    parse_mode="HTML",
                )

    return result
