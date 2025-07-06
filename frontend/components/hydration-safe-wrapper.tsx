"use client"

import { useEffect, useState } from "react"

interface HydrationSafeWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
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