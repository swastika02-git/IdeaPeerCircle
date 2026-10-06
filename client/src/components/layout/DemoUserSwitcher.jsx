import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, Check, Sparkles, UserCheck } from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    username: 'alexchen',
    name: 'Alex Chen',
    role: 'Frontend & EdTech',
    college: 'Stanford',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    username: 'mayapatel',
    name: 'Maya Patel',
    role: 'Backend & ClimateTech',
    college: 'MIT',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    username: 'liamvance',
    name: 'Liam Vance',
    role: 'UI/UX & Cognitive Sci',
    college: 'UC Berkeley',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    username: 'elenarostova',
    name: 'Elena Rostova',
    role: 'Algorithms & Canvas',
    college: 'Carnegie Mellon',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  }
];

export default function DemoUserSwitcher() {
  const { user, switchDemoUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleSelect = async (username) => {
    if (user?.username === username) {
      setIsOpen(false);
      return;
    }
    setSwitching(true);
    try {
      await switchDemoUser(username);
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSwitching(false);
    }
  };

  const activeDemo = DEMO_ACCOUNTS.find(a => a.username === user?.username) || DEMO_ACCOUNTS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/70 hover:bg-white border border-soil/15 text-soil text-xs font-semibold shadow-sm transition-all"
        title="Switch demo student identity for testing"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="hidden sm:inline font-heading text-sceptre font-bold">Demo Judge:</span>
        <span className="truncate max-w-[90px]">{user?.name?.split(' ')[0] || 'Alex'}</span>
        <ChevronDown className="w-3.5 h-3.5 text-soil/60" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#FDFAF0] shadow-lift border border-soil/15 z-50 p-2 overflow-hidden animate-fadeIn">
            <div className="px-2.5 py-2 border-b border-soil/10">
              <p className="text-xs font-bold font-heading text-sceptre flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                1-Click Demo Profiles (For Judging)
              </p>
              <p className="text-[11px] text-soil/60 mt-0.5">
                Switch perspective to test reviews, AI insights, and complementary matching:
              </p>
            </div>

            <div className="space-y-1 mt-1.5">
              {DEMO_ACCOUNTS.map((account) => {
                const isActive = user?.username === account.username;
                return (
                  <button
                    key={account.username}
                    onClick={() => handleSelect(account.username)}
                    disabled={switching}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                      isActive
                        ? 'bg-cerulean/30 border border-cerulean/60'
                        : 'hover:bg-soil/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="w-8 h-8 rounded-full object-cover border border-soil/15"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-soil truncate">{account.name}</p>
                        <p className="text-[10px] text-soil/60 truncate">{account.college} · {account.role}</p>
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-sceptre shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
