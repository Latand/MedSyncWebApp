from datetime import datetime
from typing import Optional

from sqlalchemy import (
    String,
    ForeignKey,
    Boolean,
    false,
    Integer,
    TIMESTAMP,
    Date,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin, TableNameMixin, int_pk


class WorkingHour(Base, TimestampMixin, TableNameMixin):
    working_hour_id: Mapped[int_pk]
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.location_id"))
    start_time: Mapped[int] = mapped_column(Integer)
    end_time: Mapped[int] = mapped_column(Integer)
    weekday_index: Mapped[int] = mapped_column(Integer)


class Booking(Base, TimestampMixin, TableNameMixin):
    booking_id: Mapped[int_pk]
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.user_id"))
    user_full_name: Mapped[str] = mapped_column(String(256))
    user_email: Mapped[str] = mapped_column(String(256))
    user_phone_number: Mapped[str] = mapped_column(String(16))
    user_message: Mapped[Optional[str]] = mapped_column(String(1024))

    doctor_id: Mapped[Optional[int]] = mapped_column(ForeignKey("doctors.doctor_id", ondelete="SET NULL"))
    diagnostic_id: Mapped[Optional[int]] = mapped_column(ForeignKey("diagnostics.diagnostic_id", ondelete="SET NULL"))
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.location_id", ondelete="SET NULL"))
    booking_time: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True))

    __table_args__ = (
        UniqueConstraint('doctor_id', 'location_id', 'booking_time', name='unique_doctor_location_time'),
        UniqueConstraint('diagnostic_id', 'location_id', 'booking_time', name='unique_diagnostic_location_time'),
    )