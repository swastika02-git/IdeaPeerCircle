import React, { useState, useEffect } from 'react';
import { Bell, Check, Sparkles, MessageSquare, Users, Award, ExternalLink } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function NotificationsDropdown({ onNavigate }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifs = async () => {
    if (!user) return;
    try {
      const data = await api.getNotifications();
      setNotifications(data || []);
    } catch (e) {
      console.warn('Could not fetch notifications:', e);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (id, link) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: 1 } : n));
      setIsOpen(false);
      if (link) onNavigate(link);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: 1 })));
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'review':
        return <MessageSquare className="w-4 h-4 text-sceptre" />;
      case 'collab_request':
      case 'collab_accepted':
        return <Users className="w-4 h-4 text-cerulean" />;
      case 'ai_ready':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-soil" />;
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-soil hover:text-sceptre hover:bg-soil/5 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-sceptre text-cream text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#FDFAF0] shadow-lift border border-soil/15 z-50 overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between px-4 py-3 border-b border-soil/10 bg-cream-100">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-soil text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sceptre/15 text-sceptre">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-soil/70 hover:text-sceptre transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-soil/5">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-soil/50 text-xs">
                  No notifications yet. You're all caught up!
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkRead(notif.id, notif.link)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-cerulean/15 transition-colors ${
                      notif.read ? 'opacity-70 bg-transparent' : 'bg-white/80 font-medium'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-cream border border-soil/10 shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-soil">{notif.title}</p>
                      <p className="text-xs text-soil/80 line-clamp-2 mt-0.5">{notif.message}</p>
                      <span className="text-[10px] text-soil/50 mt-1 block">
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-sceptre shrink-0 mt-1.5" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
