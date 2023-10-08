from sqlalchemy import select

from medsyncapp.infrastructure.database.models.locations import Location
from medsyncapp.infrastructure.database.repo.base import BaseRepo


class LocationsRepo(BaseRepo):
    async def get_location(self, location_id: int) -> Location:
        query = select(
            Location.location_id,
            Location.name,
            Location.address,
        ).where(Location.location_id == location_id)
        return (await self.session.execute(query)).mappings().first()
