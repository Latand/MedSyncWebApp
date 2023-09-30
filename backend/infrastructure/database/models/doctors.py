from typing import Optional

from sqlalchemy import Integer, String, ForeignKey, Enum, DECIMAL, TEXT
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TableNameMixin, TimestampMixin, int_pk


class Doctor(Base, TableNameMixin):
    doctor_id: Mapped[int_pk]
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.location_id"))
    full_name: Mapped[str] = mapped_column(String(128))
    specialty_id: Mapped[int] = mapped_column(ForeignKey("specialties.specialty_id"))
    price: Mapped[float] = mapped_column(DECIMAL(10, 2))
    photo_url: Mapped[str] = mapped_column(String(256))
    experience: Mapped[Optional[str]] = mapped_column(TEXT)
    certificates: Mapped[Optional[str]] = mapped_column(TEXT)
    services: Mapped[Optional[str]] = mapped_column(TEXT)


class Specialty(Base, TableNameMixin):
    __tablename__ = "specialties"
    specialty_id: Mapped[int_pk]
    specialty_name: Mapped[str] = mapped_column(String(128))


class DoctorRating(Base):
    __tablename__ = "doctor_ratings"
    rating_id: Mapped[int_pk]
    doctor_id: Mapped[int] = mapped_column(ForeignKey("doctors.doctor_id"))
    rating: Mapped[int] = mapped_column(Integer, default=0)

