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
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin, TableNameMixin, int_pk


class WorkingHour(Base, TimestampMixin, TableNameMixin):
    working_hour_id: Mapped[int_pk]
    location_id: Mapped[Optional[int]] = mapped_column(ForeignKey("locations.location_id"))
    specialist_id: Mapped[Optional[int]] = mapped_column(ForeignKey("specialists.specialist_id"))
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
    specialist_id: Mapped[int] = mapped_column(ForeignKey("specialists.specialist_id", ondelete="SET NULL"),
                                               nullable=False)
    service_id: Mapped[int] = mapped_column(ForeignKey("services.service_id", ondelete="SET NULL"),
                                            nullable=False)
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.location_id", ondelete="SET NULL"))
    booking_time: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True))

    specialist = relationship('Specialist', back_populates='bookings')
    service = relationship('Service', back_populates='bookings')

    def __repr__(self):
        return str(self.user_phone_number)

    __table_args__ = (
        UniqueConstraint('specialist_id', 'location_id', 'booking_time', name='unique_specialist_location_time'),
        UniqueConstraint('service_id', 'location_id', 'booking_time', name='unique_service_location_time'),
    )
