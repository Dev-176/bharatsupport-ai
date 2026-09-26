import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Google GenAI client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Default Knowledge Base documents for Indian SMBs (EdTech, E-Commerce, D2C, Services)
export const DEFAULT_KNOWLEDGE_BASE = [
  {
    id: 'kb-fee-sheet',
    title: 'Professional Certification & Training Program Fee Structure',
    category: 'Programs & Admissions',
    content: `
- Full Stack AI & Web Development Bootcamp: ₹24,999 (Installment available: ₹8,500/month for 3 months).
- Weekend Batch Timing: Saturday & Sunday 10:00 AM to 1:30 PM IST.
- Weekday Batch Timing: Monday to Thursday 7:00 PM to 9:00 PM IST.
- Next Weekend Batch starts: 1st of next month. Limited to 40 seats per batch.
- Early Bird Discount: Use code BHARAT10 for 10% flat discount on upfront payment.
- Eligibility: Working professionals, entrepreneurs, and developers seeking applied AI engineering skills.
- Certificate: Industry Recognized Certificate with Capstone Project and Placement Assistance.
    `.trim(),
    verified: true,
    lastUpdated: '2026-03-15'
  },
  {
    id: 'kb-shipping-policy',
    title: 'D2C Retail Shipping & Delivery Timelines',
    category: 'Logistics & Orders',
    content: `
- Metro Cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata): Delivery in 24 to 48 hours.
- Tier 2 & Tier 3 Cities (Jaipur, Lucknow, Patna, Indore, Pune, etc.): Delivery in 3 to 5 business days.
- Remote & North-East regions: 5 to 7 business days.
- Courier Partners: Bluedart, Delhivery, Xpressbees, India Post.
- Live Order Tracking: Tracking link is sent via WhatsApp and SMS within 3 hours of dispatch.
- Free Shipping on all orders above ₹499. Flat ₹50 for orders below ₹499.
- Cash on Delivery (COD): Available across 19,000+ pin codes across India.
    `.trim(),
    verified: true,
    lastUpdated: '2026-03-20'
  },
  {
    id: 'kb-refund-return',
    title: 'Return, Refund & Cancellation Policy',
    category: 'Policies',
    content: `
- 7-Day Hassle-Free Replacement / Return window from the date of delivery for physical goods.
- Eligibility for Return: Product must be unused, with original tags and packaging intact.
- Refund Timeline: UPI and Net Banking refunds are credited within 24 to 48 business hours after inspection. Credit/Debit card refunds take 3 to 5 bank working days.
- Course / Digital Service Cancellation: 100% refund if requested within 48 hours before the first live lecture. No refunds after 2nd lecture completion.
- Damaged / Wrong Item Received: Instant replacement within 24 hours without return pickup delay if unboxing video/photo is shared on WhatsApp.
    `.trim(),
    verified: true,
    lastUpdated: '2026-03-22'
  },
  {
    id: 'kb-support-timings',
    title: 'Customer Support Escalation & Contact Hours',
    category: 'Operations',
    content: `
- AI Virtual Support (BharatSupport AI): 24/7/365 instant response in Hindi, Hinglish, English, Tamil, Telugu, etc.
- Human Agent Calling & Live Desk Hours: Monday to Saturday, 9:00 AM to 8:00 PM IST.
- Escalation Handling: If AI confidence is below 60% or user requests a human agent ("manager se baat karao", "human agent please"), ticket is prioritized and assigned in under 15 minutes.
- Support Phone: +91 1800-202-9900 (Toll Free).
- Official Support Email: support@bharatsupport.ai.
    `.trim(),
    verified: true,
    lastUpdated: '2026-03-24'
  },
  {
    id: 'kb-account-password',
    title: 'Account Access, Password Reset & Login Security',
    category: 'Account & Security',
    content: `
- Password Reset: To reset your account password, click on "Forgot Password" on the login screen. A secure 6-digit OTP will be sent to your registered mobile number and email. Enter the OTP to set your new password immediately.
- OTP Validity: The OTP is valid for 10 minutes. If expired, click "Resend OTP".
- Account Lockout: For security, entering an incorrect password 5 times locks the account for 30 minutes. You can unlock instantly by resetting your password via OTP.
- Two-Factor Authentication (2FA): Can be enabled under Profile > Security Settings via SMS or Authenticator App.
- Email or Mobile Number Change: Requires OTP verification from your existing email or contacting support at support@bharatsupport.ai.
    `.trim(),
    verified: true,
    lastUpdated: '2026-03-25'
  }
];

