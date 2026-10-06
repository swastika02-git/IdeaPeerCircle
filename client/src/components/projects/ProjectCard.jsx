import React from 'react';
import { Star, MessageSquare, Users, Sparkles, ArrowRight } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  const hasReviews = project.reviewCount > 0;
  const collabCount = project.collab_looking_for?.length || 0;

  return (
    <div
      onClick={() => onClick(project.id)}
      className="group rounded-3xl bg-[#FDFAF0] border border-soil/15 p-5 shadow-soft hover:shadow-lift card-hover-lift cursor-pointer flex flex-col justify-between transition-all"
    >
      <div>
        {/* Project Thumbnail Image with Category Badge */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-soil/5 mb-4">
          <img
            src={project.screenshots?.[0] || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-java/60 via-transparent to-transparent opacity-60" />

          {/* Category Chip */}
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold font-heading bg-cream/90 backdrop-blur-sm text-soil shadow-sm">
            {project.category}
          </span>

          {/* AI Badge if AI used */}
          {project.ai_used === 1 && (
            <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-heading bg-sceptre/90 backdrop-blur-sm text-cream shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-300" />
              AI-Powered
            </span>
          )}
        </div>

        {/* Creator Info */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src={project.creator?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${project.creator?.username}`}
            alt={project.creator?.name}
            className="w-5 h-5 rounded-full object-cover border border-soil/20"
          />
          <span className="text-xs font-semibold text-soil/80 truncate">
            {project.creator?.name}
          </span>
          {project.creator?.college && (
            <>
              <span className="text-soil/30 text-xs">·</span>
              <span className="text-[11px] text-soil/60 truncate max-w-[120px]">
                {project.creator.college}
              </span>
            </>
          )}
        </div>

        {/* Title & Short Description */}
        <h3 className="font-heading font-extrabold text-lg text-soil group-hover:text-sceptre transition-colors line-clamp-1">
          {project.title}
        </h3>
        <p className="mt-1 text-xs text-soil/75 line-clamp-2 leading-relaxed">
          {project.short_description}
        </p>

        {/* Tech Stack Chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(project.tech_stack || []).slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-soil/5 text-soil/80 border border-soil/10"
            >
              {tech}
            </span>
          ))}
          {(project.tech_stack || []).length > 3 && (
            <span className="px-1.5 py-0.5 rounded-lg text-[10px] font-bold bg-soil/5 text-soil/60">
              +{project.tech_stack.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Metrics & Action */}
      <div className="mt-5 pt-3.5 border-t border-soil/10 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          {/* Review Score Indicator */}
          {hasReviews ? (
            <div className="flex items-center gap-1 font-bold text-sceptre">
              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>{project.averageScore}</span>
              <span className="text-soil/50 font-normal">({project.reviewCount})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-soil/50 text-[11px]">
              <MessageSquare className="w-3 h-3" />
              <span>Awaiting reviews</span>
            </div>
          )}

          {/* Collaboration Indicator */}
          {collabCount > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-cerulean-dark bg-cerulean/20 px-2 py-0.5 rounded-full">
              <Users className="w-3 h-3" />
              <span>Needs {collabCount} {collabCount === 1 ? 'peer' : 'peers'}</span>
            </div>
          )}
        </div>

        <button className="flex items-center gap-1 text-xs font-bold font-heading text-sceptre group-hover:translate-x-0.5 transition-transform">
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
