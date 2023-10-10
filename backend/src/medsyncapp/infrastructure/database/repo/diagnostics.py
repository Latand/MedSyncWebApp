import datetime

from dateutil.parser import parse
from sqlalchemy import func
from sqlalchemy import select, insert

from medsyncapp.infrastructure.database.models import (
    Diagnostic,
    Booking,
    DiagnosticLocation,
    Location,
)
from medsyncapp.infrastructure.database.repo.base import BaseRepo


class DiagnosticRepo(BaseRepo):
    async def get_all_diagnostic_types(self):
        stmt = (
            select(
                Diagnostic.diagnostic_id,
                Diagnostic.type_name,
                Diagnostic.description,
                Diagnostic.price,
                Diagnostic.photo_url,
                func.count(DiagnosticLocation.diagnostic_id).label("clinics_count"),
            )
            .join(
                DiagnosticLocation,
                Diagnostic.diagnostic_id == DiagnosticLocation.diagnostic_id,
            )
            .group_by(Diagnostic.diagnostic_id)
            .order_by(Diagnostic.diagnostic_id)
        )
        result = await self.session.execute(stmt)
        return result.mappings().all()

    async def get_locations_by_type(self, diagnostic_id: int):
        stmt = (
            select(Location.location_id, Location.name, Location.address)
            .join(
                DiagnosticLocation,
                Location.location_id == DiagnosticLocation.location_id,
            )
            .where(DiagnosticLocation.diagnostic_id == diagnostic_id)
        )
        result = await self.session.execute(stmt)
        return result.mappings().all()

    async def book_slot(
        self,
        payload: dict,
        user_id: int = None,
    ):
        # Insert into Booking
        insert_stmt = (
            insert(Booking)
            .values(
                user_id=user_id,
                user_full_name=payload.get("user_name", "")
                + " "
                + payload.get("user_surname", ""),
                user_email=payload.get("user_email"),
                user_phone_number=payload.get("user_phone"),
                user_message=payload.get("user_message"),
                diagnostic_id=payload.get("diagnostic_id"),
                location_id=payload.get("location_id"),
                booking_time=parse(payload.get("booking_date_time")),
            )
            .returning(Booking.booking_id)
        )
        result = await self.session.scalar(insert_stmt)
        await self.session.commit()

        return result

    async def get_booked_slots(
        self, diagnostic_id: int, location_id: int, month_number: int
    ) -> list[Booking]:
        stmt = select(Booking.booking_time).where(
            Booking.diagnostic_id == diagnostic_id,
            Booking.booking_time >= datetime.date.today(),
            func.extract("month", Booking.booking_time) == month_number + 1,
            Booking.location_id == location_id,
        )
        result = await self.session.scalars(stmt)
        return result.all()
