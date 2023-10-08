from fastapi import Depends, APIRouter, HTTPException

from medsyncapp.infrastructure.database.repo.requests import RequestsRepo
from medsyncapp.webhook.utils import get_repo

diagnostics_router = APIRouter(prefix="/diagnostics")


@diagnostics_router.get("/")
async def get_all_diagnostics(repo: RequestsRepo = Depends(get_repo)):
    diagnostics = await repo.diagnostics.get_all_diagnostic_types()
    return diagnostics


@diagnostics_router.get(
    "/{diagnostic_id}/locations"
)
async def get_locations_by_type(
    diagnostic_id: int, repo: RequestsRepo = Depends(get_repo)
):
    locations = await repo.diagnostics.get_locations_by_type(diagnostic_id)
    if not locations:
        raise HTTPException(status_code=404, detail="Locations not found")
    return locations

