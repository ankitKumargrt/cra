"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { FinancialHealthIndicators } from "@/components/dashboard/FinancialHealthIndicators"
import { TransactionDialog } from "@/components/dashboard/TransactionDialog"
import { L1AgentPerformanceTracker } from "@/components/dashboard/L1AgentPerformanceTracker"
import { useTheme } from "next-themes"
import type { ApplicantData, NewApplicationState } from "@/types/applicant"
import type { Transaction } from "@/types/transaction"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { FileCheck, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ChatDialog } from "@/components/dashboard/ChatDialog"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { HomeLoanTable } from "@/components/dashboard/loan-tables/HomeLoanTable"
import { VehicleLoanTable } from "@/components/dashboard/loan-tables/VehicleLoanTable"
import { PersonalLoanTable } from "@/components/dashboard/loan-tables/PersonalLoanTable"
import { L2ApplicantDialog } from "./L2ApplicantDialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DTIResponse {
  message: string
  result: string
  dti?: number
}

interface AnalysisReadyResponse {
  applicant_id: string
  status: {
    form16_available: boolean
    spending_habits_available: boolean
    ready_for_dti_analysis: boolean
  }
  message: string
}

// Define loan type options
type LoanFilterType = "all" | "personal" | "home" | "vehicle"

