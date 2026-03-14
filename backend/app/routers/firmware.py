from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from ..ai_reasoner import AIReasoner
from ..board_manager import BoardManager
from ..config import get_settings
from ..firmware_generator import FirmwareGenerator
from ..schemas import GenerateRequest, GenerateResponse


router = APIRouter()
settings = get_settings()
board_manager = BoardManager()
reasoner = AIReasoner(board_manager=board_manager)
generator = FirmwareGenerator(board_manager=board_manager)


@router.get("/boards")
def list_boards():
    return board_manager.list_boards()


@router.post("/generate", response_model=GenerateResponse)
def generate_firmware(request: GenerateRequest):
    try:
        intent, ai_mode = reasoner.parse_prompt(request.prompt, request.board, use_ai=request.use_ai)
        artifact_id, files, _ = generator.generate(intent)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return GenerateResponse(
        artifact_id=artifact_id,
        board=request.board,
        intent=intent,
        files=files,
        download_url=f"{settings.api_prefix}/download?artifact_id={artifact_id}",
        ai_mode=ai_mode,
    )


@router.get("/download")
def download_firmware(artifact_id: str = Query(..., min_length=4)):
    zip_path = settings.output_dir / f"{artifact_id}.zip"
    if not zip_path.exists():
        raise HTTPException(status_code=404, detail="Firmware artifact not found")
    return FileResponse(
        path=Path(zip_path),
        media_type="application/zip",
        filename=f"firmware-{artifact_id}.zip",
    )

