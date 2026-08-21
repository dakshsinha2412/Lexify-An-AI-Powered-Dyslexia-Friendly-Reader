const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '../.env' });

async function testGemini() {
    const key = process.env.GEMINI_API_KEY;
    console.log("API Key loaded:", key ? (key.substring(0, 10) + "...") : "MISSING");
    const genAI = new GoogleGenerativeAI(key);

    const modelsToTest = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"];
    for (const m of modelsToTest) {
        try {
            console.log(`\nTesting model ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const res = await model.generateContent("Say hello in 3 words");
            console.log(`Success with ${m}:`, res.response.text());
            return m;
        } catch (err) {
            console.error(`Error with ${m}:`, err.message);
        }
    }
}

testGemini();
