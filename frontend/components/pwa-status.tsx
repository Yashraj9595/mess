"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, CheckCircle, Wifi, WifiOff, Smartphone } from 'lucide-react'
import { usePWAInstall } from '@/hooks/use-pwa-install'

export function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const { canInstall } = usePWAInstall()

  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    updateOnlineStatus()

    // Check if app is installed
    const checkInstallStatus = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches
      setIsStandalone(standalone)
      // iOS Safari exposes navigator.standalone, but it's not in the TS type
      const isIOSStandalone = typeof window !== 'undefined' && 'standalone' in window.navigator && (window.navigator as any).standalone === true
      setIsInstalled(standalone || isIOSStandalone)
    }
    
    checkInstallStatus()
    window.addEventListener('resize', checkInstallStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      window.removeEventListener('resize', checkInstallStatus)
    }
  }, [])

  if (!isOnline) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <WifiOff className="h-3 w-3" />
        Offline
      </Badge>
    )
  }

  if (isInstalled) {
    return (
      <Badge variant="default" className="flex items-center gap-1 bg-green-500">
        <CheckCircle className="h-3 w-3" />
        Installed
      </Badge>
    )
  }

  if (canInstall) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Download className="h-3 w-3" />
        Install Available
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <Smartphone className="h-3 w-3" />
      Web App
    </Badge>
  )
} 