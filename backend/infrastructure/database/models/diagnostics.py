from pydantic import BaseModel
from sqlalchemy import Integer, String, ForeignKey, DECIMAL, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TableNameMixin, int_pk


class Diagnostic(Base, TableNameMixin):
    diagnostic_id: Mapped[int_pk]
    type_name: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(String(256))
    price: Mapped[float] = mapped_column(DECIMAL(10, 2))


class DiagnosticLocation(Base):
    __tablename__ = "diagnostic_locations"
    diagnostic_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    location_id: Mapped[int] = mapped_column(Integer, primary_key=True)
