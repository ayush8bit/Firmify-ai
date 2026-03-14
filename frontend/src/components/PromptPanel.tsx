import type { BoardInfo } from "../types";

type PromptPanelProps = {
  prompt: string;
  selectedBoard: string;
  boards: BoardInfo[];
  isLoading: boolean;
  onPromptChange: (value: string) => void;
  onBoardChange: (value: string) => void;
  onGenerate: () => void;
  onVoiceInput: () => void;
};

export function PromptPanel(props: PromptPanelProps) {
  const { prompt, selectedBoard, boards, isLoading, onPromptChange, onBoardChange, onGenerate, onVoiceInput } = props;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-stone-400">Prompt Editor</p>
          <h2 className="mt-2 font-display text-2xl text-white">Describe the firmware the way you think about it.</h2>
        </div>
        <button
          type="button"
          onClick={onVoiceInput}
          className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold text-stone-200 transition hover:bg-white/10"
        >
          Voice Input
        </button>
      </div>

      <textarea
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
        className="mt-6 h-56 w-full rounded-3xl border border-white/10 bg-black/20 p-5 font-body text-base text-white outline-none transition focus:border-accent/80"
        placeholder="Create firmware for STM32 that reads ADC from PA1 and sends value over UART every 500ms."
      />

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
        <label className="flex flex-col gap-2 text-sm text-stone-300">
          Target MCU / Board
          <select
            value={selectedBoard}
            onChange={(event) => onBoardChange(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
          >
            {boards.map((board) => (
              <option key={board.key} value={board.key}>
                {board.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading || !prompt.trim()}
          className="self-end rounded-2xl bg-accent px-6 py-3 font-semibold text-stone-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Generating..." : "Generate with Firmify.ai"}
        </button>
      </div>
    </section>
  );
}
