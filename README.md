<h1 align="center">
  <br>
  🧠 Lexify — AI-Powered Dyslexia-Friendly Reader
  <br>
</h1>

<h4 align="center">An Accessibility-Focused Assistive Reading Platform built with React, Node.js & Google Gemini 2.5 Flash</h4>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js&logoColor=white"/>
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black"/>
  <img alt="Express" src="https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white"/>
  <img alt="Google Gemini" src="https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white"/>
  <img alt="Render Deployment" src="https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=flat-square&logo=render&logoColor=white"/>
</p>

<p align="center">
  <a href="#executive-summary">Executive Summary</a> •
  <a href="#key-engineering-highlights">Engineering Highlights</a> •
  <a href="#system-architecture">Architecture</a> •
  <a href="#core-features">Features</a> •
  <a href="#technical-challenges--solutions">Challenges & Solutions</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a>
</p>

---

## Executive Summary

**Lexify** is an end-to-end accessibility platform designed to solve cognitive reading bottlenecks for individuals with dyslexia and reading comprehension difficulties. Rather than relying solely on surface-level visual tweaks, Lexify combines **multimodal AI content ingestion (OCR, Web Scraping, PDF Parsing)** with **Google Gemini 2.5 Flash** to perform semantic text transformation, syntactic simplification, automated vocabulary glossary generation, and real-time readability scoring.

It includes both a **full-stack web application** (React + Express) and a companion **Manifest V3 Chrome Extension** for on-the-fly web page simplification.

---

## Key Engineering Highlights

- ⚡ **Sub-Second AI Pipeline**: Engineered prompt structures for Gemini 2.5 Flash returning structured JSON containing simplified text, bullet points, and dynamic vocabulary glossaries in a single inference call.
- 🔊 **Resilient TTS Chunking Protocol**: Resolved Chrome's native Web Speech API 15-second silent-fail bug by implementing custom sentence-level boundary queueing and chunk fallback mechanisms.
- 📄 **Multimodal Ingestion**: Integrated zero-dependency server-side PDF parsing and Gemini Vision OCR for extracting and processing text directly from unformatted images.
- 🧩 **Cross-Context Chrome Extension**: Built a Manifest V3 companion extension with customizable backend API dynamic endpoint switching and background fallback fetching.
- 📊 **Quantifiable Readability Metrics**: Implemented automated client/server Flesch-Kincaid Grade Level scoring to prove measurable readability improvement before and after AI transformation.

---

## System Architecture

```text
                                 ┌─────────────────────────────────┐
                                 │      Manifest V3 Extension      │
                                 │  (Selection Overlay / Popup UI) │
                                 └────────────────┬────────────────┘
                                                  │ REST API
                                                  ▼
┌────────────────────────────────┐       ┌─────────────────────────────────┐
│     React 18 SPA (Client)      │──────>│      Express 5 Server (API)     │
│ (Custom UI, OpenDyslexic, TTS) │       │  (Scraper, Multer, Readability) │
└────────────────────────────────┘       └────────────────┬────────────────┘
                                                          │
                                                          ▼
                                         ┌─────────────────────────────────┐
                                         │ Google Gemini 2.5 Flash SDK     │
                                         │  (Text & Multimodal Vision API) │
                                         └─────────────────────────────────┘
```

---

## Technical Challenges & Solutions

### 1. Workaround for Web Speech API 15-Second Engine Silent-Fail
* **Problem**: Chrome's native SpeechSynthesis API silently stops speaking long paragraphs after ~15 seconds without throwing an error event.
* **Solution**: Designed a client-side audio manager that splits paragraphs into discrete sentence boundary arrays, playing them sequentially with regex tokenization and auto-advancing highlight cues.

### 2. PDF Parsing Incompatibility in Production Serverless/Container Environments
* **Problem**: Common PDF parsing libraries rely on native binary bindings or test file artifacts that break in slim containerized environments (Render / Serverless).
* **Solution**: Configured lightweight pure JavaScript PDF text extraction (`pdf-parse`) and implemented buffer-first multer handling without saving temp files to disk.

### 3. Dynamic API Target Routing in Extension
* **Problem**: Chrome extension hardcoded localhost endpoints prevented usage in staging/production deployments.
* **Solution**: Added reactive options storage in `chrome.storage.sync` allowing users to configure custom backend production gateways dynamically.

---

## Core Features

- **Multi-Source Content Processing**: Direct text input, web article URL scraping (`cheerio`), PDF document upload, and image OCR via Gemini Vision.
- **3 Simplification Modes**: Simplified English (max 15 words/sentence), Bullet Point Distillation, and Plain Text structural cleanup.
- **Accessibility Toolkit**: Toggleable **OpenDyslexic font**, real-time letter/word spacing & line height sliders, sentence-level Focus Mode, and TTS.
- **Readability Analytics**: Real-time Flesch-Kincaid grade level scoring showing initial vs simplified reading levels.

---

## Tech Stack

| Domain | Technologies |
|--------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Web Speech API |
| **Backend** | Node.js (v22), Express 5, Multer, Cheerio, Node-Fetch |
| **AI / NLP** | `@google/generative-ai` (Gemini 2.5 Flash & Vision) |
| **Browser Extension** | Chrome Manifest V3, Content Scripts, Service Worker |
| **Deployment** | Render (Infrastructure-as-Code via `render.yaml`) |

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/dakshsinha2412/Lexify-An-AI-Powered-Dyslexia-Friendly-Reader.git
cd Lexify-An-AI-Powered-Dyslexia-Friendly-Reader
npm run install:all
```

### 2. Environment Setup
Create `.env` in root:
```env
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
```

### 3. Run Locally
```bash
npm run dev
```
- App: `http://localhost:5173` | API: `http://localhost:5000`

---

## Author & Project Info

Designed & engineered for accessibility and educational impact.
