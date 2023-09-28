import datetime

from pydantic import BaseModel
from sqlalchemy import Integer, String, ForeignKey, TIMESTAMP, Boolean, false
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin, TableNameMixin, int_pk


class Slot(Base, TimestampMixin, TableNameMixin):
    slot_id: Mapped[int_pk]
    location_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("locations.location_id")
    )
    start_time: Mapped[datetime] = mapped_column(TIMESTAMP)
    end_time: Mapped[datetime] = mapped_column(TIMESTAMP)


class DoctorSlot(Base):
    __tablename__ = "doctor_slots"
    doctor_slot_id: Mapped[int_pk]
    doctor_id: Mapped[int] = mapped_column(Integer, ForeignKey("doctors.doctor_id"))
    slot_id: Mapped[int] = mapped_column(Integer, ForeignKey("slots.slot_id"))
    is_booked: Mapped[bool] = mapped_column(Boolean, server_default=false())


class DiagnosticSlot(Base):
    __tablename__ = "diagnostic_slots"
    diagnostic_slot_id: Mapped[int_pk]
    diagnostic_location_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("diagnostic_locations.diagnostic_location_id")
    )

    # sqlalchemy.exc.ProgrammingError: (sqlalchemy.dialects.postgresql.asyncpg.ProgrammingError) <class 'asyncpg.exceptions.InvalidForeignKeyError'>: there is no unique constraint matching given keys for referenced table "diagnostic_locations"

    slot_id: Mapped[int] = mapped_column(Integer, ForeignKey("slots.slot_id"))
    is_booked: Mapped[bool] = mapped_column(Boolean, server_default=false())


class Booking(Base, TimestampMixin, TableNameMixin):
    booking_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    user_full_name: Mapped[str] = mapped_column(String(256))
    user_email: Mapped[str] = mapped_column(String(256))
    user_phone_number: Mapped[str] = mapped_column(String(16))
    doctor_slot_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("doctor_slots.doctor_slot_id"), nullable=True
    )
    diagnostic_slot_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("diagnostic_slots.diagnostic_slot_id"), nullable=True
    )
