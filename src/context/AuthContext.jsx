import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { authAPI } from '../api/client';
import { getFromStorage, STORAGE_KEYS, INITIAL_USER } from '../utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session exists in storage
    const storedUser = getFromStorage(STORAGE_KEYS.USER, null);
    const storedToken = getFromStorage(STORAGE_KEYS.TOKEN, null);

    if (storedUser) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await authAPI.login({ email, password });
      setUser(res.user);
      setToken(res.token);
      toast.success(`Welcome back, ${res.user.name || 'Student'}! 👋`);
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Login failed. Please verify credentials.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await authAPI.register({ name, email, password });
      setUser(res.user);
      setToken(res.token);
      toast.success(`Account created successfully! Welcome to StudyFlow, ${res.user.name}! 🚀`);
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please check your details.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async () => {
    setLoading(true);
    try {
      const demoUser = { ...INITIAL_USER };
      const demoToken = 'token_demo_studyflow';
      setUser(demoUser);
      setToken(demoToken);
      toast.success('Signed in as Demo Student (Alex Rivera)! 🎉');
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setUser(null);
      setToken(null);
      toast.info('You have been signed out.');
    }
  };

  const updateProfile = async (updates) => {
    try {
      const res = await authAPI.updateProfile(updates);
      setUser(res.user);
      toast.success('Profile details updated!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        loginAsDemo,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
