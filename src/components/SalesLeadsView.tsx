import React, { useState } from 'react';
import { Users, TrendingUp, Sparkles, Download, Phone, Mail, Smartphone, CheckCircle, Plus, X } from 'lucide-react';
import { SalesLead, SalesPipelineStage, ChannelType } from '../types/bharatSupport';

interface SalesLeadsViewProps {
  leads: SalesLead[];
  onUpdateLeadStatus: (leadId: string, newStatus: SalesPipelineStage) => void;
  onNewLead?: (lead: SalesLead) => void;
}

const STAGES: { stage: SalesPipelineStage; label: string; color: string }[] = [
  { stage: 'NEW', label: 'New Lead', color: 'bg-amber-100 text-amber-800' },
  { stage: 'QUALIFIED', label: 'Qualified', color: 'bg-purple-100 text-purple-800' },
  { stage: 'CONTACTED', label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
  { stage: 'NEGOTIATION', label: 'Negotiation', color: 'bg-cyan-100 text-cyan-800' },
  { stage: 'CONVERTED', label: 'Converted', color: 'bg-emerald-100 text-emerald-800' },
  { stage: 'LOST', label: 'Lost', color: 'bg-rose-100 text-rose-800' },
];

export const SalesLeadsView: React.FC<SalesLeadsViewProps> = ({
  leads,
  onUpdateLeadStatus,
  onNewLead,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | SalesPipelineStage>('ALL');
  const [isCreatingLead, setIsCreatingLead] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newChannel, setNewChannel] = useState<ChannelType>('whatsapp');
  const [newInterest, setNewInterest] = useState('Bulk Order Inquiry (100 units)');
  const [newScore, setNewScore] = useState(90);
  const [newSnippet, setNewSnippet] = useState('I need 100 units. What is your bulk pricing?');
  const [newStage, setNewStage] = useState<SalesPipelineStage>('NEW');

  const filteredLeads = leads.filter((l) => filterStatus === 'ALL' || l.status === filterStatus);

  const handleExportCSV = () => {
    // Generate clean CSV without internal system data
    const headers = ['Customer Name', 'Contact', 'Channel', 'Interested Product / Service', 'Buyer Intent Score (%)', 'Stage', 'Captured Date'];
    const rows = leads.map((l) => [
      `"${(l.customerName || '').replace(/"/g, '""')}"`,
      `"${(l.contact || '').replace(/"/g, '""')}"`,
      `"${l.channel}"`,
      `"${(l.interestArea || '').replace(/"/g, '""')}"`,
      l.buyerIntentScore,
      `"${l.status}"`,
      `"${l.capturedAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BharatSupport_Sales_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newContact.trim()) return;

    if (onNewLead) {
      onNewLead({
        id: `lead-${Date.now()}`,
        customerName: newCustomerName.trim(),
        contact: newContact.trim(),
        channel: newChannel,
        interestArea: newInterest.trim(),
        buyerIntentScore: Number(newScore),
        snippet: newSnippet.trim(),
        capturedAt: 'Just now',
        status: newStage,
      });
    }

    setNewCustomerName('');
    setNewContact('');
    setIsCreatingLead(false);
  };

  const getStageBadgeStyle = (status: SalesPipelineStage) => {
    switch (status) {
      case 'NEW':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'QUALIFIED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CONTACTED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'NEGOTIATION':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'CONVERTED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'LOST':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded">
              Support to Sales Intelligence
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Autonomous Revenue Pipeline from Inbound Customer Queries
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Qualified Sales Pipeline
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            BharatSupport AI detects commercial intent (course admissions, bulk purchases, corporate deals) and tracks leads across all 6 pipeline stages.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onNewLead && (
            <button
              onClick={() => setIsCreatingLead(!isCreatingLead)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Lead</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            title="Download CSV report of current pipeline"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Create Lead Form */}
      {isCreatingLead && (
        <form
          onSubmit={handleCreateLeadSubmit}
          className="bg-white rounded-2xl border border-blue-200 p-6 shadow-md mb-8 animate-fade-in"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Create / Log New Sales Lead</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsCreatingLead(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Chandra"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone or Email</label>
              <input
                type="text"
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                placeholder="e.g. +91 98450 12345"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Channel</label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value as ChannelType)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="webchat">Web Chat</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Interested Product / Service</label>
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="e.g. Full Stack AI Bootcamp"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Buyer Intent Score (0-100%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newScore}
                onChange={(e) => setNewScore(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Stage</label>
              <select
                value={newStage}
                onChange={(e) => setNewStage(e.target.value as SalesPipelineStage)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              >
                {STAGES.map((s) => (
                  <option key={s.stage} value={s.stage}>
                    {s.label} ({s.stage})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Snippet</label>
            <input
              type="text"
              value={newSnippet}
              onChange={(e) => setNewSnippet(e.target.value)}
              placeholder="e.g. Customer inquiry text"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreatingLead(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Save Lead to Pipeline
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs (All 6 Stages) */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1 mb-6 overflow-x-auto">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
            filterStatus === 'ALL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Stages ({leads.length})
        </button>

        {STAGES.map(({ stage, label }) => {
          const count = leads.filter((l) => l.status === stage).length;
          return (
            <button
              key={stage}
              onClick={() => setFilterStatus(stage)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === stage
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <h3 className="font-display text-base font-bold text-slate-800">No leads in this filter</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Inbound customer queries with commercial purchase intent will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4">Interested Product / Service</th>
                  <th className="p-4">Buyer Intent Score</th>
                  <th className="p-4">Captured Inquiry Snippet</th>
                  <th className="p-4">Pipeline Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{lead.customerName}</div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">{lead.contact}</div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {lead.channel}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                        {lead.interestArea}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-emerald-700 tabular-nums">
                          {lead.buyerIntentScore}%
                        </span>
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${Math.min(lead.buyerIntentScore, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs text-slate-600 italic">
                      "{lead.snippet}"
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          onUpdateLeadStatus(lead.id, e.target.value as SalesPipelineStage)
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${getStageBadgeStyle(
                          lead.status
                        )}`}
                      >
                        {STAGES.map((s) => (
                          <option key={s.stage} value={s.stage}>
                            {s.label} ({s.stage})
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
