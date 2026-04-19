const express = require('express');
const https = require('https');
const { auth } = require('../middleware/auth');
const router = express.Router();

// ── OpenRouter Free Models ──────────────────────────────────────────────
// We use OpenRouter's free Gemini 2.0 Flash endpoint to bypass Google's region/billing locks.

// Helper: make HTTPS POST request (works on all Node.js versions)
function postJSON(url, body, apiKey) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://skillswapfontend.netlify.app', 
        'X-Title': 'SwapLearnThrive Assistant',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, body });
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(new Error('Request timeout')); });
    req.write(data);
    req.end();
  });
}

// Platform-aware system prompt
const SYSTEM_PROMPT = `You are SwapBot, the smart AI assistant for SwapLearnThrive — a skill exchange platform where people teach what they know and learn what they want.

## Your Personality
- Friendly, concise, and helpful. Use emojis sparingly (1-2 per message).
- Always answer in 2-4 short paragraphs max. Users are on mobile — keep it tight.
- Be extremely encouraging.

## Platform Knowledge
1. Register/Verify: Users verify email via OTP, then upload Aadhaar/College ID for full verification.
2. Offer/Find Skills: Users list what they can teach or search for what they want to learn.
3. Matching System: Algorithm matches based on skill compatibility and location (%).
4. Chat & Schedule: Users can message each other directly and schedule live sessions.
5. Reviews: After sessions, users leave 1-5 star ratings.
6. Certificates: Users earn certificates for completed classes.

## Relevant URLs to suggest
- /dashboard — Profile overview
- /learn — Find a new skill
- /teach — Offer a skill
- /matches — View matched partners
- /messages — Chat area
- /schedule — Class scheduler
- /certificates — Earned certificates

## Rules
- Answer questions solely based on platform knowledge.
- Keep responses under 100 words so the UI doesn't stretch too much.`;

// Simple in-memory rate limiter per user (max 20 messages per minute)
const rateLimitMap = new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(userId) {
  const now = Date.now();
  const userEntry = rateLimitMap.get(userId);
  if (!userEntry || now - userEntry.windowStart > RATE_WINDOW) {
    rateLimitMap.set(userId, { windowStart: now, count: 1 });
    return true;
  }
  if (userEntry.count >= RATE_LIMIT) return false;
  userEntry.count++;
  return true;
}

// POST /api/chat
router.post('/', auth, async (req, res) => {
  try {
    if (!checkRateLimit(req.user._id.toString())) {
      return res.status(429).json({ message: 'Too many messages. Please wait a moment.' });
    }

    const { message, history = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        reply: "👋 Hi! SwapBot needs a free OpenRouter key to be configured in the backend environment. Get one for free at https://openrouter.ai!"
      });
    }

    // Build OpenRouter/OpenAI-compatible payload
    const messages = [];
    
    // 1. Add System Prompt
    messages.push({ role: 'system', content: SYSTEM_PROMPT });

    // 2. Add history (last 10 interactions max)
    const recentHistory = history.slice(-10);
    for (const turn of recentHistory) {
      messages.push({
        role: turn.role === 'user' ? 'user' : 'assistant',
        content: turn.content
      });
    }

    // 3. Add current prompt
    messages.push({ role: 'user', content: message });

    // Verified working free models (tested live with actual API key)
    const FREE_MODELS = [
      "google/gemma-3-27b-it:free",
      "google/gemma-3-4b-it:free",
      "liquid/lfm-2.5-1.2b-instruct:free",
    ];

    let lastError = null;

    for (const model of FREE_MODELS) {
      const result = await postJSON('https://openrouter.ai/api/v1/chat/completions', {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 500
      }, apiKey);

      if (result.status === 200) {
        const data = JSON.parse(result.body);
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return res.json({ reply });
        }
      }

      console.error(`Model ${model} failed:`, result.status, result.body);
      lastError = result;
    }

    // All models failed
    let errorMsg = 'All AI models are temporarily busy. Please try again in a moment.';
    if (lastError) {
      try {
        const parsed = JSON.parse(lastError.body);
        errorMsg = `API Error: ${parsed.error?.message || 'Unknown error'}`;
      } catch (e) {
        errorMsg = `API Error (${lastError.status})`;
      }
    }
    return res.status(502).json({ message: errorMsg });




  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
