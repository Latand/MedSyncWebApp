import sqlalchemy.exc
from fastapi import Depends, HTTPException
from starlette.requests import Request

from infrastructure.database.repo.requests import RequestsRepo
from infrastructure.webhook.utils import get_repo
from .diagnostics import diagnostics_router
from .doctors import doctor_router


async def book_slot_endpoint(
    request: Request, item_type:str, repo: RequestsRepo = Depends(get_repo)
):
    payload = await request.json()
    book_repo = repo.doctors if item_type == "doctor" else repo.diagnostics
    try:
        booking_id = await book_repo.book_slot(payload)
    except sqlalchemy.exc.IntegrityError as e:
        await repo.session.rollback()
        if "bookings_user_id_fkey" in str(e) and payload.get("user_id"):
            await repo.users.get_or_create_user(
                user_id=payload.get("user_id"),
                full_name=payload.get('user_name', '') + " " + payload.get('user_surname', ''),
            )
            booking_id = await book_repo.book_slot(payload)
        else:
            raise HTTPException(status_code=400, detail="Invalid payload") from e

    return {"status": "success", "booking_id": booking_id}



@doctor_router.post("/book_slot")
@diagnostics_router.post("/book_slot")
async def book_slot(request: Request, repo: RequestsRepo = Depends(get_repo)):
    return await book_slot_endpoint(request, "doctor", repo)