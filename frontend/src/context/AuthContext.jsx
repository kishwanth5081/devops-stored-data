import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    // Clear persistent token so opening the application starts at the login page
    localStorage.removeItem('devops_token');
    return sessionStorage.getItem('devops_token');
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const currentUser = await api.getCurrentUser();
        const userKey = currentUser.id || currentUser.email;
        const cachedAvatar = localStorage.getItem(`devops_avatar_${userKey}`);

        if (currentUser.avatar) {
          localStorage.setItem(`devops_avatar_${userKey}`, currentUser.avatar);
        } else if (cachedAvatar) {
          currentUser.avatar = cachedAvatar;
          api.uploadAvatar(cachedAvatar).catch(() => {});
        }

        setUser(currentUser);
      } catch (err) {
        console.error('Failed to restore session:', err);
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (identifier, password) => {
    const data = await api.login(identifier, password);
    sessionStorage.setItem('devops_token', data.token);
    setToken(data.token);

    const userKey = data.user.id || data.user.email;
    const cachedAvatar = localStorage.getItem(`devops_avatar_${userKey}`);
    if (data.user.avatar) {
      localStorage.setItem(`devops_avatar_${userKey}`, data.user.avatar);
    } else if (cachedAvatar) {
      data.user.avatar = cachedAvatar;
      api.uploadAvatar(cachedAvatar).catch(() => {});
    }

    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await api.register({ name, email, password });
    sessionStorage.setItem('devops_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    sessionStorage.removeItem('devops_token');
    localStorage.removeItem('devops_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser, newToken) => {
    if (newToken) {
      sessionStorage.setItem('devops_token', newToken);
      setToken(newToken);
    }
    if (updatedUser) {
      const userKey = updatedUser.id || updatedUser.email;
      if (updatedUser.avatar) {
        localStorage.setItem(`devops_avatar_${userKey}`, updatedUser.avatar);
      } else if (updatedUser.avatar === null) {
        // User explicitly removed their avatar
        localStorage.removeItem(`devops_avatar_${userKey}`);
      }
    }
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
