import datetime
from typing import Optional

from sqlalchemy import String, ForeignKey, TIMESTAMP, Boolean, false
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin, TableNameMixin, int_pk


class Slot(Base, TimestampMixin, TableNameMixin):
    slot_id: Mapped[int_pk]
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.location_id"))
    start_time: Mapped[datetime] = mapped_column(TIMESTAMP)
    end_time: Mapped[datetime] = mapped_column(TIMESTAMP)


class DoctorSlot(Base):
    __tablename__ = "doctor_slots"
    doctor_slot_id: Mapped[int_pk]
    doctor_id: Mapped[int] = mapped_column(ForeignKey("doctors.doctor_id"))
    slot_id: Mapped[int] = mapped_column(ForeignKey("slots.slot_id"))
    is_booked: Mapped[bool] = mapped_column(Boolean, server_default=false())


class DiagnosticSlot(Base):
    __tablename__ = "diagnostic_slots"
    diagnostic_slot_id: Mapped[int_pk]
    diagnostic_location_id: Mapped[int] = mapped_column(
        ForeignKey("diagnostic_locations.diagnostic_location_id")
    )
    slot_id: Mapped[int] = mapped_column(ForeignKey("slots.slot_id"))
    is_booked: Mapped[bool] = mapped_column(Boolean, server_default=false())


class Booking(Base, TimestampMixin, TableNameMixin):
    booking_id: Mapped[int_pk]
    user_full_name: Mapped[str] = mapped_column(String(256))
    user_email: Mapped[str] = mapped_column(String(256))
    user_phone_number: Mapped[str] = mapped_column(String(16))
    doctor_slot_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("doctor_slots.doctor_slot_id")
    )
    diagnostic_slot_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("diagnostic_slots.diagnostic_slot_id")
    )
