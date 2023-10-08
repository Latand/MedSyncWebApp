from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TableNameMixin, int_pk


class Location(Base, TableNameMixin):
    location_id: Mapped[int_pk]
    name: Mapped[String] = mapped_column(String(128))
    address: Mapped[String] = mapped_column(String(256))