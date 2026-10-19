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
