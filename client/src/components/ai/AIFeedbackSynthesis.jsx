import React from 'react';
import { Sparkles, Heart, AlertCircle, Lightbulb, Compass, MessageSquareQuote } from 'lucide-react';

export default function AIFeedbackSynthesis({ synthesis, reviewCount = 0 }) {
  if (!synthesis) return null;

  const count = synthesis.reviewCount || reviewCount || 1;

  return (
    <div className="rounded-3xl bg-[#FDFAF0] border-2 border-sceptre/20 p-6 sm:p-8 shadow-warm space-y-6 relative overflow-hidden">
      {/* Background Subtle Sparkle Sweep */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cerulean/20 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-soil/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sceptre text-cream flex items-center justify-center font-bold text-sm shadow-sm">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sceptre font-heading">
              Feedback Synthesis
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-soil">
              {count} {count === 1 ? 'Peer Reviewed' : 'Peers Reviewed'} Your Project
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold font-heading bg-cream text-soil border border-soil/15">
          Consensus Model
        </span>
      </div>

      {/* 3 Synthesis Focus Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WHAT PEOPLE LIKED */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold font-heading text-emerald-900 uppercase tracking-wide">
            <Heart className="w-3.5 h-3.5 text-emerald-600 fill-current" />
            <span>What People Liked</span>
          </div>
          <p className="text-xs text-soil/90 leading-relaxed font-medium">
            "{synthesis.liked}"
          </p>
        </div>

        {/* COMMON CONCERN */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold font-heading text-amber-950 uppercase tracking-wide">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Common Concern</span>
          </div>
          <p className="text-xs text-soil/90 leading-relaxed font-medium">
            "{synthesis.commonConcern}"
          </p>
        </div>

        {/* UNIQUE SUGGESTION */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-cerulean/50 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold font-heading text-blue-900 uppercase tracking-wide">
            <Lightbulb className="w-3.5 h-3.5 text-blue-700" />
            <span>Unique Suggestion</span>
          </div>
          <p className="text-xs text-soil/90 leading-relaxed font-medium">
            "{synthesis.uniqueSuggestion}"
          </p>
        </div>
      </div>

      {/* AI TAKEAWAY HERO BOX */}
      <div className="p-5 rounded-2xl bg-sceptre text-cream shadow-warm space-y-1 relative">
        <div className="flex items-center gap-2 text-xs font-bold font-heading text-cream/70 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI Takeaway</span>
        </div>
        <p className="text-sm sm:text-base font-heading font-semibold text-cream leading-snug">
          "{synthesis.takeaway}"
        </p>
      </div>
    </div>
  );
}
