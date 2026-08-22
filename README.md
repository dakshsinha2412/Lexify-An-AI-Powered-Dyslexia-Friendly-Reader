<h1 align="center">
  <br>
  🧠 Lexify
  <br>
</h1>

<h4 align="center">An AI-Powered Dyslexia-Friendly Reader built with Google Gemini</h4>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js&logoColor=white"/>
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black"/>
  <img alt="Express" src="https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white"/>
  <img alt="Gemini" src="https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white"/>
  <img alt="Deployed on Render" src="https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=flat-square&logo=render&logoColor=white"/>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#chrome-extension">Chrome Extension</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#tech-stack">Tech Stack</a>
</p>

---

## Overview

**Lexify** is a full-stack web application purpose-built to improve reading accessibility for individuals with dyslexia and reading comprehension challenges. By leveraging **Google Gemini 2.5 Flash**, Lexify intelligently transforms complex, jargon-heavy text into clear and digestible content — with a single click.

Unlike conventional reading tools, Lexify goes beyond simple font changes. It provides a complete AI-powered reading pipeline: from importing content through multiple sources (raw text, web page URLs, PDF files, and image OCR), to processing it with a state-of-the-art language model, to delivering it through a fully customizable, accessibility-first interface with built-in auditory support.

---

## Features

### 📥 Multi-Source Content Input
| Source | Description |
|--------|-------------|
| **Paste Text** | Paste any content directly into the input panel for immediate AI simplification. |
| **Image OCR** | Upload images (`.jpg`, `.png`, etc.) and Gemini Vision extracts and simplifies the embedded text. |
| **URL Fetch** | Provide a webpage URL and the backend scrapes, cleans, and processes the article body. |
| **PDF Upload** | Upload PDF documents; the server parses the text contents and sends them for simplification. |

### 🤖 AI Simplification Modes
| Mode | Description |
|------|-------------|
| **Simplified English** | Rewrites dense or complex text into simple, concise sentences (max 15 words) alongside an automatically generated glossary. |
| **Bullet Points** | Distills long-form content into 5–8 concise, scannable bullet points. |
| **Plain Text** | Cleans up grammar, removes heavy jargon, and simplifies paragraph structure without losing meaning. |

### ♿ Accessibility Toolkit
- **OpenDyslexic Font**: Toggleable font specifically designed to reduce reading errors and improve readability for people with dyslexia.
- **Visual Customization**: Real-time interactive sliders for font size, line height, and word spacing.
- **Text-to-Speech (TTS)**: Auditory reading support powered by the Web Speech API, with sentence-level chunking to prevent browser speech cutoffs.
- **Readability Scoring**: Calculates the Flesch-Kincaid Grade Level score before and after simplification to showcase quantifiable reading ease improvements.
- **Focus Mode**: A distraction-free reading view with step-by-step sentence card navigation.
- **Interactive Glossary**: Highlights and defines complex terms identified automatically by the Gemini AI.

---

## Project Structure

```
Lexify-An-AI-Powered-Dyslexia-Friendly-Reader/
├── client/                   # React frontend (Vite + Tailwind CSS)
│   ├── public/
│   │   └── lexify-extension.zip  # Downloadable Chrome Extension package
│   └── src/
│       ├── components/       # UI Components (Header, Input, Output, TTS, Settings, etc.)
│       └── App.jsx           # Main application state and integration
│
├── server/                   # Node.js / Express backend
│   ├── routes/
│   │   └── simplify.js       # Core AI simplification API (Gemini integration)
│   ├── utils/
│   │   └── readability.js    # Flesch-Kincaid grade level calculation utility
│   └── index.js              # Express server entry point & static client fallback
│
├── chrome-extension/         # Source files for the companion Chrome Extension
│   ├── background.js         # Service worker with configurable API backend support
│   ├── content.js            # In-page text selection & overlay reader
│   ├── popup.html / popup.js # Extension popup UI & backend URL settings
│   └── manifest.json         # Extension Manifest V3 configuration
│
├── render.yaml               # Render Infrastructure-as-Code Blueprint
├── .env.example              # Environment variable configuration template
└── package.json              # Root build, dev, and installation scripts
```

---

## Getting Started

### Prerequisites
- **Node.js** v18 or higher
- A **Google Gemini API Key** (Get a free key at [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/dakshsinha2412/Lexify-An-AI-Powered-Dyslexia-Friendly-Reader.git
cd Lexify-An-AI-Powered-Dyslexia-Friendly-Reader
```

### 2. Install All Dependencies
Install dependencies for root, server, and client with a single command:
```bash
npm run install:all
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Fill in your API key:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=5000
```

### 4. Start Development Mode
Run both the frontend (Vite) and backend (Express) concurrently:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

### 5. Production Preview
Build and run the unified production server locally:
```bash
npm run build
npm start
```
The full application will be served at `http://localhost:5000`.

---

## Chrome Extension

Lexify includes a Manifest V3 **Chrome Companion Extension** to simplify selected text directly on any webpage.

### Installation
1. Download `lexify-extension.zip` from the Lexify web app or locate the `chrome-extension/` directory.
2. Unzip the file if downloaded.
3. Open Chrome and go to `chrome://extensions/`.
4. Enable **Developer mode** in the top-right corner.
5. Click **Load unpacked** and select the unzipped extension folder.

### Configuration
Open the extension popup options to set your target Backend API Server URL:
- Local Development: `http://localhost:5000`
- Production Deployment: `https://your-lexify-app.onrender.com`

---

## Deployment

Lexify is pre-configured for one-click deployment on **Render** using `render.yaml`.

| Configuration | Value |
|---------------|-------|
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Node.js Version** | `22.x` |

> ⚠️ **Important**: Configure `GEMINI_API_KEY` under Environment Variables in your Render Dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express 5 |
| **AI / Multimodal** | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| **Document Processing** | `pdf-parse` (PDF parsing), `cheerio` & `node-fetch` (Web scraping) |
| **File Uploads** | `multer` (in-memory storage) |
| **Text-to-Speech** | Web Speech API |
| **Extension** | Chrome Extension Manifest V3 |
| **Deployment** | Render |

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run install:all` | Installs root, client, and server dependencies |
| `npm run dev` | Runs client (Vite) and server (Express) concurrently in dev mode |
| `npm run build` | Builds client assets and installs server packages |
| `npm start` | Launches production server serving API + static frontend |

---

## License

This project is open-source and built for accessibility and educational purposes.
