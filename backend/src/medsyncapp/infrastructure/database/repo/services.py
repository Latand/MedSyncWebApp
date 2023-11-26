import datetime

from dateutil.parser import parse
from sqlalchemy import func
from sqlalchemy import select, insert

from medsyncapp.infrastructure.database.models import (
    Service,
    Booking,
    ServiceLocation,
    Location,
)
from medsyncapp.infrastructure.database.repo.base import BaseRepo


class ServiceRepo(BaseRepo):
    async def get_all_diagnostic_types(self):
        stmt = (
            select(
                Service.service_id,
                Service.service_name,
                Service.description,
                Service.price,
                Service.photo_url,
                func.count(ServiceLocation.service_id).label("clinics_count"),
            )
            .join(
                ServiceLocation,
                Service.service_id == ServiceLocation.service_id,
            )
            .group_by(Service.service_id)
            .order_by(Service.service_id)
        )
        result = await self.session.execute(stmt)
        return result.mappings().all()

    async def get_locations_by_type(self, diagnostic_id: int):
        stmt = (
            select(Location.location_id, Location.name, Location.address)
            .join(
                ServiceLocation,
                Location.location_id == ServiceLocation.location_id,
            )
            .where(ServiceLocation.service_id == diagnostic_id)
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
                service_id=payload.get("diagnostic_id"),
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
            Booking.service_id == diagnostic_id,
            Booking.booking_time >= datetime.date.today(),
            func.extract("month", Booking.booking_time) == month_number + 1,
            Booking.location_id == location_id,
        )
        result = await self.session.scalars(stmt)
        return result.all()
