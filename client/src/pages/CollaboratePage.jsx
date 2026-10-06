import React, { useState, useEffect } from 'react';
import {
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  MessageSquare,
  FolderGit2
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { fireSparkles } from '../components/brand/SparkleEffect';
import EmptyState from '../components/common/EmptyState';

export default function CollaboratePage({ onNavigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'requests'
  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [sending, setSending] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [matchData, requestData] = await Promise.all([
        api.getCollabMatches(),
        api.getCollaborations()
      ]);
      setMatches(matchData || []);
      setRequests(requestData || []);
    } catch (err) {
      console.error('Failed to load collaborations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleUpdateStatus = async (collabId, status) => {
    try {
      await api.updateCollabStatus(collabId, status);
      if (status === 'accepted') fireSparkles();
      setRequests(prev => prev.map(r => r.id === collabId ? { ...r, status } : r));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenSendModal = (peerMatch) => {
    setSelectedPeer(peerMatch);
    setSelectedProject(peerMatch.projects?.[0]?.id || '');
    setModalMessage(`Hi ${peerMatch.user.name.split(' ')[0]}! I noticed our complementary skills and would love to collaborate!`);
    setCollabModalOpen(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!selectedPeer || !selectedProject) return;

    setSending(true);
    try {
      await api.sendCollabRequest({
        project_id: selectedProject,
        receiver_id: selectedPeer.user.id,
        skill_offered: user?.skills?.[0] || 'Frontend',
        skill_wanted: selectedPeer.user.can_help_with?.[0] || 'Backend',
        message: modalMessage
      });
      fireSparkles();
      setCollabModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-soil/15">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-sceptre font-heading">
            Skill-Based Team Matching
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-soil tracking-tight mt-1">
            Complementary Collaboration
          </h1>
          <p className="text-xs sm:text-sm text-soil/70 mt-1 max-w-xl">
            Don't build in isolation. Our matching engine pairs students who have complementary skills (what you want to learn vs what they can teach) to build higher-quality projects together.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1.5 rounded-2xl bg-white border border-soil/15 shadow-sm">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-heading transition-all ${
              activeTab === 'matches'
                ? 'bg-sceptre text-cream shadow-sm'
                : 'text-soil hover:text-sceptre'
            }`}
          >
            Smart Matches ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-heading transition-all ${
              activeTab === 'requests'
                ? 'bg-sceptre text-cream shadow-sm'
                : 'text-soil hover:text-sceptre'
            }`}
          >
            My Requests ({requests.length})
          </button>
        </div>
      </div>

      {/* MATCHES VIEW */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-cream border border-soil/15 text-xs text-soil flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Your profile offers: <strong>{(user?.can_help_with || []).join(', ') || 'Frontend'}</strong> · You want to learn: <strong>{(user?.currently_learning || []).join(', ') || 'Backend'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div
                key={match.user.id}
                className="p-6 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft hover:shadow-lift card-hover-lift flex flex-col justify-between space-y-5"
              >
                <div>
                  {/* Top Peer Info & Match Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={match.user.avatar}
                        alt={match.user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-sceptre/20"
                      />
                      <div>
                        <h3 className="font-heading font-extrabold text-base text-soil flex items-center gap-1.5">
                          {match.user.name}
                        </h3>
                        <p className="text-xs text-soil/60">{match.user.college || 'Student'}</p>
                      </div>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold font-heading flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{match.matchScore}% Match</span>
                    </div>
                  </div>

                  {/* Great Potential Match Explanation Banner */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-white border border-cerulean/50 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sceptre font-heading block">
                      Why you match:
                    </span>
                    <p className="text-xs text-soil/90 font-medium leading-relaxed">
                      "{match.reason}"
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <div className="p-2.5 rounded-xl bg-cerulean/20">
                      <span className="font-bold text-soil block text-[11px] mb-1">They Can Help With:</span>
                      <div className="flex flex-wrap gap-1">
                        {(match.user.can_help_with || []).map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-white text-soil text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50">
                      <span className="font-bold text-amber-900 block text-[11px] mb-1">They Want To Learn:</span>
                      <div className="flex flex-wrap gap-1">
                        {(match.user.currently_learning || []).map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-white text-soil text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active Projects created by peer */}
                  {match.projects?.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-soil/10">
                      <span className="text-[11px] font-bold text-soil/60 uppercase tracking-wider block mb-1">
                        Active Project:
                      </span>
                      {match.projects.map(p => (
                        <div
                          key={p.id}
                          onClick={() => onNavigate(`/projects/${p.id}`)}
                          className="flex items-center justify-between text-xs font-semibold text-soil hover:text-sceptre cursor-pointer py-1"
                        >
                          <span className="flex items-center gap-1.5">
                            <FolderGit2 className="w-3.5 h-3.5 text-sceptre" />
                            {p.title} ({p.category})
                          </span>
                          <span className="text-[10px] text-soil/50">View &rarr;</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Send Collab Action */}
                <div className="pt-2 border-t border-soil/10 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate(`/users/${match.user.id}`)}
                    className="text-xs font-bold text-soil/70 hover:text-sceptre"
                  >
                    View Portfolio
                  </button>

                  <button
                    onClick={() => handleOpenSendModal(match)}
                    className="px-4 py-2 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs shadow-warm transition-transform active:scale-95 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Collab Offer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REQUESTS VIEW */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <EmptyState
              type="collaborators"
              title="No active collaboration invitations yet."
              message="Check the Smart Matches tab to connect with peers who have complementary skills!"
              actionLabel="View Smart Matches"
              onAction={() => setActiveTab('matches')}
            />
          ) : (
            requests.map((collab) => {
              const isReceived = !collab.isSender;
              return (
                <div
                  key={collab.id}
                  className="p-5 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        collab.status === 'accepted' ? 'bg-emerald-100 text-emerald-900' :
                        collab.status === 'declined' ? 'bg-red-100 text-red-900' :
                        'bg-amber-100 text-amber-900'
                      }`}>
                        {collab.status}
                      </span>
                      <span className="text-xs text-soil/60">
                        {isReceived ? 'Received from' : 'Sent to'}{' '}
                        <strong>{isReceived ? collab.sender?.name : collab.receiver?.name}</strong>
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-soil">
                      Project: {collab.project?.title}
                    </h4>

                    <p className="text-xs text-soil/80 italic">"{collab.message}"</p>

                    <div className="flex items-center gap-2 text-[11px] text-soil/70 pt-1">
                      <span>Offered: <strong className="text-sceptre">{collab.skill_offered}</strong></span>
                      {collab.skill_wanted && (
                        <span>· In return wants: <strong className="text-soil">{collab.skill_wanted}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Actions depending on status and role */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isReceived && collab.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(collab.id, 'accepted')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(collab.id, 'declined')}
                          className="px-3 py-1.5 rounded-xl bg-white border border-soil/20 hover:bg-soil/5 text-soil font-heading font-bold text-xs flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}

                    {!isReceived && collab.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(collab.id, 'cancelled')}
                        className="px-3 py-1.5 rounded-xl bg-white border border-soil/20 text-soil/70 hover:text-red-700 font-heading font-bold text-xs"
                      >
                        Cancel Request
                      </button>
                    )}

                    {collab.status === 'accepted' && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                        Teammates Connected! 🤝
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Send Collab Modal */}
      {collabModalOpen && selectedPeer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-java/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#FDFAF0] rounded-3xl shadow-lift border border-soil/20 p-6 space-y-4">
            <h3 className="font-heading font-bold text-lg text-soil">
              Send Collaboration Offer to {selectedPeer.user.name}
            </h3>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1">
                  Select Project to Collaborate On
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-soil focus:outline-none"
                >
                  {(selectedPeer.projects || []).map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1">
                  Message
                </label>
                <textarea
                  rows={3}
                  value={modalMessage}
                  onChange={(e) => setModalMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-java focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-soil/10">
                <button
                  type="button"
                  onClick={() => setCollabModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-soil/70 hover:bg-soil/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs shadow-warm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Offer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
