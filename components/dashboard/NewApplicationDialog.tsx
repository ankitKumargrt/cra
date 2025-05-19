"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import type { NewApplicationState, DocumentType } from "@/types/applicant"
import { useAuth } from "@/contexts/AuthContext"
import { X } from "lucide-react"
import { DocumentUploadStep } from "./application-steps/DocumentUploadStep"
import { ApplicationSummaryStep } from "./application-steps/ApplicationSummaryStep"
import { AnalysisLoader } from "./AnalysisLoader"
import { LoanInformationStep } from "./application-dialog/LoanInformationStep"
import { DialogNavigation } from "./application-dialog/DialogNavigation"
import { useDocumentUploadHandler } from "./application-dialog/DocumentUploadHandler"
import { useAnalysisSubmissionHandler } from "./application-dialog/AnalysisSubmissionHandler"
import { useLoanTypeSubmissionHandler } from "./application-dialog/LoanTypeSubmissionHandler"
import { Button } from "@/components/ui/button"

interface NewApplicationDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  applicationStep: number
  setApplicationStep: (step: number) => void
  newApplication: NewApplicationState
  setNewApplication: React.Dispatch<React.SetStateAction<NewApplicationState>>
  handleNewApplicationSubmit: () => void
  nextStep: () => void
  prevStep: () => void
  isSubmitting?: boolean
  refreshApplicants?: () => Promise<void>
}

export function NewApplicationDialog({
  isOpen,
  setIsOpen,
  applicationStep,
  setApplicationStep,
  newApplication,
  setNewApplication,
  handleNewApplicationSubmit,
  nextStep,
  prevStep,
  isSubmitting = false,
  refreshApplicants,
}: NewApplicationDialogProps) {
  const [documentConsent, setDocumentConsent] = useState(false)
  const { user } = useAuth()
  const closeButtonClickedRef = useRef(false)
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [documentUploading, setDocumentUploading] = useState<Record<DocumentType, boolean>>({
    pan: false,
    aadhar: false,
    bankStatement: false,
    form16: false,
    itr: false,
    propertyDeed: false,
  })
  const [direction, setDirection] = useState(0)

  // Check if any document is currently uploading
  const isAnyDocumentUploading = Object.values(documentUploading).some((status) => status === true)

  // Custom hooks for handling different aspects of the application
  const { isLoading, submitLoanType } = useLoanTypeSubmissionHandler({
    newApplication,
    setApplicationId,
    setDirection,
    setApplicationStep,
  })

  const { handleFileChange, handleRemoveDocument } = useDocumentUploadHandler({
    applicationId,
    documentUploading,
    setDocumentUploading,
    newApplication,
    setNewApplication,
  })

  const { analysisLoading, showAnalysisLoader, handleAnalysisSubmit, handleAnalysisComplete } =
    useAnalysisSubmissionHandler({
      applicationId,
      newApplication,
      setIsOpen,
      refreshApplicants,
      handleNewApplicationSubmit,
    })

  // Function to reset the application form
  const resetApplicationForm = () => {
    setNewApplication({
      full_name: "",
      father_name: "",
      pan_number: "",
      mobile: "",
      dob: "",
      loan_type: "",
      proposal_amount: 0,
      banker_id: user?.id || null,
      consent: false,
      documents: {
        pan: false,
        aadhar: false,
        bankStatement: false,
        form16: false,
        itr: false,
        propertyDeed: false,
      },
      fileNames: {
        pan: "",
        aadhar: "",
        bankStatement: "",
        form16: "",
        itr: "",
        propertyDeed: "",
      },
    })
    setDocumentConsent(false)
    setApplicationId(null)
    localStorage.removeItem("current_application_id")
  }

  useEffect(() => {
    if (!isOpen) {
      // Reset step when dialog closes
      setApplicationStep(0)
      setDocumentConsent(false)
      closeButtonClickedRef.current = false
    }
  }, [isOpen, setApplicationStep])

  // Reset form when dialog opens at step 0
  useEffect(() => {
    if (isOpen && applicationStep === 0) {
      resetApplicationForm()
    }
  }, [isOpen, applicationStep, user?.id])

  useEffect(() => {
    setNewApplication((prev) => ({
      ...prev,
      consent: documentConsent,
    }))
  }, [documentConsent, setNewApplication])

  const stepVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      transition: { duration: 0.3 },
    }),
  }

  const isStepOneValid = () => {
    return (
      newApplication?.loan_type?.trim?.() !== "" &&
      (typeof newApplication?.proposal_amount === "number"
        ? newApplication.proposal_amount > 0
        : Number.parseFloat(String(newApplication?.proposal_amount || "0")) > 0)
    )
  }

  // Handle close button click
  const handleCloseButtonClick = () => {
    closeButtonClickedRef.current = true
    setIsOpen(false)
  }

  // Custom handler for dialog open state changes
  const handleOpenChange = (open: boolean) => {
    // If the dialog is being closed and it's not from the close button, prevent closing
    if (open === false && !closeButtonClickedRef.current) {
      // Do nothing - prevent closing when clicking outside
      return
    }

    // Reset the flag and allow the state change
    closeButtonClickedRef.current = false
    setIsOpen(open)
  }

  const handleNextStep = async () => {
    if (applicationStep === 0) {
      await submitLoanType()
    } else {
      // For other steps, just proceed normally
      setDirection(1)
      nextStep()
    }
  }

  useEffect(() => {
    // Check for existing application ID in local storage when dialog opens
    if (isOpen && applicationStep === 2) {
      const storedAppId = localStorage.getItem("current_application_id")
      if (storedAppId) {
        setApplicationId(storedAppId)
      }
    }
  }, [isOpen, applicationStep])

  useEffect(() => {
    if (applicationId) {
      console.log("Current application ID:", applicationId)
    }
  }, [applicationId])

  const handlePrevStep = () => {
    setDirection(-1)
    // Always go back to step 0 from step 2 (document upload)
    if (applicationStep === 2) {
      setApplicationStep(0)
    } else {
      prevStep()
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>
              {applicationStep === 0
                ? "Loan Information"
                : applicationStep === 2
                  ? "Upload Documents"
                  : "Application Summary"}
            </DialogTitle>
            {applicationStep !== 2 && (
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleCloseButtonClick}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            )}
          </DialogHeader>

          <div className="relative overflow-hidden">
            <AnimatePresence custom={direction} initial={false} mode="wait">
              <motion.div
                key={applicationStep}
                custom={direction}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="min-h-[300px]"
              >
                {applicationStep === 0 && (
                  <LoanInformationStep newApplication={newApplication} setNewApplication={setNewApplication} />
                )}

                {applicationStep === 2 && (
                  <DocumentUploadStep
                    newApplication={newApplication}
                    documentUploading={documentUploading}
                    handleFileChange={handleFileChange}
                    handleRemoveDocument={handleRemoveDocument}
                  />
                )}

                {applicationStep === 3 && <ApplicationSummaryStep newApplication={newApplication} />}
              </motion.div>
            </AnimatePresence>
          </div>

          <DialogNavigation
            applicationStep={applicationStep}
            isStepValid={isStepOneValid()}
            isLoading={isLoading}
            isAnyDocumentUploading={isAnyDocumentUploading}
            analysisLoading={analysisLoading}
            handlePrevStep={handlePrevStep}
            handleNextStep={handleNextStep}
            handleAnalysisSubmit={handleAnalysisSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Render the loader outside the Dialog component */}
      {showAnalysisLoader && <AnalysisLoader isAnalyzing={showAnalysisLoader} onComplete={handleAnalysisComplete} />}
    </>
  )
}

export default NewApplicationDialog
