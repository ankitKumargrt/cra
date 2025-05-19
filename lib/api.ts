"use client"

import { useAuth } from "@/contexts/AuthContext"

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const { tokens, refreshToken, logout } = useAuth()

  if (!tokens) {
    throw new Error("No authentication tokens available")
  }

  // Add authorization header
  const headers = {
    ...options.headers,
    Authorization: `${tokens.token_type} ${tokens.access_token}`,
  }

  let response = await fetch(url, { ...options, headers })

  // If unauthorized, try to refresh the token
  if (response.status === 401) {
    const refreshed = await refreshToken()

    if (refreshed) {
      // Retry with new token
      headers.Authorization = `${tokens.token_type} ${tokens.access_token}`
      response = await fetch(url, { ...options, headers })
    } else {
      // If refresh failed, logout
      logout()
      throw new Error("Authentication failed")
    }
  }

  return response
}
