from sqlalchemy import Integer, String, ForeignKey, Enum, DECIMAL
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TableNameMixin, TimestampMixin, int_pk


class Doctor(Base, TableNameMixin):
    doctor_id: Mapped[int_pk]
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.location_id"))
    full_name: Mapped[str] = mapped_column(String(128))
    specialty: Mapped[str] = mapped_column(String(128))
    price: Mapped[float] = mapped_column(DECIMAL(10, 2))
    photo_url: Mapped[str] = mapped_column(String(256))


class DoctorRating(Base):
    __tablename__ = "doctor_ratings"
    rating_id: Mapped[int_pk]
    doctor_id: Mapped[int] = mapped_column(ForeignKey("doctors.doctor_id"))
    rating: Mapped[int] = mapped_column(Integer, default=0)


class DoctorBooking(Base, TimestampMixin):
    __tablename__ = "doctor_bookings"
    appointment_id: Mapped[int_pk]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"))
    doctor_id: Mapped[int] = mapped_column(ForeignKey("doctors.doctor_id"))
    slot_id: Mapped[int] = mapped_column(ForeignKey("slots.slot_id"))
    status: Mapped[str] = mapped_column(Enum("Booked", "Cancelled", name="booking_status"))
