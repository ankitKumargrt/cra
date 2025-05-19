"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "L1" | "L2" | "L3" // Updated to uppercase
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }

    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      // Redirect to appropriate dashboard if user doesn't have required role
      // Use lowercase for URL path
      router.push(`/${user?.role.toLowerCase()}/dashboard`)
    }
  }, [isLoading, isAuthenticated, user, router, requiredRole])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
