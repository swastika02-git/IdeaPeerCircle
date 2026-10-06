import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  MessageSquare,
  Sparkles,
  Users,
  Award,
  BookOpen,
  ArrowRight,
  Star,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { fireMilestoneSparkles } from '../components/brand/SparkleEffect';

export default function DashboardPage({ onNavigate, onOpenShareWizard }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;
      setLoading(true);
      try {
        const res = await api.getUser(user.id);
        setUserData(res);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-soil/60">
        <div className="w-8 h-8 border-2 border-sceptre border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-heading font-bold text-sm">Loading your personalized student dashboard...</p>
      </div>
    );
  }

  const { stats, projects, achievements } = userData || {
    stats: { totalProjects: 0, reviewsReceived: 0, reviewsGiven: 0, collaborationsActive: 0, achievementsUnlocked: 0 },
    projects: [],
    achievements: []
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Welcome Greeting Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-soil/15">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-sceptre font-heading">
            Student Creator Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-soil tracking-tight mt-1">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-soil/70 mt-1">
            {user?.college || 'University Builder'} · {user?.bio || 'Learning through projects'}
          </p>
        </div>

        <button
          onClick={onOpenShareWizard}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs sm:text-sm shadow-warm transition-transform active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* 5-METRIC STATS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Reviews Received */}
        <div className="p-5 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-sceptre">
            <span className="text-[11px] font-bold uppercase tracking-wider font-heading">Reviews</span>
            <MessageSquare className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-heading text-soil">
            {stats.reviewsReceived}
          </p>
          <p className="text-[10px] text-soil/60">Peer critiques received</p>
        </div>

        {/* Active Projects */}
        <div className="p-5 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-cerulean-dark">
            <span className="text-[11px] font-bold uppercase tracking-wider font-heading">Projects</span>
            <FolderGit2 className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-heading text-soil">
            {stats.totalProjects}
          </p>
          <p className="text-[10px] text-soil/60">Active in showcase</p>
        </div>

        {/* Skills Identified */}
        <div className="p-5 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[11px] font-bold uppercase tracking-wider font-heading">Skills</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-heading text-soil">
            {(user?.skills?.length || 5) + (user?.currently_learning?.length || 3)}
          </p>
          <p className="text-[10px] text-soil/60">Identified proficiencies</p>
        </div>

        {/* Learning Focus */}
        <div className="p-5 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[11px] font-bold uppercase tracking-wider font-heading">Roadmaps</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-heading text-soil">
            {user?.currently_learning?.length || 3}
          </p>
          <p className="text-[10px] text-soil/60">Actionable areas</p>
        </div>

        {/* Achievements */}
        <div
          onClick={fireMilestoneSparkles}
          className="p-5 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft space-y-1 cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[11px] font-bold uppercase tracking-wider font-heading">Badges</span>
            <Award className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-heading text-soil">
            {achievements.length}
          </p>
          <p className="text-[10px] text-soil/60">Unlocked honors (click ✨)</p>
        </div>
      </div>

      {/* MY PROJECTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-soil flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-sceptre" />
            <span>My Showcased Projects ({projects.length})</span>
          </h2>
          <button
            onClick={() => onNavigate('/explore')}
            className="text-xs font-bold font-heading text-sceptre hover:underline"
          >
            Explore All Community Projects &rarr;
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="p-8 rounded-3xl bg-cream-50 border-2 border-dashed border-soil/20 text-center text-xs text-soil/70 space-y-3">
            <p>You haven't showcased a project yet!</p>
            <button
              onClick={onOpenShareWizard}
              className="px-4 py-2 rounded-xl bg-sceptre text-cream font-bold text-xs font-heading"
            >
              Share Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-cerulean/30 text-soil">
                        {proj.category}
                      </span>
                      <h3 className="font-heading font-extrabold text-lg text-soil mt-1.5">
                        {proj.title}
                      </h3>
                    </div>

                    {proj.averageScore && (
                      <span className="flex items-center gap-1 text-xs font-extrabold font-heading text-amber-900 bg-amber-500/15 px-2.5 py-1 rounded-xl border border-amber-500/30">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                        {proj.averageScore} ({proj.reviewCount})
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-soil/75 mt-2 line-clamp-2 leading-relaxed">
                    {proj.short_description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {(proj.tech_stack || []).map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-soil/5 text-soil/80">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-soil/10 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate(`/projects/${proj.id}`)}
                    className="text-xs font-bold text-sceptre hover:underline flex items-center gap-1 font-heading"
                  >
                    <span>View AI Snapshot & Reviews</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {proj.live_demo_url && (
                    <a
                      href={proj.live_demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-soil/60 hover:text-soil"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACHIEVEMENTS STRIP */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-soil flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <span>Unlocked Achievements ({achievements.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-4 rounded-2xl bg-white border border-soil/15 shadow-sm flex items-center gap-3.5 transition-transform hover:scale-105"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 flex items-center justify-center font-bold text-lg shrink-0">
                ✨
              </div>
              <div className="min-w-0">
                <h4 className="font-heading font-bold text-sm text-soil truncate">
                  {ach.title}
                </h4>
                <p className="text-[11px] text-soil/60 line-clamp-2 mt-0.5 leading-snug">
                  {ach.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
