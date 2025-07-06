'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/lib/authService';
import React from 'react';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'mess-owner' | 'admin';
  phone?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  resendOTP: (email: string) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          const userData = await authService.getProfile(storedToken);
          if (userData.success) {
            setUser(userData.user ?? null);
            setToken(storedToken);
          } else {
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await authService.login(email, password);
      
      if (result.success && result.token && result.user) {
        setUser(result.user);
        setToken(result.token);
        localStorage.setItem('authToken', result.token);
        return { success: true };
      } else {
        setError(result.message || 'Login failed');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
  }) => {
    try {
      setError(null);
      const result = await authService.register(userData);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        setError(result.message || 'Registration failed');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setError(null);
      const result = await authService.verifyOTP(email, otp);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        setError(result.message || 'OTP verification failed');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const resendOTP = async (email: string) => {
    try {
      setError(null);
      const result = await authService.resendOTP(email);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        setError(result.message || 'Failed to resend OTP');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend OTP';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setError(null);
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        setError(result.message || 'Failed to send reset email');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      setError(null);
      const result = await authService.resetPassword(email, otp, newPassword);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        setError(result.message || 'Password reset failed');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const clearError = () => {
    setError(null);
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setError(null);
      if (!token) {
        setError('No authentication token');
        return { success: false, message: 'No authentication token' };
      }

      const result = await authService.updateProfile(token, userData);
      
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true, message: result.message };
      } else {
        setError(result.message || 'Profile update failed');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    logout,
    clearError,
    updateProfile,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 