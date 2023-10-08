from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import insert

from medsyncapp.infrastructure.database.models import Booking
from medsyncapp.infrastructure.database.models.diagnostics import DiagnosticResult, Diagnostic
from medsyncapp.infrastructure.database.repo.base import BaseRepo


class ResultsRepo(BaseRepo):
    async def get_results(self, user_id: int):
        query = (
            select(DiagnosticResult, Booking, Diagnostic)
            .join(Booking, Booking.booking_id == DiagnosticResult.booking_id)
            .join(Diagnostic, Diagnostic.diagnostic_id == Booking.diagnostic_id)
            .where(Booking.user_id == user_id)
            .order_by(Booking.booking_time.desc())
        )
        results = await self.session.execute(query)
        return results.all()

    async def get_result(self, result_id: str):
        query = (
            select(DiagnosticResult, Booking, Diagnostic)
            .join(Booking, Booking.booking_id == DiagnosticResult.booking_id)
            .join(Diagnostic, Diagnostic.diagnostic_id == Booking.diagnostic_id)
            .where(DiagnosticResult.diagnostic_result_id == result_id)
        )
        result = await self.session.execute(query)
        return result.first()

    async def save_file_id(self, result_id: str, file_id: str):
        query = (
            update(DiagnosticResult)
            .where(DiagnosticResult.diagnostic_result_id == result_id)
            .values(file_id=file_id)
        )
        await self.session.execute(query)
        await self.session.commit()

    async def create_result(self, booking_id: int, diagnostic_id: int):
        default_paths_mapping = {
            1: "results/mri.pdf",
            2: "results/ct.pdf",
            3: "results/x-ray.pdf",
            4: "results/ultrasound.pdf",
            5: "results/pet.pdf",
            6: "results/blood-test.pdf",
            7: "results/urine.pdf",
            8: "results/biopsy.pdf",
            9: "results/ecg.pdf",
            10: "results/bone-density.pdf",
            11: "results/endoscopy.pdf",
            12: "results/colonoscopy.pdf",
        }

        await self.session.execute(
            insert(DiagnosticResult).values(
                booking_id=booking_id,
                file_path=default_paths_mapping[diagnostic_id],
            )
        )
        await self.session.commit()
