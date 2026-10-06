import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import OpeningAnimation from './components/brand/OpeningAnimation';
import GlobalSearchModal from './components/layout/GlobalSearchModal';
import ProjectCreateWizard from './components/projects/ProjectCreateWizard';
import AuthModal from './components/auth/AuthModal';

import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CollaboratePage from './pages/CollaboratePage';
import LearningPage from './pages/LearningPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

import api from './api/client';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();
  const [introSeen, setIntroSeen] = useState(() => {
    return sessionStorage.getItem('ideapeercircle_intro_seen') === 'true';
  });

  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [shareWizardOpen, setShareWizardOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  // Fetch initial community projects
  useEffect(() => {
    api.getProjects().then(data => setProjects(data || [])).catch(() => {});
  }, []);

  // Sync hash router with browser history
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentPath(hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const handleIntroComplete = () => {
    sessionStorage.setItem('ideapeercircle_intro_seen', 'true');
    setIntroSeen(true);
  };

  const handleReplayIntro = () => {
    setIntroSeen(false);
  };

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
    navigate(`/projects/${newProject.id}`);
  };

  // Route matching helper
  const renderCurrentPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return (
        <LandingPage
          projects={projects}
          onNavigate={navigate}
          onOpenShareWizard={() => setShareWizardOpen(true)}
        />
      );
    }

    if (currentPath === '/explore' || currentPath === '/projects') {
      return (
        <ExplorePage
          onNavigate={navigate}
          onOpenShareWizard={() => setShareWizardOpen(true)}
        />
      );
    }

    if (currentPath.startsWith('/projects/')) {
      const projectId = currentPath.replace('/projects/', '');
      return (
        <ProjectDetailPage
          projectId={projectId}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/collaborate') {
      return <CollaboratePage onNavigate={navigate} />;
    }

    if (currentPath === '/learning') {
      return <LearningPage onNavigate={navigate} />;
    }

    if (currentPath === '/dashboard') {
      return (
        <DashboardPage
          onNavigate={navigate}
          onOpenShareWizard={() => setShareWizardOpen(true)}
        />
      );
    }

    if (currentPath.startsWith('/users/')) {
      const userId = currentPath.replace('/users/', '');
      return (
        <ProfilePage
          userId={userId}
          onNavigate={navigate}
        />
      );
    }

    // Default fallback
    return (
      <LandingPage
        projects={projects}
        onNavigate={navigate}
        onOpenShareWizard={() => setShareWizardOpen(true)}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream text-java">
      {/* 3.5 Second Opening Animation for Fresh Sessions */}
      {!introSeen && (
        <OpeningAnimation onComplete={handleIntroComplete} />
      )}

      {/* Main App Layout */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenShareWizard={() => setShareWizardOpen(true)}
      />

      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      <Footer
        onNavigate={navigate}
        onReplayIntro={handleReplayIntro}
      />

      {/* Modals */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
      />

      <ProjectCreateWizard
        isOpen={shareWizardOpen}
        onClose={() => setShareWizardOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      <AuthModal />
    </div>
  );
}
