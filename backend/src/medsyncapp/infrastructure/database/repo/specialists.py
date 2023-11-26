import datetime

from dateutil.parser import parse
from sqlalchemy import select, insert, func

from medsyncapp.infrastructure.database.models import (
    Specialist,
    Booking,
    SpecialistRating,
    Location,
)
from medsyncapp.infrastructure.database.models.specialists import Specialty
from medsyncapp.infrastructure.database.repo.base import BaseRepo


class SpecialistRepo(BaseRepo):
    async def get_all_doctors(self) -> list[Specialist]:
        stmt = (
            select(
                Specialist.specialist_id,
                Specialist.location_id,
                Specialist.full_name,
                Specialty.specialty_name,
                Specialty.specialty_id,
                Specialist.price,
                Specialist.photo_url,
                Location.name.label("location_name"),
                Location.address.label("location_address"),
                func.coalesce(func.avg(SpecialistRating.rating), 0).label("avg_rating"),
                func.coalesce(func.count(SpecialistRating.rating_id), 0).label("reviews"),
            )
            .join(Location, Location.location_id == Specialist.location_id)
            .join(Specialty, Specialty.specialty_id == Specialist.specialty_id)
            .outerjoin(SpecialistRating, SpecialistRating.specialist_id == Specialist.specialist_id)
            .group_by(Specialist.specialist_id, Location.location_id, Specialty.specialty_id)
        )

        result = await self.session.execute(stmt)
        result = result.mappings().all()
        return result

    async def get_specialties(self) -> list[Specialty]:
        stmt = (
            select(Specialty.specialty_id, Specialty.specialty_name)
            .join(Specialist)
            .order_by(Specialty.specialty_name)
            .group_by(Specialty.specialty_id)
        )
        result = await self.session.execute(stmt)
        return result.mappings().all()

    async def book_slot(self, payload: dict, user_id=None):
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
                specialist_id=payload.get("doctor_id"),
                location_id=payload.get("location_id"),
                booking_time=parse(payload.get("booking_date_time")),
            )
            .returning(Booking.booking_id)
        )
        result = await self.session.scalar(insert_stmt)
        await self.session.commit()
        return result

    async def get_doctor(self, doctor_id: int) -> Specialist:
        stmt = (
            select(
                Specialist.specialist_id,
                Specialist.location_id,
                Specialist.full_name,
                Specialty.specialty_name,
                Specialty.specialty_id,
                Specialist.price,
                Specialist.photo_url,
                Location.address.label("location_address"),
                Specialist.experience,
                Specialist.certificates,
                Location.name.label("location_name"),
                func.coalesce(func.avg(SpecialistRating.rating), 0).label("avg_rating"),
                func.coalesce(func.count(SpecialistRating.rating_id), 0).label("reviews"),
                Specialist.services, # TO DO
            )
            .join(Location, Location.location_id == Specialist.location_id)
            .outerjoin(SpecialistRating, SpecialistRating.specialist_id == Specialist.specialist_id)
            .join(Specialty, Specialty.specialty_id == Specialist.specialty_id)
            .where(Specialist.doctor_id == doctor_id)
            .group_by(Specialist.doctor_id, Location.location_id, Specialty.specialty_id)
        )

        result = await self.session.execute(stmt)
        return result.mappings().first()

    async def get_booked_slots(
        self, doctor_id: int, location_id: int, month_number: int
    ) -> list[Booking]:
        stmt = select(Booking.booking_time).where(
            Booking.specialist_id == doctor_id,
            Booking.booking_time >= datetime.date.today(),
            func.extract("month", Booking.booking_time) == month_number + 1,
            Booking.location_id == location_id,
        )
        result = await self.session.scalars(stmt)
        return result.all()
