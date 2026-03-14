from __future__ import annotations

import json
import re
from typing import Any

from openai import OpenAI

from .board_manager import BoardManager
from .config import get_settings
from .schemas import HardwareIntent


INTERVAL_PATTERN = re.compile(r"(\d+)\s*(ms|milliseconds|s|sec|seconds)", re.IGNORECASE)
PIN_PATTERN = re.compile(r"\b([PA-Z]{1,2}\d{1,2}|A\d|D\d|GPIO\d+)\b", re.IGNORECASE)


class AIReasoner:
    def __init__(self, board_manager: BoardManager | None = None) -> None:
        self.settings = get_settings()
        self.board_manager = board_manager or BoardManager()
        self.client = OpenAI(api_key=self.settings.openai_api_key) if self.settings.openai_api_key else None

    def parse_prompt(self, prompt: str, board_key: str, use_ai: bool = True) -> tuple[HardwareIntent, str]:
        board = self.board_manager.get_board(board_key)
        if use_ai and self.client:
            try:
                return self._parse_with_openai(prompt, board.key), "openai"
            except Exception:
                pass
        return self._parse_with_rules(prompt, board.key), "rules"

    def _parse_with_openai(self, prompt: str, board_key: str) -> HardwareIntent:
        board = self.board_manager.get_board(board_key)
        schema = {
            "type": "object",
            "properties": {
                "mcu": {"type": "string"},
                "board": {"type": "string"},
                "peripherals": {"type": "array", "items": {"type": "string"}},
                "pins": {"type": "array", "items": {"type": "string"}},
                "interval": {"type": "string"},
                "transport": {"type": ["string", "null"]},
                "notes": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["mcu", "board", "peripherals", "pins", "interval", "notes"],
            "additionalProperties": False,
        }
        response = self.client.responses.create(
            model=self.settings.openai_model,
            input=[
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "input_text",
                            "text": (
                                "You convert embedded firmware prompts into compact JSON. "
                                "Return only valid JSON matching the schema."
                            ),
                        }
                    ],
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": (
                                f"Target board: {board.label} ({board.key}). "
                                f"Available analog pins: {', '.join(board.analog_pins)}. "
                                f"Available digital pins: {', '.join(board.digital_pins)}. "
                                f"Prompt: {prompt}"
                            ),
                        }
                    ],
                },
            ],
            text={
                "format": {
                    "type": "json_schema",
                    "name": "firmware_intent",
                    "schema": schema,
                    "strict": True,
                }
            },
        )
        payload = json.loads(response.output_text)
        payload["raw_prompt"] = prompt
        payload["board"] = board_key
        return HardwareIntent(**payload)

    def _parse_with_rules(self, prompt: str, board_key: str) -> HardwareIntent:
        prompt_lower = prompt.lower()
        board = self.board_manager.get_board(board_key)
        peripherals: list[str] = []
        for keyword in ("adc", "uart", "gpio", "i2c", "spi", "pwm"):
            if keyword in prompt_lower:
                peripherals.append(keyword)
        if "serial" in prompt_lower and "uart" not in peripherals:
            peripherals.append("uart")
        pins = [match.upper() for match in PIN_PATTERN.findall(prompt)]
        interval_match = INTERVAL_PATTERN.search(prompt)
        interval = "1000ms"
        if interval_match:
            value, unit = interval_match.groups()
            interval = f"{value}{'ms' if unit.lower().startswith('m') else 's'}"
        notes: list[str] = []
        if "send" in prompt_lower and "uart" in peripherals:
            notes.append("Stream measurements over the default UART port.")
        if not pins and board.analog_pins:
            pins = [board.analog_pins[0]]
            notes.append(f"No pin detected, defaulted to {pins[0]}.")
        transport = "uart" if "uart" in peripherals else None
        return HardwareIntent(
            mcu=board.family,
            board=board.key,
            peripherals=peripherals or ["gpio"],
            pins=pins,
            interval=interval,
            raw_prompt=prompt,
            notes=notes,
            transport=transport,
        )

