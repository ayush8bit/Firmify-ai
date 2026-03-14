# Firmify.ai

Firmify.ai is a web app that helps people turn plain-English hardware ideas into starter firmware projects.

Instead of opening vendor tools, digging through datasheets, remembering pin mappings, and writing boilerplate from scratch, you can describe what you want in one sentence and get back structured embedded C firmware you can inspect, download, and build on.

Example:

```text
Create firmware for STM32 that reads ADC from PA1 and sends value over UART every 500ms.
```

Firmify.ai reads that prompt, understands the board and peripherals involved, and generates a ready-to-edit firmware project with files like `main.c`, `adc.c`, `uart.c`, `gpio.c`, `interrupts.c`, and a build skeleton.

## Why I Built This

Embedded development is powerful, but it is also slow to get started.

A lot of people hit the same wall:
- They know what they want the hardware to do
- They do not know the exact driver setup yet
- They get stuck in board setup, initialization, clock config, and peripheral boilerplate
- They lose time jumping between documentation, examples, forums, and IDEs

Firmify.ai is meant to reduce that friction.

It does not try to replace embedded engineers.
It helps them start faster.

It is especially useful for:
- students learning microcontrollers
- makers and hobbyists building prototypes
- embedded engineers who want a faster starting point
- hackathon teams building hardware demos
- software developers entering embedded systems for the first time

## The Problem Firmify.ai Solves

Firmware work often starts with repetitive setup:
- choosing the right board and peripherals
- figuring out which pins make sense
- wiring up ADC, UART, GPIO, timing loops, and interrupts
- creating the same project structure again and again
- translating a functional idea into low-level code

That setup work is necessary, but it is rarely the interesting part.

Firmify.ai helps by converting a human description into a board-aware firmware starter project. That means less time spent on boilerplate, and more time spent testing the actual idea.

## How It Helps People

Firmify.ai helps people move from "idea" to "starting code" quickly.

Instead of this:
- search examples
- read docs
- guess peripheral setup
- hand-write project files
- debug missing pieces

You get this:
- type your hardware intention
- choose a board
- inspect generated firmware
- download the project
- customize and continue

It gives people a practical bridge between high-level thinking and low-level embedded implementation.

## Inspiration

Firmify.ai is inspired by products and workflows that make technical work feel more conversational and less intimidating.

The project draws inspiration from:
- **ChatGPT / AI coding copilots** for natural-language interaction
- **Vercel-style product UX** for clean, minimal, modern presentation
- **Replit / CodeSandbox-style fast iteration** where you can quickly move from idea to output
- **PlatformIO / STM32CubeMX workflows** in the sense that they help scaffold embedded projects
- **Developer tools with preview-first design** where people can inspect results before committing to them

Firmify.ai takes inspiration from those experiences, but focuses specifically on firmware generation for embedded systems.

## How It Works

The system follows a simple pipeline:

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

In practice, that means:
1. You describe the behavior you want
2. Firmify.ai extracts the MCU, peripherals, pins, and timing
3. It maps that request to a supported board
4. It generates firmware source files from templates
5. You preview the code in the browser
6. You download the project as a ZIP

## Current Board Support

Firmify.ai currently includes starter support for:
- STM32F103 Blue Pill
- ESP32 DevKit
- Arduino Uno

Each board support package includes:
- clock config
- GPIO mapping
- UART driver
- ADC driver
- interrupt handlers

## How To Use

### 1. Open the website

Visit:

```text
https://firmify-ai.vercel.app
```

### 2. Describe your firmware

Type a prompt such as:

```text
Create firmware for STM32 that reads ADC from PA1 and sends value over UART every 500ms.
```

### 3. Choose your board

Pick the target board from the dropdown.

### 4. Generate firmware

Click **Generate with Firmify.ai**.

### 5. Review the result

You will see:
- the parsed hardware intent
- generated source files
- a firmware preview window
- downloadable project output

### 6. Download and continue

Download the ZIP and use it as a starting point for your real embedded project.

## Example Prompts

- `Create firmware for STM32 that reads ADC from PA1 and sends value over UART every 500ms.`
- `Build Arduino Uno firmware that samples A0 and prints readings every 1s.`
- `Generate ESP32 firmware that toggles GPIO2 and streams status over UART.`
- `Create STM32 firmware that blinks PC13 every 200ms and logs heartbeat text over UART.`

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

### Backend
- FastAPI
- Pydantic

### AI Layer
- OpenAI API integration
- rule-based fallback parser

### Firmware Generation
- template-based C code generator

## Project Structure

```text
ai-firmware-studio
├── frontend
├── backend
├── bsp
├── templates
├── firmware_output
├── examples
└── README.md
```

## Running Locally

### Backend

```powershell
cd ai-firmware-studio\backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

### Frontend

```powershell
cd ai-firmware-studio\frontend
npm install
copy .env.example .env
npm run dev
```

## Deployment

### Live frontend
```text
https://firmify-ai.vercel.app
```

### Live backend
```text
https://firmify-ai-api.onrender.com
```

## What This Project Is Not

Firmify.ai is a strong starting point, not a final replacement for production firmware engineering.

You should still:
- verify generated pin mappings
- validate board-specific hardware assumptions
- test timing and interrupt behavior on real hardware
- adapt the code for your SDK, HAL, or production build system

## Future Direction

Some natural next steps for Firmify.ai are:
- support for more boards and vendors
- richer HAL / SDK integration
- smarter debugging suggestions
- project export formats for real embedded toolchains
- simulation and validation workflows
- team collaboration around firmware prompts and generated artifacts

## License

MIT
