"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Check } from "lucide-react"

interface InstallButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
  showLabel?: boolean
}

export function InstallButton({ className, variant = "outline", showLabel = false }: InstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsInstalled(true)
      setIsInstallable(false)
    }
    
    setDeferredPrompt(null)
  }

  if (isInstalled) {
    return (
      <Button
        variant={variant}
        className={className}
        disabled
      >
        <Check size={16} className="mr-2" />
        {showLabel && "App Installed"}
      </Button>
    )
  }

  if (!isInstallable) {
    return null
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleInstallClick}
    >
      <Download size={16} className="mr-2" />
      {showLabel && "Install App"}
    </Button>
  )
} 