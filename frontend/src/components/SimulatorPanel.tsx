import type { GenerateResponse } from "../types";

type SimulatorPanelProps = {
  result?: GenerateResponse;
};

export function SimulatorPanel({ result }: SimulatorPanelProps) {
  const interval = result?.intent.interval ?? "500ms";
  const pin = result?.intent.pins[0] ?? "PA1";
  const rows = Array.from({ length: 5 }, (_, index) => ({
    timestamp: `${index * 500} ms`,
    value: 2048 + index * 97,
  }));

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-stone-400">Hardware Simulator</p>
          <h3 className="mt-2 font-display text-xl text-white">UART stream preview</h3>
        </div>
        <div className="rounded-full border border-signal/40 px-3 py-1 text-xs text-signal">sample every {interval}</div>
      </div>

      <div className="mt-4 space-y-3 rounded-3xl border border-white/10 bg-black/30 p-4 font-mono text-sm text-green-300">
        {rows.map((row) => (
          <div key={row.timestamp} className="flex justify-between border-b border-white/5 pb-2">
            <span>{row.timestamp}</span>
            <span>{`ADC(${pin})=${row.value}`}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
