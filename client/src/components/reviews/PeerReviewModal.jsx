import React, { useState } from 'react';
import { X, Star, Sparkles, Send, ShieldAlert, Award } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { fireSparkles } from '../brand/SparkleEffect';

const DIMENSIONS = [
  { key: 'ui_ux', label: 'UI/UX', desc: 'Visual clarity, accessibility, and user interaction design' },
  { key: 'technical', label: 'Technical Implementation', desc: 'Code architecture, tech stack fit, and robustness' },
  { key: 'innovation', label: 'Innovation', desc: 'Originality of the concept or novel angle of approach' },
  { key: 'ai', label: 'AI Implementation', desc: 'Practical utility and relevance of intelligent features' },
  { key: 'usefulness', label: 'Real-world Usefulness', desc: 'Solves an authentic pain point for real students' },
  { key: 'problem_solving', label: 'Problem Solving', desc: 'Logical execution and clarity of solution' }
];

export default function PeerReviewModal({ isOpen, onClose, project, onReviewSubmitted }) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [scores, setScores] = useState({
    ui_ux: 8,
    technical: 8,
    innovation: 8,
    ai: 7,
    usefulness: 9,
    problem_solving: 8
  });

  const [wellDone, setWellDone] = useState('');
  const [toImprove, setToImprove] = useState('');
  const [recommendLearn, setRecommendLearn] = useState('');

  if (!isOpen) return null;

  const handleScoreChange = (dimKey, val) => {
    setScores(prev => ({ ...prev, [dimKey]: Number(val) }));
  };

  const calculateOverall = () => {
    const sum = Object.values(scores).reduce((a, b) => a + b, 0);
    return (sum / DIMENSIONS.length).toFixed(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wellDone.trim() || !toImprove.trim() || !recommendLearn.trim()) {
      setError('Please fill in all three constructive feedback sections.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        scores,
        well_done: wellDone,
        to_improve: toImprove,
        recommend_learn: recommendLearn
      };

      const result = await api.submitReview(project.id, payload);
      fireSparkles();
      onReviewSubmitted(result);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-java/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#FDFAF0] rounded-3xl shadow-lift border border-soil/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-soil/10 bg-cream-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sceptre font-heading">
                Structured Peer Review
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-900 flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-amber-500" />
                Overall: {calculateOverall()}/10
              </span>
            </div>
            <h2 className="text-lg font-bold font-heading text-soil mt-0.5">
              Reviewing "{project.title}"
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-soil/60 hover:text-sceptre hover:bg-soil/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-100/80 border border-red-300 text-sceptre text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 6 Dimensions Scoring */}
          <div>
            <div className="mb-3">
              <h3 className="font-heading font-bold text-sm text-soil">
                1. Multi-Dimensional Score (1–10)
              </h3>
              <p className="text-xs text-soil/60">
                Rate each dimension thoughtfully. Your domain skills ({user?.skills?.slice(0, 3).join(', ')}) help weight this feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {DIMENSIONS.map(({ key, label, desc }) => (
                <div key={key} className="p-3 rounded-2xl bg-white border border-soil/15 shadow-sm space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-soil">{label}</span>
                    <span className="text-xs font-extrabold font-heading px-2 py-0.5 rounded-md bg-sceptre/10 text-sceptre">
                      {scores[key]}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={scores[key]}
                    onChange={(e) => handleScoreChange(key, e.target.value)}
                    className="w-full accent-sceptre cursor-pointer h-1.5 bg-soil/10 rounded-lg"
                  />
                  <p className="text-[10px] text-soil/50 leading-tight">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Constructive Prompts */}
          <div className="space-y-4 pt-2 border-t border-soil/10">
            <h3 className="font-heading font-bold text-sm text-soil">
              2. Constructive Qualitative Feedback
            </h3>

            <div>
              <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1 font-heading">
                What did they do well? *
              </label>
              <textarea
                rows={2}
                value={wellDone}
                onChange={(e) => setWellDone(e.target.value)}
                placeholder="Highlight their strengths, design choices, clear problem articulation, or smooth execution..."
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-java focus:outline-none focus:border-sceptre"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sceptre uppercase tracking-wider mb-1 font-heading flex items-center gap-1">
                <span>Area to strengthen *</span>
                <span className="text-[10px] text-soil/50 font-normal lowercase">(constructive opportunity, not harsh critique)</span>
              </label>
              <textarea
                rows={2}
                value={toImprove}
                onChange={(e) => setToImprove(e.target.value)}
                placeholder="What architectural, visual, or functional area would benefit from more polish?"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-java focus:outline-none focus:border-sceptre"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1 font-heading">
                What would you recommend they learn next? *
              </label>
              <textarea
                rows={2}
                value={recommendLearn}
                onChange={(e) => setRecommendLearn(e.target.value)}
                placeholder="Recommend specific concepts, libraries, patterns (e.g. BullMQ job queues, Redis, ARIA live regions)..."
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-java focus:outline-none focus:border-sceptre"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-soil/10 flex items-center justify-between">
            <span className="text-[11px] text-soil/60">
              Reviews feed directly into the AI Learning Snapshot.
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs sm:text-sm shadow-warm transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                  <span>Submitting & Synthesizing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Peer Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
