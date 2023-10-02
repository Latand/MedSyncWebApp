from sqlalchemy import func
from sqlalchemy import select, insert

from infrastructure.database.models import (
    Diagnostic,
    Booking,
    DiagnosticLocation,
    Location,
)
from infrastructure.database.repo.base import BaseRepo


class DiagnosticRepo(BaseRepo):
    async def get_all_diagnostic_types(self):
        stmt = select(
            Diagnostic.diagnostic_id,
            Diagnostic.type_name,
            Diagnostic.description,
            Diagnostic.price,
            Diagnostic.photo_url,
            func.count(DiagnosticLocation.diagnostic_id).label("clinics_count"),
        ).join(
            DiagnosticLocation, Diagnostic.diagnostic_id == DiagnosticLocation.diagnostic_id
        ).group_by(
            Diagnostic.diagnostic_id
        ).order_by(Diagnostic.diagnostic_id)
        result = await self.session.execute(stmt)
        return result.mappings().all()

    async def get_locations_by_type(self, diagnostic_id: int):
        stmt = (
            select(Location.location_id, Location.name, Location.address)
            .join(DiagnosticLocation, Location.location_id == DiagnosticLocation.location_id)
            .where(DiagnosticLocation.diagnostic_id == diagnostic_id)
        )
        result = await self.session.execute(stmt)
        return result.mappings().all()

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
