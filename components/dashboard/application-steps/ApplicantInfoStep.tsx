"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { NewApplicationState } from "@/types/applicant"
import { LoanType } from "@/types/applicant"

interface ApplicantInfoStepProps {
  newApplication: NewApplicationState
  setNewApplication: React.Dispatch<React.SetStateAction<NewApplicationState>>
}

export function ApplicantInfoStep({ newApplication, setNewApplication }: ApplicantInfoStepProps) {
  const [dobError, setDobError] = useState<string | null>(null)

  // Calculate minimum date (current year - 5)
  const calculateMinDate = () => {
    const currentDate = new Date()
    const minYear = currentDate.getFullYear() - 5
    return `${minYear}-01-01`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Apply specific formatting based on field name
    if (name === "full_name" || name === "father_name") {
      // Capitalize first letter of each word
      const formattedValue = value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      setNewApplication((prev) => ({
        ...prev,
        [name]: formattedValue,
      }))
    } else if (name === "pan_number") {
      // Convert to uppercase for PAN
      const uppercaseValue = value.toUpperCase()
      setNewApplication((prev) => ({
        ...prev,
        [name]: uppercaseValue,
      }))
    } else if (name === "mobile") {
      // Only allow digits for mobile number
      const digitsOnly = value.replace(/\D/g, "")
      setNewApplication((prev) => ({
        ...prev,
        [name]: digitsOnly,
      }))
    } else if (name === "dob") {
      // Validate date of birth
      const selectedDate = new Date(value)
      const minDate = new Date(calculateMinDate())

      if (selectedDate > minDate) {
        setDobError(`Date of birth is invalid`)
      } else {
        setDobError(null)
      }

      setNewApplication((prev) => ({
        ...prev,
        [name]: value,
      }))
    } else {
      // Default handling for other fields
      setNewApplication((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Validate PAN format (5 alphabets, 4 numbers, 1 alphabet)
  const isPanValid = (pan: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return panRegex.test(pan)
  }

  // Validate mobile number (exactly 10 digits)
  const isMobileValid = (mobile: string): boolean => {
    return /^\d{10}$/.test(mobile)
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewApplication((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewApplication((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }))
  }

  // Validate DOB on component mount and when newApplication.dob changes
  useEffect(() => {
    if (newApplication.dob) {
      const selectedDate = new Date(newApplication.dob)
      const minDate = new Date(calculateMinDate())

      if (selectedDate > minDate) {
        setDobError(`Date of birth is invalid`)
      } else {
        setDobError(null)
      }
    }
  }, [newApplication.dob])

  return (
    <div className="space-y-4 px-1 pb-1">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={newApplication.full_name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            className="w-full rounded-md"
          />
        </div>
        <div>
          <Label htmlFor="father_name">Father's Name</Label>
          <Input
            id="father_name"
            name="father_name"
            value={newApplication.father_name}
            onChange={handleInputChange}
            placeholder="Enter father's name"
            className="w-full rounded-md"
          />
        </div>
        <div>
          <Label htmlFor="mobile">Mobile Number</Label>
          <div className="flex items-center">
            <span className="bg-muted px-3 py-2 text-sm border border-r-0 rounded-l-md">+91</span>
            <Input
              id="mobile"
              name="mobile"
              value={newApplication.mobile}
              onChange={handleInputChange}
              placeholder="Enter 10-digit mobile number"
              className="rounded-l-none w-full"
              maxLength={10}
            />
          </div>
          {newApplication.mobile && !isMobileValid(newApplication.mobile) && (
            <p className="text-sm text-red-500 mt-1">Please enter a valid 10-digit mobile number</p>
          )}
        </div>
        <div>
          <Label htmlFor="pan_number">PAN Number</Label>
          <Input
            id="pan_number"
            name="pan_number"
            value={newApplication.pan_number}
            onChange={handleInputChange}
            placeholder="Enter PAN number (e.g., ABCDE1234F)"
            maxLength={10}
            className="w-full rounded-md"
          />
          {newApplication.pan_number && !isPanValid(newApplication.pan_number) && (
            <p className="text-sm text-red-500 mt-1">PAN must be in format: ABCDE1234F</p>
          )}
        </div>
        <div>
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            name="dob"
            type="date"
            value={newApplication.dob}
            onChange={handleInputChange}
            max={calculateMinDate()}
            className="w-full rounded-md"
          />
          {dobError && <p className="text-sm text-red-500 mt-1">{dobError}</p>}
        </div>
        <div>
          <Label htmlFor="loan_type">Loan Type</Label>
          <Select value={newApplication.loan_type} onValueChange={(value) => handleSelectChange("loan_type", value)}>
            <SelectTrigger className="w-full rounded-md">
              <SelectValue placeholder="Select loan type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={LoanType.PERSONAL}>{LoanType.PERSONAL}</SelectItem>
              <SelectItem value={LoanType.HOME} disabled>
                {LoanType.HOME} (Coming Soon)
              </SelectItem>
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
            type="number"
            value={
              typeof newApplication.proposal_amount === "number"
                ? newApplication.proposal_amount
                : newApplication.proposal_amount
            }
            onChange={handleNumberChange}
            placeholder="Enter loan amount"
            min="1000"
            className="w-full rounded-md"
          />
        </div>
      </div>
    </div>
  )
}
