"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  X, 
  Smartphone, 
  Monitor, 
  Tablet,
  Chrome,
  Safari,
  Edge,
  Firefox,
  Share,
  Plus,
  Home,
  Settings,
  Menu
} from 'lucide-react'
import { usePWAInstall } from '@/hooks/use-pwa-install'

interface PWAInstallCardProps {
  onClose: () => void
}

export function PWAInstallCard({ onClose }: PWAInstallCardProps) {
  const { canInstall, install, isInstalled, isStandalone, isIOS, isAndroid } = usePWAInstall()
  const [showCard, setShowCard] = useState(false)
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop' | 'tablet'>('desktop')
  const [browser, setBrowser] = useState<'chrome' | 'safari' | 'edge' | 'firefox' | 'other'>('other')

  useEffect(() => {
    // Don't show if already installed
    if (isInstalled || isStandalone) {
      return
    }

    // Detect device type
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isTablet = /ipad|android(?=.*\b(?!.*\bmobile\b))/.test(userAgent)
      
      if (isTablet) {
        setDeviceType('tablet')
      } else if (isMobile) {
        setDeviceType('mobile')
      } else {
        setDeviceType('desktop')
      }
    }

    // Detect browser
    const detectBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
        setBrowser('chrome')
      } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
        setBrowser('safari')
      } else if (userAgent.includes('edg')) {
        setBrowser('edge')
      } else if (userAgent.includes('firefox')) {
        setBrowser('firefox')
      } else {
        setBrowser('other')
      }
    }

    detectDevice()
    detectBrowser()

    // Show card after a delay if install is available
    const timer = setTimeout(() => {
      if (canInstall || deviceType === 'mobile') {
        setShowCard(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [canInstall, isInstalled, isStandalone, deviceType])

  const handleInstall = async () => {
    try {
      const installed = await install()
      if (installed) {
        setShowCard(false)
        onClose()
      }
    } catch (error) {
      console.error('Failed to install PWA:', error)
    }
  }

  const handleClose = () => {
    setShowCard(false)
    onClose()
  }

  const getInstallInstructions = () => {
    if (isIOS) {
      return {
        title: "Install on iPhone/iPad",
        steps: [
          "Tap the Share button in Safari",
          "Scroll down and tap 'Add to Home Screen'",
          "Tap 'Add' to install"
        ],
        icon: <Safari className="h-5 w-5" />
      }
    }

    if (isAndroid) {
      if (browser === 'chrome') {
        return {
          title: "Install on Android",
          steps: [
            "Tap the menu button (⋮)",
            "Tap 'Add to Home screen'",
            "Tap 'Add' to install"
          ],
          icon: <Chrome className="h-5 w-5" />
        }
      } else {
        return {
          title: "Install on Android",
          steps: [
            "Tap the menu button",
            "Look for 'Add to Home screen' or 'Install app'",
            "Follow the prompts to install"
          ],
          icon: <Smartphone className="h-5 w-5" />
        }
      }
    }

    if (deviceType === 'desktop') {
      if (browser === 'chrome' || browser === 'edge') {
        return {
          title: "Install on Desktop",
          steps: [
            "Click the install icon in the address bar",
            "Or click 'Install' in the menu",
            "Follow the prompts to install"
          ],
          icon: browser === 'chrome' ? <Chrome className="h-5 w-5" /> : <Edge className="h-5 w-5" />
        }
      } else {
        return {
          title: "Install on Desktop",
          steps: [
            "Look for install option in browser menu",
            "Or use browser-specific installation method",
            "Follow the prompts to install"
          ],
          icon: <Monitor className="h-5 w-5" />
        }
      }
    }

    return {
      title: "Install MessHub",
      steps: [
        "Look for install option in your browser",
        "Follow the browser-specific instructions",
        "Add to your home screen or desktop"
      ],
      icon: <Download className="h-5 w-5" />
    }
  }

  const instructions = getInstallInstructions()

  if (!showCard || isInstalled || isStandalone) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 space-y-4 animate-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Download className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Install MessHub</h3>
              <p className="text-sm text-muted-foreground">Get the app experience</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {instructions.icon}
            <span className="font-medium">{instructions.title}</span>
          </div>

          <div className="space-y-2">
            {instructions.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  {index + 1}
                </div>
                <span className="text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {canInstall && (
            <Button
              onClick={handleInstall}
              className="flex-1"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Install Now
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleClose}
            size="sm"
          >
            Maybe Later
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Install to get offline access, notifications, and app-like experience
        </div>
      </Card>
    </div>
  )
} 