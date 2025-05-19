"use client"

import { useState, useEffect } from "react"
import { RemarksDialog } from "./RemarksDialog"
import { ChatDialog } from "./ChatDialog"
import { KYCDocumentsDialog } from "./KYCDocumentsDialog"
import { LoadingSparkles } from "@/components/ui/loading-sparkles"
import type { ApplicantData, NewApplicationState, ApplicantDetails } from "@/types/applicant"
import { L1DashboardHeader } from "./l1-components/L1DashboardHeader"
import { L1DashboardContent } from "./l1-components/L1DashboardContent"
import { ThemeProvider } from "@/components/theme-provider"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"

// Sample applicant data as fallback - empty object instead of mock data
const mockApplicantData: ApplicantData = {}

export default function L1Dashboard() {
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null)
  const [selectedApplicantDetails, setSelectedApplicantDetails] = useState<ApplicantDetails | null>(null)
  const [isNewApplicationOpen, setIsNewApplicationOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [remarksDialogOpen, setRemarksDialogOpen] = useState(false)
  const [chatDialogOpen, setChatDialogOpen] = useState(false)
  const [kycDocumentsDialogOpen, setKycDocumentsDialogOpen] = useState(false)
  const [isFetchingApplicantDetails, setIsFetchingApplicantDetails] = useState(false)
  const [newApplication, setNewApplication] = useState<NewApplicationState>({
    full_name: "",
    father_name: "",
    pan_number: "",
    mobile: "",
    dob: "",
    loan_type: "",
    proposal_amount: "",
    banker_id: null,
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
    address: "",
    email: "",
    occupation: "",
    employer: "",
  })
  const [applications, setApplications] = useState<ApplicantData>(mockApplicantData)
  const [notifications, setNotifications] = useState(3)
  const [applicationStep, setApplicationStep] = useState(0)
  const [isNewApplicationDialogOpen, setIsNewApplicationDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Get auth context
  const { user, tokens, logout } = useAuth()

  // Get banker_id from auth context
  const bankerId = user?.id || 1

  const fetchApplicants = async (showLoadingSparkles = true) => {
    // Only show loading sparkles if explicitly requested (initial load)
    if (showLoadingSparkles) {
      setIsLoading(true)
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || ""

      if (!tokens?.access_token) {
        console.warn("No auth token found, user might need to log in again")
        toast({
          title: "Authentication required",
          description: "Please log in to view applicant data",
          variant: "destructive",
        })
        logout()
        return
      }

      console.log(`Fetching applicants for banker ID: ${bankerId}`)
      const response = await fetch(`${apiUrl}/api/${bankerId}/applicants`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 401) {
        // Handle unauthorized - token expired or invalid
        toast({
          title: "Session expired",
          description: "Please log in again to continue",
          variant: "destructive",
        })
        logout()
        return
      }

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        const errorText = await response.text()
        console.error("Error details:", errorText)
        throw new Error(`Failed to fetch applicants: ${response.status}`)
      }

      const data = await response.json()
      console.log(`Fetched ${data.length} applicants`)

      // Transform the API response to match the applications format
      const updatedApplications: ApplicantData = {}

      data.forEach((item: any) => {
        // Use applicant_id as the key instead of full_name
        const uniqueKey = `${item.applicant_id}`
        updatedApplications[uniqueKey] = {
          dti: null,
          income: 0,
          debt: 0,
          loanAmount: item.proposal_amount,
          expenses: {
            housing: 0,
            transportation: 0,
            food: 0,
            entertainment: 0,
          },
          verified: item.kyc_status,
          personalDetails: {
            pan: item.pan_number,
            aadhar: "",
            address: "",
            phone: item.mobile,
            email: "",
            occupation: "",
            employer: "",
            fatherName: item.father_name,
            dob: item.dob,
          },
          kycStatus: item.kyc_status ? "Approved" : "Pending",
          remarks: "",
          applicationDate: new Date(item.application_date).toLocaleDateString(),
          loanType: item.loan_type,
          id: item.applicant_id,
          createdAt: item.created_at,
          // Add full_name as a property
          full_name: item.full_name,
          // Add pan_number directly to the applicant object for easier access
          pan_number: item.pan_number,
          // Add loan_type directly to the applicant object for easier access
          loan_type: item.loan_type,
          // Add proposed_amount directly to the applicant object for easier access
          proposed_amount: item.proposal_amount,
        }
      })

      if (Object.keys(updatedApplications).length > 0) {
        setApplications(updatedApplications)
      }

      toast({
        title: "Applicants loaded",
        description: `Successfully fetched ${data.length} applicants`,
      })
    } catch (error) {
      console.error("Error fetching applicants:", error)
      toast({
        title: "Error loading applicants",
        description: "Failed to fetch applicant data. Using sample data instead.",
        variant: "destructive",
      })
      // Keep using mock data if the API call fails
    } finally {
      if (showLoadingSparkles) {
        setIsLoading(false)
      }
    }
  }

  // New function to fetch applicant details by ID
  const fetchApplicantDetails = async (applicantKey: string, applicantId: string | number | undefined) => {
    if (!applicantId) {
      console.error("No applicant ID provided")
      toast({
        title: "Error",
        description: "Could not fetch applicant details: Missing ID",
        variant: "destructive",
      })
      return
    }

    setIsFetchingApplicantDetails(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || ""

      if (!tokens?.access_token) {
        console.warn("No auth token found, user might need to log in again")
        toast({
          title: "Authentication required",
          description: "Please log in to view applicant details",
          variant: "destructive",
        })
        logout()
        return
      }

      console.log(`Fetching details for applicant ID: ${applicantId}`)
      const response = await fetch(`${apiUrl}/api/${bankerId}/applicant/${applicantId}`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 401) {
        toast({
          title: "Session expired",
          description: "Please log in again to continue",
          variant: "destructive",
        })
        logout()
        return
      }

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        const errorText = await response.text()
        console.error("Error details:", errorText)
        throw new Error(`Failed to fetch applicant details: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched applicant details:", data)

      // Store the fetched details
      setSelectedApplicantDetails(data)

      // Open the KYC Documents dialog with the fetched details
      setSelectedApplicant(applicantKey)
      setKycDocumentsDialogOpen(true)
    } catch (error) {
      console.error("Error fetching applicant details:", error)
      toast({
        title: "Error loading details",
        description: "Failed to fetch applicant details. Using existing data instead.",
        variant: "destructive",
      })

      // Fall back to existing data if available
      if (applications[applicantKey]) {
        setSelectedApplicantDetails(applications[applicantKey])
        setSelectedApplicant(applicantKey)
        setKycDocumentsDialogOpen(true)
      }
    } finally {
      setIsFetchingApplicantDetails(false)
    }
  }

  useEffect(() => {
    // Only fetch applicants if we have a user and tokens
    if (user && tokens) {
      fetchApplicants(true) // Show loading sparkles on initial load
    } else {
      setIsLoading(false)
    }
  }, [user, tokens]) // Re-fetch when user or tokens change

  const handleNewApplicationSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      // Generate a unique ID for the new applicant
      const newApplicantId = `new-${Date.now()}`

      const newApplicant = {
        ...applications,
        [newApplicantId]: {
          dti: null,
          income: 16500,
          debt: 5445,
          loanAmount: Number.parseInt(newApplication.proposal_amount as string) || 300000,
          expenses: {
            housing: 4000,
            transportation: 1100,
            food: 900,
            entertainment: 600,
          },
          verified: false,
          personalDetails: {
            pan: newApplication.pan_number || "SRPRJ2468L",
            aadhar: "6789 0123 4567",
            address: newApplication.address || "112 Koramangala, Bangalore, Karnataka - 560034",
            phone: newApplication.mobile || "+91 98123 45678",
            email: newApplication.email || `${newApplication.full_name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
            occupation: newApplication.occupation || "Business Owner",
            employer: newApplication.employer || "Self-employed",
            fatherName: newApplication.father_name,
            dob: newApplication.dob,
          },
          kycStatus: "Pending",
          remarks: "",
          applicationDate: new Date().toLocaleDateString(),
          loanType: newApplication.loan_type || "Personal Loan",
          proposalAmount:
            typeof newApplication.proposal_amount === "number"
              ? newApplication.proposal_amount
              : Number.parseInt(newApplication.proposal_amount as string) || 300000,
          consentGiven: newApplication.consent,
          createdAt: new Date().toISOString(), // Add current timestamp for sorting
          id: newApplicantId,
          full_name: newApplication.full_name,
          pan_number: newApplication.pan_number,
          loan_type: newApplication.loan_type,
          proposed_amount: newApplication.proposal_amount,
        },
      }

      setApplications(newApplicant)
      // Add the new applicant ID to the list of new applications
      const storedNewApplications = localStorage.getItem("new_applications")
      let newApps = []
      if (storedNewApplications) {
        try {
          newApps = JSON.parse(storedNewApplications)
        } catch (error) {
          console.error("Error parsing new applications from localStorage:", error)
        }
      }
      newApps.push(newApplicantId)
      localStorage.setItem("new_applications", JSON.stringify(newApps))
      localStorage.setItem("last_submitted_applicant", newApplicantId)
      setIsSubmitting(false)
      setIsNewApplicationOpen(false)
      setNewApplication({
        full_name: "",
        father_name: "",
        pan_number: "",
        mobile: "",
        dob: "",
        loan_type: "",
        proposal_amount: "",
        banker_id: null,
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
        address: "",
        email: "",
        occupation: "",
        employer: "",
      })
    }, 3000)
  }

  const openRemarksDialog = (key: string) => {
    setSelectedApplicant(key)
    setRemarksDialogOpen(true)
  }

  const openChatDialog = (key: string) => {
    setSelectedApplicant(key)
    setChatDialogOpen(true)
  }

  const openKycDocumentsDialog = (key: string) => {
    const applicant = applications[key]
    if (applicant && applicant.id) {
      // Fetch detailed applicant data from API
      fetchApplicantDetails(key, applicant.id)
    } else {
      // Fall back to existing data if no ID is available
      setSelectedApplicant(key)
      setSelectedApplicantDetails(applicant)
      setKycDocumentsDialogOpen(true)
    }
  }

  const updateDocuments = (applicantKey: string, documentType: string, file: File) => {
    // In a real application, this would upload the file to a server
    // For now, we'll just log the action
    console.log(`Updating ${documentType} for ${applicantKey} with file: ${file.name}`)

    // You could update the application state here if needed
    // For example, updating a documents field in the applicant data
  }

  const handleLogout = () => {
    logout()
  }

  // Find the openNewApplicationDialog function and update it to set the step to 0
  const openNewApplicationDialog = () => {
    setApplicationStep(0)
    setIsNewApplicationDialogOpen(true)
  }

  const nextStep = () => {
    setApplicationStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setApplicationStep((prev) => prev - 1)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <L1DashboardHeader notifications={notifications} handleLogout={handleLogout} />

        {/* Dashboard Content */}
        <L1DashboardContent
          isLoading={isLoading}
          applications={applications}
          openRemarksDialog={openRemarksDialog}
          openChatDialog={openChatDialog}
          openKycDocumentsDialog={openKycDocumentsDialog}
          newApplication={newApplication}
          setNewApplication={setNewApplication}
          handleNewApplicationSubmit={handleNewApplicationSubmit}
          isSubmitting={isSubmitting}
          refreshApplicants={fetchApplicants}
          applicationStep={applicationStep}
          setApplicationStep={setApplicationStep}
        />

        {/* Remarks Dialog */}
        <RemarksDialog
          open={remarksDialogOpen}
          setOpen={setRemarksDialogOpen}
          selectedApplicant={selectedApplicant}
          applications={applications}
          setApplications={setApplications}
        />

        {/* Chat Dialog */}
        <ChatDialog open={chatDialogOpen} setOpen={setChatDialogOpen} applicantName={selectedApplicant} />

        {/* KYC Documents Dialog */}
        <KYCDocumentsDialog
          open={kycDocumentsDialogOpen}
          setOpen={setKycDocumentsDialogOpen}
          selectedApplicant={selectedApplicant}
          applications={applications}
          updateDocuments={updateDocuments}
          applicantDetails={selectedApplicantDetails}
        />

        {/* Loading Sparkles Overlay */}
        {(isSubmitting || isFetchingApplicantDetails) && <LoadingSparkles />}
      </div>
    </ThemeProvider>
  )
}
