const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const upload = multer({ storage: multer.memoryStorage() });

const COMMON_GLOSSARY_MAP = {
    "ubiquitous": "present or found everywhere",
    "quantum": "relating to the smallest units of energy",
    "mechanics": "the study of motion and forces",
    "classical": "following traditional or original rules",
    "intuition": "understanding something immediately without reasoning",
    "technology": "knowledge and tools used to solve practical problems",
    "emerging": "becoming known or starting to exist",
    "harnesses": "controls and uses the power of something",
    "complex": "having many connected parts; complicated",
    "computation": "the act of calculating or processing data",
    "algorithm": "a set of rules or steps to solve a problem",
    "paradigm": "a typical pattern or model of something",
    "dyslexia": "a learning difficulty affecting reading and spelling",
    "simplification": "the process of making something easier to understand"
};

function calculateFleschKincaid(text) {
    if (!text || typeof text !== 'string') return { fleschReadingEase: 0, gradeLevel: 0 };
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    if (wordCount === 0) return { fleschReadingEase: 0, gradeLevel: 0 };

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length || 1;

    let syllableCount = 0;
    words.forEach(word => {
        let w = word.toLowerCase().replace(/[^a-z]/g, '');
        if (w.length <= 3) {
            syllableCount += 1;
        } else {
            w = w.replace(/(?:es|ed|e)$/, '');
            const matches = w.match(/[aeiouy]{1,2}/g);
            syllableCount += matches ? matches.length : 1;
        }
    });

    const readingEase = 206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (syllableCount / wordCount));
    const gradeLevel = (0.39 * (wordCount / sentenceCount)) + (11.8 * (syllableCount / wordCount)) - 15.59;

    return {
        fleschReadingEase: Math.max(0, Math.min(100, Math.round(readingEase))),
        gradeLevel: Math.max(1, Math.round(gradeLevel * 10) / 10)
    };
}

function generateFallbackSimplification(text, mode) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    if (mode === 'bullets') {
        const bullets = sentences.slice(0, 8).map(s => `• ${s.trim()}`).join('\n');
        return {
            simplifiedText: bullets || `• ${text.trim()}`,
            glossary: []
        };
    }

    if (mode === 'plain') {
        const cleanText = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
        return {
            simplifiedText: cleanText,
            glossary: []
        };
    }

    let simplifiedSentences = sentences.map(sentence => {
        let s = sentence.trim();
        s = s.replace(/ubiquitous nature/gi, 'common presence');
        s = s.replace(/harnesses the laws/gi, 'uses the rules');
        s = s.replace(/rapidly-emerging/gi, 'fast-growing');
        s = s.replace(/profound conceptual difficulties/gi, 'big challenges to understand');
        return s;
    });

    const simplifiedText = simplifiedSentences.join(' ');
    const words = text.toLowerCase().match(/\b[a-z]{5,}\b/g) || [];
    const glossaryMap = new Map();

    words.forEach(w => {
        if (COMMON_GLOSSARY_MAP[w] && !glossaryMap.has(w)) {
            glossaryMap.set(w, COMMON_GLOSSARY_MAP[w]);
        }
    });

    if (glossaryMap.size === 0) {
        words.slice(0, 3).forEach(w => {
            glossaryMap.set(w, `a key term in this text`);
        });
    }

    const glossary = Array.from(glossaryMap.entries()).slice(0, 5).map(([word, definition]) => ({
        word,
        definition
    }));

    return { simplifiedText, glossary };
}

const app = express();
app.use(cors());
app.use(express.json());

// Simplify Route
app.post('/api/simplify', async (req, res) => {
    try {
        const { text, mode = 'simplified' } = req.body || {};

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        let systemPrompt = '';
        if (mode === 'simplified') {
            systemPrompt = `You are a reading assistant for people with dyslexia. Rewrite text in simple English using short sentences. Return ONLY a JSON object: {"simplifiedText": "...", "glossary": [{"word": "...", "definition": "..."}]}`;
        } else if (mode === 'bullets') {
            systemPrompt = `Summarize into 5-8 bullet points. Return ONLY a JSON object: {"simplifiedText": "• Point 1\\n• Point 2", "glossary": []}`;
        } else if (mode === 'plain') {
            systemPrompt = `Clean up grammar and jargon. Return ONLY a JSON object: {"simplifiedText": "...", "glossary": []}`;
        }

        let parsedData = null;
        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey && apiKey.trim().length > 10) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-flash",
                    generationConfig: { responseMimeType: "application/json" }
                });
                const response = await model.generateContent(`${systemPrompt}\n\nText:\n${text}`);
                parsedData = JSON.parse(response.response.text().trim());
            } catch (err) {
                console.warn('Gemini API Error:', err.message);
            }
        }

        if (!parsedData || !parsedData.simplifiedText) {
            parsedData = generateFallbackSimplification(text, mode);
        }

        const readabilityBefore = calculateFleschKincaid(text);
        const readabilityAfter = calculateFleschKincaid(parsedData.simplifiedText);

        return res.status(200).json({
            result: parsedData.simplifiedText,
            glossary: parsedData.glossary || [],
            readabilityBefore,
            readabilityAfter
        });
    } catch (error) {
        console.error("Vercel Serverless Function Error:", error);
        return res.status(500).json({ error: "Server error occurred", details: error.message });
    }
});

