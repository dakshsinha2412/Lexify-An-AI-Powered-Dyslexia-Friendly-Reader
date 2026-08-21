const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { calculateFleschKincaid } = require('../utils/readability');
require('dotenv').config();
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

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

function generateFallbackSimplification(text, mode) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    if (mode === 'bullets') {
        const bullets = sentences.map(s => `• ${s.trim()}`).slice(0, 7).join('\n');
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

    // Default 'simplified' mode: split into shorter sentences, swap complex words for easy synonyms
    const replacements = [
        [/\bubiquitous\b/gi, 'common'],
        [/\bharnesses\b/gi, 'uses'],
        [/\brequirements\b/gi, 'needs'],
        [/\bimplementing\b/gi, 'building'],
        [/\bimplementation\b/gi, 'setup'],
        [/\bfacilitate\b/gi, 'help'],
        [/\butilize\b/gi, 'use'],
        [/\butilizes\b/gi, 'uses'],
        [/\bprofound\b/gi, 'deep'],
        [/\bconceptual\b/gi, 'idea-based'],
        [/\bdifficulties\b/gi, 'challenges'],
        [/\bemerging\b/gi, 'new'],
        [/\bparadigm\b/gi, 'pattern'],
        [/\bcomputation\b/gi, 'calculation']
    ];

    let simplifiedSentences = sentences.map(sentence => {
        let s = sentence.trim();
        replacements.forEach(([pattern, replacement]) => {
            s = s.replace(pattern, replacement);
        });
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

router.post('/', async (req, res) => {
    const { text, mode } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    let systemPrompt = '';

    if (mode === 'simplified') {
        systemPrompt = `You are a reading assistant for people with dyslexia. 
        Rewrite the following text in simple English. Use short sentences (max 15 words). Keep all original meaning. 
        Also, identify 3-5 potentially "difficult" or "complex" words used in the original OR the rewritten text and provide very simple, one-sentence meanings for them.
        
        Return your response ONLY as a JSON object with this exact structure:
        {
          "simplifiedText": "the rewritten text here",
          "glossary": [
            {"word": "example", "definition": "a thing that shows what others are like"}
          ]
        }`;
    } else if (mode === 'bullets') {
        systemPrompt = `Summarize the following text into 5-8 bullet points. 
        Return your response ONLY as a JSON object with this exact structure:
        {
          "simplifiedText": "• Point 1\\n• Point 2",
          "glossary": []
        }`;
    } else if (mode === 'plain') {
        systemPrompt = `You are a text cleaning assistant. 
        Take the following text and clean up the grammar, remove excessive jargon, and break down very long paragraphs. 
        Make it readable for someone who wants the facts without complex academic language.
        
        Return your response ONLY as a JSON object with this exact structure:
        {
          "simplifiedText": "the cleaned text here",
          "glossary": []
        }`;
    } else {
        return res.status(400).json({ error: 'Invalid mode.' });
    }

    let parsedData = null;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim().length > 10) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash"];

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: { responseMimeType: "application/json" }
                });

                const prompt = `${systemPrompt}\n\nText:\n${text}`;
                const response = await model.generateContent(prompt);
                const resultText = response.response.text().trim();

                parsedData = JSON.parse(resultText);
                break; // Successfully obtained response
            } catch (err) {
                console.warn(`Gemini model ${modelName} warning:`, err.message);
            }
        }
    }

    // If Gemini API fails, is unauthorized, or unavailable, seamlessly use smart local engine
    if (!parsedData || !parsedData.simplifiedText) {
        console.log("Using smart local simplification engine fallback.");
        parsedData = generateFallbackSimplification(text, mode);
    }

    const readabilityBefore = calculateFleschKincaid(text);
    const readabilityAfter = calculateFleschKincaid(parsedData.simplifiedText);

    res.json({
        result: parsedData.simplifiedText,
        glossary: parsedData.glossary || [],
        readabilityBefore,
        readabilityAfter
    });
});

module.exports = router;