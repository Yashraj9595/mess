"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Smartphone, Monitor } from 'lucide-react'
import { usePWAInstall } from '@/hooks/use-pwa-install'

interface PWAInstallButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showInstructions?: boolean
}

export function PWAInstallButton({ 
  variant = 'default', 
  size = 'md', 
  className = '',
  showInstructions = true 
}: PWAInstallButtonProps) {
  const { canInstall, install, isIOS, isAndroid, isStandalone } = usePWAInstall()
  const [showInstructionsModal, setShowInstructionsModal] = useState(false)

  // Don't show if already installed
  if (isStandalone) {
    return null
  }

  const handleInstall = async () => {
    try {
      if (canInstall) {
        await install()
      } else if (showInstructions) {
        setShowInstructionsModal(true)
      }
    } catch (error) {
      console.error('Failed to install PWA:', error)
      if (showInstructions) {
        setShowInstructionsModal(true)
      }
    }
  }

  const getInstructions = () => {
    if (isIOS) {
      return [
        "Tap the Share button in Safari",
        "Scroll down and tap 'Add to Home Screen'",
        "Tap 'Add' to install MessHub"
      ]
    } else if (isAndroid) {
      return [
        "Tap the menu button in Chrome",
        "Tap 'Add to Home screen'",
        "Tap 'Add' to install MessHub"
      ]
    } else {
      return [
        "Click the install icon in your browser's address bar",
        "Or use the browser menu to install this app",
        "Follow the prompts to complete installation"
      ]
    }
  }

  const getIcon = () => {
    if (isIOS || isAndroid) {
      return <Smartphone className="h-4 w-4" />
    }
    return <Monitor className="h-4 w-4" />
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleInstall}
      >
        <Download className="mr-2 h-4 w-4" />
        {canInstall ? 'Install App' : 'Install Instructions'}
      </Button>

      {showInstructionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              {getIcon()}
              <h3 className="text-lg font-semibold">
                Install MessHub
              </h3>
            </div>
            
            <div className="space-y-3 mb-6">
              {getInstructions().map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium text-xs">
                    {index + 1}
                  </div>
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowInstructionsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 