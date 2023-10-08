from sqlalchemy import select

from medsyncapp.infrastructure.database.models import Booking, Doctor, Diagnostic, Location
from medsyncapp.infrastructure.database.repo.base import BaseRepo


class BookingsRepo(BaseRepo):
    async def get_booking(self, booking_id: int):
        query = (
            select(Booking, Doctor, Diagnostic, Location)
            .outerjoin(Doctor, Doctor.doctor_id == Booking.doctor_id)
            .outerjoin(Diagnostic, Diagnostic.diagnostic_id == Booking.diagnostic_id)
            .join(Location, Location.location_id == Booking.location_id)
            .where(Booking.booking_id == booking_id)
        )
        return (await self.session.execute(query)).first()


    async def get_user_bookings(self, user_id: int):
        query = (
            select(Booking, Doctor, Diagnostic, Location)
            .outerjoin(Doctor, Doctor.doctor_id == Booking.doctor_id)
            .outerjoin(Diagnostic, Diagnostic.diagnostic_id == Booking.diagnostic_id)
            .join(Location, Location.location_id == Booking.location_id)
            .where(Booking.user_id == user_id)
            .order_by(Booking.booking_time.desc())
        )
        return (await self.session.execute(query)).all()