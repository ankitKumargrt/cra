"use client"

import { useState } from "react"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { FinancialHealthIndicators } from "@/components/dashboard/FinancialHealthIndicators"
import { RecentApplications } from "@/components/dashboard/RecentApplications"
import { TransactionDialog } from "@/components/dashboard/TransactionDialog"
import { AiRecommendationDialog } from "@/components/dashboard/AiRecommendationDialog"
import { MarketInsights } from "@/components/dashboard/MarketInsights"
import { LoadingSparkles } from "@/components/ui/loading-sparkles"
import { useTheme } from "next-themes"
import type { ApplicantData } from "@/types/applicant"
import type { Transaction } from "@/types/transaction"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/ui/theme-toggle"

// Update the applicant data in the main dashboard with Indian names
const applicantData: ApplicantData = {
  "Rajesh Sharma": {
    dti: 35,
    income: 15000,
    debt: 5250,
    loanAmount: 250000,
    expenses: {
      housing: 3500,
      transportation: 1200,
      food: 800,
      entertainment: 500,
    },
    verified: true,
    personalDetails: {
      pan: "ABCPS1234G",
      aadhar: "1234 5678 9012",
      address: "42 Park Avenue, Bangalore, Karnataka - 560001",
      phone: "+91 98765 43210",
      email: "rajesh.sharma@example.com",
      occupation: "Software Engineer",
      employer: "TechSolutions Inc.",
    },
  },
  "Priya Patel": {
    dti: 32,
    income: 18000,
    debt: 5760,
    loanAmount: 400000,
    expenses: {
      housing: 4200,
      transportation: 1500,
      food: 1000,
      entertainment: 800,
    },
    verified: true,
    personalDetails: {
      pan: "BYCPP5678H",
      aadhar: "2345 6789 0123",
      address: "15 Marine Drive, Mumbai, Maharashtra - 400001",
      phone: "+91 87654 32109",
      email: "priya.patel@example.com",
      occupation: "Marketing Manager",
      employer: "Global Brands Ltd.",
    },
  },
  "Vikram Singh": {
    dti: 46,
    income: 9000,
    debt: 4140,
    loanAmount: 50000,
    expenses: {
      housing: 2800,
      transportation: 900,
      food: 700,
      entertainment: 400,
    },
    verified: true,
    personalDetails: {
      pan: "SINVK9012I",
      aadhar: "3456 7890 1234",
      address: "78 MG Road, Delhi - 110001",
      phone: "+91 76543 21098",
      email: "vikram.singh@example.com",
      occupation: "Sales Representative",
      employer: "Retail Solutions",
    },
  },
  "Ananya Desai": {
    dti: 28,
    income: 12000,
    debt: 3360,
    loanAmount: 30000,
    expenses: {
      housing: 3000,
      transportation: 800,
      food: 600,
      entertainment: 450,
    },
    verified: true,
    personalDetails: {
      pan: "DESAN4567Q",
      aadhar: "4567 8901 2345",
      address: "23 Church Street, Chennai, Tamil Nadu - 600001",
      phone: "+91 65432 10987",
      email: "ananya.desai@example.com",
      occupation: "HR Manager",
      employer: "Corporate Services",
    },
  },
  "Arjun Mehta": {
    dti: 38,
    income: 22000,
    debt: 8360,
    loanAmount: 750000,
    expenses: {
      housing: 5500,
      transportation: 1800,
      food: 1200,
      entertainment: 900,
    },
    verified: true,
    personalDetails: {
      pan: "MEHAR7890S",
      aadhar: "5678 9012 3456",
      address: "56 Brigade Road, Hyderabad, Telangana - 500001",
      phone: "+91 54321 09876",
      email: "arjun.mehta@example.com",
      occupation: "Financial Analyst",
      employer: "Investment Partners",
    },
  },
}

