"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface AuthenticatedPageProps {
  children: React.ReactNode
  requiredRole?: "L1" | "L2" | "L3"
}

export default function AuthenticatedPage({ children, requiredRole }: AuthenticatedPageProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // If authentication check is complete
    if (!isLoading) {
      // If user is not authenticated, redirect to login
      if (!isAuthenticated) {
        router.replace("/login")
        return
      }

      // If a specific role is required and user doesn't have it
      if (requiredRole && user?.role !== requiredRole) {
        // Redirect to the appropriate dashboard
        router.replace(`/${user?.role.toLowerCase()}/dashboard`)
        return
      }

      // User is authenticated and has the required role (if any)
      setIsAuthorized(true)
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router])

  // Show loading state while checking authentication
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Render children once authenticated and authorized
  return <>{children}</>
}
