"use client"

import { useEffect } from "react"
import { MultiStepLoader } from "@/components/ui/multi-step-loader"

// Define the loading states for document analysis
const analysisLoadingStates = [
  {
    text: "Initializing document analysis...",
  },
  {
    text: "Extracting data from PAN card...",
  },
  {
    text: "Verifying identity information...",
  },
  {
    text: "Processing bank statements...",
  },
  {
    text: "Analyzing income patterns...",
  },
  {
    text: "Calculating debt-to-income ratio...",
  },
  {
    text: "Generating financial health report...",
  },
  {
    text: "Finalizing application assessment...",
  },
]

interface AnalysisLoaderProps {
  isAnalyzing: boolean
  onComplete: () => void
  duration?: number
}

export function AnalysisLoader({ isAnalyzing, onComplete, duration = 2000 }: AnalysisLoaderProps) {
  // Set a timer to call onComplete after all steps are done
  useEffect(() => {
    if (isAnalyzing) {
      console.log("Analysis loader started")
      // Calculate total duration: number of steps * duration per step
      const totalDuration = analysisLoadingStates.length * duration

      // Add a small buffer to ensure all animations complete
      const timerDuration = totalDuration + 1000

      const timer = setTimeout(() => {
        console.log("Analysis loader complete")
        onComplete()
      }, timerDuration)

      return () => clearTimeout(timer)
    }
  }, [isAnalyzing, duration, onComplete])

  return (
    <MultiStepLoader loadingStates={analysisLoadingStates} loading={isAnalyzing} duration={duration} loop={false} />
  )
}
