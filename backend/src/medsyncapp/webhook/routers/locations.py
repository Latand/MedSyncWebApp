from fastapi import Depends, APIRouter, HTTPException

from medsyncapp.infrastructure.database.repo.requests import RequestsRepo
from medsyncapp.webhook.utils import get_repo

locations_router = APIRouter(prefix="/locations")


@locations_router.get("/{location_id}")
async def get_location(location_id: int, repo: RequestsRepo = Depends(get_repo)):
    location = await repo.locations.get_location(location_id)
    if location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return location
