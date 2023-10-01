from sqlalchemy import select

from infrastructure.database.models.locations import Location
from infrastructure.database.repo.base import BaseRepo


class LocationsRepo(BaseRepo):
    async def get_location(self, location_id: int) -> Location:
        query = select(Location).where(Location.location_id== location_id)
        return (await self.session.scalars(query)).first()
