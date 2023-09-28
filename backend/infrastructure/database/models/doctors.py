from pydantic import BaseModel
from sqlalchemy import Integer, String, ForeignKey, Enum, DECIMAL
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TableNameMixin, TimestampMixin


class Doctor(Base, TableNameMixin):
    doctor_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    location_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("locations.location_id")
    )
    full_name: Mapped[str] = mapped_column(String(128))
    specialty: Mapped[str] = mapped_column(String(128))
    price: Mapped[float] = mapped_column(DECIMAL(10, 2))

class DoctorRating(Base):
    __tablename__ = "doctor_ratings"
    doctor_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    rating: Mapped[int] = mapped_column(Integer, default=0)


class DoctorBooking(Base, TimestampMixin):
    __tablename__ = "doctor_bookings"
    appointment_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.user_id"))
    doctor_id: Mapped[int] = mapped_column(Integer, ForeignKey("doctors.doctor_id"))
    slot_id: Mapped[int] = mapped_column(Integer, ForeignKey("slots.slot_id"))
    status: Mapped[str] = mapped_column(Enum("Booked", "Cancelled"))

