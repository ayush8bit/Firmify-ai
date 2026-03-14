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

#if $UART_ENABLED
    uart_init();
#endif

#if $ADC_ENABLED
    adc_init();
#endif

    while (1) {
#if $ADC_ENABLED
        const uint16_t adc_value = adc_read_blocking();
#else
        const uint16_t adc_value = 0;
#endif

#if $UART_ENABLED
        snprintf(buffer, sizeof(buffer), "ADC(%s)=%u", "$ADC_PIN", adc_value);
        uart_write_line(buffer);
#endif

        delay_ms($INTERVAL_MS);
    }

    return 0;
}

