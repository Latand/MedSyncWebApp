from sqlalchemy import select

from medsyncapp.infrastructure.database.models import Booking, Specialist, Service, Location
from medsyncapp.infrastructure.database.repo.base import BaseRepo


class BookingsRepo(BaseRepo):
    async def get_booking(self, booking_id: int):
        query = (
            select(Booking, Specialist, Service, Location)
            .outerjoin(Specialist, Specialist.specialist_id == Booking.specialist_id)
            .outerjoin(Service, Service.service_id == Booking.service_id)
            .join(Location, Location.location_id == Booking.location_id)
            .where(Booking.booking_id == booking_id)
        )
        return (await self.session.execute(query)).first()

    async def get_user_bookings(self, user_id: int):
        query = (
            select(Booking, Specialist, Service, Location)
            .outerjoin(Specialist, Specialist.specialist_id == Booking.specialist_id)
            .outerjoin(Service, Service.service_id == Booking.service_id)
            .join(Location, Location.location_id == Booking.location_id)
            .where(Booking.user_id == user_id)
            .order_by(Booking.booking_time.desc())
        )
        return (await self.session.execute(query)).all()
