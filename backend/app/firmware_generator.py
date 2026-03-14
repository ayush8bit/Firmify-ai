from __future__ import annotations

import json
import shutil
from pathlib import Path
from string import Template
from uuid import uuid4
from zipfile import ZIP_DEFLATED, ZipFile

from .board_manager import BoardManager
from .config import get_settings
from .schemas import GeneratedFile, HardwareIntent


class FirmwareGenerator:
    def __init__(self, board_manager: BoardManager | None = None) -> None:
        self.settings = get_settings()
        self.board_manager = board_manager or BoardManager()

    def generate(self, intent: HardwareIntent) -> tuple[str, list[GeneratedFile], Path]:
        artifact_id = uuid4().hex[:12]
        output_dir = self.settings.output_dir / artifact_id
        output_dir.mkdir(parents=True, exist_ok=True)
        board = self.board_manager.get_board(intent.board)

        substitutions = {
            "BOARD_KEY": board.key,
            "BOARD_LABEL": board.label,
            "BOARD_FAMILY": board.family,
            "CPU": board.cpu,
            "DEFAULT_UART": board.default_uart,
            "PROMPT": intent.raw_prompt,
            "ADC_PIN": intent.pins[0] if intent.pins else "UNASSIGNED",
            "INTERVAL_MS": str(self._interval_to_ms(intent.interval)),
            "UART_ENABLED": "1" if "uart" in intent.peripherals else "0",
            "ADC_ENABLED": "1" if "adc" in intent.peripherals else "0",
            "GPIO_ENABLED": "1" if "gpio" in intent.peripherals else "0",
        }

        template_map = {
            "main.c": self.settings.templates_dir / "main.c.tpl",
            "gpio.c": self.settings.templates_dir / "gpio" / "gpio.c.tpl",
            "uart.c": self.settings.templates_dir / "uart" / "uart.c.tpl",
            "adc.c": self.settings.templates_dir / "adc" / "adc.c.tpl",
            "interrupts.c": self.settings.templates_dir / "interrupts.c.tpl",
            "Makefile": self.settings.templates_dir / "Makefile.tpl",
        }

        generated_files: list[GeneratedFile] = []
        for filename, template_path in template_map.items():
            content = Template(template_path.read_text(encoding="utf-8")).safe_substitute(substitutions)
            (output_dir / filename).write_text(content, encoding="utf-8")
            generated_files.append(
                GeneratedFile(
                    filename=filename,
                    content=content,
                    language="makefile" if filename == "Makefile" else "c",
                )
            )

        metadata = {
            "artifact_id": artifact_id,
            "board": board.model_dump(),
            "intent": intent.model_dump(),
        }
        metadata_text = json.dumps(metadata, indent=2)
        (output_dir / "manifest.json").write_text(metadata_text, encoding="utf-8")
        generated_files.append(GeneratedFile(filename="manifest.json", content=metadata_text, language="json"))

        bsp_dir = output_dir / "bsp"
        bsp_dir.mkdir(exist_ok=True)
        for bsp_file in self.board_manager.resolve_bsp_files(board.key):
            shutil.copy2(bsp_file, bsp_dir / bsp_file.name)

        zip_path = self.settings.output_dir / f"{artifact_id}.zip"
        with ZipFile(zip_path, "w", compression=ZIP_DEFLATED) as archive:
            for file_path in output_dir.rglob("*"):
                archive.write(file_path, arcname=file_path.relative_to(output_dir))

        return artifact_id, generated_files, zip_path

    @staticmethod
    def _interval_to_ms(interval: str) -> int:
        if interval.endswith("ms"):
            return int(interval[:-2])
        if interval.endswith("s"):
            return int(float(interval[:-1]) * 1000)
        return 1000