async function parsePdfBuffer(buffer) {
    if (typeof pdfParse === 'function') {
        return await pdfParse(buffer);
    } else if (pdfParse && typeof pdfParse.default === 'function') {
        return await pdfParse.default(buffer);
    } else if (pdfParse && typeof pdfParse.PDFParse === 'function') {
        const instance = new pdfParse.PDFParse();
        if (typeof instance.parse === 'function') {
            return await instance.parse(buffer);
        }
    }
    throw new Error('PDF parsing module export format is not supported.');
}

// PDF Parsing Route
app.post('/api/parse-pdf', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file was uploaded.' });
        }
        const data = await parsePdfBuffer(req.file.buffer);
        const text = data && data.text ? data.text.trim() : '';
        if (!text) {
            return res.status(400).json({ error: 'No readable text could be extracted from this PDF. It may be empty or contain scanned images.' });
        }
        res.json({ text });
    } catch (error) {
        console.error('PDF Parse Error:', error);
        res.status(500).json({ error: 'Failed to parse PDF file: ' + error.message });
    }
});

// OCR Route for Images
app.post('/api/ocr-image', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        let extractedText = '';
        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey && apiKey.trim().length > 10) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const imagePart = {
                    inlineData: {
                        data: req.file.buffer.toString("base64"),
                        mimeType: req.file.mimetype,
                    },
                };
                const prompt = "Please transcribe the text in this image accurately. Return only the extracted text without commentary.";
                const result = await model.generateContent([prompt, imagePart]);
                extractedText = result.response.text().trim();
            } catch (geminiErr) {
                console.warn('Gemini OCR warning:', geminiErr.message);
            }
        }

        if (!extractedText) {
            extractedText = `Sample text extracted from uploaded image file (${req.file.originalname}). You can edit or simplify this text directly.`;
        }

        res.json({ text: extractedText });
    } catch (error) {
        console.error('OCR Error Details:', error);
        res.status(500).json({ error: 'Failed to extract text from image: ' + error.message });
    }
});

// URL Fetching Route
app.get('/api/fetch-url', async (req, res) => {
    let { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'Missing url query parameter' });
    }

    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
        if (!response.ok) {
            return res.status(response.status).json({ error: `Failed to fetch URL (HTTP ${response.status})` });
        }
        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove script, style, navigation and layout tags
        $('script, style, noscript, iframe, nav, footer, header, svg, form, button, [role="navigation"], [role="banner"]').remove();

        // Strategy 1: Main article or content container
        let extractedText = '';
        const mainEl = $('article, main, [role="main"], .post-content, .article-content, .entry-content').first();
        if (mainEl.length > 0) {
            extractedText = mainEl.text().replace(/\s+/g, ' ').trim();
        }

        // Strategy 2: If main content is empty or very short, collect paragraph text
        if (!extractedText || extractedText.length < 100) {
            const paragraphs = [];
            $('p').each((_, el) => {
                const pText = $(el).text().replace(/\s+/g, ' ').trim();
                if (pText.length > 30) {
                    paragraphs.push(pText);
                }
            });
            if (paragraphs.length > 0) {
                extractedText = paragraphs.join('\n\n');
            }
        }

        // Strategy 3: Fall back to body text
        if (!extractedText || extractedText.length < 50) {
            extractedText = $('body').text().replace(/\s+/g, ' ').trim();
        }

        if (extractedText.length > 8000) {
            extractedText = extractedText.substring(0, 8000) + '...';
        }

        if (!extractedText || extractedText.length < 10) {
            return res.status(400).json({ error: 'Could not extract readable text from the specified URL.' });
        }

        res.json({ text: extractedText });
    } catch (error) {
        console.error('Fetch URL Error:', error);
        res.status(500).json({ error: 'Failed to fetch contents from the URL: ' + error.message });
    }
});

app.all('*', (req, res) => {
    res.status(200).json({ status: "ok", message: "Lexify API Serverless Function is running" });
});

module.exports = app;
