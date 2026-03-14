from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    prompt: str = Field(min_length=10, description="Natural language firmware request")
    board: str = Field(description="Board key, e.g. stm32f103")
    use_ai: bool = Field(default=True, description="Use OpenAI when configured")


class HardwareIntent(BaseModel):
    mcu: str
    board: str
    peripherals: list[str] = Field(default_factory=list)
    pins: list[str] = Field(default_factory=list)
    interval: str = "1000ms"
    raw_prompt: str
    notes: list[str] = Field(default_factory=list)
    transport: str | None = None


class GeneratedFile(BaseModel):
    filename: str
    content: str
    language: Literal["c", "makefile", "json", "markdown", "text"] = "text"


class GenerateResponse(BaseModel):
    artifact_id: str
    board: str
    intent: HardwareIntent
    files: list[GeneratedFile]
    download_url: str
    ai_mode: str


class BoardInfo(BaseModel):
    key: str
    label: str
    family: str
    cpu: str
    toolchain: str
    default_uart: str
    analog_pins: list[str]
    digital_pins: list[str]
    summary: str

