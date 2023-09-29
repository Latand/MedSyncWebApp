from typing import List

from fastapi import Depends, APIRouter, HTTPException

from infrastructure.database.repo.requests import RequestsRepo
from infrastructure.webhook.models import (
    DiagnosticLocation, Diagnostic
)
from infrastructure.webhook.utils import get_repo

diagnostics_router = APIRouter(prefix="/diagnostics")


@diagnostics_router.get("/", response_model=List[Diagnostic])
async def get_all_diagnostics(repo: RequestsRepo = Depends(get_repo)):
    diagnostics = await repo.diagnostics.get_all_diagnostic_types()
    return diagnostics


@diagnostics_router.get(
    "/{diagnostic_id}/locations", response_model=List[DiagnosticLocation]
)
async def get_locations_by_type(
    diagnostic_id: int, repo: RequestsRepo = Depends(get_repo)
):
    locations = await repo.diagnostics.get_locations_by_type(diagnostic_id)
    if not locations:
        raise HTTPException(status_code=404, detail="Locations not found")
    return locations

