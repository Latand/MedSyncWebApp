import datetime

from sqlalchemy import select, insert, update, cast, Date, false

from infrastructure.database.models import Doctor, DoctorSlot, Booking, Slot
from infrastructure.database.repo.base import BaseRepo


class DoctorRepo(BaseRepo):
    async def get_all_doctors(self):
        stmt = select(Doctor)
        result = await self.session.scalars(stmt)
        return result.all()

    async def get_available_slots(self, doctor_id: int, selected_date: datetime.date):
        stmt = (
            select(Slot, DoctorSlot)
            .join(DoctorSlot, DoctorSlot.slot_id == Slot.slot_id)
            .where(
                DoctorSlot.doctor_id == doctor_id,
                DoctorSlot.is_booked == false(),
                cast(Slot.start_time, Date) == selected_date,
            )
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def book_slot(
        self,
        doctor_slot_id: int,
        user_full_name: str,
        user_email: str,
        user_phone_number: str,
    ):
        # Insert into Booking
        insert_stmt = (
            insert(Booking)
            .values(
                doctor_slot_id=doctor_slot_id,
                user_full_name=user_full_name,
                user_email=user_email,
                user_phone_number=user_phone_number,
            )
            .returning(Booking)
        )
        await self.session.execute(insert_stmt)

        # Update the DoctorSlot to indicate it is booked
        update_stmt = (
            update(DoctorSlot)
            .where(DoctorSlot.doctor_slot_id == doctor_slot_id)
            .values(is_booked=True)
        )
        await self.session.execute(update_stmt)

        await self.session.commit()
