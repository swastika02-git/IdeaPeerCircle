import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FolderGit2,
  Award,
  Compass
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { fireSparkles } from '../components/brand/SparkleEffect';

export default function LearningPage({ onNavigate }) {
  const { user } = useAuth();
  const [learningData, setLearningData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedConcepts, setCompletedConcepts] = useState({});

  useEffect(() => {
    async function fetchLearning() {
      setLoading(true);
      try {
        const res = await api.getLearningPlan();
        setLearningData(res);
      } catch (err) {
        console.error('Failed to load learning plan:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLearning();
  }, [user]);

  const toggleConcept = (conceptName) => {
    setCompletedConcepts(prev => {
      const next = { ...prev, [conceptName]: !prev[conceptName] };
      if (next[conceptName]) {
        fireSparkles();
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-soil/60">
        <div className="w-8 h-8 border-2 border-sceptre border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-heading font-bold text-sm">Aggregating AI project feedback into your learning path...</p>
      </div>
    );
  }

  const { activeFocus, skillGaps, recommendations, pathways } = learningData || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Top Banner */}
      <div className="pb-6 border-b border-soil/15">
        <span className="text-xs font-bold uppercase tracking-widest text-sceptre font-heading">
          Feedback-Driven Mastery
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-soil tracking-tight mt-1">
          My Learning Path
        </h1>
        <p className="text-xs sm:text-sm text-soil/70 mt-1 max-w-xl">
          Every peer review and AI snapshot feeds directly into this roadmap. Turn constructive critiques into actionable technical milestones.
        </p>
      </div>

      {/* CURRENT LEARNING FOCUS HERO CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cream via-[#FDFAF0] to-cream border-2 border-sceptre/30 shadow-warm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sceptre font-heading flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Your Current Learning Focus
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-soil mt-1">
              {activeFocus || 'Backend Development & API Architecture'}
            </h2>
          </div>

          <div className="text-left sm:text-right font-mono text-xs">
            <span className="text-soil/60 font-sans block mb-1">Visual Progress Bar:</span>
            <span className="px-3 py-1.5 rounded-xl bg-java text-cream font-bold text-xs tracking-widest">
              ██████░░░░ 60%
            </span>
          </div>
        </div>

        {/* Gradient Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-soil/15 h-3 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sceptre via-cerulean-dark to-sceptre rounded-full w-[60%] transition-all duration-700" />
          </div>
          <div className="flex justify-between text-[11px] text-soil/60 font-semibold">
            <span>Core Principles Mastered</span>
            <span>2 Modules to Production Polish</span>
          </div>
        </div>
      </div>

      {/* IDENTIFIED SKILL GAPS FROM REVIEWS */}
      <div className="space-y-4">
        <div>
          <h3 className="font-heading font-extrabold text-lg text-soil flex items-center gap-2">
            <Compass className="w-5 h-5 text-sceptre" />
            <span>Identified Skill Gaps (From Peer Reviews)</span>
          </h3>
          <p className="text-xs text-soil/60 mt-0.5">
            Concepts highlighted by reviewers that will elevate your active projects:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(skillGaps || []).map((gap, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#FDFAF0] border border-soil/15 shadow-sm space-y-2 card-hover-lift"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-sceptre font-heading">
                Identified Gap
              </span>
              <h4 className="font-heading font-bold text-sm text-soil">
                {gap.skill}
              </h4>
              <p className="text-xs text-soil/70">
                Flagged in: <strong>{gap.detectedIn?.join(', ')}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CURATED LEARNING PATHWAYS */}
      <div className="space-y-6">
        <div>
          <h3 className="font-heading font-extrabold text-xl text-soil flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sceptre" />
            <span>Structured Roadmaps</span>
          </h3>
          <p className="text-xs text-soil/60 mt-0.5">
            Click any concept to check off mastery as you build and experiment:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(pathways || []).map((track) => (
            <div
              key={track.id}
              className="p-6 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft space-y-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 border-b border-soil/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sceptre font-heading">
                      {track.category}
                    </span>
                    <h4 className="font-heading font-extrabold text-base sm:text-lg text-soil mt-0.5">
                      {track.title}
                    </h4>
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-cerulean/30 text-soil">
                    {track.progress}%
                  </span>
                </div>

                <p className="text-xs text-soil/70 mt-3 italic leading-relaxed">
                  "{track.description}"
                </p>

                {/* Concepts list */}
                <div className="mt-4 space-y-2.5">
                  {track.concepts.map((concept) => {
                    const isDone = completedConcepts[concept.name] || concept.status === 'completed';
                    return (
                      <div
                        key={concept.name}
                        onClick={() => toggleConcept(concept.name)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isDone
                            ? 'bg-emerald-50/70 border-emerald-200'
                            : 'bg-white border-soil/10 hover:border-cerulean'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-soil/30 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-bold ${isDone ? 'line-through text-emerald-900/70' : 'text-soil'}`}>
                            {concept.name}
                          </p>
                          <p className="text-[11px] text-soil/60 mt-0.5 leading-snug">
                            {concept.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
