import React from 'react';
import {
  Compass,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Hammer,
  Share2,
  MessageSquareHeart,
  Brain,
  BookOpen,
  Users,
  TrendingUp,
  Star,
  CheckCircle2
} from 'lucide-react';
import ProjectCard from '../components/projects/ProjectCard';

export default function LandingPage({ projects = [], onNavigate, onOpenShareWizard }) {
  const featuredProjects = projects.slice(0, 3);

  const loopSteps = [
    { name: 'IDEA', desc: 'Identify a campus pain point or creative spark', icon: Lightbulb, color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { name: 'BUILD', desc: 'Craft your working prototype with real code', icon: Hammer, color: 'bg-stone-100 text-stone-900 border-stone-300' },
    { name: 'SHARE', desc: 'Publish to the circle for structured community feedback', icon: Share2, color: 'bg-blue-100 text-blue-900 border-blue-300' },
    { name: 'FEEDBACK', desc: 'Peers review across 6 rigorous dimensions (1-10)', icon: MessageSquareHeart, color: 'bg-red-100 text-sceptre border-red-300' },
    { name: 'AI INSIGHTS', desc: 'Synthesize reviews and detect conceptual bottlenecks', icon: Brain, color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
    { name: 'LEARN', desc: 'Follow tailored roadmaps to master missing skills', icon: BookOpen, color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { name: 'COLLABORATE', desc: 'Team up with peers who have complementary skills', icon: Users, color: 'bg-sky-100 text-sky-900 border-sky-300' },
    { name: 'IMPROVE', desc: 'Refactor, scale, and polish your project', icon: TrendingUp, color: 'bg-yellow-100 text-yellow-900 border-yellow-300' }
  ];

  return (
    <div className="space-y-20 pb-16 animate-fadeIn">
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-12 overflow-hidden">
        {/* Playful Floating SVG Elements */}
        <div className="absolute top-10 left-[8%] animate-float-slow pointer-events-none opacity-80">
          <div className="p-3 rounded-2xl bg-white/70 border border-soil/15 shadow-soft flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-soil">React + FastAPI</span>
          </div>
        </div>

        <div className="absolute top-24 right-[10%] animate-float-delayed pointer-events-none opacity-80 hidden sm:block">
          <div className="p-3 rounded-2xl bg-white/70 border border-soil/15 shadow-soft flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold text-soil">AI Learning Snapshot Ready</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10 space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-soil/15 shadow-sm text-xs font-bold font-heading text-sceptre">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Built by students · Improved by peers</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-sceptre tracking-tight leading-[1.08]">
            Your project is more than <span className="text-soil underline decoration-cerulean decoration-wavy decoration-4">a project</span>.
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-soil/80 max-w-2xl mx-auto leading-relaxed font-normal">
            Build something. Share it with your peers. Get meaningful multi-dimensional feedback. Discover what to learn next.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/explore')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-extrabold text-base shadow-warm hover:shadow-lift transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5" />
              <span>Explore Projects</span>
            </button>

            <button
              onClick={onOpenShareWizard}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-cream border-2 border-sceptre text-sceptre font-heading font-extrabold text-base transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Share Your Project</span>
            </button>
          </div>
        </div>

        {/* HERO PLAYFUL ECOSYSTEM ILLUSTRATION */}
        <div className="mt-14 max-w-5xl mx-auto px-4">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#FDFAF0] to-cream border-2 border-soil/15 p-6 sm:p-10 shadow-lift overflow-hidden">
            {/* Background constellation lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
              <line x1="10%" y1="20%" x2="40%" y2="50%" stroke="#4A2E27" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="40%" y1="50%" x2="80%" y2="30%" stroke="#4A2E27" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="40%" y1="50%" x2="50%" y2="85%" stroke="#4A2E27" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-center">
              {/* Left Student Node */}
              <div className="p-4 rounded-2xl bg-white/90 border border-soil/15 shadow-sm space-y-2 card-hover-lift">
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="Alex"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-soil">Alex Chen (Stanford)</p>
                    <p className="text-[10px] text-soil/60">Built: StudyBuddy AI</p>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-cerulean/20 text-[11px] text-soil">
                  "UI/UX was praised! AI mentor identified <strong>REST API queuing</strong> as my next focus area."
                </div>
              </div>

              {/* Center Orbit Core */}
              <div className="text-center p-6 rounded-3xl bg-[#F5EFC6] border-2 border-sceptre shadow-warm space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-sceptre text-cream flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="font-heading font-extrabold text-base text-soil">The Active Learning Core</h4>
                <p className="text-xs text-soil/70 leading-relaxed">
                  Connect peer feedback to concrete skill roadmaps and complementary collaboration.
                </p>
              </div>

              {/* Right Student Node */}
              <div className="p-4 rounded-2xl bg-white/90 border border-soil/15 shadow-sm space-y-2 card-hover-lift">
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                    alt="Maya"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-soil">Maya Patel (MIT)</p>
                    <p className="text-[10px] text-soil/60">Needs: UI/UX · Offers: Backend</p>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 text-[11px] text-emerald-900 border border-emerald-200">
                  "Found a peer collaborator in 24 hours to design mobile transit sheets for GreenRoute."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE 8-STAGE LEARNING LOOP EXPLAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-sceptre font-heading">
            The Educational Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-soil tracking-tight">
            How Peer Learning Actually Works
          </h2>
          <p className="text-sm text-soil/70 leading-relaxed">
            Passive video tutorials produce tutorial hell. IdeaPeerCircle transforms the projects you build into personalized, lifelong mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loopSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.name}
                className="p-5 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft hover:shadow-lift card-hover-lift flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold font-heading text-soil/40">
                      0{idx + 1}
                    </span>
                    <div className={`p-2.5 rounded-2xl border ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-soil mb-1">
                    {step.name}
                  </h3>
                  <p className="text-xs text-soil/70 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-soil/10 text-[10px] text-soil/50 font-bold uppercase tracking-wider">
                  Loop Phase {idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED COMMUNITY PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sceptre font-heading">
              Active Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-soil tracking-tight mt-1">
              Projects Currently in Peer Review
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/explore')}
            className="flex items-center gap-1.5 text-sm font-bold font-heading text-sceptre hover:underline"
          >
            <span>Explore all {projects.length} projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map(proj => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onClick={(id) => onNavigate(`/projects/${id}`)}
            />
          ))}
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl bg-sceptre text-cream p-8 sm:p-12 shadow-warm text-center space-y-6 relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-cream tracking-tight">
              Ready to learn by building?
            </h2>
            <p className="text-sm text-cream/80 leading-relaxed">
              Don't leave your hackathon prototype or side project sitting idle in a private repo. Share it with curious peers, receive structured critiques, and see what to learn next.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <button
              onClick={onOpenShareWizard}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-cream hover:bg-cream-100 text-sceptre font-heading font-extrabold text-sm shadow-sm transition-transform active:scale-95"
            >
              Share Your Project Today
            </button>
            <button
              onClick={() => onNavigate('/collaborate')}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-cream font-heading font-bold text-sm border border-white/20 transition-colors"
            >
              Find a Peer Collaborator
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
