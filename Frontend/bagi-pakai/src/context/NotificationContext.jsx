import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationsApi } from '../api/notificationsApi';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    try {
      const count = await notificationsApi.getUnreadCount();
      setUnreadCount(typeof count === 'number' ? count : 0);
    } catch {
      // Ignore background fetch error
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUnread();
    if (!isAuthenticated) return;

    // Periodic check every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [fetchUnread, isAuthenticated]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnread: fetchUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
