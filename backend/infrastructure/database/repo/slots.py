from sqlalchemy.dialects.postgresql import insert

from infrastructure.database.models import Slot
from infrastructure.database.repo.base import BaseRepo


class SlotRepo(BaseRepo):
    async def insert_new_slot(self, new_slot: dict):
        stmt = insert(Slot).values(new_slot)
        await self.session.execute(stmt)
        await self.session.commit()
