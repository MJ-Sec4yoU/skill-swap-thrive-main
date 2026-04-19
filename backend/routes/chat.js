const express = require('express');
const https = require('https');
const { auth } = require('../middleware/auth');
const router = express.Router();

// ── Gemini 2.0 Flash (free tier) ────────────────────────────────────────────
const GEMINI_MODEL = 'gemini-1.5-flash';

// Helper: make HTTPS POST request (works on all Node.js versions)
function postJSON(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
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
const SYSTEM_PROMPT = `You are **SwapBot**, the smart AI assistant for **SwapLearnThrive** — a skill exchange platform where people teach what they know and learn what they want.

## Your Personality
- Friendly, concise, and helpful.  Use emojis sparingly (1-2 per message) to stay warm but professional.
- Always answer in 2-4 short paragraphs max.  Users are on mobile — keep it tight.
- If you don't know something specific about a user's account, say so honestly and suggest they check the relevant page.

## Platform Knowledge
SwapLearnThrive lets users:
1. **Register & Verify** — Sign up, verify email via OTP, then upload an Aadhaar or College ID for full verification.
2. **Offer Skills** — List skills they can teach (e.g. Python, Guitar, Graphic Design) with category, level, and description.
3. **Find Skills** — Browse skills offered by others and express interest.
4. **Matching System** — An algorithm matches teachers with learners based on skill compatibility, location, and ratings. Users see match scores (%).
5. **Messaging** — Once matched, users can chat directly through the Messages page.
6. **Scheduling** — Schedule teaching/learning sessions with date, time, and meeting link.
7. **Reviews & Ratings** — After a session, users can rate and review each other (1-5 stars).
8. **Certificates** — Users can earn certificates for completed sessions.
9. **Subscription Plans** — Free tier available; premium plans unlock extra features.
10. **Dashboard** — Central hub showing stats, quick actions, and recent activity.

## Navigation Help
- **Dashboard**: /dashboard — Overview of your activity
- **Offer a Skill**: /teach — List a skill you can teach
- **Find Skills**: /learn — Browse available skills
- **My Skills**: /my-skills — Manage your listed skills
- **Matches**: /matches — See your skill matches
- **Messages**: /messages — Chat with your matches
- **Schedule**: /schedule — Manage sessions
- **Certificates**: /certificates — View earned certificates
- **Profile**: /profile/edit — Update your profile
- **Verification**: /verify — Verify your identity
- **Reviews**: /reviews/:userId — See reviews for a user

## Rules
- NEVER share private user data, passwords, or API keys.
- If asked about pricing, mention that there is a free tier and premium plans are available at /subscription.
- For technical issues, suggest refreshing the page or contacting support.
- You can help with: platform navigation, feature explanations, skill suggestions, learning tips, and general questions about the platform.
- Keep responses under 150 words when possible.`;

// Simple in-memory rate limiter per user (max 20 messages per minute)
const rateLimitMap = new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 1000; // 1 minute

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
    // Rate limit check
    if (!checkRateLimit(req.user._id.toString())) {
      return res.status(429).json({ message: 'Too many messages. Please wait a moment.' });
    }

    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ message: 'Message too long (max 1000 characters)' });
    }

    // Read API key at request time (picks up env vars added after server start)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        reply: "👋 Hi! I'm SwapBot, your assistant here at SwapLearnThrive. I'm currently being set up — the admin needs to configure my AI brain (Gemini API key). In the meantime, here are some quick links:\n\n• **Find skills to learn** → /learn\n• **Offer your skills** → /teach\n• **Check your matches** → /matches\n• **View messages** → /messages\n\nFeel free to explore the platform!"
      });
    }

    // Build conversation for Gemini
    const contents = [];

    // Add conversation history (last 10 turns max to control token usage)
    const recentHistory = history.slice(-10);
    for (const turn of recentHistory) {
      contents.push({
        role: turn.role === 'user' ? 'user' : 'model',
        parts: [{ text: turn.content }]
      });
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Call Gemini API using Node.js https module (works on all Node versions)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const result = await postJSON(geminiUrl, {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 512,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ]
    });

    if (result.status !== 200) {
      console.error('Gemini API error:', result.status, result.body);
      
      let errorMsg = 'AI service temporarily unavailable.';
      try {
        const parsed = JSON.parse(result.body);
        if (parsed.error && parsed.error.message) {
          errorMsg = `API Error: ${parsed.error.message}`;
        }
      } catch (e) {
        errorMsg = `API Error (${result.status}): ${result.body}`;
      }
      
      return res.status(502).json({ message: errorMsg });
    }

    const data = JSON.parse(result.body);
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(502).json({ message: 'No response from AI. Please try again.' });
    }

    res.json({ reply });

  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
