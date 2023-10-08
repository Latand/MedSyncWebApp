import sqlalchemy.exc
from fastapi import Depends, HTTPException
from starlette.requests import Request

from medsyncapp.infrastructure.database.repo.requests import RequestsRepo
from medsyncapp.webhook.utils import get_repo, validate_telegram_data
from .diagnostics import diagnostics_router
from .doctors import doctor_router


async def book_slot_endpoint(
    payload: dict, item_type: str, repo: RequestsRepo = Depends(get_repo)
):
    book_repo = repo.doctors if item_type == "doctor" else repo.diagnostics
    try:
        booking_id = await book_repo.book_slot(payload)
    except sqlalchemy.exc.IntegrityError as e:
        await repo.session.rollback()
        if "bookings_user_id_fkey" in str(e) and payload.get("user_id"):
            await repo.users.get_or_create_user(
                user_id=payload.get("user_id"),
                full_name=payload.get("user_name", "")
                + " "
                + payload.get("user_surname", ""),
            )
            booking_id = await book_repo.book_slot(payload)
        else:
            raise HTTPException(status_code=400, detail="Invalid payload") from e

    return {"status": "success", "booking_id": booking_id}


@doctor_router.post("/book_slot")
async def book_slot(request: Request, repo: RequestsRepo = Depends(get_repo)):
    data = await request.json()

    init_data = data.get("initData")
    if init_data and not validate_telegram_data(init_data):
        raise HTTPException(status_code=400, detail="Invalid initData")
    return await book_slot_endpoint(data, "doctor", repo)


@diagnostics_router.post("/book_slot")
async def book_slot(request: Request, repo: RequestsRepo = Depends(get_repo)):
    data = await request.json()

    init_data = data.get("initData")
    if init_data and not validate_telegram_data(init_data):
        raise HTTPException(status_code=400, detail="Invalid initData")

    result = await book_slot_endpoint(data, "diagnostic", repo)
    # This is just for test purposes, we will create a diagnostic result here straightaway
    await repo.results.create_result(
        result["booking_id"], diagnostic_id=data["diagnostic_id"]
    )
    return result
