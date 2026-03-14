PROJECT := ai_firmware_$BOARD_KEY
CC := arm-none-eabi-gcc
CFLAGS := -Wall -Wextra -std=c11 -Os -mcpu=cortex-m3 -mthumb
SRC := main.c gpio.c uart.c adc.c interrupts.c

all: $(PROJECT).elf

$(PROJECT).elf: $(SRC)
	$(CC) $(CFLAGS) $(SRC) -o $@

clean:
	del /Q $(PROJECT).elf 2>NUL || exit 0

.PHONY: all clean

