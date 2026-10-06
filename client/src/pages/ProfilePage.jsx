import React, { useState, useEffect } from 'react';
import {
  User,
  School,
  Sparkles,
  BookOpen,
  Award,
  FolderGit2,
  Edit3,
  CheckCircle,
  X,
  Plus,
  Compass,
  ArrowRight
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { fireSparkles } from '../components/brand/SparkleEffect';

export default function ProfilePage({ userId, onNavigate }) {
  const { user: currentUser, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    college: '',
    bio: '',
    skills: '',
    currently_learning: '',
    can_help_with: '',
    interests: ''
  });
  const [saving, setSaving] = useState(false);

  const targetId = userId || currentUser?.id;
  const isOwnProfile = currentUser?.id === targetId;

  const fetchProfile = async () => {
    if (!targetId) return;
    setLoading(true);
    try {
      const res = await api.getUser(targetId);
      setProfileData(res);
      if (res.user) {
        setEditForm({
          name: res.user.name || '',
          college: res.user.college || '',
          bio: res.user.bio || '',
          skills: (res.user.skills || []).join(', '),
          currently_learning: (res.user.currently_learning || []).join(', '),
          can_help_with: (res.user.can_help_with || []).join(', '),
          interests: (res.user.interests || []).join(', ')
        });
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [targetId]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: editForm.name,
        college: editForm.college,
        bio: editForm.bio,
        skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        currently_learning: editForm.currently_learning.split(',').map(s => s.trim()).filter(Boolean),
        can_help_with: editForm.can_help_with.split(',').map(s => s.trim()).filter(Boolean),
        interests: editForm.interests.split(',').map(s => s.trim()).filter(Boolean)
      });
      fireSparkles();
      setEditModalOpen(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-soil/60">
        <div className="w-8 h-8 border-2 border-sceptre border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-heading font-bold text-sm">Loading student portfolio...</p>
      </div>
    );
  }

  const { user, projects, stats, achievements } = profileData || {};
  if (!user) {
    return <div className="text-center py-12 text-soil/70">Student profile not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Portfolio Hero Header */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#FDFAF0] border border-soil/20 shadow-warm relative overflow-hidden">
        {/* Soft decorative background circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-cerulean/20 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
              alt={user.name}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-cream shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-soil tracking-tight">
                  {user.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cerulean/30 text-soil font-bold font-heading">
                  Student Builder
                </span>
              </div>
              <p className="text-xs text-soil/60">
                @{user.username} {user.college && `· ${user.college}`}
              </p>
              <p className="text-xs sm:text-sm text-soil/80 max-w-lg mt-2 leading-relaxed">
                {user.bio}
              </p>
            </div>
          </div>

          {isOwnProfile && (
            <button
              onClick={() => setEditModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-cream border border-soil/20 text-xs font-bold font-heading text-soil shadow-sm flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5 text-sceptre" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* 4 Quick Summary Badges */}
        <div className="mt-8 pt-6 border-t border-soil/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-xl font-extrabold font-heading text-sceptre block">
              {stats?.totalProjects || 0}
            </span>
            <span className="text-[11px] text-soil/60 uppercase tracking-wider font-semibold">Projects Built</span>
          </div>
          <div>
            <span className="text-xl font-extrabold font-heading text-soil block">
              {stats?.reviewsReceived || 0}
            </span>
            <span className="text-[11px] text-soil/60 uppercase tracking-wider font-semibold">Reviews Received</span>
          </div>
          <div>
            <span className="text-xl font-extrabold font-heading text-amber-600 block">
              {achievements?.length || 0}
            </span>
            <span className="text-[11px] text-soil/60 uppercase tracking-wider font-semibold">Badges Earned</span>
          </div>
          <div>
            <span className="text-xl font-extrabold font-heading text-emerald-700 block">
              {stats?.collaborationsActive || 0}
            </span>
            <span className="text-[11px] text-soil/60 uppercase tracking-wider font-semibold">Active Collabs</span>
          </div>
        </div>
      </div>

      {/* SKILLS & COLLABORATION PROFILE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Can Help With */}
        <div className="p-6 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sceptre font-heading block">
            Offerings
          </span>
          <h3 className="font-heading font-extrabold text-base text-soil">Can Help Peers With</h3>
          <div className="flex flex-wrap gap-1.5">
            {(user.can_help_with || []).map(skill => (
              <span key={skill} className="px-3 py-1 rounded-xl bg-cerulean/30 text-soil text-xs font-bold">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Currently Learning */}
        <div className="p-6 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 font-heading block">
            Growth Vector
          </span>
          <h3 className="font-heading font-extrabold text-base text-soil">Currently Learning</h3>
          <div className="flex flex-wrap gap-1.5">
            {(user.currently_learning || []).map(skill => (
              <span key={skill} className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-950 text-xs font-bold border border-amber-500/30">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Core Stack */}
        <div className="p-6 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-soil/60 font-heading block">
            Proficiencies
          </span>
          <h3 className="font-heading font-extrabold text-base text-soil">Tech Stack & Tools</h3>
          <div className="flex flex-wrap gap-1.5">
            {(user.skills || []).map(skill => (
              <span key={skill} className="px-2.5 py-1 rounded-xl bg-white border border-soil/15 text-soil text-xs font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* STUDENT SHOWCASED PROJECTS */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-soil flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-sceptre" />
          <span>Showcased Projects ({projects?.length || 0})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(projects || []).map(proj => (
            <div
              key={proj.id}
              onClick={() => onNavigate(`/projects/${proj.id}`)}
              className="p-5 rounded-3xl bg-[#FDFAF0] border border-soil/15 shadow-soft hover:shadow-lift card-hover-lift cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cerulean/30 text-soil">
                  {proj.category}
                </span>
                <h3 className="font-heading font-extrabold text-base text-soil mt-1.5">
                  {proj.title}
                </h3>
                <p className="text-xs text-soil/75 mt-1 line-clamp-2 leading-relaxed">
                  {proj.short_description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-soil/10 flex items-center justify-between text-xs font-bold font-heading text-sceptre">
                <span>View Full Critique</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS STRIP */}
      {achievements && achievements.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-soil flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Honors & Milestones</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {achievements.map(ach => (
              <div key={ach.id} className="p-4 rounded-2xl bg-white border border-soil/15 shadow-sm flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <h4 className="font-heading font-bold text-xs text-soil">{ach.title}</h4>
                  <p className="text-[10px] text-soil/60 mt-0.5">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-java/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#FDFAF0] rounded-3xl shadow-lift border border-soil/20 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-soil/10 pb-3">
              <h3 className="font-heading font-bold text-lg text-soil">Edit Student Profile</h3>
              <button onClick={() => setEditModalOpen(false)} className="p-1 text-soil/60 hover:text-sceptre">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-soil focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1">College / University</label>
                <input
                  type="text"
                  value={editForm.college}
                  onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-soil focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-soil focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-soil focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1">Currently Learning (comma separated)</label>
                <input
                  type="text"
                  value={editForm.currently_learning}
                  onChange={(e) => setEditForm({ ...editForm, currently_learning: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-soil focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1">Can Help With (comma separated)</label>
                <input
                  type="text"
                  value={editForm.can_help_with}
                  onChange={(e) => setEditForm({ ...editForm, can_help_with: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-soil focus:outline-none focus:border-sceptre"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-soil/10">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-soil/70 hover:bg-soil/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs shadow-warm"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