export default function Dashboard() {
  const [showFinancialHealth, setShowFinancialHealth] = useState(true)
  const [showRecentApplications, setShowRecentApplications] = useState(true)
  const [showMarketInsights, setShowMarketInsights] = useState(true)
  const { theme, setTheme } = useTheme()
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null)
  const [isNewApplicationOpen, setIsNewApplicationOpen] = useState(false)
  const [applicationStep, setApplicationStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newApplication, setNewApplication] = useState({
    panNumber: "",
    loanType: "",
    loanAmount: "",
    documents: {
      pan: false,
      aadhar: false,
      bankStatement: false,
      form16: false,
      itr: false,
    },
    fileNames: {
      bankStatement: "",
      form16: "",
      itr: "",
    },
  })
  const [applications, setApplications] = useState(applicantData)

  // Define the dummy data before using it in useState
  const initialVerifiedTransactions: Transaction[] = [
    {
      id: 1,
      date: "26/02/2025",
      description: "AT&T - Entertainment",
      category: "Entertainment",
      amount: -467.73,
      confidenceScore: 5,
      selected: true,
    },
    {
      id: 2,
      date: "12/01/2025",
      description: "CVS - Education",
      category: "Education",
      amount: -255.06,
      confidenceScore: 5,
      selected: true,
    },
    {
      id: 3,
      date: "05/02/2025",
      description: "Spotify - Education",
      category: "Education",
      amount: -400.19,
      confidenceScore: 5,
      selected: true,
    },
    {
      id: 4,
      date: "13/01/2025",
      description: "CVS - Dining",
      category: "Dining",
      amount: -290.23,
      confidenceScore: 5,
      selected: true,
    },
    {
      id: 5,
      date: "16/01/2025",
      description: "Walgreens - Dining",
      category: "Dining",
      amount: -495.57,
      confidenceScore: 5,
      selected: true,
    },
    {
      id: 6,
      date: "23/03/2025",
      description: "T-Mobile - Education",
      category: "Education",
      amount: -101.34,
      confidenceScore: 5,
      selected: true,
    },
    {
      id: 7,
      date: "20/03/2025",
      description: "Amazon - Dining",
      category: "Dining",
      amount: -159.28,
      confidenceScore: 5,
      selected: true,
    },
  ]

  const initialUnverifiedTransactions: Transaction[] = [
    {
      id: 1,
      date: "15/03/2025",
      description: "Student Loan - HDFC Bank",
      category: "Education Loan",
      totalAmount: 20377.08,
      monthlyEMI: 1698.09,
      amount: -1698.09,
      confidenceScore: 4,
      selected: false,
    },
    {
      id: 2,
      date: "10/03/2025",
      description: "Credit Card Payment - Yes Bank",
      category: "Credit Card",
      totalAmount: 12129.93,
      monthlyEMI: 1010.83,
      amount: -1010.83,
      confidenceScore: 3,
      selected: false,
    },
    {
      id: 3,
      date: "05/03/2025",
      description: "Auto Loan - Kotak Mahindra",
      category: "Auto Loan",
      totalAmount: 11827.96,
      monthlyEMI: 985.66,
      amount: -985.66,
      confidenceScore: 4,
      selected: false,
    },
    {
      id: 4,
      date: "01/03/2025",
      description: "Auto Loan - SBI",
      category: "Auto Loan",
      totalAmount: 20225.17,
      monthlyEMI: 1685.43,
      amount: -1685.43,
      confidenceScore: 3,
      selected: false,
    },
    {
      id: 5,
      date: "28/02/2025",
      description: "Unknown Bank Transfer - Axis Bank",
      category: "Bank Transfer",
      totalAmount: 7773.17,
      monthlyEMI: 647.76,
      amount: -647.76,
      confidenceScore: 2,
      selected: true,
    },
    {
      id: 6,
      date: "25/02/2025",
      description: "Credit Card Payment - Kotak Mahindra",
      category: "Credit Card",
      totalAmount: 19436.01,
      monthlyEMI: 1619.67,
      amount: -1619.67,
      confidenceScore: 4,
      selected: true,
    },
    {
      id: 7,
      date: "20/02/2025",
      description: "Unknown Bank Transfer - HDFC Bank",
      category: "Bank Transfer",
      totalAmount: 12029.89,
      monthlyEMI: 1002.49,
      amount: -1002.49,
      confidenceScore: 2,
      selected: false,
    },
    {
      id: 8,
      date: "15/02/2025",
      description: "Mortgage Payment - RBL Bank",
      category: "Home Loan",
      totalAmount: 8080.39,
      monthlyEMI: 673.37,
      amount: -673.37,
      confidenceScore: 3,
      selected: false,
    },
  ]

  // Now use the initial data in useState
  const [selectedTransactions, setSelectedTransactions] = useState(initialUnverifiedTransactions)
  const [verifiedTransactions, setVerifiedTransactions] = useState(initialVerifiedTransactions)
  const [isCalculatingDTI, setIsCalculatingDTI] = useState(false)
  const [dtiCalculated, setDtiCalculated] = useState(false)
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false)
  const [showAiRecommendationDialog, setShowAiRecommendationDialog] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const getApplicantData = (name: string) => {
    return applications[name as keyof typeof applications] || null
  }

  // Update the handleNewApplicationSubmit function to include personal details
  const handleNewApplicationSubmit = () => {
    // Show loading animation
    setIsSubmitting(true)

    // Simulate API call delay
    setTimeout(() => {
      // Add new dummy applicant to the list
      const newApplicant = {
        ...applications,
        "Sunil Agarwal": {
          dti: null,
          income: 16500,
          debt: 5445,
          loanAmount: Number.parseInt(newApplication.loanAmount) || 300000,
          expenses: {
            housing: 4000,
            transportation: 1100,
            food: 900,
            entertainment: 600,
          },
          verified: false,
          personalDetails: {
            pan: newApplication.panNumber || "SRPRJ2468L",
            aadhar: "6789 0123 4567",
            address: "112 Koramangala, Bangalore, Karnataka - 560034",
            phone: "+91 98123 45678",
            email: "sunil.agarwal@example.com",
            occupation: "Business Owner",
            employer: "Self-employed",
          },
        },
      }

      setApplications(newApplicant)
      setIsSubmitting(false)
      setIsNewApplicationOpen(false)
      setApplicationStep(1)
      setNewApplication({
        panNumber: "",
        loanType: "",
        loanAmount: "",
        documents: {
          pan: false,
          aadhar: false,
          bankStatement: false,
          form16: false,
          itr: false,
        },
        fileNames: {
          bankStatement: "",
          form16: "",
          itr: "",
        },
      })
    }, 3000)
  }

  const handleTransactionSelect = (id: number) => {
    setSelectedTransactions(
      selectedTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, selected: !transaction.selected } : transaction,
      ),
    )
  }

  const handleVerifiedTransactionSelect = (id: number) => {
    setVerifiedTransactions(
      verifiedTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, selected: !transaction.selected } : transaction,
      ),
    )
  }

  // Update the calculateDTI function to close the dialog after calculation
  const calculateDTI = () => {
    setIsCalculatingDTI(true)

    // Simulate API call delay
    setTimeout(() => {
      if (selectedApplicant === "Sunil Agarwal") {
        const updatedApplications = {
          ...applications,
          "Sunil Agarwal": {
            ...applications["Sunil Agarwal"],
            dti: 33,
            verified: true,
          },
        }
        setApplications(updatedApplications)
      }
      setIsCalculatingDTI(false)
      setDtiCalculated(true)
      // Close the transaction dialog after DTI calculation
      setTransactionDialogOpen(false)
    }, 2000)
  }

  // Update the openTransactionDialog function to open AI recommendation directly if DTI is already calculated
  const openTransactionDialog = (name: string) => {
    setSelectedApplicant(name)

    // Check if DTI is already calculated for this applicant
    const isVerified = applications[name as keyof typeof applications]?.verified || false

    if (isVerified) {
      // If verified, open the AI recommendation dialog directly
      setShowAiRecommendationDialog(true)
    } else {
      // Otherwise, open the transaction dialog
      setTransactionDialogOpen(true)
    }

    setDtiCalculated(isVerified)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {showFinancialHealth && (
            <AnimatedContainer className="lg:col-span-1">
              <FinancialHealthIndicators onClose={() => setShowFinancialHealth(false)} />
            </AnimatedContainer>
          )}

          {showRecentApplications && (
            <AnimatedContainer className="lg:col-span-2">
              <RecentApplications
                applications={applications}
                openTransactionDialog={openTransactionDialog}
                newApplication={newApplication}
                setNewApplication={setNewApplication}
                handleNewApplicationSubmit={handleNewApplicationSubmit}
                isSubmitting={isSubmitting}
                onClose={() => setShowRecentApplications(false)}
              />
            </AnimatedContainer>
          )}

          {showMarketInsights && (
            <AnimatedContainer className="lg:col-span-3">
              <MarketInsights onClose={() => setShowMarketInsights(false)} />
            </AnimatedContainer>
          )}
        </div>

        {/* Transaction Verification Dialog */}
        <TransactionDialog
          open={transactionDialogOpen}
          setOpen={setTransactionDialogOpen}
          selectedApplicant={selectedApplicant}
          applications={applications}
          verifiedTransactions={verifiedTransactions}
          selectedTransactions={selectedTransactions}
          handleVerifiedTransactionSelect={handleVerifiedTransactionSelect}
          handleTransactionSelect={handleTransactionSelect}
          isCalculatingDTI={isCalculatingDTI}
          dtiCalculated={dtiCalculated}
          calculateDTI={calculateDTI}
          setShowAiRecommendationDialog={setShowAiRecommendationDialog}
          getApplicantData={getApplicantData}
        />

        {/* Detailed AI Recommendation Dialog */}
        <AiRecommendationDialog
          open={showAiRecommendationDialog}
          setOpen={setShowAiRecommendationDialog}
          selectedApplicant={selectedApplicant}
          getApplicantData={getApplicantData}
        />

        {/* Loading Sparkles Overlay */}
        {isSubmitting && <LoadingSparkles />}
      </div>
    </ThemeProvider>
  )
}
