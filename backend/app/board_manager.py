from __future__ import annotations

import json
from pathlib import Path

from .config import get_settings
from .schemas import BoardInfo


class BoardManager:
    def __init__(self) -> None:
        self.settings = get_settings()
        self._boards = self._load_boards()

    def _load_boards(self) -> dict[str, BoardInfo]:
        boards: dict[str, BoardInfo] = {}
        for manifest_path in self.settings.bsp_dir.rglob("manifest.json"):
            payload = json.loads(manifest_path.read_text(encoding="utf-8"))
            board = BoardInfo(**payload)
            boards[board.key] = board
        return boards

    def list_boards(self) -> list[BoardInfo]:
        return sorted(self._boards.values(), key=lambda item: item.label)

    def get_board(self, key: str) -> BoardInfo:
        normalized = key.strip().lower()
        if normalized not in self._boards:
            available = ", ".join(sorted(self._boards))
            raise KeyError(f"Unknown board '{key}'. Available boards: {available}")
        return self._boards[normalized]

    def resolve_bsp_files(self, board_key: str) -> list[Path]:
        board = self.get_board(board_key)
        board_dir = self.settings.bsp_dir / board.family
        return sorted(path for path in board_dir.iterdir() if path.is_file())

