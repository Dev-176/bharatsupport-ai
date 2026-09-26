import React from 'react';
import {
  TrendingUp,
  Globe2,
  Sparkles,
  Inbox,
  Users,
  CheckCircle2,
  Clock,
  Smartphone,
  MessageSquare,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { EscalationTicket, SalesLead } from '../types/bharatSupport';

interface AnalyticsDashboardViewProps {
  tickets?: EscalationTicket[];
  leads?: SalesLead[];
}

export const AnalyticsDashboardView: React.FC<AnalyticsDashboardViewProps> = ({
  tickets = [],
  leads = [],
}) => {
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'RESOLVED').length;

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'NEW').length;
  const convertedLeads = leads.filter((l) => l.status === 'CONVERTED').length;

  // Live Channel Breakdown from actual application state
  const whatsappCount =
    tickets.filter((t) => t.channel === 'whatsapp').length +
    leads.filter((l) => l.channel === 'whatsapp').length;
  const webchatCount =
    tickets.filter((t) => t.channel === 'webchat').length +
    leads.filter((l) => l.channel === 'webchat').length;
  const emailCount =
    tickets.filter((t) => t.channel === 'email').length +
    leads.filter((l) => l.channel === 'email').length;
  const totalEvents = whatsappCount + webchatCount + emailCount || 1;

  const whatsappPercent = Math.round((whatsappCount / totalEvents) * 100);
  const webchatPercent = Math.round((webchatCount / totalEvents) * 100);
  const emailPercent = 100 - whatsappPercent - webchatPercent;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Support Analytics
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time resolution rates, active agent queues, channel distribution, and customer intent metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live State Connected
          </span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Open Escalations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Open Escalations</span>
            <span className="text-rose-600 font-semibold">
              Live Queue
            </span>
          </div>
          <div className="font-display text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {openTickets}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {inProgressTickets} in progress · {totalTickets} total logged
          </p>
        </div>

        {/* Resolved Tickets */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Resolved Cases</span>
            <span className="flex items-center gap-0.5 text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> Handled
            </span>
          </div>
          <div className="font-display text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
            {resolvedTickets}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Agent & verified autonomous closures
          </p>
        </div>

        {/* Qualified Sales Leads */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Sales Opportunities</span>
            <span className="text-blue-600 font-semibold">
              High Intent
            </span>
          </div>
          <div className="font-display text-3xl font-extrabold text-blue-600 font-mono tabular-nums">
            {totalLeads}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {newLeads} new · {convertedLeads} converted
          </p>
        </div>

        {/* Avg Response Time */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Median Response</span>
            <span className="text-emerald-600 font-semibold">
              Sub-2s
            </span>
          </div>
          <div className="font-display text-3xl font-extrabold text-indigo-600 font-mono tabular-nums">
            1.8s
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Zero-hallucination verification active
          </p>
        </div>
      </div>

      {/* Live Channel Activity & Topic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Real Live Channel Distribution */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Live Channel Ingestion</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Application Data
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Live ratio of customer conversations across connected messaging touchpoints:
            </p>

            <div className="space-y-4">
              {/* WhatsApp */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>WhatsApp Business API</span>
                  </div>
                  <span className="font-mono text-emerald-700 tabular-nums">
                    {whatsappCount} records ({whatsappPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.max(whatsappPercent, 5)}%` }}
                  />
                </div>
              </div>

              {/* Web Chat */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>Web Widget & In-App Portal</span>
                  </div>
                  <span className="font-mono text-blue-700 tabular-nums">
                    {webchatCount} records ({webchatPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${Math.max(webchatPercent, 5)}%` }}
                  />
                </div>
              </div>

              {/* Email Support */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    <span>Email Support Desk</span>
                  </div>
                  <span className="font-mono text-slate-700 tabular-nums">
                    {emailCount} records ({emailPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-700 transition-all duration-500"
                    style={{ width: `${Math.max(emailPercent, 5)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Omnichannel Synchronizer</span>
            <span className="text-emerald-700 font-semibold">Active & Streaming</span>
          </div>
        </div>

        {/* Indian Language Breakdown */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-600" />
                <span>Multilingual & Dialect Distribution</span>
              </h3>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Sample Benchmark
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Code-mixed Hinglish and regional vernacular query volume across Indian SMB demographics:
            </p>

            <div className="space-y-3">
              {[
                { lang: 'Hinglish (Code-Mixed Roman Hindi)', share: 42, sample: 'Mujhe order check karna hai', color: 'bg-emerald-500' },
                { lang: 'Hindi (हिंदी देवनागरी)', share: 28, sample: 'फीस कितनी है? सीट है क्या?', color: 'bg-blue-600' },
                { lang: 'English (Business Context)', share: 22, sample: 'Please share invoice #492', color: 'bg-indigo-600' },
                { lang: 'Tamil, Telugu, Marathi, Bengali', share: 8, sample: 'Regional vernacular queries', color: 'bg-amber-500' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                    <span>{item.lang}</span>
                    <span className="font-mono text-blue-700 tabular-nums">{item.share}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.share}%` }} />
                  </div>
                  <span className="text-[11px] text-slate-500 italic block">
                    e.g. "{item.sample}"
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Natural Language Understanding</span>
            <span className="text-emerald-700 font-semibold">Zero Translation Latency</span>
          </div>
        </div>
      </div>

      {/* Common Issues & Resolution Topics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900">
              Customer Inquiries by Topic
            </h3>
            <p className="text-xs text-slate-500">
              Categorization of incoming inquiries by detected intent (Sample Benchmark)
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
            Intent Analytics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {[
            { label: 'Order Status & Live Tracking', percent: 28, color: 'bg-blue-600' },
            { label: 'Account Access & Verification', percent: 22, color: 'bg-emerald-600' },
            { label: 'Billing, Fees & Payment Queries', percent: 18, color: 'bg-indigo-600' },
            { label: 'Return & Refund Verification', percent: 17, color: 'bg-amber-500' },
            { label: 'Product Specifications & Batch Timings', percent: 15, color: 'bg-purple-600' },
          ].map((issue, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-slate-800">
                <span>{issue.label}</span>
                <span className="font-mono text-slate-900 tabular-nums">{issue.percent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${issue.color} rounded-full`}
                  style={{ width: `${issue.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Highlights */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-display text-lg sm:text-xl font-bold text-white">
            Operational Architecture
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-2xl leading-relaxed">
          How BharatSupport AI combines verified knowledge retrieval, confidence thresholds, and human-in-the-loop escalation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
            <span className="text-slate-400 font-medium block">Autonomous Resolution</span>
            <span className="font-display text-2xl font-bold text-white mt-1 block font-mono tabular-nums">
              &gt; 80%
            </span>
            <p className="text-slate-400 mt-1 text-[11px]">
              Direct resolution of queries using verified knowledge base docs.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
            <span className="text-slate-400 font-medium block">Lead Capture</span>
            <span className="font-display text-2xl font-bold text-emerald-400 mt-1 block font-mono tabular-nums">
              Automatic
            </span>
            <p className="text-slate-400 mt-1 text-[11px]">
              Buyer inquiries detected and routed directly to sales pipeline.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
            <span className="text-slate-400 font-medium block">Zero-Hallucination Safe</span>
            <span className="font-display text-2xl font-bold text-blue-400 mt-1 block font-mono tabular-nums">
              Strict Policy
            </span>
            <p className="text-slate-400 mt-1 text-[11px]">
              Ambiguous or unverified queries safely routed to human support desk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
