"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CheckCircle2, Download, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calculator, ThumbsUp, ThumbsDown, Check, X, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import type { ApplicantData } from "@/types/applicant"
import type { Transaction } from "@/types/transaction"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface TransactionDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  selectedApplicant: string | null
  applications: ApplicantData
  highConfidenceTransactions: Transaction[]
  lowConfidenceTransactions: Transaction[]
  handleHighConfidenceTransactionSelect: (id: number) => void
  handleLowConfidenceTransactionSelect: (id: number) => void
  handleSelectAllHighConfidence: (checked: boolean) => void
  handleSelectAllLowConfidence: (checked: boolean) => void
  isCalculatingDTI: boolean
  dtiCalculated: boolean
  calculateDTI: () => void
  getApplicantData: (name: string) => any
  isLoadingTransactions: boolean
  dtiAnalysisResult?: string | null
}

interface LoanCalculationParams {
  annual_interest_rate: number
  tenure_months: number
  loan_affordability_ratio: number
}

interface LoanCalculationResult {
  "Principal Amount (₹)"?: string
  "Total Payment to Bank (₹)"?: number
  "Eligible EMI (₹)"?: number
  "Tenure (Months)"?: number
  "Total No of EMI"?: number
  applicant_id?: string
}

export function TransactionDialog({
  open,
  setOpen,
  selectedApplicant,
  applications,
  highConfidenceTransactions,
  lowConfidenceTransactions,
  handleHighConfidenceTransactionSelect,
  handleLowConfidenceTransactionSelect,
  handleSelectAllHighConfidence,
  handleSelectAllLowConfidence,
  isCalculatingDTI,
  dtiCalculated,
  calculateDTI,
  getApplicantData,
  isLoadingTransactions,
  dtiAnalysisResult,
}: TransactionDialogProps) {
  // Calculate if all high confidence transactions are selected
  const allHighConfidenceSelected =
    highConfidenceTransactions.length > 0 && highConfidenceTransactions.every((tx) => tx.selected)

  // Calculate if all low confidence transactions are selected
  const allLowConfidenceSelected =
    lowConfidenceTransactions.length > 0 && lowConfidenceTransactions.every((tx) => tx.selected)

  // EMI calculation state
  const [calculationParams, setCalculationParams] = useState<LoanCalculationParams>({
    annual_interest_rate: 10,
    tenure_months: 60,
    loan_affordability_ratio: 45,
  })
  const [calculationResult, setCalculationResult] = useState<LoanCalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationError, setCalculationError] = useState<string | null>(null)

  // Approval state
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showApproveSuccess, setShowApproveSuccess] = useState(false)
  const [showRejectSuccess, setShowRejectSuccess] = useState(false)
  const { toast } = useToast()
  const { tokens } = useAuth()

  // Reset success animations after a delay
  useEffect(() => {
    if (showApproveSuccess || showRejectSuccess) {
      const timer = setTimeout(() => {
        setShowApproveSuccess(false)
        setShowRejectSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showApproveSuccess, showRejectSuccess])

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setCalculationResult(null)
      setCalculationError(null)
      setShowApproveSuccess(false)
      setShowRejectSuccess(false)
    }
  }, [open])

  const handleCalculationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCalculationParams((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }))
  }

  const calculateLoan = async () => {
    if (!selectedApplicant || !tokens?.access_token) {
      setCalculationError("Missing required information")
      return
    }

    const applicantData = getApplicantData(selectedApplicant)
    if (!applicantData || !applicantData.id) {
      setCalculationError("Applicant data not found")
      return
    }

    setIsCalculating(true)
    setCalculationError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || ""
      const endpoint = `${apiUrl}/api/calculation/${applicantData.id}/calculate_loan`

      console.log(`Calculating loan at: ${endpoint}`)
      console.log("Calculation params:", calculationParams)

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(calculationParams),
      })

      if (!response.ok) {
        throw new Error(`Failed to calculate loan: ${response.status}`)
      }

      const data = await response.json()
      console.log("Calculation result:", data)
      setCalculationResult(data)

      toast({
        title: "Success",
        description: "Loan calculation completed successfully.",
        variant: "default",
      })
    } catch (err) {
      console.error("Error calculating loan:", err)
      setCalculationError(err instanceof Error ? err.message : "Failed to calculate loan")
      toast({
        title: "Error",
        description: "Failed to calculate loan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCalculating(false)
    }
  }

  const handleApprove = async () => {
    if (
      !selectedApplicant ||
      !tokens?.access_token ||
      !calculationResult ||
      !calculationResult["Principal Amount (₹)"]
    ) {
      toast({
        title: "Error",
        description: "Missing required information for approval.",
        variant: "destructive",
      })
      return
    }

    const applicantData = getApplicantData(selectedApplicant)
    if (!applicantData || !applicantData.id) {
      toast({
        title: "Error",
        description: "Applicant data not found",
        variant: "destructive",
      })
      return
    }

    setIsApproving(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || ""
      const endpoint = `${apiUrl}/api/calculation/${applicantData.id}/accept_offer`

      // Updated payload to use "predicted_amount" instead of "Principal Amount (₹)"
      const payload = {
        predicted_amount: calculationResult["Principal Amount (₹)"],
      }

      console.log(`Approving loan at: ${endpoint}`)
      console.log("Approval payload:", payload)

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Failed to approve loan: ${response.status}`)
      }

      const data = await response.json()
      console.log("Approval result:", data)

      // Show success animation
      setShowApproveSuccess(true)

      toast({
        title: "Success",
        description: "Loan has been approved successfully.",
        variant: "default",
      })
    } catch (err) {
      console.error("Error approving loan:", err)
      toast({
        title: "Error",
        description: "Failed to approve loan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (
      !selectedApplicant ||
      !tokens?.access_token ||
      !calculationResult ||
      !calculationResult["Principal Amount (₹)"]
    ) {
      toast({
        title: "Error",
        description: "Missing required information for rejection.",
        variant: "destructive",
      })
      return
    }

    const applicantData = getApplicantData(selectedApplicant)
    if (!applicantData || !applicantData.id) {
      toast({
        title: "Error",
        description: "Applicant data not found",
        variant: "destructive",
      })
      return
    }

    setIsRejecting(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || ""
      const endpoint = `${apiUrl}/api/calculation/${applicantData.id}/reject_offer`

      // Updated payload to use "predicted_amount" instead of "Principal Amount (₹)"
      const payload = {
        predicted_amount: calculationResult["Principal Amount (₹)"],
      }

      console.log(`Rejecting loan at: ${endpoint}`)
      console.log("Rejection payload:", payload)

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Failed to reject loan: ${response.status}`)
      }

      const data = await response.json()
      console.log("Rejection result:", data)

      // Show rejection animation
      setShowRejectSuccess(true)

      toast({
        title: "Success",
        description: "Loan has been rejected.",
        variant: "default",
      })
    } catch (err) {
      console.error("Error rejecting loan:", err)
      toast({
        title: "Error",
        description: "Failed to reject loan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRejecting(false)
    }
  }

  const markdownComponents = {
    h2: (props: any) => <h2 className="text-xl font-bold mt-4 mb-2 text-foreground" {...props} />,
    h3: (props: any) => <h3 className="text-lg font-semibold mt-3 mb-2 text-foreground" {...props} />,
    p: (props: any) => <p className="my-2 text-foreground" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-5 my-2 text-foreground" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-5 my-2 text-foreground" {...props} />,
    li: (props: any) => <li className="my-1 text-foreground" {...props} />,
    table: (props: any) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-border" {...props} />
      </div>
    ),
    thead: (props: any) => <thead className="bg-muted" {...props} />,
    tbody: (props: any) => <tbody className="text-foreground" {...props} />,
    tr: (props: any) => <tr className="border-b border-border" {...props} />,
    th: (props: any) => (
      <th className="border border-border px-4 py-2 text-left font-medium text-foreground" {...props} />
    ),
    td: (props: any) => <td className="border border-border px-4 py-2 text-sm text-foreground" {...props} />,
    strong: (props: any) => <strong className="font-bold text-foreground" {...props} />,
    em: (props: any) => <em className="italic text-foreground" {...props} />,
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-border pl-4 italic my-4 text-foreground" {...props} />
    ),
    code: (props: any) => {
      // Check if this is a code block (has className) or inline code (no className)
      if (props.className) {
        return (
          <pre className="bg-muted p-4 rounded overflow-x-auto my-4">
            <code className={`${props.className} text-foreground`} {...props} />
          </pre>
        )
      }
      return <code className="bg-muted px-1 py-0.5 rounded text-foreground" {...props} />
    },
    pre: (props: any) => <>{props.children}</>,
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto px-4 sm:px-6 bg-background border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl text-foreground">Transaction Verification & DTI Analysis</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Review transactions and calculate DTI for {selectedApplicant}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="h-8 w-8 p-0 rounded-full">
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {/* Applicant Personal Details Section */}
          {selectedApplicant && getApplicantData(selectedApplicant) && (
            <div className="mb-6 p-4 border rounded-lg bg-card text-card-foreground">
              <h3 className="text-lg font-semibold mb-3 text-foreground">Applicant Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Applicant ID:</div>
                    <div className="text-sm col-span-2 text-foreground">{getApplicantData(selectedApplicant).id}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Full Name:</div>
                    <div className="text-sm col-span-2 text-foreground">{selectedApplicant}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Father's Name:</div>
                    <div className="text-sm col-span-2 text-foreground">
                      {getApplicantData(selectedApplicant).personalDetails?.fatherName}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-sm font-medium text-muted-foreground">PAN:</div>
                    <div className="text-sm col-span-2 text-foreground">
                      {getApplicantData(selectedApplicant).personalDetails?.pan}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Mobile:</div>
                    <div className="text-sm col-span-2 text-foreground">
                      {getApplicantData(selectedApplicant).personalDetails?.phone}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Date of Birth:</div>
                    <div className="text-sm col-span-2 text-foreground">
                      {getApplicantData(selectedApplicant).personalDetails?.dob}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Loan Type:</div>
                    <div className="text-sm col-span-2 text-foreground">
                      {getApplicantData(selectedApplicant).loanType}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Proposal Amount:</div>
                    <div className="text-sm col-span-2 text-foreground">
                      ₹{getApplicantData(selectedApplicant).loanAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-sm font-medium text-muted-foreground">KYC Status:</div>
                    <div className="text-sm col-span-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getApplicantData(selectedApplicant).verified ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"}`}
                      >
                        {getApplicantData(selectedApplicant).verified ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Banker ID:</div>
                    <div className="text-sm col-span-2 text-foreground">
                      {getApplicantData(selectedApplicant).bankerId}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Income & Employment Verification Section */}
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                Income & Employment Verification
              </h3>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-green-700 dark:text-green-300 flex items-center gap-1">
              <span className="text-xl">🎉</span> Congrats! Your ITR & Form 16 is verified.
            </p>
          </div>

          {/* DTI Score Section - Only show if calculated */}
          {dtiCalculated && getApplicantData(selectedApplicant || "") && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium text-foreground">
                  DTI: {getApplicantData(selectedApplicant || "")?.dti}%
                </div>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    (getApplicantData(selectedApplicant || "")?.dti || 0) < 36
                      ? "bg-green-600"
                      : (getApplicantData(selectedApplicant || "")?.dti || 0) < 43
                        ? "bg-yellow-500"
                        : "bg-red-600"
                  }`}
                  style={{ width: `${getApplicantData(selectedApplicant || "")?.dti || 0}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                DTI ratio stands at {getApplicantData(selectedApplicant || "")?.dti}%, indicating a{" "}
                {(getApplicantData(selectedApplicant || "")?.dti || 0) < 36
                  ? "healthy"
                  : (getApplicantData(selectedApplicant || "")?.dti || 0) < 43
                    ? "balanced but slightly high"
                    : "significantly high"}{" "}
                debt burden.
              </p>
            </div>
          )}

          {/* Transaction Tables */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Transaction Verification</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search transactions..." className="pl-8 w-[250px]" />
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            {isLoadingTransactions ? (
              <div className="flex justify-center items-center py-12 text-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading transactions...</span>
              </div>
            ) : (
              <>
                {/* High Confidence Transactions Table */}
                <div className="border border-border rounded-md mb-6 overflow-x-auto w-full">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead colSpan={7} className="text-base font-semibold text-foreground">
                          High Confidence Transactions (Score 5)
                        </TableHead>
                      </TableRow>
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <div className="flex items-center">
                            <Checkbox
                              checked={allHighConfidenceSelected}
                              onCheckedChange={handleSelectAllHighConfidence}
                              id="select-all-high"
                            />
                            <label htmlFor="select-all-high" className="ml-2 text-xs text-foreground">
                              Select
                            </label>
                          </div>
                        </TableHead>
                        <TableHead className="text-foreground">Date</TableHead>
                        <TableHead className="text-foreground">Description</TableHead>
                        <TableHead className="text-foreground">Category</TableHead>
                        <TableHead className="text-center text-foreground">Confidence</TableHead>
                        <TableHead className="text-right text-foreground">Amount</TableHead>
                        <TableHead className="text-foreground">Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {highConfidenceTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                            No high confidence transactions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        highConfidenceTransactions.map((transaction) => (
                          <TableRow key={`high-${transaction.id}`}>
                            <TableCell>
                              <Checkbox
                                checked={transaction.selected}
                                onCheckedChange={() => handleHighConfidenceTransactionSelect(transaction.id)}
                              />
                            </TableCell>
                            <TableCell className="text-foreground">{transaction.date}</TableCell>
                            <TableCell className="max-w-[300px] text-foreground" title={transaction.description}>
                              <div className="break-words whitespace-normal">{transaction.description}</div>
                            </TableCell>
                            <TableCell className="text-foreground">{transaction.category}</TableCell>
                            <TableCell className="text-center">
                              <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs font-medium">
                                {transaction.confidenceScore}/5
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-red-500 dark:text-red-400">
                              {transaction.amount}
                            </TableCell>
                            <TableCell className="max-w-[300px] text-foreground" title={transaction.reason}>
                              <div className="break-words whitespace-normal">{transaction.reason}</div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Low Confidence Transactions Table */}
                <div className="border border-border rounded-md overflow-x-auto w-full">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead colSpan={7} className="text-base font-semibold text-foreground">
                          Low Confidence Transactions (Score &lt; 5)
                        </TableHead>
                      </TableRow>
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <div className="flex items-center">
                            <Checkbox
                              checked={allLowConfidenceSelected}
                              onCheckedChange={handleSelectAllLowConfidence}
                              id="select-all-low"
                            />
                            <label htmlFor="select-all-low" className="ml-2 text-xs text-foreground">
                              Select
                            </label>
                          </div>
                        </TableHead>
                        <TableHead className="text-foreground">Date</TableHead>
                        <TableHead className="text-foreground">Description</TableHead>
                        <TableHead className="text-foreground">Category</TableHead>
                        <TableHead className="text-center text-foreground">Confidence</TableHead>
                        <TableHead className="text-right text-foreground">Amount</TableHead>
                        <TableHead className="text-foreground">Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowConfidenceTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                            No low confidence transactions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        lowConfidenceTransactions.map((transaction) => (
                          <TableRow key={`low-${transaction.id}`}>
                            <TableCell>
                              <Checkbox
                                checked={transaction.selected}
                                onCheckedChange={() => handleLowConfidenceTransactionSelect(transaction.id)}
                              />
                            </TableCell>
                            <TableCell className="text-foreground">{transaction.date}</TableCell>
                            <TableCell className="max-w-[300px] text-foreground" title={transaction.description}>
                              <div className="break-words whitespace-normal">{transaction.description}</div>
                            </TableCell>
                            <TableCell className="text-foreground">{transaction.category}</TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`inline-flex items-center justify-center px-2 py-1 rounded-full ${
                                  transaction.confidenceScore >= 4
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : transaction.confidenceScore >= 3
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                } text-xs font-medium`}
                              >
                                {transaction.confidenceScore}/5
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-red-500 dark:text-red-400">
                              {transaction.amount}
                            </TableCell>
                            <TableCell className="max-w-[300px] text-foreground" title={transaction.reason}>
                              <div className="break-words whitespace-normal">{transaction.reason}</div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}

            {!dtiCalculated && (
              <div className="mt-4 flex justify-end">
                <Button onClick={calculateDTI} disabled={isCalculatingDTI || isLoadingTransactions}>
                  {isCalculatingDTI && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isCalculatingDTI ? "Calculating..." : "Calculate DTI"}
                </Button>
              </div>
            )}
          </div>

          {/* DTI Analysis Result - Show if available */}
          {dtiCalculated && dtiAnalysisResult && (
            <div className="mt-6 p-4 border border-border rounded-lg bg-card text-card-foreground">
              <h3 className="text-lg font-semibold mb-3 text-foreground">Result</h3>
              <div className="prose prose-sm max-w-none overflow-auto dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {dtiAnalysisResult}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* EMI Calculator - Only show after DTI is calculated */}
          {dtiCalculated && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    EMI Calculation
                  </CardTitle>
                  <CardDescription>
                    Calculate the maximum loan amount and EMI based on the applicant's income
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="annual_interest_rate">Annual Interest Rate (%)</Label>
                      <Input
                        id="annual_interest_rate"
                        name="annual_interest_rate"
                        type="number"
                        step="0.1"
                        min="0"
                        value={calculationParams.annual_interest_rate}
                        onChange={handleCalculationInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenure_months">Tenure (Months)</Label>
                      <Input
                        id="tenure_months"
                        name="tenure_months"
                        type="number"
                        min="1"
                        value={calculationParams.tenure_months}
                        onChange={handleCalculationInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loan_affordability_ratio">Loan Affordability Ratio (%)</Label>
                      <Input
                        id="loan_affordability_ratio"
                        name="loan_affordability_ratio"
                        type="number"
                        min="1"
                        max="100"
                        value={calculationParams.loan_affordability_ratio}
                        onChange={handleCalculationInputChange}
                      />
                    </div>
                  </div>

                  <Button onClick={calculateLoan} disabled={isCalculating} className="w-full">
                    {isCalculating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      "Calculate"
                    )}
                  </Button>

                  {calculationError && (
                    <div className="mt-4 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      {calculationError}
                    </div>
                  )}
                </CardContent>

                {calculationResult && (
                  <>
                    <CardFooter className="flex flex-col">
                      <div className="w-full bg-muted/50 rounded-lg p-4 space-y-3">
                        {/* Display the specific fields from the response */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-muted-foreground">Principal Amount:</div>
                          <div className="text-sm font-medium text-right">
                            ₹{calculationResult["Principal Amount (₹)"] || "N/A"}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-muted-foreground">Total Payment to Bank:</div>
                          <div className="text-sm font-medium text-right">
                            ₹{calculationResult["Total Payment to Bank (₹)"]?.toLocaleString() || "N/A"}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-muted-foreground">Eligible EMI:</div>
                          <div className="text-sm font-medium text-right">
                            ₹{calculationResult["Eligible EMI (₹)"]?.toLocaleString() || "N/A"}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-muted-foreground">Tenure:</div>
                          <div className="text-sm font-medium text-right">
                            {calculationResult["Tenure (Months)"]} months
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-muted-foreground">Total No of EMI:</div>
                          <div className="text-sm font-medium text-right">{calculationResult["Total No of EMI"]}</div>
                        </div>
                      </div>

                      {/* Approve/Reject buttons */}
                      <div className="flex justify-between w-full mt-6 gap-4">
                        <Button
                          variant="outline"
                          className="w-1/2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={handleReject}
                          disabled={isRejecting || isApproving || showRejectSuccess || showApproveSuccess}
                        >
                          {isRejecting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Rejecting...
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="h-4 w-4 mr-2" />
                              Reject Offer
                            </>
                          )}
                        </Button>
                        <Button
                          className="w-1/2 bg-green-600 hover:bg-green-700"
                          onClick={handleApprove}
                          disabled={isApproving || isRejecting || showApproveSuccess || showRejectSuccess}
                        >
                          {isApproving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Approve Offer
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Success/Failure animations */}
                      {showApproveSuccess && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-4 p-4 bg-green-100 text-green-800 rounded-md flex items-center justify-center"
                        >
                          <Check className="h-6 w-6 mr-2" />
                          <span className="font-medium">Loan approved successfully!</span>
                        </motion.div>
                      )}

                      {showRejectSuccess && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-4 p-4 bg-red-100 text-red-800 rounded-md flex items-center justify-center"
                        >
                          <X className="h-6 w-6 mr-2" />
                          <span className="font-medium">Loan rejected successfully!</span>
                        </motion.div>
                      )}
                    </CardFooter>
                  </>
                )}
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
