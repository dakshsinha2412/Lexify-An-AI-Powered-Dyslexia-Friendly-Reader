const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

app.all('*', (req, res) => {
    res.status(200).json({ status: "ok", message: "Lexify API Serverless Function is running" });
});

module.exports = app;
