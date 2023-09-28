from datetime import datetime

from sqlalchemy import cast, Date, false
from sqlalchemy import select, insert, update

from infrastructure.database.models import (
    Diagnostic,
    DiagnosticSlot,
    Slot,
    Booking,
    DiagnosticLocation,
    Location,
)
from infrastructure.database.repo.base import BaseRepo


class DiagnosticRepo(BaseRepo):
    async def get_all_diagnostic_types(self):
        stmt = select(Diagnostic)
        result = await self.session.scalars(stmt)
        return result.all()

    async def get_locations_by_type(self, diagnostic_id: int):
        stmt = (
            select(DiagnosticLocation, Location)
            .join(Location)
            .where(DiagnosticLocation.diagnostic_id == diagnostic_id)
        )
        result = await self.session.scalars(stmt)
        return result.all()

    async def get_available_slots(
        self, diagnostic_location_id: int, selected_date: datetime.date
    ):
        stmt = (
            select(Slot, DiagnosticSlot)
            .join(DiagnosticSlot, DiagnosticSlot.slot_id == Slot.slot_id)
            .where(
                DiagnosticSlot.diagnostic_location_id == diagnostic_location_id,
                DiagnosticSlot.is_booked == false(),
                cast(Slot.start_time, Date) == selected_date,
            )
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def book_slot(
        self,
        diagnostic_slot_id: int,
        user_full_name: str,
        user_email: str,
        user_phone_number: str,
    ):
        # Insert into Booking
        insert_stmt = (
            insert(Booking)
            .values(
                diagnostic_slot_id=diagnostic_slot_id,
                user_full_name=user_full_name,
                user_email=user_email,
                user_phone_number=user_phone_number,
            )
            .returning(Booking)
        )
        await self.session.execute(insert_stmt)

        # Update the DiagnosticSlot to indicate it is booked
        update_stmt = (
            update(DiagnosticSlot)
            .where(DiagnosticSlot.diagnostic_slot_id == diagnostic_slot_id)
            .values(is_booked=True)
        )
        await self.session.execute(update_stmt)
        await self.session.commit()
