"use client"

import type React from "react"

import { useState, useEffect } from "react"
import NewApplicationDialog from "@/components/dashboard/NewApplicationDialog"
import type { ApplicantData, NewApplicationState } from "@/types/applicant"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { L1ApplicationsTable } from "./l1-components/L1ApplicationsTable"
import { L1ApplicationsTableHeader } from "./l1-components/L1ApplicationsTableHeader"
import { L1ApplicationsTableFooter } from "./l1-components/L1ApplicationsTableFooter"

interface L1RecentApplicationsProps {
  applications: ApplicantData
  openRemarksDialog: (key: string) => void
  openChatDialog: (key: string) => void
  openKycDocumentsDialog: (key: string) => void
  newApplication: NewApplicationState
  setNewApplication: React.Dispatch<React.SetStateAction<NewApplicationState>>
  handleNewApplicationSubmit: () => void
  isSubmitting: boolean
  refreshApplicants: (showLoadingSparkles?: boolean) => Promise<void>
  applicationStep?: number
  setApplicationStep?: React.Dispatch<React.SetStateAction<number>>
}

export function L1RecentApplications({
  applications,
  openRemarksDialog,
  openChatDialog,
  openKycDocumentsDialog,
  newApplication,
  setNewApplication,
  handleNewApplicationSubmit,
  isSubmitting,
  refreshApplicants,
  applicationStep = 0,
  setApplicationStep,
}: L1RecentApplicationsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewApplicationOpen, setIsNewApplicationOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [newApplications, setNewApplications] = useState<string[]>([])
  const { toast } = useToast()
  const router = useRouter()
  const { tokens } = useAuth()

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12 // Show 12 entries per page

  // Filter and sort applications - newest first
  const filteredApplications = Object.entries(applications)
    .filter(([key, data]) => {
      // If data has full_name property, use it for filtering
      const nameToFilter = data.full_name || key
      return nameToFilter.toLowerCase().includes(searchTerm.toLowerCase())
    })
    .sort(([, a], [, b]) => {
      // Sort by creation date, newest first
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

  // Calculate pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
  const paginatedApplications = filteredApplications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Load new applications from localStorage on mount
  useEffect(() => {
    const storedNewApplications = localStorage.getItem("new_applications")
    if (storedNewApplications) {
      try {
        setNewApplications(JSON.parse(storedNewApplications))
      } catch (error) {
        console.error("Error parsing new applications from localStorage:", error)
        localStorage.removeItem("new_applications")
      }
    }
  }, [])

  // Check for newly submitted applicant on mount and after refresh
  useEffect(() => {
    const lastSubmittedApplicant = localStorage.getItem("last_submitted_applicant")
    if (lastSubmittedApplicant && applications[lastSubmittedApplicant]) {
      // Add this application to the new applications list if it's not already there
      setNewApplications((prev) => {
        if (!prev.includes(lastSubmittedApplicant)) {
          const updated = [...prev, lastSubmittedApplicant]
          localStorage.setItem("new_applications", JSON.stringify(updated))
          return updated
        }
        return prev
      })

      // Remove the last_submitted_applicant key as we've now tracked it
      localStorage.removeItem("last_submitted_applicant")
    }
  }, [applications])

  // Function to mark an application as viewed (no longer new)
  const markAsViewed = (key: string) => {
    setNewApplications((prev) => {
      const updated = prev.filter((app) => app !== key)
      localStorage.setItem("new_applications", JSON.stringify(updated))
      return updated
    })
  }

  // Check if an application is new (unviewed) - ensure it always returns a boolean
  const isNewApplication = (key: string): boolean => {
    const applicant = applications[key]
    return Boolean(newApplications.includes(key) || (applicant?.id && newApplications.includes(applicant.id)))
  }

  // Handle row click - mark as viewed and open details
  const handleRowClick = (key: string) => {
    markAsViewed(key)
    openKycDocumentsDialog(key)
  }

  // Create a wrapper function for setApplicationStep that always returns a function
  const handleSetApplicationStep = (step: number): void => {
    if (setApplicationStep) {
      setApplicationStep(step)
    }
  }

  const nextStep = () => {
    if (setApplicationStep) {
      setApplicationStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (setApplicationStep) {
      setApplicationStep((prev) => prev - 1)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Check for auth token before refreshing
      if (!tokens?.access_token) {
        toast({
          title: "Authentication required",
          description: "Please log in to refresh applicant data",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      await refreshApplicants(false) // Don't show loading sparkles for refresh
      toast({
        title: "Refresh complete",
        description: "The applicant list has been updated",
      })
    } catch (error) {
      console.error("Error refreshing:", error)
      toast({
        title: "Refresh failed",
        description: "Could not update the applicant list",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <L1ApplicationsTableHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isRefreshing={isRefreshing}
        handleRefresh={handleRefresh}
        setIsNewApplicationOpen={setIsNewApplicationOpen}
        setApplicationStep={handleSetApplicationStep}
      />

      <L1ApplicationsTable
        filteredApplications={paginatedApplications}
        isNewApplication={isNewApplication}
        handleRowClick={handleRowClick}
      />

      <L1ApplicationsTableFooter
        filteredApplications={filteredApplications}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
      />

      <NewApplicationDialog
        isOpen={isNewApplicationOpen}
        setIsOpen={setIsNewApplicationOpen}
        applicationStep={applicationStep}
        setApplicationStep={handleSetApplicationStep}
        newApplication={newApplication}
        setNewApplication={setNewApplication}
        handleNewApplicationSubmit={handleNewApplicationSubmit}
        nextStep={nextStep}
        prevStep={prevStep}
        refreshApplicants={refreshApplicants}
      />
    </div>
  )
}
