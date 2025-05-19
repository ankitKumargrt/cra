"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export const FileInput = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLInputElement> & { onChange: (file: File | null) => void }
>(({ className, onChange, ...props }, ref) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    onChange(file)
  }

  return (
    <input
      type="file"
      ref={ref}
      className={cn(
        "peer relative cursor-pointer appearance-none overflow-hidden rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      onChange={handleChange}
      {...props}
    />
  )
})
FileInput.displayName = "FileInput"
