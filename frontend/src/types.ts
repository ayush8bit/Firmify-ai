export type BoardInfo = {
  key: string;
  label: string;
  family: string;
  cpu: string;
  toolchain: string;
  default_uart: string;
  analog_pins: string[];
  digital_pins: string[];
  summary: string;
};

export type HardwareIntent = {
  mcu: string;
  board: string;
  peripherals: string[];
  pins: string[];
  interval: string;
  raw_prompt: string;
  notes: string[];
  transport: string | null;
};

export type GeneratedFile = {
  filename: string;
  content: string;
  language: "c" | "makefile" | "json" | "markdown" | "text";
};

export type GenerateResponse = {
  artifact_id: string;
  board: string;
  intent: HardwareIntent;
  files: GeneratedFile[];
  download_url: string;
  ai_mode: string;
};

