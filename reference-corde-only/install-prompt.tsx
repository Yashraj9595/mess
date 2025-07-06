'use client';

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, X } from 'lucide-react'
import { usePWAInstall } from '@/hooks/use-pwa-install'

interface InstallPromptProps {
  onClose: () => void
}

export function InstallPrompt({ onClose }: InstallPromptProps) {
  const { canInstall, install, dismissPrompt } = usePWAInstall()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (canInstall) {
      setIsVisible(true)
    }
  }, [canInstall])

  const handleInstall = async () => {
    try {
      const installed = await install()
      if (installed) {
        setIsVisible(false)
        onClose()
      }
    } catch (error) {
      console.error('Failed to install PWA:', error)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    dismissPrompt()
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50">
      <Card className="p-4 shadow-lg border-primary/10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">Install MessHub</h3>
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
            Install Now
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Maybe Later
          </Button>
        </div>
      </Card>
    </div>
  )
}