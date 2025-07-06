'use client';

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, X, Smartphone, Monitor, Share2, Plus } from 'lucide-react'
import { usePWAInstall } from '@/hooks/use-pwa-install'

interface InstallPromptProps {
  onClose: () => void
}

export function InstallPrompt({ onClose }: InstallPromptProps) {
  const { canInstall, install, dismissPrompt, isIOS, isAndroid, isStandalone } = usePWAInstall()
  const [isVisible, setIsVisible] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    if (canInstall || (!isStandalone && (isIOS || isAndroid))) {
      setIsVisible(true)
    }
  }, [canInstall, isIOS, isAndroid, isStandalone])

  const handleInstall = async () => {
    try {
      if (canInstall) {
        const installed = await install()
        if (installed) {
          setIsVisible(false)
          onClose()
        }
      } else {
        setShowInstructions(true)
      }
    } catch (error) {
      console.error('Failed to install PWA:', error)
      setShowInstructions(true)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    dismissPrompt()
    onClose()
  }

  const getInstallInstructions = () => {
    if (isIOS) {
      return {
        title: "Install on iOS",
        steps: [
          "Tap the Share button in Safari",
          "Scroll down and tap 'Add to Home Screen'",
          "Tap 'Add' to install MessHub"
        ],
        icon: <Smartphone className="h-6 w-6" />
      }
    } else if (isAndroid) {
      return {
        title: "Install on Android",
        steps: [
          "Tap the menu button in Chrome",
          "Tap 'Add to Home screen'",
          "Tap 'Add' to install MessHub"
        ],
        icon: <Smartphone className="h-6 w-6" />
      }
    } else {
      return {
        title: "Install on Desktop",
        steps: [
          "Click the install icon in your browser's address bar",
          "Or use the browser menu to install this app",
          "Follow the prompts to complete installation"
        ],
        icon: <Monitor className="h-6 w-6" />
      }
    }
  }

  if (!isVisible) return null

  const instructions = getInstallInstructions()

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50">
      <Card className="p-4 shadow-lg border-primary/10 bg-background/95 backdrop-blur-sm">
        {!showInstructions ? (
          <>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Install MessHub
                </h3>
                <p className="text-sm text-muted-foreground">
                  Install MessHub on your device for quick access and offline features
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="default"
                className="flex-1"
                onClick={handleInstall}
              >
                <Download className="mr-2 h-4 w-4" />
                {canInstall ? "Install Now" : "Show Instructions"}
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Maybe Later
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold flex items-center gap-2">
                  {instructions.icon}
                  {instructions.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Follow these steps to install MessHub
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              {instructions.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium text-xs">
                    {index + 1}
                  </div>
                  <span className="text-foreground">{step}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowInstructions(false)}
              >
                Back
              </Button>
              <Button
                variant="default"
                onClick={handleClose}
              >
                Got it!
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
} 