"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, XCircle, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { ApplicantData } from "@/types/applicant"

interface HomeLoanTableProps {
  applications: ApplicantData
  openTransactionDialog: (key: string) => void
  openApplicantDetails: (key: string) => void
  isLoading?: boolean
  newApplicationIds?: string[]
  markApplicationAsViewed?: (id: string) => void
  refreshApplicants?: () => Promise<void>
}

export function HomeLoanTable({
  applications,
  openTransactionDialog,
  openApplicantDetails,
  isLoading = false,
  newApplicationIds = [],
  markApplicationAsViewed = () => {},
  refreshApplicants,
}: HomeLoanTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter applications for home loans only
  const homeLoanApplications = Object.entries(applications)
    .filter(
      ([_, data]) => data.loanType?.toLowerCase() === "home loan" || data.loan_type?.toLowerCase() === "home loan",
    )
    .sort(([, a], [, b]) => {
      // Sort by date - newest first
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

  // Calculate pagination
  const totalPages = Math.ceil(homeLoanApplications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedApplications = homeLoanApplications.slice(startIndex, startIndex + itemsPerPage)

  // Check if an application is new
  const isNewApplication = (id: string | undefined) => {
    return id ? newApplicationIds.includes(id) : false
  }

  const getKycStatusBadge = (kycStatus: boolean | undefined) => {
    if (kycStatus === true) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
        >
          <Check className="mr-1 h-3 w-3" />
          Successful
        </Badge>
      )
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
        >
          <XCircle className="mr-1 h-3 w-3" />
          Failed
        </Badge>
      )
    }
  }

  // Function to display the LTV value
  const getLtvDisplay = (dti: number | null | undefined, kycStatus: boolean | undefined) => {
    // If KYC is not verified, show N/A
    if (kycStatus === false) {
      return (
        <div className="flex items-center text-muted-foreground">
          <span>N/A</span>
        </div>
      )
    }

    // Simply display the LTV value (using the DTI value from data)
    if (dti !== undefined && dti !== null) {
      // Display the LTV value with a percentage sign
      return <div>{dti}%</div>
    }

    return (
      <div className="flex items-center text-muted-foreground">
        <span>N/A</span>
      </div>
    )
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch (error) {
      console.error("Error formatting datetime:", error)
      return dateString
    }
  }

  const handleRowClick = (key: string) => {
    const applicantData = applications[key]
    if (applicantData) {
      // Mark as viewed when clicking the row
      if (applicantData.id) {
        markApplicationAsViewed(applicantData.id)
      }

      // If KYC is not verified, open applicant details to show documents
      if (applicantData.kyc_status === false) {
        openApplicantDetails(key)
        return
      }

      if (applicantData.dtiStatus) {
        // If DTI status is verified, open applicant details
        openApplicantDetails(key)
      } else {
        // If DTI status is not verified, open transaction dialog
        openTransactionDialog(key)
      }
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-xl font-semibold">Home Loans</h2>
        {refreshApplicants && (
          <Button variant="outline" size="sm" onClick={refreshApplicants} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
            Refresh
          </Button>
        )}
      </div>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : homeLoanApplications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No home loan applications found</div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-background sticky top-0 z-10">
                  <TableRow>
                    <TableHead>Applicant Name</TableHead>
                    <TableHead>PAN Number</TableHead>
                    <TableHead>Loan Type</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Proposed Amount</TableHead>
                    <TableHead>Approved Amount</TableHead>
                    <TableHead>LTV</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedApplications.map(([key, data], index) => {
                    // Use full_name property if available, otherwise use the key
                    const displayName = data.full_name || key
                    const isNew = isNewApplication(data.id)

                    return (
                      <TableRow
                        key={`${key}-${index}`}
                        className={cn(
                          "cursor-pointer hover:bg-muted/50 relative",
                          (isNewApplication(data.id) || newApplicationIds.includes(key)) &&
                            "bg-green-50 dark:bg-green-900/20",
                        )}
                        onClick={() => handleRowClick(key)}
                      >
                        <TableCell className="font-medium">{displayName}</TableCell>
                        <TableCell>{data.personalDetails?.pan || data.pan_number || "N/A"}</TableCell>
                        <TableCell>{data.loanType || data.loan_type || "Home Loan"}</TableCell>
                        <TableCell>{getKycStatusBadge(data.kyc_status)}</TableCell>
                        <TableCell>₹{(data.loanAmount || data.proposed_amount || 0).toLocaleString()}</TableCell>
                        <TableCell>
                          {data.approved_amount ? `₹${data.approved_amount.toLocaleString()}` : "Pending"}
                        </TableCell>
                        <TableCell>{getLtvDisplay(data.dti, data.kyc_status)}</TableCell>
                        <TableCell>{formatDateTime(data.createdAt || "")}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, homeLoanApplications.length)} of{" "}
                  {homeLoanApplications.length} entries
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Page</span>
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Page</span>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
