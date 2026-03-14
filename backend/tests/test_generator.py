from app.board_manager import BoardManager
from app.firmware_generator import FirmwareGenerator
from app.schemas import HardwareIntent


def test_generator_creates_main_and_manifest():
    generator = FirmwareGenerator(BoardManager())
    intent = HardwareIntent(
        mcu="stm32",
        board="stm32f103",
        peripherals=["adc", "uart"],
        pins=["PA1"],
        interval="500ms",
        raw_prompt="Read ADC and stream over UART every 500ms.",
        notes=[],
        transport="uart",
    )
    artifact_id, files, zip_path = generator.generate(intent)
    assert artifact_id
    assert any(file.filename == "main.c" for file in files)
    assert any(file.filename == "manifest.json" for file in files)
    assert zip_path.exists()

