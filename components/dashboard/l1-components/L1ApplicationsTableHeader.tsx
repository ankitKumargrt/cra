"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Search, Plus, RefreshCcw } from "lucide-react"

interface L1ApplicationsTableHeaderProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  isRefreshing: boolean
  handleRefresh: () => Promise<void>
  setIsNewApplicationOpen: (open: boolean) => void
  setApplicationStep: (step: number) => void
}

export function L1ApplicationsTableHeader({
  searchTerm,
  setSearchTerm,
  isRefreshing,
  handleRefresh,
  setIsNewApplicationOpen,
  setApplicationStep,
}: L1ApplicationsTableHeaderProps) {
  return (
    <div className="p-4 border-b bg-muted/40 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search applicants..."
            className="w-[200px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Refresh applicants"
        >
          <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <AnimatedButton
        onClick={() => {
          setApplicationStep(0) // Reset to consent step
          setIsNewApplicationOpen(true)
        }}
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" />
        New Application
      </AnimatedButton>
    </div>
  )
}
