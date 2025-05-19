"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { ApplicantData } from "@/types/applicant"

interface RemarksDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  selectedApplicant: string | null
  applications: ApplicantData
  setApplications: React.Dispatch<React.SetStateAction<ApplicantData>>
}

export function RemarksDialog({ open, setOpen, selectedApplicant, applications, setApplications }: RemarksDialogProps) {
  const [remarks, setRemarks] = useState("")

  // Set initial remarks when dialog opens
  useState(() => {
    if (selectedApplicant && open && applications[selectedApplicant]) {
      setRemarks(applications[selectedApplicant].remarks || "")
    }
  })

  const handleSave = () => {
    if (selectedApplicant) {
      setApplications((prev) => ({
        ...prev,
        [selectedApplicant]: {
          ...prev[selectedApplicant],
          remarks,
        },
      }))
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remarks for {selectedApplicant}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Enter remarks about this applicant..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Remarks</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
