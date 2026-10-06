import React from 'react';
import Logo from '../brand/Logo';
import { ArrowRight, Sparkles, Heart, RefreshCw } from 'lucide-react';

export default function Footer({ onNavigate, onReplayIntro }) {
  const steps = [
    'IDEA',
    'BUILD',
    'SHARE',
    'FEEDBACK',
    'AI INSIGHTS',
    'LEARN',
    'COLLABORATE',
    'IMPROVE'
  ];

  return (
    <footer className="w-full bg-java text-cream border-t border-soil/20 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Interactive Learning Loop Ribbon */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-[#34211B] border border-soil/40 shadow-lift">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-cerulean font-bold font-heading">
              The IdeaPeerCircle Loop
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-cream mt-1">
              From First Spark to Production Polish
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold font-heading">
            {steps.map((step, idx) => (
              <React.Fragment key={step}>
                <span className="px-3 py-1.5 rounded-xl bg-soil text-cream border border-cerulean/30 shadow-sm transition-transform hover:scale-105">
                  {step}
                </span>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-cerulean shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-soil/30">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-[#2D1B17] inline-block p-2 rounded-2xl">
              <Logo size="md" />
            </div>
            <p className="text-cream/80 text-sm max-w-md leading-relaxed">
              IdeaPeerCircle is an AI-powered peer learning community designed for students. Move beyond passive coursework by building real projects, receiving multi-dimensional peer critiques, and discovering customized learning roadmaps.
            </p>
            <div className="flex items-center gap-2 text-xs text-cerulean font-medium">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Built by students · Improved by peers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-cream text-sm uppercase tracking-wider">
              Explore Circle
            </h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>
                <button onClick={() => onNavigate('/explore')} className="hover:text-cerulean transition-colors">
                  Project Discovery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/collaborate')} className="hover:text-cerulean transition-colors">
                  Skill Matchmaking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/learning')} className="hover:text-cerulean transition-colors">
                  My Learning Paths
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dashboard')} className="hover:text-cerulean transition-colors">
                  Student Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Core Philosophy & Tools */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-cream text-sm uppercase tracking-wider">
              Community
            </h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>
                <span className="text-cream/50 text-xs block">Brand System:</span>
                <span className="text-xs text-cerulean">Transparent Yellow · Sceptre Red · Cerulean Blue</span>
              </li>
              <li>
                <button
                  onClick={onReplayIntro}
                  className="flex items-center gap-1.5 text-xs text-cream hover:text-cerulean transition-colors py-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replay 3.5s Brand Intro</span>
                </button>
              </li>
              <li className="pt-2 text-xs text-cream/50">
                Peer Review Dimensions: UI/UX, Technical, Innovation, AI, Utility, Problem Solving.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/60 gap-4">
          <p>© 2026 IdeaPeerCircle. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-sceptre-light fill-current" /> for student builders worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
