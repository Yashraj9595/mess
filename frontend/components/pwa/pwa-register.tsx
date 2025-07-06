"use client"

import { useEffect, useState } from 'react'

export function PWARegister() {
  const [isOnline, setIsOnline] = useState(true)
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration)
          setSwRegistration(registration)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available
                  console.log('New content is available')
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })

      // Handle service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed')
        window.location.reload()
      })
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        console.log('Notification permission granted')
      }
    }
  }

  // Send test notification
  const sendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('MessHub', {
        body: 'Welcome to MessHub! Your smart mess management solution.',
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png'
      })
    }
  }

  // Background sync
  const triggerBackgroundSync = async () => {
    if (swRegistration && 'sync' in swRegistration) {
      try {
        // Use any for syncManager since ServiceWorkerSyncManager is not in TS by default
        const syncManager = (swRegistration as any).sync
        if (syncManager && typeof syncManager.register === 'function') {
          await syncManager.register('background-sync')
          console.log('Background sync registered')
        }
      } catch (error) {
        console.error('Background sync registration failed:', error)
      }
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Online/Offline indicator */}
      <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
      
      {/* Hidden PWA registration - this component handles registration but doesn't render UI */}
      <div className="hidden">
        {/* PWA functionality is handled here */}
      </div>
    </div>
  )
} 