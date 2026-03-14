#include <stddef.h>

void uart_init(void) {
    /* Initialize $DEFAULT_UART for 115200 8N1 logging. */
}

void uart_write_line(const char *line) {
    (void)line;
    /* Replace with a board-specific transmit loop or DMA write. */
}

