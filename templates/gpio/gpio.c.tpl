#include <stdint.h>

void gpio_init(void) {
    /* Configure pin muxing and default output states for $BOARD_LABEL. */
}

void delay_ms(uint32_t milliseconds) {
    volatile uint32_t ticks = milliseconds * 8000U;
    while (ticks--) {
        __asm__("nop");
    }
}

