import type { BoardInfo, GenerateResponse } from "../types";

type InsightCardsProps = {
  board?: BoardInfo;
  result?: GenerateResponse;
};

export function InsightCards({ board, result }: InsightCardsProps) {
  const suggestions = result
    ? [
        `Verify ${result.intent.pins.join(", ") || "the selected pins"} against the ${board?.label ?? "board"} schematic.`,
        `Start with ${result.intent.interval} timing and adjust once UART throughput is measured.`,
        `Use DMA for UART or ADC if you later increase the sample rate or add more peripherals.`,
      ]
    : [
        "Prompt examples: \"Blink PC13 every 200ms\", \"Read ADC from PA1 and print over UART\", \"ESP32 PWM on GPIO18.\"",
        "The parser extracts MCU type, peripherals, pins, timing, and notes before code generation.",
        "Downloadable ZIP artifacts include templates, generated sources, and board support files.",
      ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {suggestions.map((item) => (
        <article key={item} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 text-sm leading-6 text-stone-300 backdrop-blur-xl">
          {item}
        </article>
      ))}
    </div>
  );
}
