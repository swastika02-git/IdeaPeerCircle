import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register' | 'demo'

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem('ideapeercircle_token');
      if (token) {
        api.setToken(token);
        try {
          const res = await api.getMe();
          if (res?.user) {
            setUser(res.user);
          } else {
            api.setToken(null);
          }
        } catch (err) {
          console.warn('Initial session check failed, resetting token:', err);
          api.setToken(null);
        }
      } else {
        // Automatically default to demo user Alex Chen if no active token so demo is instantaneous!
        try {
          const res = await api.demoSwitch('alexchen');
          setUser(res.user);
        } catch (e) {
          console.warn('Could not auto-login demo user:', e);
        }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    setUser(res.user);
    setAuthModalOpen(false);
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    setUser(res.user);
    setAuthModalOpen(false);
    return res.user;
  };

  const switchDemoUser = async (username) => {
    const res = await api.demoSwitch(username);
    setUser(res.user);
    setAuthModalOpen(false);
    return res.user;
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    setUser(res.user);
    return res.user;
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        switchDemoUser,
        logout,
        updateProfile,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
