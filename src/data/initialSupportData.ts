import { EscalationTicket, SalesLead, KnowledgeDocument } from '../types/bharatSupport';

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDocument[] = [
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

export const INITIAL_ESCALATION_TICKETS: EscalationTicket[] = [
  {
    id: 'TICK-1082',
    customerName: 'Rahul Verma',
    customerPhoneOrEmail: '+91 98231 44512',
    channel: 'whatsapp',
    detectedLanguage: 'Hinglish',
    intent: 'Refund Dispute',
    sentiment: 'FRUSTRATED',
    confidenceScore: 42,
    priority: 'HIGH',
    status: 'OPEN',
    summary: 'Customer returned sneakers 4 days ago; UPI refund has not reflected yet. UTR number requested.',
    suggestedDraft: 'Namaste Rahul ji! Main check kar raha hoon. Aapke return package ka inspection kal complete hua tha. Maine aapka refund ₹2,499 UPI transaction id #REF99281 ke saath initiate kar diya hai, 2 ghante me aapke bank me reflect ho jayega.',
    createdAt: '12 mins ago',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Bhaiya mera refund abhi tak nahi aaya 4 din ho gaye return kiye hue! Kab aayega?',
        timestamp: '12 mins ago',
        channel: 'whatsapp'
      },
      {
        id: 'm2',
        sender: 'bot',
        text: 'Maine aapki request hamare senior support desk ko prioritize karke bhej di hai. Ek human agent turant aapki madad karega.',
        timestamp: '11 mins ago',
        channel: 'whatsapp',
        actionTaken: 'HUMAN_ESCALATION',
        confidenceScore: 42
      }
    ]
  },
  {
    id: 'TICK-1079',
    customerName: 'Priya Sharma',
    customerPhoneOrEmail: 'priya.s@gmail.com',
    channel: 'email',
    detectedLanguage: 'English',
    intent: 'Corporate Invoice & GST Clarification',
    sentiment: 'NEUTRAL',
    confidenceScore: 54,
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    assignedAgent: 'Amit Patel',
    summary: 'Customer needs GST B2B invoice revised with new legal company name and CIN number.',
    suggestedDraft: 'Dear Priya, We have verified your GSTIN details. Our finance desk has regenerated your invoice with your registered corporate entity. Attached is the revised tax invoice.',
    createdAt: '45 mins ago',
    messages: [
      {
        id: 'm3',
        sender: 'user',
        text: 'Kindly re-issue our invoice #INV-492 with our updated GSTIN 07AAAAA0000A1Z5.',
        timestamp: '45 mins ago',
        channel: 'email'
      }
    ]
  },
  {
    id: 'TICK-1074',
    customerName: 'Anand Kumar',
    customerPhoneOrEmail: '+91 99104 88392',
    channel: 'webchat',
    detectedLanguage: 'Hindi',
    intent: 'Seat Reservation & Fee Concession',
    sentiment: 'POSITIVE',
    confidenceScore: 78,
    priority: 'LOW',
    status: 'RESOLVED',
    assignedAgent: 'Neha Singh',
    summary: 'Requested confirmation of weekend batch seats for AI bootcamp. Enrolled with coupon BHARAT10.',
    suggestedDraft: 'नमस्ते आनंद जी, आपकी सीट वीकेंड बैच में कन्फर्म हो चुकी है। ओरिएंटेशन लिंक आपकी ईमेल पर भेज दिया गया है।',
    createdAt: '2 hours ago',
    messages: [
      {
        id: 'm4',
        sender: 'user',
        text: 'क्या वीकेंड बैच में सीटें खाली हैं? मुझे एडमिशन लेना है।',
        timestamp: '2 hours ago',
        channel: 'webchat'
      }
    ]
  }
];

export const INITIAL_SALES_LEADS: SalesLead[] = [
  {
    id: 'lead-1',
    customerName: 'Vikram Joshi',
    contact: '+91 98112 34567',
    channel: 'whatsapp',
    interestArea: 'Full Stack AI Bootcamp (Weekend Batch)',
    buyerIntentScore: 92,
    snippet: 'Fees kitni hai? Weekend batch me Seat hai kya? Main weekend me join karna chahta hoon.',
    capturedAt: '25 mins ago',
    status: 'NEW'
  },
  {
    id: 'lead-2',
    customerName: 'Sneha Kulkarni',
    contact: 'sneha.k@techcorp.in',
    channel: 'webchat',
    interestArea: 'Enterprise D2C Bulk Order (50+ units)',
    buyerIntentScore: 85,
    snippet: 'Do you offer bulk discounts for corporate Diwali gifting on orders above 50 boxes?',
    capturedAt: '1 hour ago',
    status: 'CONTACTED'
  },
  {
    id: 'lead-3',
    customerName: 'Mohammed Tariq',
    contact: '+91 97401 22910',
    channel: 'whatsapp',
    interestArea: 'Full Stack AI Bootcamp (EMI Option)',
    buyerIntentScore: 88,
    snippet: 'Kya monthly installment ₹8,500 me credit card zaroori hai ya debit card EMI chalega?',
    capturedAt: '3 hours ago',
    status: 'NEW'
  }
];
