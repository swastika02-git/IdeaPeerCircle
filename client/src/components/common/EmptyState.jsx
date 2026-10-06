import React from 'react';
import { Lightbulb, MessageSquare, Users, Compass, PlusCircle } from 'lucide-react';

export default function EmptyState({
  type = 'projects',
  title,
  message,
  actionLabel,
  onAction
}) {
  const defaults = {
    projects: {
      icon: Lightbulb,
      title: 'Looks like this circle is still waiting for its first idea.',
      message: 'Be the pioneer! Showcase your active prototype and invite your peers to help you refine it.',
      actionLabel: 'Share Your Project'
    },
    reviews: {
      icon: MessageSquareDashes,
      title: 'Your first piece of feedback is on its way.',
      message: 'Share your project link with classmates or study partners to receive your first multi-dimensional critique.',
      actionLabel: 'Write First Review'
    },
    collaborators: {
      icon: Users,
      title: 'Your perfect teammate might be one search away.',
      message: 'Tell the circle what skills you are looking for, or offer your own strengths to a peer project.',
      actionLabel: 'Explore Matches'
    },
    search: {
      icon: Compass,
      title: 'No sparks found matching that query.',
      message: 'Try clearing your filters or searching for foundational skills like React, Python, or UI/UX.',
      actionLabel: 'Reset Filters'
    }
  };

  const config = defaults[type] || defaults.projects;
  const Icon = config.icon;
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;
  const displayAction = actionLabel || config.actionLabel;

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl bg-cream-50 border-2 border-dashed border-soil/20 my-6 max-w-lg mx-auto">
      {/* Whimsical Doodle Icon Container */}
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-cerulean/30 border border-cerulean flex items-center justify-center text-sceptre shadow-sm">
          <Icon className="w-8 h-8" />
        </div>
        <span className="absolute -top-1.5 -right-1.5 text-lg">✨</span>
      </div>

      <h3 className="font-heading font-extrabold text-lg sm:text-xl text-soil tracking-tight">
        {displayTitle}
      </h3>
      <p className="mt-2 text-xs sm:text-sm text-soil/70 max-w-sm leading-relaxed">
        {displayMessage}
      </p>

      {onAction && displayAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs sm:text-sm shadow-warm transition-transform active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{displayAction}</span>
        </button>
      )}
    </div>
  );
}
