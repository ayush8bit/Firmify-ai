#include <stdint.h>
#include <stdio.h>

extern void board_clock_init(void);
extern void gpio_init(void);
extern void uart_init(void);
extern void adc_init(void);
extern uint16_t adc_read_blocking(void);
extern void uart_write_line(const char *line);
extern void delay_ms(uint32_t milliseconds);

int main(void) {
    char buffer[64];

    board_clock_init();
    gpio_init();
    uart_init();
    adc_init();

    while (1) {
        const uint16_t adc_value = adc_read_blocking();
        snprintf(buffer, sizeof(buffer), "ADC(PA1)=%u", adc_value);
        uart_write_line(buffer);
        delay_ms(500U);
    }

    return 0;
}

