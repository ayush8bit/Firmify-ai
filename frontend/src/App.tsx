import { useEffect, useState } from "react";

import { FirmwareViewer } from "./components/FirmwareViewer";
import { InsightCards } from "./components/InsightCards";
import { PromptPanel } from "./components/PromptPanel";
import { SimulatorPanel } from "./components/SimulatorPanel";
import type { BoardInfo, GenerateResponse } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";
const DEFAULT_PROMPT = "Create firmware for STM32 that reads ADC from PA1 and sends value over UART every 500ms.";

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    start: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
  }

  interface SpeechRecognitionEvent {
    results: {
      [index: number]: {
        [index: number]: {
          transcript: string;
        };
      };
      length: number;
    };
  }
}

function App() {
  const [boards, setBoards] = useState<BoardInfo[]>([]);
  const [selectedBoard, setSelectedBoard] = useState("stm32f103");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [result, setResult] = useState<GenerateResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      const response = await fetch(`${API_BASE}/boards`);
      const data: BoardInfo[] = await response.json();
      setBoards(data);
      if (data.length > 0) {
        setSelectedBoard((current) => current || data[0].key);
      }
    };

    fetchBoards().catch(() => {
      setError("Unable to reach the backend. Start FastAPI on http://127.0.0.1:8000.");
    });
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          board: selectedBoard,
          use_ai: true,
        }),
      });
      if (!response.ok) {
        throw new Error(`Generation failed with ${response.status}`);
      }
      const data: GenerateResponse = await response.json();
      setResult(data);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Firmware generation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) {
      return;
    }
    window.open(`http://127.0.0.1:8000${result.download_url}`, "_blank");
  };

  const handleVoiceInput = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setError("Voice input is only available in browsers with SpeechRecognition support.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
    };
    recognition.start();
  };

  const activeBoard = boards.find((board) => board.key === selectedBoard);

  return (
    <div className="min-h-screen overflow-hidden bg-stone-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-9rem] h-[28rem] w-[28rem] rounded-full bg-accent/16 blur-3xl" />
        <div className="absolute right-[-10rem] top-[4rem] h-[24rem] w-[24rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/3 h-[22rem] w-[22rem] rounded-full bg-emerald-400/8 blur-3xl" />
        <div className="grid-overlay absolute inset-0 opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="rounded-[2.25rem] border border-white/10 bg-white/[0.04] px-6 py-6 backdrop-blur-xl md:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-stone-300">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Firmify.ai
              </div>

              <h1 className="mt-6 max-w-4xl font-display text-4xl leading-[1.05] text-white md:text-6xl">
                Turn hardware ideas into downloadable firmware in one clean flow.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-300">
                Firmify.ai transforms natural-language hardware prompts into board-aware C firmware projects with
                drivers, interrupts, previews, and packaged downloads.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-stone-300">
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">STM32F103</div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">ESP32</div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Arduino Uno</div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Template-driven C output</div>
              </div>
            </div>

            <div className="lg:w-[24rem]">
              <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-400">Pipeline</p>
                <div className="mt-3 space-y-2 text-sm text-stone-300">
                  <div>Prompt</div>
                  <div>Reasoner</div>
                  <div>Hardware model</div>
                  <div>Firmware generator</div>
                  <div>ZIP artifact</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <PromptPanel
              prompt={prompt}
              selectedBoard={selectedBoard}
              boards={boards}
              isLoading={isLoading}
              onPromptChange={setPrompt}
              onBoardChange={setSelectedBoard}
              onGenerate={handleGenerate}
              onVoiceInput={handleVoiceInput}
            />
            <InsightCards board={activeBoard} result={result} />
            <SimulatorPanel result={result} />
          </div>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-stone-400">Run Summary</p>
                  <h2 className="mt-2 font-display text-2xl text-white">
                    {result ? `${activeBoard?.label ?? result.board} firmware ready` : "Waiting for generation"}
                  </h2>
                </div>
                <button
                  type="button"
                  disabled={!result}
                  onClick={handleDownload}
                  className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Download ZIP
                </button>
              </div>

              {error ? <div className="mt-4 rounded-2xl bg-red-500/10 p-4 text-sm text-red-200">{error}</div> : null}

              {result ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-white/8 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Reasoner Output</p>
                    <pre className="mt-3 overflow-auto text-sm text-stone-200">{JSON.stringify(result.intent, null, 2)}</pre>
                  </div>
                  <div className="rounded-3xl border border-white/8 bg-black/20 p-4 text-sm text-stone-300">
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Generation Info</p>
                    <p className="mt-3">AI mode: {result.ai_mode}</p>
                    <p className="mt-2">Artifact: {result.artifact_id}</p>
                    <p className="mt-2">Peripherals: {result.intent.peripherals.join(", ")}</p>
                    <p className="mt-2">Default UART: {activeBoard?.default_uart ?? "n/a"}</p>
                    <p className="mt-2">Toolchain: {activeBoard?.toolchain ?? "n/a"}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-3xl border border-dashed border-white/15 p-8 text-stone-400">
                  Generate once to inspect the parsed hardware model and artifact metadata.
                </div>
              )}
            </section>

            <FirmwareViewer files={result?.files ?? []} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
