"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import type { NewApplicationState } from "@/types/applicant"

interface LoanTypeSubmissionHandlerProps {
  newApplication: NewApplicationState
  setApplicationId: (id: string | null) => void
  setDirection: (direction: number) => void
  setApplicationStep: (step: number) => void
}

export function useLoanTypeSubmissionHandler({
  newApplication,
  setApplicationId,
  setDirection,
  setApplicationStep,
}: LoanTypeSubmissionHandlerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user, tokens } = useAuth()
  const { toast } = useToast()

  const submitLoanType = async () => {
    setIsLoading(true)
    try {
      // Get banker_id directly from the auth context
      const bankerId = user?.id

      if (!bankerId) {
        throw new Error("Banker ID is missing. Please log in again.")
      }

      if (!tokens || !tokens.access_token) {
        throw new Error("Authentication token is missing. Please log in again.")
      }

      const payload = {
        loan_type: newApplication?.loan_type || "",
        proposal_amount:
          typeof newApplication?.proposal_amount === "number"
            ? newApplication.proposal_amount
            : Number.parseFloat(String(newApplication?.proposal_amount || "0")) || 0,
        banker_id: bankerId,
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
      console.log(`Submitting loan type to: ${apiUrl}api/${bankerId}/new_applicant_loan_type`)

      const response = await fetch(`${apiUrl}api/${bankerId}/new_applicant_loan_type`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access_token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Error Response:", errorData)
        throw new Error(`Failed to submit loan type data: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Loan type data submitted successfully:", data)

      // Store the application ID in state and local storage
      if (data.applicant_id) {
        setApplicationId(data.applicant_id)
        localStorage.setItem("current_application_id", data.applicant_id)

        toast({
          title: "Loan type submitted",
          description: "Your loan type and amount have been submitted successfully.",
        })
      } else {
        console.error("No applicant ID returned from API")
        toast({
          title: "Warning",
          description: "Loan type submitted but no ID was returned. Document uploads may not work.",
          variant: "destructive",
        })
      }

      // Skip directly to document upload step (step 2)
      setDirection(1)
      setApplicationStep(2)
    } catch (error) {
      console.error("Error submitting loan type data:", error)
      toast({
        title: "Error",
        description: `${error instanceof Error ? error.message : "Failed to submit loan type"}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    submitLoanType,
  }
}
