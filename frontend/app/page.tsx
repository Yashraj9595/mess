"use client"

import { useState } from "react"
import { WelcomePage } from "@/components/auth/WelcomePage"
import { LoginForm } from "@/components/auth/LoginForm"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"
import { OTPVerificationForm } from "@/components/auth/OTPVerificationForm"
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-context"
import { Toaster } from "sonner"

export type AuthScreen = "welcome" | "login" | "register" | "forgot-password" | "otp-verification" | "reset-password"

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>("welcome")
  const [screenState, setScreenState] = useState<any>({})

  const handleNavigate = (screen: AuthScreen, state?: any) => {
    setCurrentScreen(screen)
    if (state) {
      setScreenState(state)
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return <WelcomePage onNavigate={handleNavigate} />
      case "login":
        return <LoginForm onNavigate={handleNavigate} />
      case "register":
        return <RegisterForm onNavigate={handleNavigate} />
      case "forgot-password":
        return <ForgotPasswordForm onNavigate={handleNavigate} />
      case "otp-verification":
        return <OTPVerificationForm onNavigate={handleNavigate} state={screenState} />
      case "reset-password":
        return <ResetPasswordForm onNavigate={handleNavigate} state={screenState} />
      default:
        return <WelcomePage onNavigate={handleNavigate} />
    }
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen">
          {renderScreen()}
          <Toaster position="top-right" richColors />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}