import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
import { getStoredToken, setStoredToken, getStoredUser, setStoredUser } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  // Fetch full user details from /api/users/me
  const refreshUser = useCallback(async () => {
    try {
      if (getStoredToken()) {
        const profile = await userApi.getMe();
        setUser(profile);
        setStoredUser(profile);
        return profile;
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
    return null;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        try {
          await refreshUser();
        } catch {
          // Token might be expired or invalid
          setStoredToken(null);
          setStoredUser(null);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth expiration event from client.js
    const handleAuthExpired = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('bagipakai_auth_expired', handleAuthExpired);
    return () => {
      window.removeEventListener('bagipakai_auth_expired', handleAuthExpired);
    };
  }, [refreshUser]);

  const login = async (username, password) => {
    const res = await authApi.login({ username, password });
    // res: { token, username, role }
    setStoredToken(res.token);
    setToken(res.token);

    // Initial user payload
    const initialUser = { username: res.username, role: res.role };
    setUser(initialUser);
    setStoredUser(initialUser);

    // Fetch full profile in background
    try {
      const fullProfile = await userApi.getMe();
      setUser(fullProfile);
      setStoredUser(fullProfile);
    } catch (e) {
      console.warn('Profile fetch after login notice:', e);
    }

    return res;
  };

  const register = async (username, email, password) => {
    const res = await authApi.register({ username, email, password });
    setStoredToken(res.token);
    setToken(res.token);

    const initialUser = { username: res.username, role: res.role };
    setUser(initialUser);
    setStoredUser(initialUser);

    try {
      const fullProfile = await userApi.getMe();
      setUser(fullProfile);
      setStoredUser(fullProfile);
    } catch (e) {
      console.warn('Profile fetch after register notice:', e);
    }

    return res;
  };

  const logout = () => {
    setStoredToken(null);
    setStoredUser(null);
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
