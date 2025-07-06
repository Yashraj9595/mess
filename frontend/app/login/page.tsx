"use client"

import { useState } from "react"
import { LoginForm } from '@/components/auth/LoginForm'
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-context"
import { Toaster } from "sonner"

type AuthScreen = "welcome" | "login" | "register" | "forgot-password" | "otp-verification" | "reset-password"

export default function LoginPage() {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>("login")
  const [screenState, setScreenState] = useState<any>({})

  const handleNavigate = (screen: AuthScreen, state?: any) => {
    setCurrentScreen(screen)
    if (state) {
      setScreenState(state)
    }
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen">
          <LoginForm onNavigate={handleNavigate} />
          <Toaster position="top-right" richColors />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
} 