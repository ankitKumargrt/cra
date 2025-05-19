"use client"

import type React from "react"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { FileCheck, LogOut } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("Logout button clicked")

    // Clear all authentication data manually as a backup
    localStorage.removeItem("auth_tokens")
    localStorage.removeItem("auth_user")
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    // Call the logout function from AuthContext
    logout()

    // Force navigation as a last resort
    setTimeout(() => {
      window.location.href = "/login"
    }, 200)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <FileCheck className="h-6 w-6" />
            <span className="font-bold">FinVerify</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  Logged in as <strong>{user.username}</strong> ({user.role})
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout} className="h-8 gap-1">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
