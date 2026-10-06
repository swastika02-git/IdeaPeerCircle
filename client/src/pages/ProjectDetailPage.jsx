import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FolderGit2,
  Globe,
  Star,
  Sparkles,
  MessageSquare,
  Users,
  Target,
  Lightbulb,
  CheckCircle,
  ExternalLink,
  Code2,
  Calendar,
  ShieldAlert
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import CollaborationCard from '../components/projects/CollaborationCard';
import ReviewScoreRadar from '../components/reviews/ReviewScoreRadar';
import ReviewCard from '../components/reviews/ReviewCard';
import PeerReviewModal from '../components/reviews/PeerReviewModal';
import AILearningSnapshot from '../components/ai/AILearningSnapshot';
import AIFeedbackSynthesis from '../components/ai/AIFeedbackSynthesis';
import LoadingSkeleton, { ProjectDetailSkeleton } from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';

export default function ProjectDetailPage({ projectId, onNavigate }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getProject(projectId);
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchDetail();
  }, [projectId]);

  if (loading) return <ProjectDetailSkeleton />;
  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState message={error} onRetry={fetchDetail} />
      </div>
    );
  }

  const { project, reviews, aiInsight, githubMeta, userHasReviewed, existingCollab } = data;
  const isOwner = user?.id === project.user_id;

  const handleReviewSubmitted = (result) => {
    setData(prev => ({
      ...prev,
      reviews: [result.review, ...(prev.reviews || [])],
      aiInsight: result.aiInsight || prev.aiInsight,
      userHasReviewed: true
    }));
  };

  const handleInsightUpdated = (newInsight) => {
    setData(prev => ({ ...prev, aiInsight: newInsight }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('/explore')}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold font-heading text-soil hover:text-sceptre transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </button>

      {/* TOP HERO & PROJECT HEADER */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold font-heading bg-cerulean/30 text-soil">
                {project.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-heading bg-cream text-soil border border-soil/20">
                {project.difficulty || 'Intermediate'}
              </span>
              {project.ai_used === 1 && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-heading bg-sceptre text-cream">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  AI-Powered
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-soil tracking-tight">
              {project.title}
            </h1>

            <p className="text-sm sm:text-base text-soil/80 leading-relaxed font-normal">
              {project.short_description}
            </p>
          </div>

          {/* Action Links: GitHub & Live Demo */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {project.live_demo_url && (
              <a
                href={project.live_demo_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs sm:text-sm shadow-warm transition-transform active:scale-95 flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5 text-cream/70" />
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-cream border border-soil/20 text-soil font-heading font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95 flex items-center gap-2"
              >
                <FolderGit2 className="w-4 h-4 text-sceptre" />
                <span>Source Code</span>
                {githubMeta?.stars !== undefined && (
                  <span className="ml-1 px-2 py-0.5 rounded-md bg-soil/10 text-[10px]">
                    ★ {githubMeta.stars}
                  </span>
                )}
              </a>
            )}
          </div>
        </div>

        {/* Creator Info Strip */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-soil/15 shadow-sm">
          <div
            onClick={() => onNavigate(`/users/${project.creator?.id}`)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={project.creator?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${project.creator?.username}`}
              alt={project.creator?.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-sceptre/20 group-hover:border-sceptre transition-colors"
            />
            <div>
              <p className="font-heading font-bold text-sm text-soil group-hover:text-sceptre transition-colors flex items-center gap-1.5">
                {project.creator?.name}
                <span className="text-[11px] font-normal text-soil/60">
                  @{project.creator?.username}
                </span>
              </p>
              <p className="text-xs text-soil/60">
                {project.creator?.college || 'Student Builder'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {(project.creator?.skills || []).slice(0, 3).map(skill => (
              <span
                key={skill}
                className="hidden sm:inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-cerulean/20 text-soil"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* PROJECT SCREENSHOT / MEDIA BANNER */}
      {project.screenshots && project.screenshots.length > 0 && (
        <div className="rounded-3xl overflow-hidden border border-soil/20 bg-soil/10 max-h-[460px] shadow-lift">
          <img
            src={project.screenshots[0]}
            alt={project.title}
            className="w-full h-full object-cover max-h-[460px]"
          />
        </div>
      )}

      {/* PROBLEM & SOLUTION SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* The Problem */}
        <div className="p-6 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-sceptre font-bold font-heading text-base">
            <Target className="w-5 h-5 text-sceptre" />
            <span>The Problem</span>
          </div>
          <p className="text-xs sm:text-sm text-soil/80 leading-relaxed">
            {project.problem}
          </p>
          {project.target_users && (
            <div className="pt-3 border-t border-soil/10 text-xs">
              <span className="font-bold text-soil font-heading">Target Users: </span>
              <span className="text-soil/70">{project.target_users}</span>
            </div>
          )}
        </div>

        {/* The Solution */}
        <div className="p-6 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-soil font-bold font-heading text-base">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <span>The Solution</span>
          </div>
          <p className="text-xs sm:text-sm text-soil/80 leading-relaxed">
            {project.solution}
          </p>
          {project.real_world_impact && (
            <div className="pt-3 border-t border-soil/10 text-xs">
              <span className="font-bold text-emerald-800 font-heading">Real-World Impact: </span>
              <span className="text-soil/70">{project.real_world_impact}</span>
            </div>
          )}
        </div>
      </div>

      {/* TECH STACK & SKILLS */}
      <div className="p-6 rounded-3xl bg-white border border-soil/15 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-base text-soil flex items-center gap-2">
          <Code2 className="w-4 h-4 text-sceptre" />
          <span>Technologies & Proficiencies Used</span>
        </h3>

        <div className="flex flex-wrap gap-2">
          {(project.tech_stack || []).map(t => (
            <span
              key={t}
              className="px-3 py-1.5 rounded-xl bg-soil/5 border border-soil/15 text-xs font-bold text-soil font-heading"
            >
              {t}
            </span>
          ))}
          {(project.skills_used || []).map(s => (
            <span
              key={s}
              className="px-3 py-1.5 rounded-xl bg-cerulean/25 border border-cerulean/50 text-xs font-bold text-soil font-heading"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* COLLABORATION REQUIREMENT CARD ("Need a hand?") */}
      <CollaborationCard
        project={project}
        existingCollab={existingCollab}
        onCollabSent={() => fetchDetail()}
      />

      {/* AI FEEDBACK SYNTHESIS BANNER (Consensus across peer reviews) */}
      {aiInsight?.feedback_synthesis && (
        <AIFeedbackSynthesis
          synthesis={aiInsight.feedback_synthesis}
          reviewCount={reviews?.length || 0}
        />
      )}

      {/* AI LEARNING SNAPSHOT SECTION */}
      <AILearningSnapshot
        project={project}
        initialInsight={aiInsight}
        onInsightUpdated={handleInsightUpdated}
      />

      {/* PEER REVIEWS SECTION */}
      <section className="space-y-6 pt-6 border-t border-soil/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sceptre font-heading">
              Structured Peer Critiques
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-soil tracking-tight mt-0.5">
              Peer Reviews ({reviews.length})
            </h2>
          </div>

          {!isOwner && (
            <div>
              {userHasReviewed ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>You reviewed this project</span>
                </span>
              ) : (
                <button
                  onClick={() => {
                    if (!isAuthenticated) openAuthModal('login');
                    else setReviewModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs sm:text-sm shadow-warm transition-transform active:scale-95 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Submit Peer Review</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* 6D Review Score Matrix Radar/Bar Breakdown */}
        <ReviewScoreRadar reviews={reviews} />

        {/* List of Reviews */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="p-8 rounded-3xl bg-cream-50 border-2 border-dashed border-soil/20 text-center text-xs text-soil/60">
              No reviews submitted yet. Be the first student to review this project across all 6 dimensions!
            </div>
          ) : (
            reviews.map(r => (
              <ReviewCard key={r.id} review={r} />
            ))
          )}
        </div>
      </section>

      {/* Review Modal */}
      <PeerReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        project={project}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
