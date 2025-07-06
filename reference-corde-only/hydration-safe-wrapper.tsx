"use client"

import { useEffect, useState, ReactNode } from 'react'

interface HydrationSafeWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export function HydrationSafeWrapper({ 
  children, 
  fallback = null 
}: HydrationSafeWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return <>{fallback}</>
  }

  return <>{children}</>
} 