#include <stdint.h>

void gpio_init(void) {
}

void delay_ms(uint32_t milliseconds) {
    volatile uint32_t ticks = milliseconds * 8000U;
    while (ticks--) {
        __asm__("nop");
    }
}

