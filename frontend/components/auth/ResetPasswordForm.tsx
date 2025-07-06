"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ArrowLeft, Lock, AlertCircle, Shield, CheckCircle, Zap, Eye, EyeOff } from "lucide-react"
import type { AuthScreen } from "@/app/page"
import { useAuth } from "@/contexts/auth-context"

interface ResetPasswordFormProps {
  onNavigate: (screen: AuthScreen, state?: any) => void
  state?: {
    email: string
  }
}

export function ResetPasswordForm({ onNavigate, state }: ResetPasswordFormProps) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { resetPasswordWithOTP } = useAuth()
  
  // Use stable callbacks for form updates to prevent cursor jumping
  const handleNewPasswordChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, newPassword: value }))
  }, [])
  
  const handleConfirmPasswordChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, confirmPassword: value }))
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleResetPassword = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const success = await resetPasswordWithOTP(state?.email || "", formData.newPassword)
      if (success) {
        onNavigate("login", { passwordReset: true })
      }
    } catch (error: any) {
      const errorMessage = error.message || "Password reset failed. Please try again."
      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

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
              onClick={() => onNavigate("otp-verification", { email: state?.email, resetFlow: true })}
              className="text-white hover:bg-white/20 rounded-full p-2 sm:p-3 transition-all duration-300"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </Button>
            <ThemeToggle />
          </div>

          <div className="relative z-10 px-4 sm:px-6 pb-6 sm:pb-8">
            <h1 className="text-white text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Reset Password</h1>
            <p className="text-white/90 text-base sm:text-lg">Create a new secure password</p>
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
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Create New Password</h2>
                <p className="text-sm sm:text-base text-muted-foreground px-2">
                  Choose a strong password to secure your account
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <Shield size={16} className="text-green-500" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">Secure</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Zap size={16} className="text-blue-500" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Strong</span>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4" encType="application/x-www-form-urlencoded">
                <div className="space-y-2">
                  <Label
                    htmlFor="new-password"
                    className="text-foreground font-semibold flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Lock size={14} className="sm:w-4 sm:h-4 text-primary-blue" />
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={(e) => handleNewPasswordChange(e.target.value)}
                      autoComplete="new-password"
                      className={`bg-background border-2 rounded-lg sm:rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg text-sm sm:text-base touch-manipulation ${
                        errors.newPassword
                          ? "border-red-500 focus:border-red-500"
                          : "border-border focus:border-primary-blue"
                      }`}
                      autoFocus={false}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary-blue transition-colors duration-300 p-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirm-new-password"
                    className="text-foreground font-semibold flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Lock size={14} className="sm:w-4 sm:h-4 text-primary-blue" />
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-new-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      autoComplete="new-password"
                      className={`bg-background border-2 rounded-lg sm:rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg text-sm sm:text-base touch-manipulation ${
                        errors.confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : "border-border focus:border-primary-blue"
                      }`}
                      autoFocus={false}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary-blue transition-colors duration-300 p-2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {errors.general && (
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-red-500 text-sm flex items-center gap-2">
                      <AlertCircle size={14} />
                      {errors.general}
                    </p>
                  </div>
                )}

                <div className="bg-neutral-gray/20 dark:bg-neutral-gray/10 rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">Password Requirements:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>At least 8 characters long</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${/(?=.*[a-z])/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Contains lowercase letter</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${/(?=.*[A-Z])/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Contains uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${/(?=.*\d)/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Contains number</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || formData.newPassword !== formData.confirmPassword || formData.newPassword.length < 8}
                  className="w-full gradient-primary hover:shadow-xl text-white rounded-lg sm:rounded-xl py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-manipulation"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Resetting Password...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} />
                      Reset Password
                    </div>
                  )}
                </Button>

                <div className="text-center pt-3 sm:pt-4">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Remember your password?{" "}
                    <Button
                      variant="ghost"
                      onClick={() => onNavigate("login")}
                      className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto font-semibold text-sm sm:text-base"
                    >
                      Sign In
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
                    Reset Password
                  </h1>
                  <p className="text-2xl text-muted-foreground font-medium mt-2">Create a strong, secure password</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="text-center p-8 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-3xl border border-green-500/20">
                  <Shield size={48} className="text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-3">Secure Password</h3>
                  <p className="text-lg text-muted-foreground">Strong encryption and security standards</p>
                </div>
                <div className="text-center p-8 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-3xl border border-blue-500/20">
                  <Zap size={48} className="text-blue-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-3">Instant Access</h3>
                  <p className="text-lg text-muted-foreground">Login immediately with your new password</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Password Security Tips</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Use a mix of characters</h3>
                    <p className="text-lg text-muted-foreground">Include uppercase, lowercase, numbers, and symbols</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Make it unique</h3>
                    <p className="text-lg text-muted-foreground">Don't reuse passwords from other accounts</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Keep it long</h3>
                    <p className="text-lg text-muted-foreground">Use at least 8 characters for better security</p>
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
                <h2 className="text-4xl font-bold text-foreground">Create New Password</h2>
                <p className="text-xl text-muted-foreground">Choose a strong password to secure your account</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <Shield size={24} className="text-green-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-green-700 dark:text-green-400">Secure</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <Zap size={24} className="text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-400">Strong</div>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6" encType="application/x-www-form-urlencoded">
                <div className="space-y-3">
                  <Label
                    htmlFor="desktop-new-password"
                    className="text-lg font-semibold text-foreground flex items-center gap-3"
                  >
                    <Lock size={20} className="text-primary-blue" />
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="desktop-new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={(e) => handleNewPasswordChange(e.target.value)}
                      autoComplete="new-password"
                      className={`bg-background border-2 rounded-2xl py-4 px-6 text-lg text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
                        errors.newPassword ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary-blue"
                      }`}
                      autoFocus={false}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary-blue transition-colors duration-300 p-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-base flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="desktop-confirm-new-password"
                    className="text-lg font-semibold text-foreground flex items-center gap-3"
                  >
                    <Lock size={20} className="text-primary-blue" />
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="desktop-confirm-new-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      autoComplete="new-password"
                      className={`bg-background border-2 rounded-2xl py-4 px-6 text-lg text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
                        errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary-blue"
                      }`}
                      autoFocus={false}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary-blue transition-colors duration-300 p-2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-base flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {errors.general && (
                  <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                    <p className="text-red-500 text-base flex items-center gap-2">
                      <AlertCircle size={18} />
                      {errors.general}
                    </p>
                  </div>
                )}

                <div className="bg-neutral-gray/20 dark:bg-neutral-gray/10 rounded-2xl p-6 border border-border">
                  <h4 className="font-semibold text-foreground mb-4 text-lg">Password Requirements:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-base text-muted-foreground">
                      <div className={`w-3 h-3 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>At least 8 characters long</span>
                    </div>
                    <div className="flex items-center gap-4 text-base text-muted-foreground">
                      <div className={`w-3 h-3 rounded-full ${/(?=.*[a-z])/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Contains lowercase letter</span>
                    </div>
                    <div className="flex items-center gap-4 text-base text-muted-foreground">
                      <div className={`w-3 h-3 rounded-full ${/(?=.*[A-Z])/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Contains uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-4 text-base text-muted-foreground">
                      <div className={`w-3 h-3 rounded-full ${/(?=.*\d)/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Contains number</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || formData.newPassword !== formData.confirmPassword || formData.newPassword.length < 8}
                  className="w-full gradient-primary hover:shadow-2xl text-white rounded-2xl py-6 text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Resetting Password...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <CheckCircle size={24} />
                      Reset Password
                    </div>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-lg text-muted-foreground">
                    Remember your password?{" "}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onNavigate("login")}
                      className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto font-semibold text-lg"
                    >
                      Sign In
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