let activeKnowledgeBase = [...DEFAULT_KNOWLEDGE_BASE];

// Structured Schema for Confidence Engine Output
const supportResponseSchema = {
  type: Type.OBJECT,
  properties: {
    detectedLanguage: {
      type: Type.STRING,
      description: "Detected language: Hinglish, Hindi, English, Tamil, Telugu, Bengali, Marathi, or Other"
    },
    detectedIntent: {
      type: Type.STRING,
      description: "Primary intent: Order Status, Fee Inquiry, Refund Request, Technical Support, Sales Lead, Complaint, or General FAQ"
    },
    customerSentiment: {
      type: Type.STRING,
      description: "Customer emotion: POSITIVE, NEUTRAL, FRUSTRATED, or URGENT"
    },
    confidenceScore: {
      type: Type.INTEGER,
      description: "Model confidence score from 0 to 100 based on verified knowledge match"
    },
    actionTaken: {
      type: Type.STRING,
      description: "AUTO_REPLY (if confidence >= 85), ASK_CLARIFICATION (if 60-84), or HUMAN_ESCALATION (if < 60 or high frustration/explicit human demand)"
    },
    responseMessage: {
      type: Type.STRING,
      description: "The empathetic, accurate response written in the same language and style (e.g. natural Hinglish if user spoke Hinglish, Hindi if Devanagari, English if English)."
    },
    clarificationOptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2 to 3 quick clickable options if actionTaken is ASK_CLARIFICATION"
    },
    citations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          docTitle: { type: Type.STRING },
          matchedFact: { type: Type.STRING }
        },
        required: ["docTitle", "matchedFact"]
      },
      description: "Knowledge base verified sources referenced"
    },
    escalationDetails: {
      type: Type.OBJECT,
      properties: {
        requiresHuman: { type: Type.BOOLEAN },
        priority: { type: Type.STRING, description: "LOW, MEDIUM, HIGH, or CRITICAL" },
        reason: { type: Type.STRING, description: "Reason for escalation" },
        internalSummary: { type: Type.STRING, description: "Quick 1-line summary in English for the human agent" },
        suggestedDraftForAgent: { type: Type.STRING, description: "Pre-written draft response the human agent can send with 1 click" }
      },
      required: ["requiresHuman", "priority", "reason", "internalSummary", "suggestedDraftForAgent"]
    },
    salesOpportunity: {
      type: Type.OBJECT,
      properties: {
        isLead: { type: Type.BOOLEAN },
        interestArea: { type: Type.STRING },
        buyerIntentScore: { type: Type.INTEGER, description: "0 to 100 purchase intent" }
      },
      required: ["isLead", "interestArea", "buyerIntentScore"]
    }
  },
  required: [
    "detectedLanguage", "detectedIntent", "customerSentiment", "confidenceScore",
    "actionTaken", "responseMessage", "clarificationOptions", "citations",
    "escalationDetails", "salesOpportunity"
  ]
};

// Retry helper with fallback models
async function generateContentWithFallback(params: { contents: any; config?: any }) {
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        if (msg.includes('503') || msg.includes('429') || msg.includes('UNAVAILABLE')) {
          await new Promise((r) => setTimeout(r, 1200));
        } else {
          break;
        }
      }
    }
  }
  throw lastError;
}

