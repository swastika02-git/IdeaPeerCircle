import React, { useState } from 'react';
import { Users, Send, CheckCircle2, Sparkles, MessageCircle } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { fireSparkles } from '../brand/SparkleEffect';

export default function CollaborationCard({ project, existingCollab, onCollabSent }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [selectedRole, setSelectedRole] = useState(project.collab_looking_for?.[0] || 'Backend');
  const [mode, setMode] = useState('help'); // 'help' | 'learn'
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(!!existingCollab);
  const [error, setError] = useState(null);

  const isOwner = user?.id === project.user_id;
  const rolesNeeded = project.collab_looking_for || [];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (isOwner) {
      setError('You are the creator of this project!');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        project_id: project.id,
        receiver_id: project.user_id,
        skill_offered: mode === 'help' ? selectedRole : (user?.skills?.[0] || 'Peer Feedback'),
        skill_wanted: mode === 'learn' ? selectedRole : '',
        message: message.trim() || (mode === 'help' ? `I can help with ${selectedRole}!` : `I want to learn ${selectedRole} and help build with you!`)
      };

      const res = await api.sendCollabRequest(payload);
      fireSparkles();
      setSentSuccess(true);
      if (onCollabSent) onCollabSent(res);
    } catch (err) {
      setError(err.message || 'Could not send collaboration request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (rolesNeeded.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl bg-[#FDFAF0] border border-soil/15 p-6 shadow-soft space-y-4">
      <div className="flex items-center justify-between border-b border-soil/10 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sceptre font-heading flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            Peer Collaboration
          </span>
          <h3 className="text-lg font-bold font-heading text-soil mt-0.5">Need a hand?</h3>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-cerulean/30 text-soil font-semibold">
          {rolesNeeded.length} {rolesNeeded.length === 1 ? 'Role Open' : 'Roles Open'}
        </span>
      </div>

      <div>
        <p className="text-xs text-soil/70 mb-2">Looking for peer support in:</p>
        <div className="flex flex-wrap gap-2">
          {rolesNeeded.map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRole === role
                  ? 'bg-sceptre text-cream shadow-sm scale-105'
                  : 'bg-white border border-soil/20 text-soil hover:bg-soil/5'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {isOwner ? (
        <div className="p-3.5 rounded-2xl bg-soil/5 border border-soil/10 text-xs text-soil/70 text-center">
          You are the creator of this project. Check your <strong className="text-sceptre">Collaborate</strong> tab to manage incoming peer requests.
        </div>
      ) : sentSuccess ? (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Collaboration Request Active!</p>
            <p className="text-[11px] opacity-80 mt-0.5">
              The project creator has been notified. You can check status anytime on your Collaborate page.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSend} className="space-y-3 pt-2 border-t border-soil/10">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('help')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                mode === 'help'
                  ? 'bg-soil text-cream'
                  : 'bg-white border border-soil/20 text-soil/70'
              }`}
            >
              "I can help with {selectedRole}"
            </button>
            <button
              type="button"
              onClick={() => setMode('learn')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                mode === 'learn'
                  ? 'bg-cerulean-dark text-java'
                  : 'bg-white border border-soil/20 text-soil/70'
              }`}
            >
              "I want to learn {selectedRole}"
            </button>
          </div>

          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Say hi to ${project.creator?.name?.split(' ')[0] || 'the creator'}! Mention your background or why you're interested...`}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-java focus:outline-none focus:border-sceptre"
          />

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs shadow-warm transition-transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-3.5 h-3.5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Collaboration Offer</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
