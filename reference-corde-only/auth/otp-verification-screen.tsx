"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ArrowLeft, Shield, RefreshCw, Clock, CheckCircle, AlertTriangle, Zap, Mail } from "lucide-react"
import type { AuthScreen, AuthState } from "@/app/page"
import { useAuth } from "@/contexts/auth-context"

interface OTPVerificationScreenProps {
  onNavigate: (screen: AuthScreen, state?: any) => void
  authState: AuthState
}

export function OTPVerificationScreen({ onNavigate, authState }: OTPVerificationScreenProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const { verifyOTP, resetPassword, loginAfterRegistration } = useAuth()

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleOtpChange = useCallback((index: number, value: string) => {
    if (value.length > 1) return

    setOtp(prev => {
      const newOtp = [...prev]
      newOtp[index] = value
      return newOtp
    })

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }, [])

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }, [otp])

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    const otpString = otp.join("")
    if (otpString.length !== 6) return

    setIsLoading(true)

    try {
      const success = await verifyOTP(authState.email || "", otpString)
      if (success) {
        if (authState.resetFlow) {
          // Store OTP for password reset
          localStorage.setItem("resetOtp", otpString)
          onNavigate("reset-password", { email: authState.email, otp: otpString })
        } else {
          // Direct login after successful registration
          await loginAfterRegistration(authState.email || "", authState.otp || "")
        }
      }
    } catch (error: any) {
      setAttempts(attempts + 1)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      const success = await resetPassword(authState.email || "")
      if (success) {
        setTimeLeft(60)
        setCanResend(false)
        setOtp(["", "", "", "", "", ""])
        setAttempts(attempts + 1)
      }
    } catch (error: any) {
      console.error("Failed to resend OTP:", error)
    }
  }

  const isOtpComplete = otp.every((digit) => digit !== "")
  const maxAttempts = 3

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gradient-to-br from-background via-neutral-gray/10 to-background">
        <div className="relative gradient-primary h-64 sm:h-72 rounded-b-[40px] sm:rounded-b-[60px] shadow-2xl">
          <div className="absolute inset-0 bg-black/10 rounded-b-[40px] sm:rounded-b-[60px]"></div>

          <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 pt-12 sm:pt-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(authState.resetFlow ? "forgot-password" : "register")}
              className="text-white hover:bg-white/20 rounded-full p-2 sm:p-3 transition-all duration-300"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </Button>
            <ThemeToggle />
          </div>

          <div className="relative z-10 px-4 sm:px-6 pb-6 sm:pb-8">
            <h1 className="text-white text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Verify Code</h1>
            <p className="text-white/90 text-base sm:text-lg">Enter the 6-digit code we sent</p>
          </div>

          <div className="absolute top-16 right-4 sm:top-20 sm:right-8 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-6 left-4 sm:bottom-10 sm:left-8 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-lg animate-pulse animation-delay-1000"></div>
        </div>

        <div className="px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20 pb-6">
          <Card className="bg-card/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border-0 max-w-md mx-auto animate-slide-up">
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg animate-pulse-glow">
                  <Shield className="text-white" size={24} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Verification Code</h2>
                <p className="text-sm sm:text-base text-muted-foreground px-2">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-primary-blue break-all">{authState.email}</span>
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 p-3 bg-green-500/10 rounded-xl border border-green-500/20 mb-4">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Secure verification in progress
                </span>
              </div>

              {attempts >= 2 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 mb-4">
                  <AlertTriangle size={16} className="text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                    {maxAttempts - attempts} attempt{maxAttempts - attempts !== 1 ? "s" : ""} remaining
                  </span>
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-4 sm:space-y-6" encType="application/x-www-form-urlencoded">
                <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el: HTMLInputElement | null): void => {
                        if (inputRefs.current) {
                          inputRefs.current[index] = el;
                        }
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold bg-background border-2 border-border rounded-lg sm:rounded-xl focus:border-primary-blue focus:shadow-lg transition-all duration-300 touch-manipulation"
                    />
                  ))}
                </div>

              <div className="text-center mb-4 sm:mb-6">
                {!canResend ? (
                  <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-muted-foreground">
                    <Clock size={16} className="text-primary-blue" />
                    <span>
                      Resend code in{" "}
                      <span className="font-semibold text-primary-blue">
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                      </span>
                    </span>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={handleResendOTP}
                    disabled={attempts >= maxAttempts}
                    className="text-primary-blue hover:text-dark-blue hover:bg-transparent font-semibold flex items-center gap-2 mx-auto text-sm sm:text-base"
                  >
                    <RefreshCw size={14} className="sm:w-4 sm:h-4" />
                    Resend Code
                  </Button>
                )}
              </div>

              <Button
                type="submit"
                disabled={!isOtpComplete || isLoading || attempts >= maxAttempts}
                className="w-full gradient-primary hover:shadow-xl text-white rounded-lg sm:rounded-xl py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-manipulation"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield size={18} />
                    Verify Code
                  </div>
                )}
              </Button>

              <div className="text-center pt-3 sm:pt-4">
                <p className="text-xs sm:text-sm text-muted-foreground px-2">
                  {"Didn't receive the code? Check your spam folder or "}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onNavigate("forgot-password")}
                    className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto text-xs sm:text-sm font-semibold"
                  >
                    try again
                  </Button>
                </p>
              </div>
              </form>
            </div>
          </Card>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen bg-gradient-to-br from-background via-neutral-gray/5 to-background">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-60 -right-60 w-[600px] h-[600px] bg-primary-blue/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-60 -left-60 w-[600px] h-[600px] bg-secondary-blue/8 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>

        {/* Desktop Left Panel */}
        <div className="flex-1 flex items-center justify-center p-16 relative z-10">
          <div className="max-w-2xl space-y-12 animate-fade-in">
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                  <Shield size={48} className="text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-6xl font-black bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent">
                    Verification
                  </h1>
                  <p className="text-2xl text-muted-foreground font-medium mt-2">Secure identity confirmation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="text-center p-8 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-3xl border border-green-500/20">
                  <Mail size={48} className="text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-3">Code Sent</h3>
                  <p className="text-lg text-muted-foreground">
                    A secure 6-digit verification code has been sent to{" "}
                    <span className="font-semibold text-primary-blue">{authState.email}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Security Features</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-dark-blue rounded-xl flex items-center justify-center">
                    <Shield size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Encrypted Codes</h3>
                    <p className="text-lg text-muted-foreground">
                      All verification codes are encrypted and time-limited
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-blue to-primary-blue rounded-xl flex items-center justify-center">
                    <Clock size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Time-Limited Access</h3>
                    <p className="text-lg text-muted-foreground">Codes expire automatically for enhanced security</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Zap size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Instant Verification</h3>
                    <p className="text-lg text-muted-foreground">Real-time code validation and processing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Right Panel */}
        <div className="w-[600px] flex items-center justify-center p-16 relative z-10">
          <div className="absolute top-8 right-8">
            <ThemeToggle />
          </div>

          <Card className="w-full max-w-lg bg-card/95 backdrop-blur-lg rounded-4xl p-12 shadow-2xl border-0 animate-slide-up">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-lg animate-pulse-glow">
                  <Shield className="text-white" size={48} />
                </div>
                <h2 className="text-4xl font-bold text-foreground">Enter Verification Code</h2>
                <p className="text-xl text-muted-foreground">
                  We sent a 6-digit code to <span className="font-semibold text-primary-blue">{authState.email}</span>
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-base font-medium text-green-700 dark:text-green-400">
                  Secure verification in progress
                </span>
              </div>

              {attempts >= 2 && (
                <div className="flex items-center gap-2 p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                  <AlertTriangle size={20} className="text-yellow-500" />
                  <span className="text-base font-medium text-yellow-700 dark:text-yellow-400">
                    {maxAttempts - attempts} attempt{maxAttempts - attempts !== 1 ? "s" : ""} remaining
                  </span>
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-6" encType="application/x-www-form-urlencoded">
                <div className="flex justify-center gap-4">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el: HTMLInputElement | null): void => {
                        if (inputRefs.current) {
                          inputRefs.current[index] = el;
                        }
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-16 h-16 text-center text-2xl font-bold bg-background border-2 border-border rounded-2xl focus:border-primary-blue focus:shadow-lg transition-all duration-300"
                    />
                  ))}
                </div>

                <div className="text-center">
                  {!canResend ? (
                    <div className="flex items-center justify-center gap-3 text-lg text-muted-foreground">
                      <Clock size={20} className="text-primary-blue" />
                      <span>
                        Resend code in{" "}
                        <span className="font-semibold text-primary-blue">
                          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                        </span>
                      </span>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={handleResendOTP}
                      disabled={attempts >= maxAttempts}
                      className="text-primary-blue hover:text-dark-blue hover:bg-transparent font-semibold flex items-center gap-3 mx-auto text-lg"
                    >
                      <RefreshCw size={18} />
                      Resend Code
                    </Button>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!isOtpComplete || isLoading || attempts >= maxAttempts}
                  className="w-full gradient-primary hover:shadow-2xl text-white rounded-2xl py-6 text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Verifying Code...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Shield size={24} />
                      Verify Code
                    </div>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-lg text-muted-foreground">
                    {"Didn't receive the code? "}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onNavigate("forgot-password")}
                      className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto font-semibold text-lg"
                    >
                      Try again
                    </Button>
                  </p>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
