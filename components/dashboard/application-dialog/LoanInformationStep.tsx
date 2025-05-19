"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoanType } from "@/types/applicant"
import type { NewApplicationState } from "@/types/applicant"

interface LoanInformationStepProps {
  newApplication: NewApplicationState
  setNewApplication: React.Dispatch<React.SetStateAction<NewApplicationState>>
}

export function LoanInformationStep({ newApplication, setNewApplication }: LoanInformationStepProps) {
  return (
    <div className="space-y-4 px-1 pb-1">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="loan_type">Loan Type</Label>
          <Select
            value={newApplication.loan_type}
            onValueChange={(value) => setNewApplication((prev) => ({ ...prev, loan_type: value }))}
          >
            <SelectTrigger className="w-full rounded-md">
              <SelectValue placeholder="Select loan type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={LoanType.PERSONAL}>{LoanType.PERSONAL}</SelectItem>
              <SelectItem value={LoanType.HOME}>{LoanType.HOME}</SelectItem>
              <SelectItem value={LoanType.AUTO} disabled>
                {LoanType.AUTO} (Coming Soon)
              </SelectItem>
              <SelectItem value={LoanType.BUSINESS} disabled>
                {LoanType.BUSINESS} (Coming Soon)
              </SelectItem>
              <SelectItem value={LoanType.EDUCATION} disabled>
                {LoanType.EDUCATION} (Coming Soon)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-2">
          <Label htmlFor="proposal_amount">Proposal Amount (₹)</Label>
          <Input
            id="proposal_amount"
            name="proposal_amount"
            type="text"
            inputMode="numeric"
            value={
              typeof newApplication.proposal_amount === "number"
                ? newApplication.proposal_amount.toString()
                : newApplication.proposal_amount
            }
            onChange={(e) => {
              const value = Number.parseFloat(e.target.value) || 0
              setNewApplication((prev) => ({ ...prev, proposal_amount: value }))
            }}
            placeholder="Enter loan amount"
            className="w-full rounded-md"
          />
        </div>
      </div>
    </div>
  )
}
