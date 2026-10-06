import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, PlusCircle, ArrowUpDown } from 'lucide-react';
import ProjectCard from '../components/projects/ProjectCard';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import api from '../api/client';

const CATEGORIES = [
  'All',
  'EdTech / AI',
  'Sustainability / Mobility',
  'Mental Health / Community',
  'Developer Tools / Learning',
  'Marketplace / Campus Utility'
];

const POPULAR_TECHS = ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Firebase', 'OpenAI API'];

export default function ExplorePage({ onNavigate, onOpenShareWizard }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTech, setSelectedTech] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        technology: selectedTech || undefined,
        search: search.trim() || undefined,
        sort: sortBy
      };
      const data = await api.getProjects(params);
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, selectedTech, sortBy]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-soil/15">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-sceptre font-heading">
            Student Showcase & Discovery
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-soil tracking-tight mt-1">
            Explore Peer Projects
          </h1>
          <p className="text-xs sm:text-sm text-soil/70 mt-1 max-w-xl">
            Discover real projects built by students worldwide. Give constructive multi-dimensional feedback, learn from other implementations, and find potential collaborators.
          </p>
        </div>

        <button
          onClick={onOpenShareWizard}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-sm shadow-warm transition-transform active:scale-95 shrink-0 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Share Your Project</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        {/* Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-soil/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by name, pitch, problem, or technology..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-soil/20 text-sm text-java placeholder-soil/50 focus:outline-none focus:border-sceptre shadow-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-soil flex items-center gap-1 font-heading">
              <ArrowUpDown className="w-3.5 h-3.5 text-sceptre" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-soil/20 text-xs font-semibold text-soil focus:outline-none shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="most_reviewed">Most Reviewed</option>
              <option value="highest_rated">Highest Rated</option>
              <option value="looking_for_collabs">Looking for Collaborators</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-sceptre text-cream shadow-sm scale-105'
                    : 'bg-white/80 hover:bg-white text-soil border border-soil/15'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Popular Tech Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-soil/60 font-semibold font-heading text-[11px]">Popular Tech:</span>
          {POPULAR_TECHS.map(tech => {
            const isSelected = selectedTech === tech;
            return (
              <button
                key={tech}
                onClick={() => setSelectedTech(isSelected ? '' : tech)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  isSelected
                    ? 'bg-cerulean-dark text-java font-bold shadow-sm'
                    : 'bg-soil/5 hover:bg-soil/10 text-soil'
                }`}
              >
                {tech} {isSelected && '✕'}
              </button>
            );
          })}
          {(selectedCategory !== 'All' || selectedTech || search) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedTech('');
                setSearch('');
              }}
              className="text-[11px] text-sceptre font-bold hover:underline ml-2"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid / States */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : projects.length === 0 ? (
        <EmptyState
          type={search || selectedCategory !== 'All' ? 'search' : 'projects'}
          onAction={search ? () => { setSearch(''); setSelectedCategory('All'); } : onOpenShareWizard}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(proj => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onClick={(id) => onNavigate(`/projects/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
