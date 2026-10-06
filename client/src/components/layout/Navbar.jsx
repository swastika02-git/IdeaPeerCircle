import React, { useState } from 'react';
import Logo from '../brand/Logo';
import DemoUserSwitcher from './DemoUserSwitcher';
import NotificationsDropdown from './NotificationsDropdown';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  PlusCircle,
  Menu,
  X,
  Compass,
  Layers,
  Users,
  BookOpen,
  LayoutDashboard,
  User,
  LogOut
} from 'lucide-react';

export default function Navbar({ currentPath, onNavigate, onOpenSearch, onOpenShareWizard }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Projects', path: '/projects', icon: Layers },
    { label: 'Collaborate', path: '/collaborate', icon: Users },
    { label: 'My Learning', path: '/learning', icon: BookOpen },
  ];

  const handleNavClick = (path) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F5EFC6]/90 backdrop-blur-md border-b border-soil/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('/')}
          className="cursor-pointer transition-transform hover:scale-[1.02] shrink-0 py-2"
        >
          <Logo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-sceptre text-cream shadow-sm'
                    : 'text-soil hover:text-sceptre hover:bg-soil/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 hover:bg-white border border-soil/15 text-soil text-xs sm:text-sm font-medium transition-all shadow-sm"
            aria-label="Global Search"
          >
            <Search className="w-4 h-4 text-sceptre" />
            <span className="hidden lg:inline text-soil/60">Search projects, skills...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-soil/60 bg-soil/5 rounded">⌘K</kbd>
          </button>

          {/* Demo User Switcher (for hackathon evaluators) */}
          <DemoUserSwitcher />

          {/* Notifications Dropdown */}
          <NotificationsDropdown onNavigate={onNavigate} />

          {/* Primary CTA: Share Project */}
          <button
            onClick={onOpenShareWizard}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-sm shadow-warm transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Project</span>
          </button>

          {/* User Profile / Auth State */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full border-2 border-sceptre/30 hover:border-sceptre transition-colors"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#FDFAF0] shadow-lift border border-soil/15 z-50 p-2 overflow-hidden animate-fadeIn">
                    <div className="px-3 py-2 border-b border-soil/10">
                      <p className="font-heading font-bold text-soil text-sm truncate">{user.name}</p>
                      <p className="text-xs text-soil/60 truncate">@{user.username} · {user.college || 'Student'}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('/dashboard');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-soil hover:bg-cerulean/20 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-sceptre" />
                        <span>My Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate(`/users/${user.id}`);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-soil hover:bg-cerulean/20 transition-colors"
                      >
                        <User className="w-4 h-4 text-sceptre" />
                        <span>Student Portfolio</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-soil/10">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="px-3.5 py-1.5 rounded-xl border border-sceptre text-sceptre hover:bg-sceptre hover:text-cream text-xs font-bold font-heading transition-colors"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-soil hover:bg-soil/5"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-[#F5EFC6] border-b border-soil/15 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold font-heading ${
                  isActive ? 'bg-sceptre text-cream' : 'text-soil hover:bg-soil/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-soil/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenShareWizard();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sceptre text-cream font-bold font-heading text-sm shadow-warm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share Your Project</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
