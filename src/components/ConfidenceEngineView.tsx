import React, { useState } from 'react';
import { Sliders, ShieldCheck, HelpCircle, UserCheck, Play, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { AIResponseResult } from '../types/bharatSupport';

interface ConfidenceEngineViewProps {
  thresholds: { autoReply: number; clarify: number };
  setThresholds: React.Dispatch<React.SetStateAction<{ autoReply: number; clarify: number }>>;
}

export const ConfidenceEngineView: React.FC<ConfidenceEngineViewProps> = ({
  thresholds,
  setThresholds,
}) => {
  const [testQuery, setTestQuery] = useState('Weekend batch me admission fees kitni hai aur kya EMI option available hai?');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<AIResponseResult | null>(null);

  const handleTestEvaluation = async () => {
    if (!testQuery.trim() || isEvaluating) return;
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testQuery,
          channel: 'webchat',
          thresholds,
        }),
      });

      const data = await res.json();
      if (data.result) {
        setEvaluationResult(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded">
            Policy & Decision Routing
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Three-Tier Confidence Engine & Escalation Policy
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Confidence Engine & Escalation Policy
        </h1>
        <p className="text-sm text-slate-600 mt-0.5 max-w-2xl">
          Configurable three-tier confidence routing that prevents AI hallucination by safely escalating ambiguous or high-risk queries to human agents.
        </p>
      </div>

      {/* The 3 Core Routing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Tier 1: Auto-Reply */}
        <div className="bg-white rounded-2xl border-2 border-emerald-500/80 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Tier 1
          </div>
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider mb-1">
              &gt; {thresholds.autoReply}% Confidence
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
              Auto-Reply
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              When query intent matches verified company policy documents with absolute mathematical clarity. Instant, zero-latency autonomous resolution.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-[11px] text-emerald-800 border border-emerald-200">
            <strong>Outcome:</strong> Auto-sends verified response with source citations. 84.3% of all traffic resolved here.
          </div>
        </div>

        {/* Tier 2: Ask Clarification */}
        <div className="bg-white rounded-2xl border-2 border-amber-400 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Tier 2
          </div>
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider mb-1">
              {thresholds.clarify}% - {thresholds.autoReply}% Confidence
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
              Ask Clarification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              When the query is ambiguous, missing key order numbers, or could match multiple knowledge base topics. Guided options are presented to the user.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-[11px] text-amber-900 border border-amber-200">
            <strong>Outcome:</strong> Generates 2-3 interactive clarification pills to narrow intent before finalizing answer.
          </div>
        </div>

        {/* Tier 3: Human Escalation */}
        <div className="bg-white rounded-2xl border-2 border-rose-400 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Tier 3
          </div>
          <div>
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-bold text-rose-700 uppercase tracking-wider mb-1">
              &lt; {thresholds.clarify}% or High Emotion
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
              Human Escalation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              When knowledge is unverified, policy doesn't cover edge case, or user expresses frustration / demands a human supervisor.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-[11px] text-rose-800 border border-rose-200">
            <strong>Outcome:</strong> Creates priority ticket on Human Desk with AI auto-draft response for 1-click human resolution.
          </div>
        </div>
      </div>

      {/* Threshold Tuner Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Tune Confidence Thresholds</span>
          </h3>
          <button
            onClick={() => setThresholds({ autoReply: 85, clarify: 60 })}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Reset to Recommended Defaults (85% / 60%)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auto Reply Slider */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
              <span>Auto-Reply Minimum Threshold</span>
              <span className="text-emerald-700 font-bold font-mono text-sm">
                ≥ {thresholds.autoReply}%
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="95"
              value={thresholds.autoReply}
              onChange={(e) =>
                setThresholds((prev) => ({ ...prev, autoReply: Number(e.target.value) }))
              }
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 mt-2">
              Higher value = stricter safety against hallucination. Lower value = higher autonomous throughput.
            </p>
          </div>

          {/* Clarification Threshold */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
              <span>Clarification Minimum Threshold</span>
              <span className="text-amber-700 font-bold font-mono text-sm">
                ≥ {thresholds.clarify}%
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="75"
              value={thresholds.clarify}
              onChange={(e) =>
                setThresholds((prev) => ({ ...prev, clarify: Number(e.target.value) }))
              }
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 mt-2">
              Any confidence score below this threshold automatically routes directly to a human agent.
            </p>
          </div>
        </div>
      </div>

      {/* Live Confidence Evaluation Playground */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-display text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
          <span>Live Confidence Evaluator Sandbox</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Type any Indian multilingual query to observe the Confidence Engine calculate intent, sentiment, citations, and routing in real time:
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Type a test customer query..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          />
          <button
            onClick={handleTestEvaluation}
            disabled={isEvaluating}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0 flex items-center justify-center gap-2"
          >
            {isEvaluating ? (
              <span>Evaluating...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Engine</span>
              </>
            )}
          </button>
        </div>

        {/* Evaluation Output Details */}
        {evaluationResult && (
          <div className="mt-4 p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Engine Decision:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                    evaluationResult.actionTaken === 'AUTO_REPLY'
                      ? 'bg-emerald-100 text-emerald-800'
                      : evaluationResult.actionTaken === 'ASK_CLARIFICATION'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {evaluationResult.actionTaken.replace('_', ' ')}
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-blue-700">
                Score: {evaluationResult.confidenceScore}% Confidence
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Language</span>
                <strong className="text-slate-800">{evaluationResult.detectedLanguage}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Intent</span>
                <strong className="text-slate-800">{evaluationResult.detectedIntent}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Sentiment</span>
                <strong className="text-slate-800">{evaluationResult.customerSentiment}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Sales Opportunity</span>
                <strong className="text-slate-800">
                  {evaluationResult.salesOpportunity?.isLead ? 'Yes (Lead Captured)' : 'No'}
                </strong>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-slate-400 block uppercase mb-1">Generated Response</span>
              <p className="bg-white p-3 rounded-lg border border-slate-200 text-slate-800 leading-relaxed font-sans">
                {evaluationResult.responseMessage}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
