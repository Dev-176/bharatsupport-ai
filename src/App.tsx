import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { CustomerOmnichannelView } from './components/CustomerOmnichannelView';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView';
import { ConfidenceEngineView } from './components/ConfidenceEngineView';
import { AgentInboxView } from './components/AgentInboxView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { SalesLeadsView } from './components/SalesLeadsView';
import { MobileAppDeviceFrame } from './components/MobileAppDeviceFrame';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  INITIAL_ESCALATION_TICKETS,
  INITIAL_SALES_LEADS,
  INITIAL_KNOWLEDGE_DOCS,
} from './data/initialSupportData';
import { EscalationTicket, SalesLead, KnowledgeDocument, SalesPipelineStage } from './types/bharatSupport';
import { CheckCircle2, X, Shield, FileText, Lock, Mail, ExternalLink } from 'lucide-react';

type LegalModalType = 'privacy' | 'terms' | 'security' | 'contact' | null;

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState<boolean>(false);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Escalation Tickets state
  const [tickets, setTickets] = useState<EscalationTicket[]>(() => {
    try {
      const saved = localStorage.getItem('bharatsupport_tickets');
      return saved ? JSON.parse(saved) : INITIAL_ESCALATION_TICKETS;
    } catch {
      return INITIAL_ESCALATION_TICKETS;
    }
  });

  // Sales Leads state
  const [leads, setLeads] = useState<SalesLead[]>(() => {
    try {
      const saved = localStorage.getItem('bharatsupport_leads');
      return saved ? JSON.parse(saved) : INITIAL_SALES_LEADS;
    } catch {
      return INITIAL_SALES_LEADS;
    }
  });

  // Knowledge Documents state
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(INITIAL_KNOWLEDGE_DOCS);

  // Confidence thresholds
  const [confidenceThresholds, setConfidenceThresholds] = useState({
    autoReply: 85,
    clarify: 60,
  });

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bharatsupport_tickets', JSON.stringify(tickets));
    } catch (e) {
      console.error(e);
    }
  }, [tickets]);

  useEffect(() => {
    try {
      localStorage.setItem('bharatsupport_leads', JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  // Sync knowledge docs from backend
  useEffect(() => {
    fetch('/api/support/knowledge')
      .then((r) => r.json())
      .then((data) => {
        if (data.documents) {
          setKnowledgeDocs(data.documents);
        }
      })
      .catch((e) => console.warn('Could not sync knowledge base from backend:', e));
  }, []);

  const handleNewEscalation = (newTicket: EscalationTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    showToast(`New case #${newTicket.id} escalated to Support Desk`);
  };

  const handleResolveTicket = (ticketId: string, replyText: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'RESOLVED',
            messages: [
              ...t.messages,
              {
                id: `rep-${Date.now()}`,
                sender: 'agent',
                text: replyText,
                timestamp: 'Just now',
                channel: t.channel,
              },
            ],
          };
        }
        return t;
      })
    );
    showToast(`Ticket #${ticketId} marked resolved and response dispatched`);
  };

  const handleNewLead = (newLead: SalesLead) => {
    setLeads((prev) => [newLead, ...prev]);
    showToast(`New sales opportunity captured: ${newLead.customerName} (${newLead.buyerIntentScore}%)`);
  };

  const handleUpdateLeadStatus = (
    leadId: string,
    newStatus: SalesPipelineStage
  ) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    showToast(`Lead pipeline status updated to ${newStatus}`);
  };

  const handleAddKnowledgeDoc = async (title: string, category: string, content: string) => {
    try {
      const res = await fetch('/api/support/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, content }),
      });
      const data = await res.json();
      if (data.documents) {
        setKnowledgeDocs(data.documents);
        showToast(`Document "${title}" indexed into verified knowledge base`);
      }
    } catch (e) {
      console.error('Failed to add knowledge document:', e);
      showToast('Error syncing document with server');
    }
  };

  const handleUpdateKnowledgeDoc = async (
    id: string,
    title: string,
    category: string,
    content: string
  ) => {
    try {
      const res = await fetch(`/api/support/knowledge/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, content }),
      });
      const data = await res.json();
      if (data.documents) {
        setKnowledgeDocs(data.documents);
        showToast(`Document "${title}" updated and re-indexed`);
      }
    } catch (e) {
      console.error('Failed to update knowledge document:', e);
      showToast('Error updating document on server');
    }
  };

  const handleDeleteKnowledgeDoc = async (id: string) => {
    try {
      const res = await fetch(`/api/support/knowledge/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.documents) {
        setKnowledgeDocs(data.documents);
        showToast('Document removed from knowledge base');
      }
    } catch (e) {
      console.error('Failed to delete knowledge document:', e);
      showToast('Error deleting document');
    }
  };

  const openTicketsCount = tickets.filter((t) => t.status === 'OPEN').length;
  const newLeadsCount = leads.filter((l) => l.status === 'NEW').length;

  const renderActiveView = () => (
    <>
      {activeTab === 'chat' && (
        <CustomerOmnichannelView
          onNewEscalation={handleNewEscalation}
          onNewLead={handleNewLead}
          confidenceThresholds={confidenceThresholds}
        />
      )}

      {activeTab === 'dashboard' && (
        <AnalyticsDashboardView
          tickets={tickets}
          leads={leads}
        />
      )}

      {activeTab === 'confidence' && (
        <ConfidenceEngineView
          thresholds={confidenceThresholds}
          setThresholds={setConfidenceThresholds}
        />
      )}

      {activeTab === 'inbox' && (
        <AgentInboxView
          tickets={tickets}
          onResolveTicket={handleResolveTicket}
        />
      )}

      {activeTab === 'knowledge' && (
        <KnowledgeBaseView
          documents={knowledgeDocs}
          onAddDocument={handleAddKnowledgeDoc}
          onUpdateDocument={handleUpdateKnowledgeDoc}
          onDeleteDocument={handleDeleteKnowledgeDoc}
        />
      )}

      {activeTab === 'leads' && (
        <SalesLeadsView
          leads={leads}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          onNewLead={handleNewLead}
        />
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openTicketsCount={openTicketsCount}
        newLeadsCount={newLeadsCount}
        isMobileDeviceFrame={isMobileDeviceFrame}
        setIsMobileDeviceFrame={setIsMobileDeviceFrame}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {isMobileDeviceFrame ? (
          <MobileAppDeviceFrame onClose={() => setIsMobileDeviceFrame(false)}>
            {renderActiveView()}
          </MobileAppDeviceFrame>
        ) : (
          renderActiveView()
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xl border border-slate-700 transition-all animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Offline Toast Indicator */}
      <OfflineIndicator />

      {/* Clean Standalone Enterprise Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="font-display font-bold text-slate-900 text-sm">
                BharatSupport <span className="text-blue-600">AI</span>
              </span>
              <span className="text-slate-400">·</span>
              <span>Multilingual Customer Support & Workflow Automation</span>
            </div>

            {/* Legal & Policy Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-5 text-slate-600 font-medium">
              <button
                onClick={() => setLegalModal('privacy')}
                className="hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setLegalModal('terms')}
                className="hover:text-blue-600 transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => setLegalModal('security')}
                className="hover:text-blue-600 transition-colors"
              >
                Security & Compliance
              </button>
              <button
                onClick={() => setLegalModal('contact')}
                className="hover:text-blue-600 transition-colors"
              >
                Support & Contact
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>© 2026 BharatSupport Technologies Inc. All rights reserved.</span>
            <span>Enterprise SLAs · High Availability Deployment</span>
          </div>
        </div>
      </footer>

      {/* Legal & Info Modals */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 relative">
            <button
              onClick={() => setLegalModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {legalModal === 'privacy' && (
              <div>
                <div className="flex items-center gap-2 mb-3 text-slate-900">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-display font-bold text-lg">Enterprise Privacy Policy</h3>
                </div>
                <div className="text-xs text-slate-600 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                  <p>
                    BharatSupport AI processes customer communication strictly within isolated tenant sandboxes in accordance with the Digital Personal Data Protection (DPDP) standards.
                  </p>
                  <p>
                    <strong>1. Zero Data Training:</strong> Customer messages, phone numbers, and enterprise queries are never utilized to train foundation models.
                  </p>
                  <p>
                    <strong>2. Confidential Storage:</strong> Active chat histories and verification records are stored encrypted in-transit (TLS 1.3) and at-rest (AES-256).
                  </p>
                  <p>
                    <strong>3. Data Retention:</strong> Transcripts are retained per tenant-specified retention windows and can be purged on demand.
                  </p>
                </div>
              </div>
            )}

            {legalModal === 'terms' && (
              <div>
                <div className="flex items-center gap-2 mb-3 text-slate-900">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-display font-bold text-lg">Terms of Service</h3>
                </div>
                <div className="text-xs text-slate-600 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                  <p>
                    Welcome to the BharatSupport AI platform. By integrating our conversational API, WhatsApp gateway, or web widgets, you agree to these operational terms:
                  </p>
                  <p>
                    <strong>1. Grounded Verification:</strong> BharatSupport AI utilizes verified RAG retrieval. Responses with confidence below 60% trigger mandatory human escalation.
                  </p>
                  <p>
                    <strong>2. Acceptable Use:</strong> Tenants must ensure uploaded documents, fee structures, and shipping policies are legally accurate and truthful.
                  </p>
                  <p>
                    <strong>3. Service Availability:</strong> Cloud endpoints guarantee 99.9% uptime SLA for automated messaging channels.
                  </p>
                </div>
              </div>
            )}

            {legalModal === 'security' && (
              <div>
                <div className="flex items-center gap-2 mb-3 text-slate-900">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-display font-bold text-lg">Security & Confidence Architecture</h3>
                </div>
                <div className="text-xs text-slate-600 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                  <p>
                    BharatSupport AI was engineered from the ground up to eradicate AI hallucinations for Indian commerce:
                  </p>
                  <p>
                    <strong>• Three-Tier Confidence Gate:</strong> Every customer query passes through mathematical confidence scoring before automated responses are dispatched.
                  </p>
                  <p>
                    <strong>• Role-Based Escalation:</strong> High frustration or ambiguity automatically surfaces tickets directly into the Human Support Desk.
                  </p>
                  <p>
                    <strong>• API Security:</strong> Internal endpoints use rate limiting, payload sanitization, and bearer token authorization.
                  </p>
                </div>
              </div>
            )}

            {legalModal === 'contact' && (
              <div>
                <div className="flex items-center gap-2 mb-3 text-slate-900">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h3 className="font-display font-bold text-lg">Contact & Enterprise Support</h3>
                </div>
                <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    Need customized onboarding, on-premise deployment, or assistance with CRM integration?
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Official Email:</span>
                      <strong className="text-slate-900 font-mono">support@bharatsupport.ai</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Toll-Free Helpline:</span>
                      <strong className="text-slate-900 font-mono">+91 1800-202-9900</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Operating Hours:</span>
                      <span className="text-slate-700">24/7 AI Desk · Mon-Sat Human Desk</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
