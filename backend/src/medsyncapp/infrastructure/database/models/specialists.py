from typing import Optional

from sqlalchemy import Integer, String, ForeignKey, DECIMAL, TEXT
from sqlalchemy.orm import Mapped, mapped_column, relationship
from fastapi_storages.integrations.sqlalchemy import FileType
from fastapi_storages import FileSystemStorage
from .base import Base, TableNameMixin, int_pk


class Specialty(Base, TableNameMixin):
    __tablename__ = "specialties"
    specialty_id: Mapped[int_pk]
    specialty_name: Mapped[str] = mapped_column(String(128))

    specialists = relationship("Specialist", back_populates="specialty")

    def __repr__(self):
        return self.specialty_name


class Specialist(Base, TableNameMixin):
    specialist_id: Mapped[int_pk]
    full_name: Mapped[str] = mapped_column(String(128))
    specialty_id: Mapped[int] = mapped_column(ForeignKey("specialties.specialty_id"))
    price: Mapped[float] = mapped_column(DECIMAL(10, 2))
    photo: Mapped[str] = mapped_column(
        FileType(storage=FileSystemStorage(path="/src/public/images/specialists/profiles")))
    experience: Mapped[Optional[str]] = mapped_column(TEXT)
    certificates: Mapped[Optional[str]] = mapped_column(TEXT)
    provided_services = relationship("Service", secondary="specialist_service_link", back_populates="specialists")
    bookings = relationship('Booking', back_populates='specialist')
    specialty = relationship("Specialty", back_populates="specialists")

    def __repr__(self):
        return str(f"{self.full_name}")


class SpecialistRating(Base):
    __tablename__ = "specialist_ratings"
    rating_id: Mapped[int_pk]
    specialist_id: Mapped[int] = mapped_column(ForeignKey("specialists.specialist_id"))
    rating: Mapped[int] = mapped_column(Integer, default=0)
