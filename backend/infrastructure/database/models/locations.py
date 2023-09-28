from pydantic import BaseModel
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TableNameMixin


class Location(Base, TableNameMixin):
    location_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    name: Mapped[String] = mapped_column(String(128))
    address: Mapped[String] = mapped_column(String(256))
