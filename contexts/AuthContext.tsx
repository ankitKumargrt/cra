"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

type User = {
  username: string
  role: "L1" | "L2" | "L3" // Uppercase role types
  id?: number // Add id field for banker_id
}

type AuthTokens = {
  access_token: string
  refresh_token: string
  token_type: string
}

interface AuthContextType {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [apiUrl, setApiUrl] = useState<string>("http://localhost:8000")

  // Get API URL from environment
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL
    if (url) {
      setApiUrl(url)
    }
  }, [])

  // Check if we have tokens in localStorage on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedTokens = localStorage.getItem("auth_tokens")
      if (storedTokens) {
        try {
          const parsedTokens = JSON.parse(storedTokens) as AuthTokens
          setTokens(parsedTokens)

          // Get user info from stored data or token
          const storedUser = localStorage.getItem("auth_user")
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        } catch (error) {
          console.error("Failed to parse stored tokens:", error)
          localStorage.removeItem("auth_tokens")
          localStorage.removeItem("auth_user")
          Cookies.remove("auth_token", { path: "/" })
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const storeAuthData = (tokens: AuthTokens, user: User) => {
    localStorage.setItem("auth_tokens", JSON.stringify(tokens))
    localStorage.setItem("auth_user", JSON.stringify(user))

    // Also store the access token in a cookie for middleware access
    Cookies.set("auth_token", tokens.access_token, {
      expires: 7, // 7 days
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    setTokens(tokens)
    setUser(user)
  }

  // Helper function to format data as x-www-form-urlencoded
  const formatFormData = (data: Record<string, string>): string => {
    return Object.keys(data)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join("&")
  }

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      // Format the data as x-www-form-urlencoded
      const formData = formatFormData({
        username,
        password,
      })

      // Updated API endpoint to include "api/" prefix
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      const data = await response.json()
      const { access_token, refresh_token, token_type, role_type, banker_id } = data

      // Use role_type directly from the response (L1, L2, L3)
      const role = role_type as "L1" | "L2" | "L3"

      // Store tokens and user info, including banker_id
      const userData: User = {
        username,
        role,
        id: banker_id || 0, // Store banker_id in the user object
      }

      storeAuthData({ access_token, refresh_token, token_type }, userData)

      // Redirect to the appropriate dashboard using lowercase version of role
      const dashboardPath = `/${role.toLowerCase()}/dashboard`

      // Use window.location for a full page navigation instead of router.push
      // This ensures the middleware sees the updated cookies
      window.location.href = dashboardPath
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem("auth_tokens")
    localStorage.removeItem("auth_user")

    // Remove cookies with explicit path
    Cookies.remove("auth_token", { path: "/" })

    // Reset state
    setTokens(null)
    setUser(null)

    // Redirect to login page immediately
    window.location.href = "/login"
  }

  const refreshToken = async (): Promise<boolean> => {
    if (!tokens?.refresh_token) return false

    try {
      // Format the data as x-www-form-urlencoded
      const formData = formatFormData({
        refresh_token: tokens.refresh_token,
      })

      // Updated API endpoint to include "api/" prefix
      const response = await fetch(`${apiUrl}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to refresh token")
      }

      const data = await response.json()
      const { access_token, refresh_token, token_type } = data

      // Update tokens
      const newTokens = {
        access_token,
        refresh_token,
        token_type,
      }

      if (user) {
        storeAuthData(newTokens, user)
      }

      return true
    } catch (error) {
      console.error("Token refresh error:", error)
      logout()
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isLoading,
        isAuthenticated: !!user && !!tokens,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
