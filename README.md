# Firmify.ai

Firmify.ai is an open-source web application that turns natural language hardware requests into downloadable microcontroller firmware projects. It combines a React + TypeScript frontend, a FastAPI backend, an OpenAI-powered reasoning layer, and a template-based C code generator that targets common embedded boards.

## Website

Suggested production URL:

```text
https://firmify-ai.vercel.app
```

Suggested backend API URL:

```text
https://firmify-ai-api.onrender.com
```

These URLs are the intended live targets for the project. They become real once you push the repo to GitHub and deploy the frontend to Vercel and the backend to Render.

## Overview

Example prompt:

```text
Create firmware for STM32 that reads ADC from PA1 and sends value over UART every 500ms.
```

The system interprets the request, extracts the hardware intent, selects the matching board support package, generates source files such as `main.c`, `adc.c`, `uart.c`, `gpio.c`, `interrupts.c`, and bundles the result into a ZIP artifact.

## Architecture

```text
Natural Language Input
        |
        v
AI Task Interpreter
        |
        v
Hardware Abstraction Model
        |
        v
Firmware Code Generator
        |
        v
Downloadable Firmware Project
```

Additional detail lives in [docs/architecture.md](/c:/Users/ayush/OneDrive/Desktop/scrapper/ai-firmware-studio/docs/architecture.md).

## Features

- Natural language prompt editor for embedded firmware requests
- MCU / board selection for STM32F103, ESP32 DevKit, and Arduino Uno
- OpenAI-backed interpreter with a deterministic rule-based fallback
- Template-based C firmware generation
- Syntax-highlighted firmware preview
- ZIP download endpoint for generated projects
- Optional voice command input in supported browsers
- Lightweight UART simulator panel
- Embedded debugging suggestions in the UI

## Repository Structure

```text
ai-firmware-studio
├── frontend
├── backend
├── bsp
│   ├── stm32
│   ├── esp32
│   └── arduino
├── templates
│   ├── gpio
│   ├── uart
│   └── adc
├── firmware_output
├── examples
└── README.md
```

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Vite
- Backend: FastAPI, Pydantic
- AI layer: OpenAI API integration with JSON-schema-constrained extraction
- Firmware generation: template-based C code generation

## Supported Boards

### STM32F103 Blue Pill
- Clock config
- GPIO mapping
- UART driver
- ADC driver
- Interrupt handlers

### ESP32 DevKit
- Clock config
- GPIO mapping
- UART driver
- ADC driver
- Interrupt handlers

### Arduino Uno
- Clock config
- GPIO mapping
- UART driver
- ADC driver
- Interrupt handlers

## Screenshots

Screenshots can be added later in `docs/` using these placeholders:

- `docs/screenshot-dashboard.png`
- `docs/screenshot-generated-firmware.png`

## Installation

### Backend

```powershell
cd ai-firmware-studio\backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Recommended Python version: `3.11` to `3.13`. On the current March 14, 2026 stack, Python `3.14` may require a local Rust toolchain to build `pydantic-core`, so the smoothest setup is Python `3.13`.

Set `OPENAI_API_KEY` in `.env` to enable the OpenAI reasoning path. Without it, the backend still works using the deterministic parser.

### Frontend

```powershell
cd ai-firmware-studio\frontend
npm.cmd install
npm.cmd copy .env.example .env
npm.cmd run dev
```

The frontend reads:

- `VITE_API_BASE_URL` for the backend endpoint
- `VITE_SITE_URL` for the canonical website link shown in the UI

## Deployment

### GitHub

Create a GitHub repository named `firmify-ai`, then push the local repo:

```powershell
cd c:\Users\ayush\OneDrive\Desktop\scrapper\ai-firmware-studio
git add .
git commit -m "Launch Firmify.ai"
git branch -M main
git remote add origin https://github.com/<your-username>/firmify-ai.git
git push -u origin main
```

### Backend on Render

The repository includes [render.yaml](/c:/Users/ayush/OneDrive/Desktop/scrapper/ai-firmware-studio/render.yaml) and [backend/runtime.txt](/c:/Users/ayush/OneDrive/Desktop/scrapper/ai-firmware-studio/backend/runtime.txt).

On Render:

1. Create a new Blueprint deployment from the GitHub repo.
2. Confirm the generated web service `firmify-ai-api`.
3. Add `OPENAI_API_KEY` in the Render environment settings.
4. After deploy, copy the live API URL, for example `https://firmify-ai-api.onrender.com`.

### Frontend on Vercel

The repository includes [vercel.json](/c:/Users/ayush/OneDrive/Desktop/scrapper/ai-firmware-studio/vercel.json).

On Vercel:

1. Import the GitHub repo.
2. Set the root to the repository root.
3. Add environment variables:
   `VITE_API_BASE_URL=https://firmify-ai-api.onrender.com/api`
   `VITE_SITE_URL=https://firmify-ai.vercel.app`
4. Deploy and connect the custom production domain or keep the Vercel URL.

### CORS

Render should expose:

```text
CORS_ORIGINS=https://firmify-ai.vercel.app,http://localhost:5173,http://127.0.0.1:5173
```

If your Vercel URL differs, update the Render environment variable to match it.

## API

### `POST /api/generate`

Request body:

```json
{
  "prompt": "Create firmware for STM32 that reads ADC from PA1 and sends value over UART every 500ms.",
  "board": "stm32f103",
  "use_ai": true
}
```

### `GET /api/boards`

Returns supported board metadata and capabilities.

### `GET /api/download?artifact_id=<id>`

Downloads the generated ZIP artifact.

## Demo Commands

```powershell
curl http://127.0.0.1:8000/api/boards
```

```powershell
curl -X POST http://127.0.0.1:8000/api/generate `
  -H "Content-Type: application/json" `
  -d "{\"prompt\":\"Create firmware for STM32 that reads ADC from PA1 and sends value over UART every 500ms.\",\"board\":\"stm32f103\",\"use_ai\":true}"
```

## Example Prompts

- `Create firmware for STM32 that reads ADC from PA1 and sends value over UART every 500ms.`
- `Build Arduino Uno firmware that samples A0 and prints readings every 1s.`
- `Generate ESP32 firmware that toggles GPIO2 and streams status over UART.`
- `Create STM32 firmware that blinks PC13 every 200ms and logs heartbeat text over UART.`

## Example Output

The repository includes a generated STM32 example:

- [examples/stm32_adc_uart_500ms.prompt.txt](/c:/Users/ayush/OneDrive/Desktop/scrapper/ai-firmware-studio/examples/stm32_adc_uart_500ms.prompt.txt)
- [examples/stm32_adc_uart_500ms.main.c](/c:/Users/ayush/OneDrive/Desktop/scrapper/ai-firmware-studio/examples/stm32_adc_uart_500ms.main.c)
- `examples/stm32_adc_uart_500ms/` contains the full generated starter project.

## Development Notes

- The OpenAI integration uses the Python SDK and requests structured JSON output for intent extraction.
- Generated firmware is designed as a board-aware starter project and can be extended into a vendor SDK or HAL-based workflow.
- BSP source stubs are copied into each artifact to provide a starting point for customization.
- `vercel.json` is included so the frontend can be deployed quickly after the repo is pushed.
- `render.yaml` is included so the backend can be deployed quickly after the repo is pushed.

## License

MIT
