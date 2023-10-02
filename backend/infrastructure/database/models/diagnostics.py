from sqlalchemy import Integer, String, ForeignKey, DECIMAL, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TableNameMixin, int_pk


class Diagnostic(Base, TableNameMixin):
    diagnostic_id: Mapped[int_pk]
    type_name: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(String(256))
    price: Mapped[float] = mapped_column(DECIMAL(10, 2))
    photo_url: Mapped[str] = mapped_column(String(256))



class DiagnosticLocation(Base):
    __tablename__ = "diagnostic_locations"
    diagnostic_location_id: Mapped[int_pk]
    diagnostic_id: Mapped[int] = mapped_column(ForeignKey("diagnostics.diagnostic_id"))
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.location_id"))
