import React from 'react';
import { Star, ThumbsUp, ArrowUpRight, BookOpen, CheckCircle, Sparkles } from 'lucide-react';

export default function ReviewCard({ review }) {
  const reviewer = review.reviewer || {
    name: 'Peer Reviewer',
    username: 'peer',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=peer',
    skills: []
  };

  const scores = review.scores || {};

  return (
    <div className="rounded-3xl bg-[#FDFAF0] border border-soil/15 p-6 shadow-soft space-y-4 transition-all hover:shadow-warm">
      {/* Top Reviewer Meta */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={reviewer.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${reviewer.username}`}
            alt={reviewer.name}
            className="w-10 h-10 rounded-full object-cover border border-soil/20"
          />
          <div>
            <h4 className="font-heading font-bold text-sm text-soil flex items-center gap-2">
              {reviewer.name}
              {reviewer.college && (
                <span className="text-[11px] font-normal text-soil/60">
                  ({reviewer.college})
                </span>
              )}
            </h4>
            {/* Reviewer expertise tags for smart weighting context */}
            <div className="flex flex-wrap gap-1 mt-0.5">
              {(reviewer.skills || []).slice(0, 3).map(skill => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-cerulean/30 text-soil"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-950 text-xs font-bold font-heading shrink-0">
          <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
          <span>{review.overall_score || 8.0}/10</span>
        </div>
      </div>

      {/* 3 Structured Feedback Content Blocks */}
      <div className="space-y-3 pt-2 border-t border-soil/10 text-xs leading-relaxed">
        {/* What was done well */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold font-heading mb-1">
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>What They Did Well</span>
          </div>
          <p className="text-soil/90">{review.well_done}</p>
        </div>

        {/* Area to strengthen */}
        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold font-heading mb-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-700" />
            <span>Area to Strengthen</span>
          </div>
          <p className="text-soil/90">{review.to_improve}</p>
        </div>

        {/* Recommended to learn next */}
        <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-cerulean/40">
          <div className="flex items-center gap-1.5 text-blue-900 font-bold font-heading mb-1">
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            <span>Recommended to Learn Next</span>
          </div>
          <p className="text-soil/90">{review.recommend_learn}</p>
        </div>
      </div>

      {/* Mini score dimension chips */}
      {scores && (
        <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-soil/60">
          {scores.ui_ux && <span className="bg-soil/5 px-2 py-0.5 rounded">UI/UX: {scores.ui_ux}</span>}
          {scores.technical && <span className="bg-soil/5 px-2 py-0.5 rounded">Tech: {scores.technical}</span>}
          {scores.innovation && <span className="bg-soil/5 px-2 py-0.5 rounded">Innovation: {scores.innovation}</span>}
          {scores.ai && <span className="bg-soil/5 px-2 py-0.5 rounded">AI: {scores.ai}</span>}
          {scores.usefulness && <span className="bg-soil/5 px-2 py-0.5 rounded">Utility: {scores.usefulness}</span>}
          {scores.problem_solving && <span className="bg-soil/5 px-2 py-0.5 rounded">Problem Solving: {scores.problem_solving}</span>}
        </div>
      )}
    </div>
  );
}
