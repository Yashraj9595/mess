"use client"

import { useEffect, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { InstallPrompt } from '@/components/install-prompt'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { WifiOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function RootClientWrapper({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if the app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches
    
    if (!isInstalled) {
      // Show install prompt after 30 seconds if not installed
      const timer = setTimeout(() => {
        setShowInstallPrompt(true)
      }, 30000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const handleOnlineStatus = () => {
      const isCurrentlyOffline = !navigator.onLine
      setIsOffline(isCurrentlyOffline)
      
      // If we're offline and not already on the offline page, show the alert
      if (isCurrentlyOffline && window.location.pathname !== '/offline') {
        // Store the current path for later
        sessionStorage.setItem('lastPath', window.location.pathname)
      } 
      // If we're back online and were previously offline
      else if (!isCurrentlyOffline && sessionStorage.getItem('lastPath')) {
        const lastPath = sessionStorage.getItem('lastPath')
        sessionStorage.removeItem('lastPath')
        if (lastPath && lastPath !== '/offline') {
          router.push(lastPath)
        }
      }
    }

    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)
    handleOnlineStatus() // Check initial status

    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [router])

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful')
            
            // Handle service worker updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New content is available, show refresh prompt
                    if (confirm('New version available! Click OK to refresh.')) {
                      window.location.reload()
                    }
                  }
                })
              }
            })
          },
          (err) => {
            console.error('ServiceWorker registration failed:', err)
          }
        )
      })
    }
  }, [])

  return (
    <>
      {children}
      <Toaster />
      {showInstallPrompt && <InstallPrompt onClose={() => setShowInstallPrompt(false)} />}
      {isOffline && window.location.pathname !== '/offline' && (
        <Alert variant="destructive" className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You are currently offline. Some features may be limited.
          </AlertDescription>
        </Alert>
      )}
    </>
  )
} 