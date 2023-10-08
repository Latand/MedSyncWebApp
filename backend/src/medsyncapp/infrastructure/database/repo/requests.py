from dataclasses import dataclass

from sqlalchemy.ext.asyncio import AsyncSession

from medsyncapp.infrastructure.database.repo.bookings import BookingsRepo
from medsyncapp.infrastructure.database.repo.diagnostics import DiagnosticRepo
from medsyncapp.infrastructure.database.repo.doctors import DoctorRepo
from medsyncapp.infrastructure.database.repo.locations import LocationsRepo
from medsyncapp.infrastructure.database.repo.results import ResultsRepo
from medsyncapp.infrastructure.database.repo.slots import SlotRepo
from medsyncapp.infrastructure.database.repo.users import UserRepo


@dataclass
class RequestsRepo:
    """
    Repository for handling database operations. This class holds all the repositories for the database models.

    You can add more repositories as properties to this class, so they will be easily accessible.
    """

    session: AsyncSession

    @property
    def users(self) -> UserRepo:
        return UserRepo(self.session)

    @property
    def doctors(self) -> DoctorRepo:
        return DoctorRepo(self.session)

    @property
    def diagnostics(self) -> DiagnosticRepo:
        return DiagnosticRepo(self.session)

    @property
    def slots(self) -> SlotRepo:
        return SlotRepo(self.session)

    @property
    def locations(self) -> LocationsRepo:
        return LocationsRepo(self.session)

    @property
    def bookings(self) -> BookingsRepo:
        return BookingsRepo(self.session)

    @property
    def results(self) -> ResultsRepo:
        return ResultsRepo(self.session)
