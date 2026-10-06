import React, { useState, useEffect } from 'react';
import { Search, X, FolderGit2, User, Sparkles, Code2, ArrowRight } from 'lucide-react';
import api from '../../api/client';

export default function GlobalSearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], users: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults({ projects: [], users: [] });
      return;
    }

    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        try {
          const [projData, userData] = await Promise.all([
            api.getProjects({ search: query }),
            api.searchUsers(query)
          ]);
          setResults({
            projects: projData.slice(0, 4),
            users: userData.slice(0, 4)
          });
        } catch (e) {
          console.error('Search error:', e);
        } finally {
          setLoading(false);
        }
      } else {
        setResults({ projects: [], users: [] });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-java/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#FDFAF0] rounded-2xl shadow-lift border border-soil/15 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-soil/10 gap-3">
          <Search className="w-5 h-5 text-sceptre" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, skills (e.g., React, AI), or student peers..."
            className="flex-1 bg-transparent text-base text-java placeholder-soil/50 focus:outline-none font-medium"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-soil/10 rounded-lg text-soil/60">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-soil/70 hover:text-sceptre bg-soil/5 hover:bg-soil/10 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {loading && (
            <div className="py-8 text-center text-soil/60 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-sceptre border-t-transparent rounded-full animate-spin" />
              <span>Searching across circle...</span>
            </div>
          )}

          {!loading && query.trim().length <= 1 && (
            <div className="py-6 px-2 text-center text-soil/60">
              <p className="text-sm">Try searching for <span className="font-semibold text-sceptre cursor-pointer hover:underline" onClick={() => setQuery('AI')}>"AI"</span>, <span className="font-semibold text-sceptre cursor-pointer hover:underline" onClick={() => setQuery('React')}>"React"</span>, <span className="font-semibold text-sceptre cursor-pointer hover:underline" onClick={() => setQuery('Backend')}>"Backend"</span>, or <span className="font-semibold text-sceptre cursor-pointer hover:underline" onClick={() => setQuery('Stanford')}>"Stanford"</span>.</p>
            </div>
          )}

          {!loading && query.trim().length > 1 && results.projects.length === 0 && results.users.length === 0 && (
            <div className="py-8 text-center text-soil/60">
              <p className="font-heading font-semibold text-soil">No matching projects or peers found</p>
              <p className="text-xs mt-1 text-soil/50">Try broadening your keywords or exploring by category tags.</p>
            </div>
          )}

          {/* Project Results */}
          {!loading && results.projects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-sceptre">
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Projects ({results.projects.length})</span>
              </div>
              <div className="space-y-2">
                {results.projects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onNavigate(`/projects/${proj.id}`);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/70 hover:bg-cerulean/20 border border-soil/10 cursor-pointer transition-colors group"
                  >
                    <div>
                      <h4 className="font-heading font-bold text-sm text-soil group-hover:text-sceptre flex items-center gap-2">
                        {proj.title}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cerulean/40 text-soil font-normal">
                          {proj.category}
                        </span>
                      </h4>
                      <p className="text-xs text-soil/70 line-clamp-1 mt-0.5">
                        {proj.short_description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-soil/40 group-hover:text-sceptre transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Results */}
          {!loading && results.users.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-sceptre">
                <User className="w-3.5 h-3.5" />
                <span>Students & Peers ({results.users.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.users.map((peer) => (
                  <div
                    key={peer.id}
                    onClick={() => {
                      onNavigate(`/users/${peer.id}`);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 hover:bg-cerulean/20 border border-soil/10 cursor-pointer transition-colors"
                  >
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-9 h-9 rounded-full object-cover border border-sceptre/20"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-soil truncate">{peer.name}</p>
                      <p className="text-xs text-soil/60 truncate">{peer.college || `@${peer.username}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
