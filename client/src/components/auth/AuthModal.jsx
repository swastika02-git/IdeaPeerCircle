import React, { useState } from 'react';
import { X, Sparkles, User, Mail, Lock, School, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fireSparkles } from '../brand/SparkleEffect';

export default function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, login, register, switchDemoUser } = useAuth();
  const [tab, setTab] = useState(authModalTab || 'login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [college, setCollege] = useState('');
  const [skills, setSkills] = useState('React, JavaScript');
  const [currentlyLearning, setCurrentlyLearning] = useState('Backend, AI');
  const [canHelpWith, setCanHelpWith] = useState('Frontend, UI/UX');

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ emailOrUsername, password });
      fireSparkles();
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register({
        name,
        username,
        email,
        password: regPassword,
        college,
        skills: skills.split(',').map(s => s.trim()),
        currently_learning: currentlyLearning.split(',').map(s => s.trim()),
        can_help_with: canHelpWith.split(',').map(s => s.trim())
      });
      fireSparkles();
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-java/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#FDFAF0] rounded-3xl shadow-lift border border-soil/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-soil/10 bg-cream-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setTab('login'); setError(null); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heading transition-all ${
                tab === 'login' ? 'bg-sceptre text-cream' : 'text-soil hover:text-sceptre'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(null); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heading transition-all ${
                tab === 'register' ? 'bg-sceptre text-cream' : 'text-soil hover:text-sceptre'
              }`}
            >
              Create Account
            </button>
          </div>
          <button onClick={closeAuthModal} className="p-1.5 rounded-xl text-soil/60 hover:text-sceptre">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-100/80 border border-red-300 text-sceptre rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1 font-heading">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-soil/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="alex@stanford.edu or alexchen"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-soil/20 text-xs text-java focus:outline-none focus:border-sceptre"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1 font-heading">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-soil/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-soil/20 text-xs text-java focus:outline-none focus:border-sceptre"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs shadow-warm transition-transform active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In to Circle'}
              </button>

              {/* 1-Click Judge Shortcut */}
              <div className="pt-3 border-t border-soil/10 text-center">
                <span className="text-[11px] text-soil/60 block mb-2">Hackathon evaluator? Quick 1-click login:</span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => switchDemoUser('alexchen')}
                    className="px-2.5 py-1 rounded-lg bg-soil/5 hover:bg-soil/10 text-soil text-[11px] font-bold"
                  >
                    Alex (Stanford)
                  </button>
                  <button
                    type="button"
                    onClick={() => switchDemoUser('mayapatel')}
                    className="px-2.5 py-1 rounded-lg bg-soil/5 hover:bg-soil/10 text-soil text-[11px] font-bold"
                  >
                    Maya (MIT)
                  </button>
                  <button
                    type="button"
                    onClick={() => switchDemoUser('liamvance')}
                    className="px-2.5 py-1 rounded-lg bg-soil/5 hover:bg-soil/10 text-soil text-[11px] font-bold"
                  >
                    Liam (Berkeley)
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1 font-heading">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-java focus:outline-none focus:border-sceptre"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1 font-heading">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="jordans"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-java focus:outline-none focus:border-sceptre"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1 font-heading">
                    College / School
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Stanford, MIT..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-java focus:outline-none focus:border-sceptre"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1 font-heading">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@university.edu"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-java focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1 font-heading">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-java focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1 font-heading">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Python, Figma"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-java focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1 font-heading">
                  Currently Learning
                </label>
                <input
                  type="text"
                  value={currentlyLearning}
                  onChange={(e) => setCurrentlyLearning(e.target.value)}
                  placeholder="Backend, AI, WebSockets"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-soil/20 text-xs text-java focus:outline-none focus:border-sceptre"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs shadow-warm transition-transform active:scale-95 disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating student profile...' : 'Join IdeaPeerCircle'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
