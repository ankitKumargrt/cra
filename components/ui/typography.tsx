"use client"

import { cn } from "@/lib/utils"
import type React from "react"

// Typography components to ensure consistency across the application

export function Heading1({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn("text-3xl md:text-5xl font-bold", className)} {...props}>
      {children}
    </h1>
  )
}

export function Heading2({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-3xl md:text-5xl font-bold", className)} {...props}>
      {children}
    </h2>
  )
}

export function Heading3({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-2xl font-semibold", className)} {...props}>
      {children}
    </h3>
  )
}

export function Subheading({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xl text-gray-700 dark:text-gray-300", className)} {...props}>
      {children}
    </p>
  )
}

export function Paragraph({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-lg text-gray-600 dark:text-gray-400", className)} {...props}>
      {children}
    </p>
  )
}

export function LargeParagraph({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xl text-gray-600 dark:text-gray-400", className)} {...props}>
      {children}
    </p>
  )
}
