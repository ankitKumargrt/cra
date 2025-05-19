"use client"

import type React from "react"

import { useState } from "react"
import { NewApplicationDialog } from "./NewApplicationDialog"
import type { NewApplicationState } from "@/types/applicant"

interface L2NewApplicationDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  newApplication: NewApplicationState
  setNewApplication: React.Dispatch<React.SetStateAction<NewApplicationState>>
  handleNewApplicationSubmit: () => void
  isSubmitting: boolean
}

export function L2NewApplicationDialog({
  open,
  setOpen,
  newApplication,
  setNewApplication,
  handleNewApplicationSubmit,
  isSubmitting,
}: L2NewApplicationDialogProps) {
  // Local state for application step
  const [applicationStep, setApplicationStep] = useState(0)

  // Helper functions for step navigation
  const nextStep = () => setApplicationStep((prev) => prev + 1)
  const prevStep = () => setApplicationStep((prev) => prev - 1)

  return (
    <NewApplicationDialog
      isOpen={open}
      setIsOpen={setOpen}
      applicationStep={applicationStep}
      setApplicationStep={setApplicationStep}
      newApplication={newApplication}
      setNewApplication={setNewApplication}
      handleNewApplicationSubmit={handleNewApplicationSubmit}
      nextStep={nextStep}
      prevStep={prevStep}
      isSubmitting={isSubmitting}
    />
  )
}
