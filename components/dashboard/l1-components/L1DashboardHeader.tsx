"use client"

import { Bell, FileCheck, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface L1DashboardHeaderProps {
  notifications: number
  handleLogout: () => void
}

export function L1DashboardHeader({ notifications, handleLogout }: L1DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 font-bold text-xl text-primary">
        <FileCheck className="h-6 w-6" />
        <span>FinSight - L1 Dashboard</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white">
                {notifications}
              </Badge>
            )}
          </Button>
        </div>
        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
