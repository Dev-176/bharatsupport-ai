import React, { useState } from 'react';
import {
  Inbox,
  AlertCircle,
  Clock,
  Send,
  CheckCircle,
  UserCheck,
  Sparkles,
  Phone,
  Mail,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { EscalationTicket } from '../types/bharatSupport';

interface AgentInboxViewProps {
  tickets: EscalationTicket[];
  onResolveTicket: (ticketId: string, replyText: string) => void;
}

export const AgentInboxView: React.FC<AgentInboxViewProps> = ({
  tickets,
  onResolveTicket,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    tickets[0]?.id || ''
  );
  const [agentReplyText, setAgentReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'ALL') return true;
    return t.status === filterStatus;
  });

  const handleUseDraft = (draft: string) => {
    setAgentReplyText(draft);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentReplyText.trim() || !selectedTicket) return;
    onResolveTicket(selectedTicket.id, agentReplyText.trim());
    setAgentReplyText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded">
              Escalation Desk
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Human Agent Console for Ambiguous & High-Priority Customer Cases
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Escalation Desk
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            When confidence is low or customers request specialized assistance, BharatSupport routes here with full context and instant AI-drafted replies.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1 self-start sm:self-auto">
          {(['ALL', 'OPEN', 'RESOLVED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {status.toLowerCase()} ({tickets.filter((t) => status === 'ALL' || t.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-slate-900">
            All Escalation Tickets Resolved
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            BharatSupport AI is currently handling all incoming queries autonomously with &gt; 85% confidence.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Tickets Queue */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[650px]">
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <span>Escalated Queue ({filteredTickets.length})</span>
              <span>Priority & Time</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredTickets.map((ticket) => {
                const isSelected = ticket.id === selectedTicket?.id;
                const isCritical = ticket.priority === 'CRITICAL' || ticket.priority === 'HIGH';

                return (
                  <div
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicketId(ticket.id);
                      setAgentReplyText(ticket.suggestedDraft || '');
                    }}
                    className={`p-4 cursor-pointer transition-colors relative ${
                      isSelected ? 'bg-blue-50/80 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{ticket.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">#{ticket.id}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            ticket.priority === 'HIGH' || ticket.priority === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : ticket.priority === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ticket.priority}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            ticket.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                      {ticket.summary}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                          {ticket.detectedLanguage}
                        </span>
                        <span className="text-rose-600 font-mono font-semibold">
                          Score: {ticket.confidenceScore}%
                        </span>
                      </div>
                      <span>{ticket.createdAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Ticket Detail & 1-Click AI Draft */}
          {selectedTicket && (
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[650px]">
              {/* Ticket Top bar */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {selectedTicket.customerName}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">({selectedTicket.customerPhoneOrEmail})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>Channel: <strong className="capitalize">{selectedTicket.channel}</strong></span>
                    <span>·</span>
                    <span>Intent: <strong className="text-slate-800">{selectedTicket.intent}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      selectedTicket.sentiment === 'FRUSTRATED'
                        ? 'bg-rose-100 text-rose-800'
                        : selectedTicket.sentiment === 'URGENT'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Sentiment: {selectedTicket.sentiment}
                  </span>
                </div>
              </div>

              {/* Ticket Summary & Conversation View */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
                {/* AI Executive Summary Card */}
                <div className="p-3.5 rounded-xl bg-blue-50/90 border border-blue-200 text-xs text-blue-950">
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-blue-900">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>AI Context & Escalation Reason:</span>
                  </div>
                  <p className="leading-relaxed text-blue-900/90">
                    {selectedTicket.summary}
                  </p>
                </div>

                {/* Messages Timeline */}
                <div className="space-y-3 pt-1">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Customer Conversation Transcript
                  </h4>
                  {selectedTicket.messages.map((m) => {
                    const isUser = m.sender === 'user';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                            isUser
                              ? 'bg-white border border-slate-200 text-slate-900'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          <div className="text-[10px] font-bold mb-1 opacity-70">
                            {isUser ? selectedTicket.customerName : 'BharatSupport AI'}
                          </div>
                          <p>{m.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Agent Reply Box with AI 1-Click Draft */}
              <div className="p-4 bg-white border-t border-slate-200 space-y-3">
                {/* 1-Click AI Draft Card */}
                {selectedTicket.suggestedDraft && (
                  <div className="p-2.5 bg-amber-50/90 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2 min-w-0">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="truncate">
                        <span className="font-bold text-amber-900 block text-[11px]">
                          AI Recommended Resolution Draft:
                        </span>
                        <span className="text-amber-800 italic truncate block">
                          "{selectedTicket.suggestedDraft}"
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUseDraft(selectedTicket.suggestedDraft)}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0"
                    >
                      Use Draft
                    </button>
                  </div>
                )}

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="flex gap-2">
                  <input
                    type="text"
                    value={agentReplyText}
                    onChange={(e) => setAgentReplyText(e.target.value)}
                    placeholder="Type human agent reply or edit AI draft above..."
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                  <button
                    type="submit"
                    disabled={!agentReplyText.trim()}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send & Resolve</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
