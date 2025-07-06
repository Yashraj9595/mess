"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { WifiOff, Home, RefreshCw, Database, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

type CachedRoute = {
  url: string
  lastAccessed?: number
  title?: string
}

export function OfflineContent() {
  const router = useRouter()
  const [cachedRoutes, setCachedRoutes] = useState<CachedRoute[]>([])
  const [isCheckingCache, setIsCheckingCache] = useState(false)
  const [isOnline, setIsOnline] = useState(false)

  // Monitor online status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    updateOnlineStatus()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  // Check for available cached pages
  useEffect(() => {
    const checkCachedPages = async () => {
      if ('caches' in window) {
        setIsCheckingCache(true)
        try {
          const cacheNames = ['dynamic-routes', 'api-cache', 'offlineCache']
          const routes: CachedRoute[] = []

          for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName)
            const keys = await cache.keys()
            
            for (const request of keys) {
              if (request.url.includes(window.location.origin)) {
                const url = new URL(request.url)
                const pathname = url.pathname
                
                if (pathname !== '/offline' && pathname !== '/' && pathname.length > 1) {
                  const response = await cache.match(request)
                  let title = pathname
                  
                  if (response) {
                    const text = await response.text()
                    const titleMatch = text.match(/<title>(.*?)<\/title>/)
                    if (titleMatch) {
                      title = titleMatch[1].replace(' - MessHub', '')
                    }
                  }

                  routes.push({
                    url: pathname,
                    title: title.split('/').filter(Boolean).join(' / '),
                    lastAccessed: response?.headers.get('last-accessed') 
                      ? parseInt(response.headers.get('last-accessed') || '0')
                      : undefined
                  })
                }
              }
            }
          }

          // Sort by last accessed time and remove duplicates
          const uniqueRoutes = Array.from(new Map(routes.map(route => [route.url, route])).values())
          setCachedRoutes(uniqueRoutes.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0)))
        } catch (error) {
          console.error('Error checking cache:', error)
        } finally {
          setIsCheckingCache(false)
        }
      }
    }
    
    checkCachedPages()
  }, [])

  const handleRouteClick = async (url: string) => {
    try {
      // Try to fetch the route first if we're online
      if (isOnline) {
        const response = await fetch(url)
        if (response.ok) {
          router.push(url)
          return
        }
      }
      
      // If offline or fetch failed, try to get from cache
      const cache = await caches.open('dynamic-routes')
      const cachedResponse = await cache.match(url)
      
      if (cachedResponse) {
        router.push(url)
      } else {
        throw new Error('Route not available offline')
      }
    } catch (error) {
      console.error('Error navigating to route:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-6 text-center space-y-6 dark:border-muted">
        <div className="flex justify-center">
          <WifiOff className="h-12 w-12 text-muted-foreground" />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-foreground">You&apos;re Offline</h1>
          <p className="text-muted-foreground mt-2">
            {isOnline 
              ? "You're back online! Refresh to sync your data."
              : "Please check your internet connection and try again."}
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/80"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> 
            {isOnline ? "Refresh Now" : "Try Again"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" /> Go to Homepage
          </Button>
        </div>

        {isCheckingCache ? (
          <p className="text-sm text-muted-foreground">Checking for available offline content...</p>
        ) : cachedRoutes.length > 0 ? (
          <div className="space-y-4 border-t pt-4">
            <h2 className="text-sm font-medium flex items-center justify-center">
              <Database className="mr-2 h-4 w-4" /> Available Offline Content
            </h2>
            <div className="flex flex-col gap-2">
              {cachedRoutes.slice(0, 5).map((route) => (
                <Button 
                  key={route.url} 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleRouteClick(route.url)}
                  className="w-full text-left flex items-center justify-start"
                >
                  <span className="truncate">{route.title || route.url}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <Alert variant="destructive" className="bg-destructive/5 border-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No offline content available. Please connect to the internet to access the application.
            </AlertDescription>
          </Alert>
        )}
        
        <p className="text-xs text-muted-foreground">
          Some features may be limited while you&apos;re offline.
          <br />
          Your data will sync automatically when you&apos;re back online.
        </p>
      </Card>
    </div>
  )
} 