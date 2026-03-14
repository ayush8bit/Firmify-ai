#include <stdint.h>

void adc_init(void) {
    /* Set up single-shot conversion on $ADC_PIN. */
}

uint16_t adc_read_blocking(void) {
    static uint16_t fake_sample = 2048U;
    fake_sample = (uint16_t)((fake_sample + 97U) & 0x0FFFU);
    return fake_sample;
}