// API: Process incoming customer support query (WhatsApp / Web / Email)
app.post('/api/support/chat', async (req, res) => {
  try {
    const {
      message,
      channel = 'whatsapp',
      senderName = 'Customer',
      chatHistory = [],
      thresholds = { autoReply: 85, clarify: 60 }
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // Build context from active knowledge base
    const knowledgeContext = activeKnowledgeBase
      .map((kb) => `--- [DOC: ${kb.title} | Category: ${kb.category}] ---\n${kb.content}`)
      .join('\n\n');

    const systemPrompt = `You are BharatSupport AI, an enterprise-grade conversational AI assistant and customer support platform designed for Indian SMBs and growing enterprises.
Motto: "Bharat ke liye, Bharat ke bhasha mein" (Understand • Resolve • Empower).

CORE CAPABILITIES:
1. Multi-Language & Code-Mixing Mastery:
   - Flawlessly understand and speak colloquial Indian Hinglish (e.g. "Mujhe apne order ki status check karni hai. Kya aap meri madad kar sakte hain?", "Fees kitni hai? Weekend batch me Seat hai kya?", "Bhaiya mera refund kab tak aayega?").
   - Support pure Hindi (Devanagari), English, Tamil, Telugu, Marathi, and other regional tongues.
   - ALWAYS reply in the SAME language and conversational dialect that the user used. If they speak Hinglish, reply in warm, helpful, natural Hinglish.

2. Zero Hallucination & Verified Knowledge Retrieval:
   - Use ONLY the facts provided in the VERIFIED KNOWLEDGE BASE below.
   - If a query cannot be answered with verified facts from the knowledge base, do NOT invent facts. Set confidenceScore < 60 and trigger actionTaken = "HUMAN_ESCALATION".

3. Confidence Engine Rules:
   - If confidenceScore >= ${thresholds.autoReply || 85}: actionTaken = "AUTO_REPLY". Provide clear, direct, verified resolution with citations.
   - If confidenceScore >= ${thresholds.clarify || 60} and < ${thresholds.autoReply || 85}: actionTaken = "ASK_CLARIFICATION". Provide a friendly clarifying question with 2-3 clickable clarificationOptions.
   - If confidenceScore < ${thresholds.clarify || 60}, or if customer expresses high frustration ("scam", "cheat", "lawyer", "manager se baat karao", "human please"): actionTaken = "HUMAN_ESCALATION". Reassure the user that a senior agent is taking over immediately.

4. Support to Sales Intelligence:
   - If the user asks about courses, batches, products, or buying ("fees kitni hai", "kya discount milega"), mark salesOpportunity.isLead = true and assign appropriate buyerIntentScore.

VERIFIED KNOWLEDGE BASE:
${knowledgeContext}
`;

    const formattedHistory = chatHistory.slice(-6).map((h: any) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    const response = await generateContentWithFallback({
      contents: [
        ...formattedHistory,
        {
          role: 'user',
          parts: [{ text: `[Channel: ${channel}, User: ${senderName}]\n${message}` }],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: supportResponseSchema,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from BharatSupport AI engine');
    }

    const aiResult = JSON.parse(responseText);
    res.json({ success: true, result: aiResult });
  } catch (error: any) {
    console.error('BharatSupport AI chat error:', error?.message || error);
    res.status(500).json({
      error: 'Unable to generate an AI response right now. Please try again.',
    });
  }
});

// API: Get, create, update, and delete Knowledge Base
app.get('/api/support/knowledge', (_req, res) => {
  res.json({ success: true, documents: activeKnowledgeBase });
});

app.get('/api/support/knowledge/:id', (req, res) => {
  const { id } = req.params;
  const doc = activeKnowledgeBase.find((d) => d.id === id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json({ success: true, document: doc });
});

app.post('/api/support/knowledge', (req, res) => {
  const { title, category, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newDoc = {
    id: `kb-${Date.now()}`,
    title: title.trim(),
    category: category?.trim() || 'General',
    content: content.trim(),
    verified: true,
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  activeKnowledgeBase = [newDoc, ...activeKnowledgeBase];
  res.json({ success: true, document: newDoc, documents: activeKnowledgeBase });
});

app.put('/api/support/knowledge/:id', (req, res) => {
  const { id } = req.params;
  const { title, category, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const existingIndex = activeKnowledgeBase.findIndex((doc) => doc.id === id);
  if (existingIndex === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }

  activeKnowledgeBase[existingIndex] = {
    ...activeKnowledgeBase[existingIndex],
    title: title.trim(),
    category: category?.trim() || activeKnowledgeBase[existingIndex].category,
    content: content.trim(),
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  res.json({
    success: true,
    document: activeKnowledgeBase[existingIndex],
    documents: activeKnowledgeBase,
  });
});

app.delete('/api/support/knowledge/:id', (req, res) => {
  const { id } = req.params;
  activeKnowledgeBase = activeKnowledgeBase.filter((doc) => doc.id !== id);
  res.json({ success: true, documents: activeKnowledgeBase });
});

// Serve frontend in production or Vite in dev
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false as const,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 BharatSupport AI Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
