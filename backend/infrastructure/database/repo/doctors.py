import datetime
import logging

from sqlalchemy import select, insert, cast, Date, func

from infrastructure.database.models import (
    Doctor,
    Booking,
    DoctorRating,
    Location,
)
from infrastructure.database.models.doctors import Specialty
from infrastructure.database.models.slots import WorkingHour
from infrastructure.database.repo.base import BaseRepo


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
            select(Specialty)
            .join(Doctor)
            .order_by(Specialty.specialty_name)
            .group_by(Specialty.specialty_id)
        )
        result = await self.session.scalars(stmt)
        return result.all()

    async def book_slot(
        self,
        doctor_slot_id: int,
        user_full_name: str,
        user_email: str,
        user_phone_number: str,
    ):
        # Insert into Booking
        insert_stmt = (
            insert(Booking)
            .values(
                doctor_slot_id=doctor_slot_id,
                user_full_name=user_full_name,
                user_email=user_email,
                user_phone_number=user_phone_number,
            )
            .returning(Booking)
        )
        await self.session.execute(insert_stmt)

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
                Doctor.services,
            )
            .join(Location, Location.location_id == Doctor.location_id)
            .join(Specialty, Specialty.specialty_id == Doctor.specialty_id)
            .where(Doctor.doctor_id == doctor_id)
        )
        # get the working time of the doctor`s location
        working_times_stmt = (
            select(WorkingHour)
            .join(Location)
            .join(Doctor)
            .where(Doctor.doctor_id == doctor_id)
        )

        working_times = await self.session.scalars(working_times_stmt)

        result = await self.session.execute(stmt)
        return result.mappings().first(), working_times.all()

    async def get_booked_slots(
        self, doctor_id: int, location_id: int, month_number: int
    ) -> list[Booking]:
        stmt = select(Booking.booking_time).where(
            Booking.doctor_id == doctor_id,
            Booking.booking_time >= cast(datetime.date.today(), Date),
            func.extract("month", Booking.booking_time) == month_number,
            Booking.location_id == location_id,
        )
        result = await self.session.scalars(stmt)
        return result.all()
