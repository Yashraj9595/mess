"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ArrowLeft, Mail, AlertCircle, Shield, Clock, CheckCircle, RefreshCw } from "lucide-react"
import type { AuthScreen } from "@/app/page"
import { useAuth } from "@/contexts/auth-context"

interface OTPVerificationFormProps {
  onNavigate: (screen: AuthScreen, state?: any) => void
  state?: {
    email: string
    name?: string
    role?: string
    resetFlow?: boolean
  }
}

export function OTPVerificationForm({ onNavigate, state }: OTPVerificationFormProps) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)

  const { verifyOTP, resendOTP } = useAuth()
  
  // Use stable callback for OTP update to prevent cursor jumping
  const handleOtpChange = useCallback((value: string) => {
    setOtp(value)
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const validateOTP = () => {
    if (!otp) {
      setError("Please enter the verification code")
      return false
    }
    if (otp.length !== 6) {
      setError("Please enter a 6-digit code")
      return false
    }
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter only numbers")
      return false
    }
    setError("")
    return true
  }

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!validateOTP()) return

    setIsLoading(true)

    try {
      const success = await verifyOTP(state?.email || "", otp)
      if (success) {
        if (state?.resetFlow) {
          onNavigate("reset-password", { email: state.email })
        } else {
          onNavigate("login", { verified: true })
        }
      }
    } catch (error: any) {
      setError(error.message || "Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return

    setIsResending(true)
    setError("")

    try {
      await resendOTP(state?.email || "")
      setCountdown(60)
    } catch (error: any) {
      setError(error.message || "Failed to resend code. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  const maskedEmail = state?.email ? state.email.replace(/(.{2}).*(@.*)/, '$1***$2') : ""

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
              onClick={() => onNavigate(state?.resetFlow ? "forgot-password" : "register")}
              className="text-white hover:bg-white/20 rounded-full p-2 sm:p-3 transition-all duration-300"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </Button>
            <ThemeToggle />
          </div>

          <div className="relative z-10 px-4 sm:px-6 pb-6 sm:pb-8">
            <h1 className="text-white text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Verify Email</h1>
            <p className="text-white/90 text-base sm:text-lg">Enter the 6-digit code sent to your email</p>
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
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Email Verification</h2>
                <p className="text-sm sm:text-base text-muted-foreground px-2">
                  We've sent a secure verification code to
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Mail size={16} className="text-primary-blue" />
                  <span className="font-semibold text-foreground">{maskedEmail}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <Shield size={16} className="text-green-500" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">Secure</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Clock size={16} className="text-blue-500" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Expires in 10 min</span>
                </div>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4" encType="application/x-www-form-urlencoded">
                <div className="space-y-2">
                  <Label
                    htmlFor="otp-input"
                    className="text-foreground font-semibold flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Shield size={14} className="sm:w-4 sm:h-4 text-primary-blue" />
                    Verification Code
                  </Label>
                  <div className="relative">
                    <Input
                      id="otp-input"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => handleOtpChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className={`bg-background border-2 rounded-lg sm:rounded-xl py-3 px-4 text-center text-lg sm:text-xl tracking-widest font-mono text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
                        error ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary-blue"
                      }`}
                      autoFocus={false}
                    />
                    {error && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <AlertCircle size={16} className="text-red-500" />
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                      <AlertCircle size={12} />
                      {error}
                    </p>
                  )}
                </div>

                <div className="bg-neutral-gray/20 dark:bg-neutral-gray/10 rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">Code Details:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-primary-blue rounded-full"></div>
                      <span>6-digit numeric code</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-secondary-blue rounded-full"></div>
                      <span>Valid for 10 minutes</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Check your spam folder if not received</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full gradient-primary hover:shadow-xl text-white rounded-lg sm:rounded-xl py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-manipulation"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} />
                      Verify Code
                    </div>
                  )}
                </Button>

                <div className="text-center space-y-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || isResending}
                    className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw size={14} className="animate-spin" />
                        Resending...
                      </div>
                    ) : countdown > 0 ? (
                      `Resend in ${countdown}s`
                    ) : (
                      "Didn't receive code? Resend"
                    )}
                  </Button>

                  <div className="text-sm sm:text-base text-muted-foreground">
                    Wrong email?{" "}
                    <Button
                      variant="ghost"
                      onClick={() => onNavigate(state?.resetFlow ? "forgot-password" : "register")}
                      className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto font-semibold text-sm sm:text-base"
                    >
                      Go back
                    </Button>
                  </div>
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
                    Email Verification
                  </h1>
                  <p className="text-2xl text-muted-foreground font-medium mt-2">Secure identity verification process</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="text-center p-8 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-3xl border border-green-500/20">
                  <Shield size={48} className="text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-3">Secure Verification</h3>
                  <p className="text-lg text-muted-foreground">Bank-level security with encrypted codes</p>
                </div>
                <div className="text-center p-8 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-3xl border border-blue-500/20">
                  <Clock size={48} className="text-blue-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-3">Quick Process</h3>
                  <p className="text-lg text-muted-foreground">Instant verification and account activation</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Verification Steps</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-dark-blue rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Check your email</h3>
                    <p className="text-lg text-muted-foreground">Look for the verification code in your inbox</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-blue to-primary-blue rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Enter the code</h3>
                    <p className="text-lg text-muted-foreground">Type the 6-digit verification code</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Complete verification</h3>
                    <p className="text-lg text-muted-foreground">Your account will be activated instantly</p>
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
                <h2 className="text-4xl font-bold text-foreground">Email Verification</h2>
                <p className="text-xl text-muted-foreground">Enter the 6-digit code sent to</p>
                <div className="flex items-center justify-center gap-3">
                  <Mail size={20} className="text-primary-blue" />
                  <span className="font-semibold text-foreground text-lg">{maskedEmail}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <Shield size={24} className="text-green-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-green-700 dark:text-green-400">Secure</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <Clock size={24} className="text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-400">10 min expiry</div>
                </div>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-6" encType="application/x-www-form-urlencoded">
                <div className="space-y-3">
                  <Label
                    htmlFor="desktop-otp-input"
                    className="text-lg font-semibold text-foreground flex items-center gap-3"
                  >
                    <Shield size={20} className="text-primary-blue" />
                    Verification Code
                  </Label>
                  <div className="relative">
                    <Input
                      id="desktop-otp-input"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => handleOtpChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className={`bg-background border-2 rounded-2xl py-4 px-6 text-center text-2xl tracking-widest font-mono text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
                        error ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary-blue"
                      }`}
                      autoFocus={false}
                    />
                    {error && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <AlertCircle size={20} className="text-red-500" />
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="text-red-500 text-base flex items-center gap-2">
                      <AlertCircle size={16} />
                      {error}
                    </p>
                  )}
                </div>

                <div className="bg-neutral-gray/20 dark:bg-neutral-gray/10 rounded-2xl p-6 border border-border">
                  <h4 className="font-semibold text-foreground mb-4 text-lg">Code Information:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-base text-muted-foreground">
                      <div className="w-3 h-3 bg-primary-blue rounded-full"></div>
                      <span>6-digit numeric verification code</span>
                    </div>
                    <div className="flex items-center gap-4 text-base text-muted-foreground">
                      <div className="w-3 h-3 bg-secondary-blue rounded-full"></div>
                      <span>Valid for 10 minutes from sending</span>
                    </div>
                    <div className="flex items-center gap-4 text-base text-muted-foreground">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Check spam folder if not received</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full gradient-primary hover:shadow-2xl text-white rounded-2xl py-6 text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Verifying Code...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <CheckCircle size={24} />
                      Verify Code
                    </div>
                  )}
                </Button>

                <div className="text-center space-y-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || isResending}
                    className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw size={18} className="animate-spin" />
                        Resending Code...
                      </div>
                    ) : countdown > 0 ? (
                      `Resend in ${countdown} seconds`
                    ) : (
                      "Didn't receive the code? Resend"
                    )}
                  </Button>

                  <div className="text-lg text-muted-foreground">
                    Wrong email address?{" "}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onNavigate(state?.resetFlow ? "forgot-password" : "register")}
                      className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto font-semibold text-lg"
                    >
                      Go back
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 