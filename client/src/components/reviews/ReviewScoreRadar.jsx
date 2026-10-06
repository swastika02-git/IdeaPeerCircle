import React from 'react';
import { Star, ShieldCheck, Award } from 'lucide-react';

const DIMENSIONS = [
  { key: 'ui_ux', label: 'UI / UX' },
  { key: 'technical', label: 'Technical' },
  { key: 'innovation', label: 'Innovation' },
  { key: 'ai', label: 'AI Quality' },
  { key: 'usefulness', label: 'Utility' },
  { key: 'problem_solving', label: 'Problem Solving' }
];

export default function ReviewScoreRadar({ reviews = [] }) {
  if (reviews.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-[#FDFAF0] border border-soil/15 text-center text-xs text-soil/60">
        No peer reviews submitted yet. Be the first to provide feedback!
      </div>
    );
  }

  // Calculate dimension averages
  const totals = {};
  DIMENSIONS.forEach(d => { totals[d.key] = 0; });

  reviews.forEach(r => {
    if (r.scores) {
      DIMENSIONS.forEach(d => {
        totals[d.key] += (r.scores[d.key] || 8);
      });
    }
  });

  const count = reviews.length;
  const averages = {};
  let overallSum = 0;

  DIMENSIONS.forEach(d => {
    const avg = Number((totals[d.key] / count).toFixed(1));
    averages[d.key] = avg;
    overallSum += avg;
  });

  const overallAvg = (overallSum / DIMENSIONS.length).toFixed(1);

  return (
    <div className="p-6 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft space-y-5">
      <div className="flex items-center justify-between border-b border-soil/10 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-sceptre font-heading">
            Review Score Matrix
          </span>
          <h3 className="text-lg font-bold font-heading text-soil mt-0.5">
            Peer Feedback Consensus
          </h3>
        </div>

        {/* Big Overall Score Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-500/30">
          <Star className="w-5 h-5 fill-current text-amber-600" />
          <div className="text-right">
            <span className="text-lg font-extrabold font-heading text-amber-950 leading-none block">
              {overallAvg}
            </span>
            <span className="text-[10px] text-amber-900/60 font-semibold uppercase tracking-wider">
              {count} {count === 1 ? 'Peer Review' : 'Peer Reviews'}
            </span>
          </div>
        </div>
      </div>

      {/* 6 Dimension Horizontal Progress Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {DIMENSIONS.map(dim => {
          const score = averages[dim.key] || 8.0;
          const percentage = (score / 10) * 100;
          return (
            <div key={dim.key} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-soil">{dim.label}</span>
                <span className="font-extrabold font-heading text-sceptre">{score} / 10</span>
              </div>
              <div className="w-full bg-soil/10 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cerulean to-sceptre rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
