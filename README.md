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
  <a href="#deployment">Deployment</a> •
  <a href="#tech-stack">Tech Stack</a>
</p>

---

## Overview

**Lexify** is a full-stack web application purpose-built to improve reading accessibility for individuals with dyslexia and reading comprehension challenges. By leveraging **Google Gemini 2.5 Flash**, Lexify intelligently transforms complex, jargon-heavy text into clear and digestible content — with a single click.

Unlike conventional reading tools, Lexify goes beyond simple font changes. It provides a complete AI-powered reading pipeline: from importing content through multiple sources, to processing it with a state-of-the-art language model, to delivering it through a fully customizable, accessibility-first interface with built-in auditory support.

---

## Features

### 📥 Multi-Source Content Input
| Source | Description |
|--------|-------------|
| **Paste Text** | Paste any content directly into the input panel for immediate processing. |
| **Image OCR** | Upload an image (`.jpg`, `.png`, etc.) and Gemini Vision extracts and simplifies the text. |
| **URL Fetch** | Provide a webpage URL and the backend scrapes, cleans, and processes the article body. |
| **PDF Upload** | Upload a PDF document; the server parses it and sends the content for simplification. |

### 🤖 AI Simplification Modes
| Mode | Description |
|------|-------------|
| **Simplified English** | Rewrites dense or complex text in simple, short sentences (max 15 words) with a glossary of difficult terms. |
| **Bullet Points** | Distills long-form content into 5–8 concise, scannable bullet points. |
| **Plain Text** | Cleans up grammar, removes jargon, and simplifies paragraph structure without losing meaning. |

### ♿ Accessibility Toolkit
- **OpenDyslexic Font**: Toggleable font scientifically designed to improve readability for people with dyslexia.
- **Visual Customization**: Real-time sliders for font size, line height, and word spacing.
- **Text-to-Speech**: Robust auditory reading support powered by the Web Speech API, with intelligent sentence-level chunking to prevent Chrome's 15-second cutoff and silent fail bugs.
- **Readability Scoring**: Flesch-Kincaid Grade Level calculated before and after simplification to show measurable improvement.
- **Focus Mode**: A distraction-free reading environment with sentence-by-sentence card navigation.
- **Glossary**: Automatically generated definitions for complex vocabulary identified by the AI.

### 🧩 Chrome Extension
A companion browser extension is available to simplify text anywhere on the web without leaving the page. Download the `.zip` directly from the Lexify landing page and load it as an unpacked extension in Chrome.

---

## Project Structure

```
hacknova-main/
├── client/                   # React frontend (Vite)
│   ├── public/
│   │   └── lexify-extension.zip  # Downloadable Chrome Extension
│   └── src/
│       ├── components/       # UI Components (Header, Input, Output, TTS, etc.)
│       └── App.jsx           # Main application logic and state
│
├── server/                   # Node.js / Express backend
│   ├── routes/
│   │   └── simplify.js       # Core AI simplification route (Gemini)
│   ├── utils/
│   │   └── readability.js    # Flesch-Kincaid calculation
│   └── index.js              # Express server entry point
│
├── chrome-extension/         # Chrome extension source files
├── .env.example              # Environment variable template
└── package.json              # Root scripts for build & deployment
```

---

## Getting Started

### Prerequisites
- **Node.js** v18 or higher
- A **Google Gemini API Key** (free tier available at [aistudio.google.com](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/Arnav2706/hacknova-main.git
cd hacknova-main
```

### 2. Install All Dependencies
This single command installs packages for the root, client, and server:
```bash
npm run install:all
```

### 3. Configure Environment Variables
Create a `.env` file in the **root directory** by copying the example:
```bash
cp .env.example .env
```
Then open `.env` and fill in your key:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=5000
```

### 4. Start Development Servers
Run both the React dev server and the Express backend concurrently:
```bash
npm run dev
```

| Service | URL |
|---------|-----|
| React Frontend (Vite HMR) | `http://localhost:5173` |
| Express Backend (API) | `http://localhost:5000` |

### 5. Production Preview (Optional)
To preview the full production build locally:
```bash
npm run build
npm start
```
The full application (frontend + backend) will be available at `http://localhost:5000`.

---

## Deployment

Lexify is configured for seamless deployment on **Render**.

| Setting | Value |
|---------|-------|
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Environment** | Node.js |

> ⚠️ **Important**: The `.env` file is excluded from Git for security. You **must** add your `GEMINI_API_KEY` manually in the Render dashboard under **Environment → Environment Variables**.

----

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express 5 |
| **AI / NLP** | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| **Image OCR** | Gemini Vision (multimodal) |
| **PDF Parsing** | `pdf-parse` |
| **Web Scraping** | `cheerio`, `node-fetch` |
| **Text-to-Speech** | Web Speech API (browser-native) |
| **File Uploads** | `multer` (in-memory storage) |
| **Deployment** | Render |

---

## Available Scripts

From the **root directory**:

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install all dependencies (root + client + server) |
| `npm run dev` | Start both client and server in development mode |
| `npm run build` | Build the React frontend for production |
| `npm start` | Run the production Express server (serves built frontend) |

----

## License

This project was built for **HackNova** and is intended for educational and accessibility purposes.
