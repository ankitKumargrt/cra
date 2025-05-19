"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { L2ApplicantDialog } from "./L2ApplicantDialog"
import type { ApplicantData, NewApplicationState } from "@/types/applicant"
import type { Dispatch, SetStateAction } from "react"
import { RefreshCw, FileCheck, AlertTriangle, Clock, XCircle, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface L2RecentApplicationsProps {
  applications: ApplicantData
  openTransactionDialog: (key: string) => void
  openChatDialog: (key: string) => void
  newApplication: NewApplicationState
  setNewApplication: Dispatch<SetStateAction<NewApplicationState>>
  handleNewApplicationSubmit: () => void
  isSubmitting: boolean
  refreshApplicants?: (isAutoRefresh?: boolean) => Promise<void>
  isLoading?: boolean
  newApplicationIds?: string[]
  markApplicationAsViewed?: (id: string) => void
}

export function L2RecentApplications({
  applications,
  openTransactionDialog,
  openChatDialog,
  newApplication,
  setNewApplication,
  handleNewApplicationSubmit,
  isSubmitting,
  refreshApplicants,
  isLoading = false,
  newApplicationIds = [],
  markApplicationAsViewed = () => {},
}: L2RecentApplicationsProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null)
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null)
  const [selectedBankerId, setSelectedBankerId] = useState<string | number | null>(null)
  const [isApplicantDialogOpen, setIsApplicantDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [processingApplicant, setProcessingApplicant] = useState<string | null>(null)
  const itemsPerPage = 6

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
          >
            <FileCheck className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case "denied":
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
          >
            <AlertTriangle className="mr-1 h-3 w-3" />
            Denied
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
          >
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  // Update the getKycStatusBadge function to show "Successful" or "Failed" based on kyc_status
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

  // Function to display the raw DTI value from the JSON
  // Updated to accept number | null | undefined to fix type error
  const getLtvDisplay = (dti: number | null | undefined, kycStatus: boolean | undefined) => {
    // If KYC is not verified, show N/A
    if (kycStatus === false) {
      return (
        <div className="flex items-center text-muted-foreground">
          <span>N/A</span>
        </div>
      )
    }

    // Simply display the raw LTV value as it appears in the JSON
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"

    try {
      // Handle ISO date strings
      if (dateString.includes("T")) {
        const date = new Date(dateString)
        return formatDistanceToNow(date, { addSuffix: true })
      }

      // Handle DD/MM/YYYY format
      if (dateString.includes("/")) {
        const [day, month, year] = dateString.split("/").map(Number)
        const date = new Date(year, month - 1, day)
        return formatDistanceToNow(date, { addSuffix: true })
      }

      return dateString
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
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

  const openApplicantDetails = (key: string) => {
    const applicantData = applications[key]
    if (applicantData) {
      // Mark as viewed when opening details
      if (applicantData.id) {
        markApplicationAsViewed(applicantData.id)
      }

      setSelectedApplicant(key)
      setSelectedApplicantId(applicantData.id || null)
      setSelectedBankerId(applicantData.bankerId || null)
      setIsApplicantDialogOpen(true)
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
        setProcessingApplicant(key)
        openTransactionDialog(key)
        // Reset processing state after a short delay
        setTimeout(() => setProcessingApplicant(null), 3000)
      }
    }
  }

  const filteredApplications = Object.entries(applications)
    .filter(([key, data]) => {
      if (activeTab === "all") return true
      if (activeTab === "pending") return data.kycStatus?.toLowerCase() === "pending"
      if (activeTab === "approved") return data.kycStatus?.toLowerCase() === "approved"
      if (activeTab === "denied") return data.kycStatus?.toLowerCase() === "denied"
      return true
    })
    .sort(([, a], [, b]) => {
      // Sort by date - newest first
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

  // Calculate pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Check if an application is new
  const isNewApplication = (id: string | undefined) => {
    return id ? newApplicationIds.includes(id) : false
  }

  return (
    <Card className="h-full">
      <div className="flex items-center justify-end px-6 pt-6">
        {refreshApplicants && (
          <Button variant="outline" size="sm" onClick={() => refreshApplicants(false)} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
            Refresh
          </Button>
        )}
      </div>
      <CardContent className="pt-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="denied">Denied</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No applications found</div>
            ) : (
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
                          <TableCell>{data.loanType || data.loan_type || "N/A"}</TableCell>
                          <TableCell>{getKycStatusBadge(data.kyc_status)}</TableCell>
                          <TableCell>₹{(data.loanAmount || data.proposed_amount || 0).toLocaleString()}</TableCell>
                          <TableCell>₹{data.approved_amount?.toLocaleString() || "N/A"}</TableCell>
                          <TableCell>{getLtvDisplay(data.dti, data.kyc_status)}</TableCell>
                          <TableCell>{formatDateTime(data.createdAt || "")}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-2 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredApplications.length)} of{" "}
                      {filteredApplications.length}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <L2ApplicantDialog
        open={isApplicantDialogOpen}
        setOpen={setIsApplicantDialogOpen}
        applicantId={selectedApplicantId}
        bankerId={selectedBankerId}
      />
    </Card>
  )
}

export default L2RecentApplications
