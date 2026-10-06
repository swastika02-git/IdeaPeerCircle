import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Compass,
  ArrowRight,
  Hammer,
  Users,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import api from '../../api/client';
import AILoadingAnimation from './AILoadingAnimation';
import { fireSparkles } from '../brand/SparkleEffect';

export default function AILearningSnapshot({ project, initialInsight, onInsightUpdated }) {
  const [insight, setInsight] = useState(initialInsight);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await api.analyzeProject(project.id);
      setInsight(res);
      fireSparkles();
      if (onInsightUpdated) onInsightUpdated(res);
    } catch (err) {
      setError(err.message || 'Could not synthesize AI snapshot.');
    } finally {
      // Keep loading animation visible for at least 2.5 seconds for polish
      setTimeout(() => setAnalyzing(false), 2400);
    }
  };

  if (analyzing) {
    return <AILoadingAnimation />;
  }

  if (!insight) {
    return (
      <div className="p-8 rounded-3xl bg-[#FDFAF0] border border-soil/15 text-center shadow-soft space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-cerulean/30 border border-cerulean flex items-center justify-center text-sceptre">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="max-w-md mx-auto">
          <h3 className="font-heading font-bold text-lg text-soil">
            Ready to Generate Your AI Learning Snapshot
          </h3>
          <p className="text-xs text-soil/70 mt-1">
            Synthesize peer critiques, detect conceptual skill gaps, and receive targeted next steps.
          </p>
        </div>
        <button
          onClick={handleRunAnalysis}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs sm:text-sm shadow-warm transition-transform active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Synthesize AI Snapshot</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#FDFAF0] border border-cerulean/60 shadow-warm space-y-6">
      {/* Header with Title and Re-analyze Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-soil/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cerulean/30 border border-cerulean flex items-center justify-center text-sceptre shrink-0">
            <Sparkles className="w-6 h-6 text-sceptre" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sceptre font-heading">
              Personal Learning Mentor
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-soil">
              Your AI Learning Snapshot
            </h2>
          </div>
        </div>

        <button
          onClick={handleRunAnalysis}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-soil/15 hover:border-sceptre text-xs font-semibold text-soil hover:text-sceptre transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {error && (
        <div className="p-3 text-xs bg-red-100/80 border border-red-300 text-sceptre rounded-xl">
          {error}
        </div>
      )}

      {/* AI Summary Banner */}
      <div className="p-4 rounded-2xl bg-cream border border-soil/10 text-xs sm:text-sm text-soil leading-relaxed font-medium">
        <p className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{insight.summary}</span>
        </p>
      </div>

      {/* Grid: Strengths & Areas to Improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Project Strengths */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-bold font-heading text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>Project Strengths</span>
          </div>
          <ul className="space-y-2 text-xs text-soil/90">
            {(insight.strengths || []).map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2 text-amber-950 font-bold font-heading text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Areas to Strengthen</span>
          </div>
          <ul className="space-y-2 text-xs text-soil/90">
            {(insight.areasToImprove || []).map((area, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detected Skill Gaps */}
      <div className="p-5 rounded-2xl bg-white border border-soil/15 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-soil font-bold font-heading text-sm">
          <Compass className="w-4 h-4 text-sceptre" />
          <span>Identified Skill Gaps</span>
          <span className="text-[11px] font-normal text-soil/60">
            (Concepts mapped from feedback bottlenecks)
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(insight.skillGaps || []).map((gap, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-cerulean/30 border border-cerulean/60 text-soil text-xs font-bold font-heading"
            >
              {gap}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended Next Steps */}
      <div className="space-y-3">
        <h4 className="font-heading font-bold text-sm text-soil flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-sceptre" />
          <span>Recommended Next Learning Steps</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(insight.learningRecommendations || []).map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-soil/15 shadow-sm space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sceptre font-heading">
                  Module #{idx + 1}
                </span>
                <h5 className="font-heading font-bold text-xs sm:text-sm text-soil mt-0.5">
                  {rec.title}
                </h5>
                <p className="text-[11px] text-soil/70 mt-1">
                  <strong>Why:</strong> {rec.reason}
                </p>
              </div>

              <div className="pt-2 border-t border-soil/10">
                <p className="text-[11px] text-sceptre font-semibold">
                  <strong>Action:</strong> {rec.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Concrete Project Improvements & Collaboration Needs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-soil/10">
        <div className="space-y-2">
          <h4 className="font-heading font-bold text-xs text-soil uppercase tracking-wider flex items-center gap-1.5">
            <Hammer className="w-3.5 h-3.5 text-soil" />
            <span>Project Architecture Improvements</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-soil/80">
            {(insight.projectImprovements || []).map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-sceptre font-bold">&bull;</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-heading font-bold text-xs text-soil uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-sceptre" />
            <span>Optimal Collaborator Profiles</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-soil/80">
            {(insight.collaborationNeeds || []).map((collab, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-sceptre font-bold">&bull;</span>
                <span>{collab}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
