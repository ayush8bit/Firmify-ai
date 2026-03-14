from app.ai_reasoner import AIReasoner
from app.board_manager import BoardManager


def test_rule_parser_extracts_adc_uart_and_interval():
    reasoner = AIReasoner(BoardManager())
    intent, mode = reasoner.parse_prompt(
        "Create firmware for STM32 that reads ADC from PA1 and sends value over UART every 500ms.",
        "stm32f103",
        use_ai=False,
    )
    assert mode == "rules"
    assert intent.mcu == "stm32"
    assert "adc" in intent.peripherals
    assert "uart" in intent.peripherals
    assert "PA1" in intent.pins
    assert intent.interval == "500ms"

