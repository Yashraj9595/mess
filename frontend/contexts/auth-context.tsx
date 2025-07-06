"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'mess-owner' | 'admin'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: { name: string; email: string; password: string; role: string }) => Promise<boolean>
  logout: () => void
  verifyOTP: (email: string, otp: string) => Promise<boolean>
  resendOTP: (email: string) => Promise<void>
  resetPassword: (email: string) => Promise<boolean>
  resetPasswordWithOTP: (email: string, newPassword: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('authToken')
    if (token) {
      // Validate token and set user
      validateToken(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        localStorage.removeItem('authToken')
      }
    } catch (error) {
      console.error('Token validation error:', error)
      localStorage.removeItem('authToken')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('authToken', data.token)
        setUser(data.user)
        toast.success('Login successful!')
        return true
      } else {
        toast.error(data.message || 'Login failed')
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Network error. Please try again.')
      return false
    }
  }

  const register = async (userData: { name: string; email: string; password: string; role: string }): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Registration successful! Please check your email for verification.')
        return true
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).join('\n')
          toast.error(errorMessages)
        } else {
          toast.error(data.message || 'Registration failed')
        }
        return false
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Network error. Please try again.')
      return false
    }
  }

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('authToken', data.token)
          setUser(data.user)
        }
        toast.success('Email verified successfully!')
        return true
      } else {
        toast.error(data.message || 'Verification failed')
        return false
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      toast.error('Network error. Please try again.')
      return false
    }
  }

  const resendOTP = async (email: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Verification code sent successfully!')
      } else {
        toast.error(data.message || 'Failed to resend code')
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast.error('Network error. Please try again.')
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Password reset code sent to your email!')
        return true
      } else {
        toast.error(data.message || 'Failed to send reset code')
        return false
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Network error. Please try again.')
      return false
    }
  }

  const resetPasswordWithOTP = async (email: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Password reset successfully!')
        return true
      } else {
        toast.error(data.message || 'Password reset failed')
        return false
      }
    } catch (error) {
      console.error('Reset password with OTP error:', error)
      toast.error('Network error. Please try again.')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      verifyOTP,
      resendOTP,
      resetPassword,
      resetPasswordWithOTP,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 