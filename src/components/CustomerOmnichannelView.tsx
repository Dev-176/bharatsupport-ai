import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  CheckCheck,
  Volume2,
  VolumeX,
  FileText,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';
import { ChatMessage, ChannelType, AIResponseResult } from '../types/bharatSupport';

interface CustomerOmnichannelViewProps {
  onNewEscalation: (ticketData: any) => void;
  onNewLead: (leadData: any) => void;
  confidenceThresholds: { autoReply: number; clarify: number };
}

export const CustomerOmnichannelView: React.FC<CustomerOmnichannelViewProps> = ({
  onNewEscalation,
  onNewLead,
  confidenceThresholds,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>('whatsapp');
  const [customerName, setCustomerName] = useState('Ankit Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Initial conversation welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: 'Namaste! Welcome to BharatSupport AI. Main aapki kya madad kar sakta hoon? (You can type in Hindi, Hinglish, or English)',
      timestamp: '10:00 AM',
      channel: 'whatsapp',
      actionTaken: 'AUTO_REPLY',
      confidenceScore: 99,
      detectedLanguage: 'Hinglish',
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: selectedChannel,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          channel: selectedChannel,
          senderName: customerName,
          chatHistory: messages.slice(-5),
          thresholds: confidenceThresholds,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to reach BharatSupport AI server');
      }

      const data = await res.json();
      const result: AIResponseResult = data.result;

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: result.actionTaken === 'HUMAN_ESCALATION' ? 'agent' : 'bot',
        text: result.responseMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: selectedChannel,
        detectedLanguage: result.detectedLanguage,
        detectedIntent: result.detectedIntent,
        confidenceScore: result.confidenceScore,
        actionTaken: result.actionTaken,
        sentiment: result.customerSentiment,
        clarificationOptions: result.clarificationOptions,
        citations: result.citations,
      };

      setMessages((prev) => [...prev, botMsg]);

      // If escalated, push ticket to Agent Desk
      if (result.actionTaken === 'HUMAN_ESCALATION' || result.escalationDetails?.requiresHuman) {
        onNewEscalation({
          id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName,
          customerPhoneOrEmail: customerPhone,
          channel: selectedChannel,
          detectedLanguage: result.detectedLanguage,
          intent: result.detectedIntent,
          sentiment: result.customerSentiment,
          confidenceScore: result.confidenceScore,
          priority: result.escalationDetails?.priority || 'HIGH',
          status: 'OPEN',
          summary: result.escalationDetails?.internalSummary || 'Customer inquiry requires human resolution.',
          suggestedDraft: result.escalationDetails?.suggestedDraftForAgent || 'Namaste, main aapki turant madad kar raha hoon.',
          createdAt: 'Just now',
          messages: [...messages, userMsg, botMsg],
        });
      }

      // If high sales opportunity, push to Sales CRM
      if (result.salesOpportunity?.isLead && result.salesOpportunity?.buyerIntentScore >= 60) {
        onNewLead({
          id: `lead-${Date.now()}`,
          customerName,
          contact: customerPhone,
          channel: selectedChannel,
          interestArea: result.salesOpportunity.interestArea || result.detectedIntent,
          buyerIntentScore: result.salesOpportunity.buyerIntentScore,
          snippet: text,
          capturedAt: 'Just now',
          status: 'NEW',
        });
      }
    } catch (err: any) {
      console.error('Chat processing error:', err?.message || err);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: 'Unable to generate an AI response right now. Please try again. A senior agent has been assigned to assist you.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: selectedChannel,
        actionTaken: 'HUMAN_ESCALATION',
        confidenceScore: 30,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string, msgId: string) => {
    if (speakingMessageId === msgId) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);
      setSpeakingMessageId(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Sample customer test inquiries for demonstration & QA
  const samplePrompts = [
    {
      title: 'High Confidence (Password Reset - EN)',
      prompt: 'How can I reset my password?',
      badge: 'High Confidence'
    },
    {
      title: 'Hindi Devanagari (पासवर्ड रीसेट)',
      prompt: 'मेरा पासवर्ड कैसे रीसेट करें?',
      badge: 'Hindi Devanagari'
    },
    {
      title: 'Hinglish Colloquial (Password Reset)',
      prompt: 'Mera password reset kaise karu?',
      badge: 'Hinglish NLP'
    },
    {
      title: 'Regional Language (Tamil)',
      prompt: 'கடவுச்சொல்லை எவ்வாறு மீட்டமைப்பது?',
      badge: 'Tamil NLP'
    },
    {
      title: 'Ambiguous Query (Clarification)',
      prompt: 'I have an issue with my order.',
      badge: 'Clarification Test'
    },
    {
      title: 'Outside Knowledge Base (Escalation)',
      prompt: 'What is your stock market prediction for tomorrow?',
      badge: 'Escalation Test'
    },
    {
      title: 'Sales Intent (Bulk Pricing)',
      prompt: 'I need 100 units. Please share the bulk pricing.',
      badge: 'Lead Qualification'
    },
    {
      title: 'RAG Test (Festival Discount)',
      prompt: 'What is the festival discount coupon code?',
      badge: 'RAG Injection Test'
    },
    {
      title: 'Course Fee & Schedule (Hinglish)',
      prompt: 'Fees kitni hai? Weekend batch me Seat hai kya?',
      badge: 'Support to Sales'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title & Introduction */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
              Omnichannel Gateway
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Multi-Language & Code-Mixing NLP (Hindi, Hinglish, English, Regional)
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Conversation Simulator
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Test how customers interact via WhatsApp, Web Widget, or Email with zero-hallucination verified answers.
          </p>
        </div>

        {/* Channel Switcher */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1 self-start md:self-auto">
          <button
            onClick={() => setSelectedChannel('whatsapp')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedChannel === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>WhatsApp (58% traffic)</span>
          </button>

          <button
            onClick={() => setSelectedChannel('webchat')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedChannel === 'webchat'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Web Widget</span>
          </button>

          <button
            onClick={() => setSelectedChannel('email')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedChannel === 'email'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email Portal</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Chat Shell */}
        <div className="lg:col-span-8">
          {/* WhatsApp / Web Chat Container */}
          <div className="bg-white rounded-2xl border border-slate-300 shadow-lg overflow-hidden flex flex-col h-[620px]">
            {/* Header */}
            {selectedChannel === 'whatsapp' ? (
              <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white shadow">
                      BS
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#075e54]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-sm">BharatSupport AI</h3>
                      <span title="Verified Business Account">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                      <span>Online</span>
                      <span>·</span>
                      <span>Customer Care Desk</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs bg-emerald-800/60 px-2.5 py-1 rounded-full border border-emerald-600/40">
                  <span className="text-[10px] text-emerald-200">WhatsApp Official Business API</span>
                </div>
              </div>
            ) : selectedChannel === 'webchat' ? (
              <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white font-bold">
                    AI
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">BharatSupport Assistant</h3>
                    <p className="text-[11px] text-blue-100">Live Web Chat Widget · Instant Response</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-700 px-2.5 py-1 rounded-md text-blue-100 font-medium">
                  Embeddable SMB Widget
                </span>
              </div>
            ) : (
              <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-slate-300" />
                  <div>
                    <h3 className="font-semibold text-sm">support@bharatsupport.ai</h3>
                    <p className="text-[11px] text-slate-300">Automated Email Resolution Engine</p>
                  </div>
                </div>
                <span className="text-xs bg-slate-700 px-2.5 py-1 rounded-md text-slate-200">
                  Ticket #TICK-Auto
                </span>
              </div>
            )}

            {/* Chat Body */}
            <div
              className={`flex-1 p-4 overflow-y-auto space-y-4 ${
                selectedChannel === 'whatsapp'
                  ? 'bg-[#efeae2]'
                  : 'bg-slate-50'
              }`}
            >
              {/* WhatsApp Encryption notice */}
              {selectedChannel === 'whatsapp' && (
                <div className="text-center my-2">
                  <span className="bg-[#ffeecd] text-[#54656f] text-[11px] px-3 py-1 rounded-lg shadow-xs inline-block">
                    🔒 Messages are protected by BharatSupport Verified Enterprise Gateway.
                  </span>
                </div>
              )}

              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isEscalated = msg.actionTaken === 'HUMAN_ESCALATION';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm relative ${
                        isUser
                          ? selectedChannel === 'whatsapp'
                            ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs'
                            : 'bg-blue-600 text-white rounded-tr-xs'
                          : isEscalated
                          ? 'bg-amber-50 border border-amber-200 text-slate-900 rounded-tl-xs'
                          : selectedChannel === 'whatsapp'
                          ? 'bg-white text-slate-900 rounded-tl-xs'
                          : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'
                      }`}
                    >
                      {/* Response Message */}
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Clickable Clarification Options (from 60-84% confidence) */}
                      {msg.clarificationOptions && msg.clarificationOptions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1.5">
                          <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                            Please select an option:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.clarificationOptions.map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => handleSendMessage(opt)}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-medium transition-colors"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Knowledge Base Citations Pill (Zero Hallucination proof) */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px] text-emerald-800">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-semibold">Verified Source:</span>
                          <span className="bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {msg.citations[0].docTitle}
                          </span>
                        </div>
                      )}

                      {/* Metadata Footer in Bubble */}
                      <div className="flex items-center justify-between gap-3 mt-2 text-[10px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          {msg.detectedLanguage && (
                            <span className="font-medium text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                              {msg.detectedLanguage}
                            </span>
                          )}
                          {msg.confidenceScore !== undefined && (
                            <span
                              className={`font-semibold px-1.5 py-0.2 rounded ${
                                msg.confidenceScore >= 85
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : msg.confidenceScore >= 60
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {msg.confidenceScore}% Confidence
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <span>{msg.timestamp}</span>
                          {!isUser && (
                            <button
                              onClick={() => handleSpeak(msg.text, msg.id)}
                              className="text-slate-400 hover:text-slate-600 ml-1 p-0.5 rounded"
                              title="Listen voice readout"
                            >
                              {speakingMessageId === msg.id ? (
                                <VolumeX className="w-3.5 h-3.5 text-blue-600" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                          {isUser && selectedChannel === 'whatsapp' && (
                            <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-xs border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span>BharatSupport AI is retrieving verified facts...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  selectedChannel === 'whatsapp'
                    ? 'Type a message in Hindi, Hinglish, or English...'
                    : 'Ask anything about orders, fees, refunds...'
                }
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className={`p-2.5 text-white rounded-xl shadow-sm transition-transform active:scale-95 disabled:opacity-50 ${
                  selectedChannel === 'whatsapp' ? 'bg-[#00a884] hover:bg-[#008f6f]' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Prompt Sandbox & Live Architecture Highlights */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pre-Configured Customer Scenarios */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="font-display text-base font-bold text-slate-900">
                Pre-Configured Customer Scenarios
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Click any inquiry to test Indian language understanding, confidence scoring, and verified RAG citations in action:
            </p>

            <div className="space-y-2.5">
              {samplePrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 transition-all text-xs group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800 group-hover:text-blue-700">
                      {item.title}
                    </span>
                    <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-slate-600 italic">"{item.prompt}"</p>
                </button>
              ))}
            </div>
          </div>

          {/* Solution Architecture Breakdown */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-display text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>How BharatSupport Resolves Inquiries</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <div>
                  <strong className="text-slate-200 block">Multilingual Understanding:</strong>
                  <span className="text-slate-400">
                    Deciphers intent and context from Indian dialects & Hinglish without translation latency.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <div>
                  <strong className="text-slate-200 block">Verified Knowledge Retrieval:</strong>
                  <span className="text-slate-400">
                    Grounds every claim in fee sheets, shipping policies, and product catalogs. Zero hallucination.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <div>
                  <strong className="text-slate-200 block">Confidence Engine:</strong>
                  <span className="text-slate-400">
                    Auto-replies when confidence ≥ 85%, clarifies when 60-84%, and escalates when &lt; 60%.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Profile Config */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs text-xs space-y-2.5">
            <h4 className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
              Active Customer Identity
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-500 text-[10px] block">Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
                />
              </div>
              <div>
                <label className="text-slate-500 text-[10px] block">Contact</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
