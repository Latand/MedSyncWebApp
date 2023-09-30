from datetime import datetime

from sqlalchemy import cast, Date, false
from sqlalchemy import select, insert, update

from infrastructure.database.models import (
    Diagnostic,
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