export function L2Dashboard() {
  const [showFinancialHealth, setShowFinancialHealth] = useState(true)
  const [showAgentPerformance, setShowAgentPerformance] = useState(true)
  const { theme, setTheme } = useTheme()
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null)
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applications, setApplications] = useState<ApplicantData>({})
  const [highConfidenceTransactions, setHighConfidenceTransactions] = useState<Transaction[]>([])
  const [lowConfidenceTransactions, setLowConfidenceTransactions] = useState<Transaction[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [isCheckingAnalysisReady, setIsCheckingAnalysisReady] = useState(false)
  const [isCalculatingDTI, setIsCalculatingDTI] = useState(false)
  const [dtiCalculated, setDtiCalculated] = useState(false)
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false)
  const router = useRouter()
  const [chatDialogOpen, setChatDialogOpen] = useState(false)
  const [selectedApplicantForChat, setSelectedApplicantForChat] = useState<string | null>(null)
  const { user, tokens, logout } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [dtiAnalysisResult, setDtiAnalysisResult] = useState<string | null>(null)
  const [newApplicationIds, setNewApplicationIds] = useState<string[]>([])
  const previousApplicationsRef = useRef<ApplicantData>({})
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isApplicantDialogOpen, setIsApplicantDialogOpen] = useState(false)
  const [selectedBankerId, setSelectedBankerId] = useState<string | null>(null)
  // New state for loan type filter
  const [loanFilter, setLoanFilter] = useState<LoanFilterType>("all")

  // Initialize newApplication with empty values - ensure it matches NewApplicationState
  const [newApplication, setNewApplication] = useState<NewApplicationState>({
    full_name: "",
    father_name: "",
    pan_number: "",
    mobile: "",
    dob: "",
    loan_type: "",
    proposal_amount: "", // This can be string | number in the interface
    banker_id: user?.id || null,
    consent: false,
    documents: {
      pan: false,
      aadhar: false,
      bankStatement: false,
      form16: false,
      itr: false,
    },
    fileNames: {
      pan: "",
      aadhar: "",
      bankStatement: "",
      form16: "",
      itr: "",
    },
  })

  useEffect(() => {
    // Fetch applications when component mounts
    fetchApplications()

    // Set up auto-refresh interval (every 60 seconds)
    autoRefreshIntervalRef.current = setInterval(() => {
      console.log("Auto-refreshing applications data...")
      fetchApplications(true) // true indicates this is an auto-refresh
    }, 60000) // 60 seconds

    // Clean up interval on component unmount
    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current)
      }
    }
  }, [user, tokens])

  const fetchApplications = async (isAutoRefresh = false) => {
    if (!user?.id || !tokens?.access_token) {
      console.log("Missing user ID or access token")
      return
    }

    // Only show loading indicator for manual refreshes
    if (!isAutoRefresh) {
      setIsLoading(true)
    }

    try {
      const bankerId = user.id
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || ""

      console.log(`Fetching applications from: ${apiUrl}/api/applicants`)

      const response = await fetch(`${apiUrl}/api/applicants`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
        // Add cache busting parameter to prevent caching
        cache: "no-store",
      })

      if (response.status === 401) {
        toast({
          title: "Session expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        })
        logout()
        router.push("/login")
        return
      }

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        throw new Error(`Failed to fetch applicants: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched applications:", data)

      // Get existing application IDs before updating
      const existingIds = Object.values(previousApplicationsRef.current)
        .map((app) => app.id)
        .filter(Boolean) as string[]

      // Transform the data to match our application structure
      const transformedData: ApplicantData = {}
      const newIds: string[] = []

      data.forEach((item: any) => {
        // Use applicant_id as the key instead of full_name
        const uniqueKey = `${item.applicant_id}`
        transformedData[uniqueKey] = {
          // Keep all the existing properties
          dti: item.dti !== undefined ? item.dti : null,
          income: item.income || 0,
          debt: item.debt || 0,
          loanAmount: Number(item.proposal_amount) || 0,
          expenses: item.expenses || {
            housing: 0,
            transportation: 0,
            food: 0,
            entertainment: 0,
          },
          verified: item.kyc_status,
          dtiStatus: item.dti_status || false,
          kyc_status: item.kyc_status, // Add this line to include the raw kyc_status boolean
          personalDetails: {
            pan: item.pan_number || "",
            aadhar: item.aadhar_number || "",
            address: item.address || "",
            phone: item.mobile || "",
            email: item.email || "",
            occupation: item.occupation || "",
            employer: item.employer || "",
            fatherName: item.father_name || "",
            dob: item.dob || "",
          },
          kycStatus: item.kyc_status ? "Approved" : "Pending",
          applicationDate: item.application_date || item.created_at?.split("T")[0] || "N/A",
          loanType: item.loan_type || "Personal Loan",
          id: item.applicant_id,
          createdAt: item.created_at,
          status: item.status || "pending",
          approved_amount: item.approved_amount ? Number(item.approved_amount) : undefined,
          predicted_amount: item.predicted_amount || null,
          // Add full_name as a property
          full_name: item.full_name,
          // Add pan_number directly to the applicant object for easier access
          pan_number: item.pan_number,
          // Add loan_type directly to the applicant object for easier access
          loan_type: item.loan_type,
          // Add proposed_amount directly to the applicant object for easier access
          proposed_amount: item.proposal_amount,
          // Add bankerId
          bankerId: item.banker_id || user?.id,
        }

        const applicantId = item.applicant_id

        // Check if this is a new application by comparing with existing IDs
        if (isAutoRefresh && applicantId && !existingIds.includes(applicantId)) {
          newIds.push(applicantId)
          console.log(`New application detected: ${item.full_name} (${applicantId})`)
        }
      })

      // Save current applications for next comparison
      previousApplicationsRef.current = transformedData

      // Update the applications state
      setApplications(transformedData)

      // Update the list of new application IDs
      if (isAutoRefresh && newIds.length > 0) {
        setNewApplicationIds((prev) => [...prev, ...newIds])
        // No toast notifications for new applications - rely on green highlighting only
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
      if (!isAutoRefresh) {
        toast({
          title: "Error",
          description: "Failed to load applications. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      if (!isAutoRefresh) {
        setIsLoading(false)
      }
    }
  }

  const markApplicationAsViewed = (id: string) => {
    setNewApplicationIds((prev) => prev.filter((appId) => appId !== id))
  }

  const checkAnalysisReady = async (applicantId: string): Promise<boolean> => {
    if (!tokens?.access_token) {
      console.log("Missing access token")
      return false
    }

    setIsCheckingAnalysisReady(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || ""
      const endpoint = `${apiUrl}/api/${applicantId}/check_analysis_data`

      console.log(`Checking if analysis is ready: ${endpoint}`)

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })

      if (response.status === 401) {
        toast({
          title: "Session expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        })
        logout()
        router.push("/login")
        return false
      }

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        throw new Error(`Failed to check analysis status: ${response.status}`)
      }

      const data: AnalysisReadyResponse = await response.json()
      console.log("Analysis ready check response:", data)

      if (!data.status.ready_for_dti_analysis) {
        toast({
          title: "Analysis Not Ready",
          description: data.message || "Data is still being processed. Please try again later.",
          variant: "default",
        })
        return false
      }

      return true
    } catch (error) {
      console.error("Error checking analysis status:", error)
      toast({
        title: "Error",
        description: "Failed to check analysis status. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsCheckingAnalysisReady(false)
    }
  }

  const fetchApplicantTransactions = async (applicantId: string) => {
    if (!tokens?.access_token) {
      console.log("Missing access token")
      return false
    }

    setIsLoadingTransactions(true)
    try {
      const applicantData = applications[selectedApplicant as keyof typeof applications]
      if (!applicantData) {
        throw new Error("Applicant data not found")
      }

      // Use the banker_id from the applicant data
      const bankerId = applicantData.bankerId || user?.id

      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || ""

      console.log(`Fetching transactions from: ${apiUrl}/api/${bankerId}/applicant/${applicantId}`)

      const response = await fetch(`${apiUrl}/api/${bankerId}/applicant/${applicantId}`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })

      if (response.status === 401) {
        toast({
          title: "Session expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        })
        logout()
        router.push("/login")
        return false
      }

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        throw new Error(`Failed to fetch transactions: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched transactions:", data)

      if (data.bank_transactions) {
        // Transform high confidence transactions (score 5)
        const highConfidence = (data.bank_transactions.confidence_score_5 || []).map((tx: any, index: number) => ({
          id: index + 1,
          date: tx.date || new Date().toISOString().split("T")[0],
          description: tx.description || "Transaction",
          category: tx.category || "Uncategorized",
          amount: tx.amount || "0.00", // Keep as string
          confidenceScore: tx.confidence_score || 5,
          reason: tx.reason || "",
          selected: true, // Pre-selected by default
        }))

        // Transform low confidence transactions (score < 5)
        const lowConfidence = (data.bank_transactions.confidence_score_less_than_5 || []).map(
          (tx: any, index: number) => ({
            id: index + 1,
            date: tx.date || new Date().toISOString().split("T")[0],
            description: tx.description || "Transaction",
            category: tx.category || "Uncategorized",
            amount: tx.amount || "0.00", // Keep as string
            confidenceScore: tx.confidence_score || 3,
            reason: tx.reason || "",
            selected: false, // Not pre-selected
          }),
        )

        setHighConfidenceTransactions(highConfidence)
        setLowConfidenceTransactions(lowConfidence)
        return true
      } else {
        throw new Error("Invalid transaction data format")
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoadingTransactions(false)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const getApplicantData = (key: string) => {
    return applications[key] || null
  }

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
          loanAmount: Number.parseInt(String(newApplication.proposal_amount)) || 300000,
          expenses: {
            housing: 4000,
            transportation: 1100,
            food: 900,
            entertainment: 600,
          },
          verified: false,
          dtiStatus: false,
          personalDetails: {
            pan: newApplication.pan_number || "SRPRJ2468L",
            aadhar: "",
            address: "",
            phone: newApplication.mobile || "",
            email: "",
            occupation: "",
            employer: "",
            fatherName: newApplication.father_name || "",
            dob: newApplication.dob || "",
          },
          kycStatus: "Pending",
          applicationDate: new Date().toISOString().split("T")[0],
          loanType: newApplication.loan_type || "Personal Loan",
          id: newApplicantId,
          full_name: newApplication.full_name,
          pan_number: newApplication.pan_number,
          loan_type: newApplication.loan_type,
          proposed_amount: newApplication.proposal_amount,
          createdAt: new Date().toISOString(),
        },
      }

      setApplications(newApplicant)
      // Add the new applicant ID to the list of new application IDs
      setNewApplicationIds((prev) => [...prev, newApplicantId])
      setIsSubmitting(false)
      setNewApplication({
        full_name: "",
        father_name: "",
        pan_number: "",
        mobile: "",
        dob: "",
        loan_type: "",
        proposal_amount: "",
        banker_id: user?.id || null,
        consent: false,
        documents: {
          pan: false,
          aadhar: false,
          bankStatement: false,
          form16: false,
          itr: false,
        },
        fileNames: {
          pan: "",
          aadhar: "",
          bankStatement: "",
          form16: "",
          itr: "",
        },
      })
    }, 3000)
  }

  const handleHighConfidenceTransactionSelect = (id: number) => {
    setHighConfidenceTransactions(
      highConfidenceTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, selected: !transaction.selected } : transaction,
      ),
    )
  }

  const handleLowConfidenceTransactionSelect = (id: number) => {
    setLowConfidenceTransactions(
      lowConfidenceTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, selected: !transaction.selected } : transaction,
      ),
    )
  }

  const handleSelectAllHighConfidence = (checked: boolean) => {
    setHighConfidenceTransactions(
      highConfidenceTransactions.map((transaction) => ({
        ...transaction,
        selected: checked,
      })),
    )
  }

  const handleSelectAllLowConfidence = (checked: boolean) => {
    setLowConfidenceTransactions(
      lowConfidenceTransactions.map((transaction) => ({
        ...transaction,
        selected: checked,
      })),
    )
  }

  const calculateDTI = async () => {
    if (!selectedApplicantId || !tokens?.access_token) {
      toast({
        title: "Error",
        description: "Missing applicant ID or access token",
        variant: "destructive",
      })
      return
    }

    setIsCalculatingDTI(true)
    try {
      // Collect all selected transactions
      const selectedHighConfidenceTransactions = highConfidenceTransactions.filter((tx) => tx.selected)
      const selectedLowConfidenceTransactions = lowConfidenceTransactions.filter((tx) => tx.selected)
      const allSelectedTransactions = [...selectedHighConfidenceTransactions, ...selectedLowConfidenceTransactions]

      // Format transactions for API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || ""

      // Include applicant_id as a query parameter in the URL
      const endpoint = `${apiUrl}/api/analysis/${selectedApplicantId}/dti?applicant_id=${selectedApplicantId}`

      console.log(`Sending DTI calculation request to: ${endpoint}`)

      // Format transactions for API - ensure it's an array
      const formattedTransactions = allSelectedTransactions.map((tx) => ({
        date: tx.date,
        description: tx.description,
        category: tx.category,
        amount: tx.amount,
        confidence_score: tx.confidenceScore,
        reason: tx.reason,
        selected: true,
      }))

      console.log("Sending transactions:", formattedTransactions)

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access_token}`,
        },
        // Send the formatted transactions as an array
        body: JSON.stringify(formattedTransactions),
      })

      if (!response.ok) {
        throw new Error(`DTI calculation failed: ${response.status} ${response.statusText}`)
      }

      const data: DTIResponse = await response.json()
      console.log("DTI calculation response:", data)

      // Extract the markdown content from the result field
      if (data.result) {
        // If the result starts with markdown code fence, extract just the content
        const markdownContent = data.result.replace(/^```markdown\n/, "").replace(/```$/, "")
        console.log("Extracted markdown content:", markdownContent)
        setDtiAnalysisResult(markdownContent)
      } else {
        setDtiAnalysisResult(null)
      }

      // Update the applicant's DTI
      if (selectedApplicant && data.dti !== undefined) {
        const updatedApplications = {
          ...applications,
          [selectedApplicant]: {
            ...applications[selectedApplicant],
            dti: data.dti,
            verified: true,
            dtiStatus: true,
          },
        }
        setApplications(updatedApplications)
      }

      // Set DTI as calculated
      setDtiCalculated(true)

      toast({
        title: "Success",
        description: data.message || "DTI analysis completed successfully",
      })

      // Add a slight delay before refreshing to ensure the toast is visible
      setTimeout(() => {
        fetchApplications()
        // Keep the dialog open and let the data refresh in the background
      }, 1500)
    } catch (error) {
      console.error("Error calculating DTI:", error)
      toast({
        title: "Error",
        description: "Failed to calculate DTI. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCalculatingDTI(false)
    }
  }

  // Update the openTransactionDialog function to check if analysis is ready first
  const openTransactionDialog = async (key: string) => {
    setSelectedApplicant(key)
    const applicantData = applications[key]

    if (!applicantData) {
      toast({
        title: "Error",
        description: "Applicant data not found",
        variant: "destructive",
      })
      return
    }

    // Make sure applicantId is not undefined
    const applicantId = applicantData.id
    if (!applicantId) {
      toast({
        title: "Error",
        description: "Applicant ID not found",
        variant: "destructive",
      })
      return
    }

    // Mark the application as viewed when opening the dialog
    markApplicationAsViewed(applicantId)

    setSelectedApplicantId(applicantId ? String(applicantId) : null)

    // If DTI is already calculated, show transaction dialog with calculated data
    if (applicantData.dtiStatus) {
      const success = await fetchApplicantTransactions(applicantId)
      if (success) {
        setTransactionDialogOpen(true)
        setDtiCalculated(true)
      }
      return
    }

    // First check if analysis is ready
    const isAnalysisReady = await checkAnalysisReady(applicantId)

    if (isAnalysisReady) {
      // If analysis is ready, fetch transactions and show dialog
      const success = await fetchApplicantTransactions(applicantId)
      if (success) {
        setTransactionDialogOpen(true)
        setDtiCalculated(false)
      }
    }
    // If analysis is not ready, the checkAnalysisReady function will show a toast with the message
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const openChatDialog = (key: string) => {
    // Mark the application as viewed when opening the chat dialog
    const applicantData = applications[key]
    if (applicantData?.id) {
      markApplicationAsViewed(applicantData.id)
    }

    setSelectedApplicantForChat(key)
    setChatDialogOpen(true)
  }

  const openApplicantDetails = (key: string) => {
    const applicantData = applications[key]
    if (applicantData) {
      // Mark as viewed when opening details
      if (applicantData.id) {
        markApplicationAsViewed(applicantData.id)
      }

      setSelectedApplicant(key)
      setSelectedApplicantId(applicantData.id ? String(applicantData.id) : null)
      setSelectedBankerId(applicantData.bankerId ? String(applicantData.bankerId) : null)
      setTransactionDialogOpen(false)
      setIsApplicantDialogOpen(true)
    }
  }

  // Handle loan filter change
  const handleLoanFilterChange = (value: string) => {
    setLoanFilter(value as LoanFilterType)
  }

  // Render the appropriate loan table based on filter
  const renderLoanTable = () => {
    switch (loanFilter) {
      case "personal":
        return (
          <AnimatedContainer>
            <PersonalLoanTable
              applications={applications}
              openTransactionDialog={openTransactionDialog}
              openApplicantDetails={openApplicantDetails}
              isLoading={isLoading || isCheckingAnalysisReady}
              newApplicationIds={newApplicationIds}
              markApplicationAsViewed={markApplicationAsViewed}
              refreshApplicants={() => fetchApplications(false)}
            />
          </AnimatedContainer>
        )
      case "home":
        return (
          <AnimatedContainer>
            <HomeLoanTable
              applications={applications}
              openTransactionDialog={openTransactionDialog}
              openApplicantDetails={openApplicantDetails}
              isLoading={isLoading || isCheckingAnalysisReady}
              newApplicationIds={newApplicationIds}
              markApplicationAsViewed={markApplicationAsViewed}
              refreshApplicants={() => fetchApplications(false)}
            />
          </AnimatedContainer>
        )
      case "vehicle":
        return (
          <AnimatedContainer>
            <VehicleLoanTable
              applications={applications}
              openTransactionDialog={openTransactionDialog}
              openApplicantDetails={openApplicantDetails}
              isLoading={isLoading || isCheckingAnalysisReady}
              newApplicationIds={newApplicationIds}
              markApplicationAsViewed={markApplicationAsViewed}
              refreshApplicants={() => fetchApplications(false)}
            />
          </AnimatedContainer>
        )
      case "all":
      default:
        return (
          <>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <AnimatedContainer>
                <PersonalLoanTable
                  applications={applications}
                  openTransactionDialog={openTransactionDialog}
                  openApplicantDetails={openApplicantDetails}
                  isLoading={isLoading || isCheckingAnalysisReady}
                  newApplicationIds={newApplicationIds}
                  markApplicationAsViewed={markApplicationAsViewed}
                  refreshApplicants={() => fetchApplications(false)}
                />
              </AnimatedContainer>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
              <AnimatedContainer>
                <HomeLoanTable
                  applications={applications}
                  openTransactionDialog={openTransactionDialog}
                  openApplicantDetails={openApplicantDetails}
                  isLoading={isLoading || isCheckingAnalysisReady}
                  newApplicationIds={newApplicationIds}
                  markApplicationAsViewed={markApplicationAsViewed}
                  refreshApplicants={() => fetchApplications(false)}
                />
              </AnimatedContainer>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
              <AnimatedContainer>
                <VehicleLoanTable
                  applications={applications}
                  openTransactionDialog={openTransactionDialog}
                  openApplicantDetails={openApplicantDetails}
                  isLoading={isLoading || isCheckingAnalysisReady}
                  newApplicationIds={newApplicationIds}
                  markApplicationAsViewed={markApplicationAsViewed}
                  refreshApplicants={() => fetchApplications(false)}
                />
              </AnimatedContainer>
            </div>
          </>
        )
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <FileCheck className="h-6 w-6" />
            <span>FinSight - L2 Dashboard</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-6">
          {/* Financial Health Indicators - Full Width */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            {showFinancialHealth && (
              <AnimatedContainer>
                <FinancialHealthIndicators />
              </AnimatedContainer>
            )}
          </div>

          {/* Recent Applications Heading and Filter */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Recent Applications</h2>
            <div className="flex items-center gap-2">
              <Select value={loanFilter} onValueChange={handleLoanFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Loans</SelectItem>
                  <SelectItem value="personal">Personal Loan</SelectItem>
                  <SelectItem value="home">Home Loan</SelectItem>
                  <SelectItem value="vehicle">Loan Against Vehicle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loan Tables - Conditionally rendered based on filter */}
          {renderLoanTable()}

          {/* Agent Performance Tracker - Full Width */}
          <div className="grid grid-cols-1 gap-6">
            {showAgentPerformance && (
              <AnimatedContainer>
                <L1AgentPerformanceTracker />
              </AnimatedContainer>
            )}
          </div>
        </div>

        {/* Applicant Details Dialog */}
        <L2ApplicantDialog
          open={isApplicantDialogOpen}
          setOpen={setIsApplicantDialogOpen}
          applicantId={selectedApplicantId}
          bankerId={selectedBankerId}
        />

        {/* Transaction Verification Dialog */}
        <TransactionDialog
          open={transactionDialogOpen}
          setOpen={setTransactionDialogOpen}
          selectedApplicant={selectedApplicant}
          applications={applications}
          highConfidenceTransactions={highConfidenceTransactions}
          lowConfidenceTransactions={lowConfidenceTransactions}
          handleHighConfidenceTransactionSelect={handleHighConfidenceTransactionSelect}
          handleLowConfidenceTransactionSelect={handleLowConfidenceTransactionSelect}
          handleSelectAllHighConfidence={handleSelectAllHighConfidence}
          handleSelectAllLowConfidence={handleSelectAllLowConfidence}
          isCalculatingDTI={isCalculatingDTI}
          dtiCalculated={dtiCalculated}
          calculateDTI={calculateDTI}
          getApplicantData={getApplicantData}
          isLoadingTransactions={isLoadingTransactions}
          dtiAnalysisResult={dtiAnalysisResult}
        />

        {/* Chat Dialog */}
        <ChatDialog open={chatDialogOpen} setOpen={setChatDialogOpen} applicantName={selectedApplicantForChat} />
      </div>
    </ThemeProvider>
  )
}

export default L2Dashboard
