import datetime

from dateutil.parser import parse
from sqlalchemy import select, insert, func

from medsyncapp.infrastructure.database.models import (
    Doctor,
    Booking,
    DoctorRating,
    Location,
)
from medsyncapp.infrastructure.database.models.doctors import Specialty
from medsyncapp.infrastructure.database.repo.base import BaseRepo


class DoctorRepo(BaseRepo):
    async def get_all_doctors(self) -> list[Doctor]:
        stmt = (
            select(
                Doctor.doctor_id,
                Doctor.location_id,
                Doctor.full_name,
                Specialty.specialty_name,
                Specialty.specialty_id,
                Doctor.price,
                Doctor.photo_url,
                Location.name.label("location_name"),
                Location.address.label("location_address"),
                func.coalesce(func.avg(DoctorRating.rating), 0).label("avg_rating"),
                func.coalesce(func.count(DoctorRating.rating_id), 0).label("reviews"),
            )
            .join(Location, Location.location_id == Doctor.location_id)
            .join(Specialty, Specialty.specialty_id == Doctor.specialty_id)
            .outerjoin(DoctorRating, DoctorRating.doctor_id == Doctor.doctor_id)
            .group_by(Doctor.doctor_id, Location.location_id, Specialty.specialty_id)
        )

        result = await self.session.execute(stmt)
        result = result.mappings().all()
        return result

    async def get_specialties(self) -> list[Specialty]:
        stmt = (
            select(Specialty.specialty_id, Specialty.specialty_name)
            .join(Doctor)
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
                doctor_id=payload.get("doctor_id"),
                location_id=payload.get("location_id"),
                booking_time=parse(payload.get("booking_date_time")),
            )
            .returning(Booking.booking_id)
        )
        result = await self.session.scalar(insert_stmt)
        await self.session.commit()
        return result

    async def get_doctor(self, doctor_id: int) -> Doctor:
        stmt = (
            select(
                Doctor.doctor_id,
                Doctor.location_id,
                Doctor.full_name,
                Specialty.specialty_name,
                Specialty.specialty_id,
                Doctor.price,
                Doctor.photo_url,
                Location.address.label("location_address"),
                Doctor.experience,
                Doctor.certificates,
                Location.name.label("location_name"),
                func.coalesce(func.avg(DoctorRating.rating), 0).label("avg_rating"),
                func.coalesce(func.count(DoctorRating.rating_id), 0).label("reviews"),
                Doctor.services,
            )
            .join(Location, Location.location_id == Doctor.location_id)
            .outerjoin(DoctorRating, DoctorRating.doctor_id == Doctor.doctor_id)
            .join(Specialty, Specialty.specialty_id == Doctor.specialty_id)
            .where(Doctor.doctor_id == doctor_id)
            .group_by(Doctor.doctor_id, Location.location_id, Specialty.specialty_id)
        )

        result = await self.session.execute(stmt)
        return result.mappings().first()

    async def get_booked_slots(
        self, doctor_id: int, location_id: int, month_number: int
    ) -> list[Booking]:
        stmt = select(Booking.booking_time).where(
            Booking.doctor_id == doctor_id,
            Booking.booking_time >= datetime.date.today(),
            func.extract("month", Booking.booking_time) == month_number + 1,
            Booking.location_id == location_id,
        )
        result = await self.session.scalars(stmt)
        return result.all()
