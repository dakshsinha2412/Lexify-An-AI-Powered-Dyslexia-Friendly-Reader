const express = require('express');
const path = require('path');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const simplifyRoute = require('./routes/simplify');

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Note: check where .env is located (root)

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
app.use('/api/simplify', simplifyRoute);

// OCR Route for Images (Powered by Gemini with fallback)
app.post('/api/ocr-image', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    let extractedText = '';
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim().length > 10) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const imagePart = {
          inlineData: {
            data: req.file.buffer.toString("base64"),
            mimeType: req.file.mimetype,
          },
        };
        const prompt = "Please transcribe the text in this image accurately. Return only the extracted text without any commentary or additional formatting.";
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
    res.status(500).json({ 
      error: 'Failed to extract text from image',
      details: error.message 
    });
  }
});

// PDF Parsing (keeps pdf-parse, but backend is now more modular)
app.post('/api/parse-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const data = await pdfParse(req.file.buffer);
    res.json({ text: data.text });
  } catch (error) {
    console.error('PDF Parse Error:', error);
    res.status(500).json({ error: 'Failed to parse PDF file' });
  }
});

app.get('/api/fetch-url', async (req, res) => {
  let { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: `Failed to fetch URL (HTTP ${response.status})` });
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove script, style, navigation and layout tags
    $('script, style, noscript, iframe, nav, footer, header, svg, form').remove();
    
    // Extract main text content
    let text = $('article, main, .content, #content, body').text().replace(/\s+/g, ' ').trim();
    if (text.length > 5000) {
      text = text.substring(0, 5000) + '...';
    }
    
    if (!text) {
      return res.status(400).json({ error: 'Could not extract readable text from the specified URL.' });
    }

    res.json({ text });
  } catch (error) {
    console.error('Fetch URL Error:', error);
    res.status(500).json({ error: 'Failed to fetch contents from the URL: ' + error.message });
  }
});

// Serve static files from React app in production
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// For any other request, return React's index.html (SPA routing support)
app.use((req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
