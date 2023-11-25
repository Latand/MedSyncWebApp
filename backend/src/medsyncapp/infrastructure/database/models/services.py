from typing import Optional

from sqlalchemy import String, ForeignKey, DECIMAL, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TableNameMixin, int_pk, TimestampMixin


class SpecialistServiceLink(Base):
    __tablename__ = 'specialist_service_link'
    id: Mapped[int_pk]
    specialist_id: Mapped[int] = mapped_column(ForeignKey('specialists.specialist_id'))
    service_id: Mapped[int] = mapped_column(ForeignKey('services.service_id'))


class Service(Base, TableNameMixin):
    service_id: Mapped[int_pk]
    service_name: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(String(256))
    price: Mapped[float] = mapped_column(DECIMAL(10, 2))
    photo_url: Mapped[str] = mapped_column(String(256))
    duration: Mapped[int] = mapped_column(Integer)

    specialists = relationship("Specialist", secondary="specialist_service_link", back_populates="provided_services")
    bookings = relationship('Booking', back_populates='service')

    def __repr__(self):
        return self.service_name


class ServiceLocation(Base):
    __tablename__ = "service_locations"
    service_location_id: Mapped[int_pk]
    service_id: Mapped[int] = mapped_column(ForeignKey("services.service_id"))
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.location_id"))


class DiagnosticResult(Base, TimestampMixin):
    __tablename__ = "diagnostic_results"
    diagnostic_result_id: Mapped[int_pk]
    booking_id = mapped_column(ForeignKey("bookings.booking_id"))
    file_path: Mapped[str] = mapped_column(String(256))
    file_id: Mapped[Optional[str]] = mapped_column(String(256))
