"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import type { NewApplicationState } from "@/types/applicant"

interface AnalysisSubmissionHandlerProps {
  applicationId: string | null
  newApplication: NewApplicationState
  setIsOpen: (open: boolean) => void
  refreshApplicants?: () => Promise<void>
  handleNewApplicationSubmit: () => void
}

export function useAnalysisSubmissionHandler({
  applicationId,
  newApplication,
  setIsOpen,
  refreshApplicants,
  handleNewApplicationSubmit,
}: AnalysisSubmissionHandlerProps) {
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [showAnalysisLoader, setShowAnalysisLoader] = useState(false)
  const { tokens } = useAuth()
  const { toast } = useToast()

  const handleAnalysisSubmit = async () => {
    try {
      // Get the application ID from state or local storage
      const appId = applicationId || localStorage.getItem("current_application_id")

      if (!appId) {
        throw new Error("Application ID not found. Please try again.")
      }

      if (!tokens || !tokens.access_token) {
        throw new Error("Authentication token is missing. Please log in again.")
      }

      // Set loading state and show loader BEFORE closing the dialog
      setAnalysisLoading(true)
      setShowAnalysisLoader(true)

      // Store the applicant name for highlighting after refresh
      if (newApplication.full_name) {
        localStorage.setItem("last_submitted_applicant", newApplication.full_name)

        // Also add to new applications list directly
        const storedNewApplications = localStorage.getItem("new_applications")
        let newApps: string[] = []

        if (storedNewApplications) {
          try {
            newApps = JSON.parse(storedNewApplications)
          } catch (error) {
            console.error("Error parsing new applications:", error)
          }
        }

        if (!newApps.includes(newApplication.full_name)) {
          newApps.push(newApplication.full_name)
          localStorage.setItem("new_applications", JSON.stringify(newApps))
        }
      }

      // Close the dialog after setting the loader state
      setIsOpen(false)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""

      // Make both KYC and ITR analysis requests simultaneously
      const [kycResponse, itrResponse] = await Promise.all([
        fetch(`${apiUrl}api/analysis/kyc`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.access_token}`,
          },
          body: JSON.stringify({ applicant_id: appId }),
        }),
        fetch(`${apiUrl}api/analysis/itr`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.access_token}`,
          },
          body: JSON.stringify({ applicant_id: appId }),
        }),
      ])

      if (!kycResponse.ok) {
        throw new Error(`KYC analysis failed: ${kycResponse.status} ${kycResponse.statusText}`)
      }

      if (!itrResponse.ok) {
        throw new Error(`ITR analysis failed: ${itrResponse.status} ${itrResponse.statusText}`)
      }

      console.log("KYC and ITR analysis initiated successfully")

      // After both API calls return 200, refresh the applicants list
      if (refreshApplicants) {
        await refreshApplicants()
      }

      // The loader will continue to show until handleAnalysisComplete is called
    } catch (error) {
      console.error("Error initiating document analysis:", error)
      setShowAnalysisLoader(false)

      // Show error message
      toast({
        title: "Analysis Failed",
        description: `${error instanceof Error ? error.message : "Failed to process document analysis"}`,
        variant: "destructive",
        duration: 5000,
      })

      // Reopen the dialog if there was an error
      setIsOpen(true)
      setAnalysisLoading(false)
    }
  }

  // Handle analysis completion
  const handleAnalysisComplete = () => {
    setShowAnalysisLoader(false)
    setAnalysisLoading(false)

    // Show success message
    toast({
      title: "Analysis Complete",
      description: "Document analysis completed successfully.",
      duration: 5000,
    })

    // Call the original submit handler
    handleNewApplicationSubmit()
  }

  return {
    analysisLoading,
    showAnalysisLoader,
    handleAnalysisSubmit,
    handleAnalysisComplete,
  }
}
