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
import { FileCheck, LogOut, Users, Settings, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Update the applicant data in L3Dashboard with an empty object
const applicantData: ApplicantData = {}

// Sample transactions for L3
const initialVerifiedTransactions: Transaction[] = []

const initialUnverifiedTransactions: Transaction[] = []

// Sample user data for admin view
const userData = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", role: "L1", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "L2", status: "Active" },
  { id: 3, name: "Robert Johnson", email: "robert.johnson@example.com", role: "L1", status: "Inactive" },
  { id: 4, name: "Emily Davis", email: "emily.davis@example.com", role: "L3", status: "Active" },
  { id: 5, name: "Michael Wilson", email: "michael.wilson@example.com", role: "L2", status: "Active" },
]

export function L3Dashboard() {
  const [showFinancialHealth, setShowFinancialHealth] = useState(true)
  const [showRecentApplications, setShowRecentApplications] = useState(true)
  const [showMarketInsights, setShowMarketInsights] = useState(true)
  const { theme, setTheme } = useTheme()
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null)
  const [isNewApplicationOpen, setIsNewApplicationOpen] = useState(false)
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
  const [selectedTransactions, setSelectedTransactions] = useState(initialUnverifiedTransactions)
  const [verifiedTransactions, setVerifiedTransactions] = useState(initialVerifiedTransactions)
  const [isCalculatingDTI, setIsCalculatingDTI] = useState(false)
  const [dtiCalculated, setDtiCalculated] = useState(false)
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false)
  const [showAiRecommendationDialog, setShowAiRecommendationDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const router = useRouter()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const getApplicantData = (name: string) => {
    return applications[name as keyof typeof applications] || null
  }

  const handleNewApplicationSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
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

  const calculateDTI = () => {
    setIsCalculatingDTI(true)
    setTimeout(() => {
      if (selectedApplicant === "Rajiv Sharma") {
        const updatedApplications = {
          ...applications,
          "Rajiv Sharma": {
            ...applications["Rajiv Sharma"],
            dti: 33,
            verified: true,
          },
        }
        setApplications(updatedApplications)
      }
      setIsCalculatingDTI(false)
      setDtiCalculated(true)
      setTransactionDialogOpen(false)
    }, 2000)
  }

  const openTransactionDialog = (name: string) => {
    setSelectedApplicant(name)
    const isVerified = applications[name as keyof typeof applications]?.verified || false
    if (isVerified) {
      setShowAiRecommendationDialog(true)
    } else {
      setTransactionDialogOpen(true)
    }
    setDtiCalculated(isVerified)
  }

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <FileCheck className="h-6 w-6" />
            <span>FinSight - L3 Admin Dashboard</span>
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">L3 Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Complete system management and advanced analytics</p>
          </div>

          <Tabs defaultValue="dashboard" className="mb-6">
            <TabsList className="grid w-full grid-cols-4 md:w-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
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
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>Manage system users and their permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50 font-medium">
                          <th className="p-3 text-left">Name</th>
                          <th className="p-3 text-left">Email</th>
                          <th className="p-3 text-left">Role</th>
                          <th className="p-3 text-left">Status</th>
                          <th className="p-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  user.role === "L3"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                    : user.role === "L2"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  user.status === "Active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  Deactivate
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Advanced Analytics
                  </CardTitle>
                  <CardDescription>System-wide performance metrics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium mb-2">Loan Approval Rate</h3>
                      <div className="h-64 bg-muted/50 rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Analytics Chart Placeholder</p>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium mb-2">Processing Time</h3>
                      <div className="h-64 bg-muted/50 rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Analytics Chart Placeholder</p>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium mb-2">Risk Distribution</h3>
                      <div className="h-64 bg-muted/50 rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Analytics Chart Placeholder</p>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium mb-2">User Activity</h3>
                      <div className="h-64 bg-muted/50 rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Analytics Chart Placeholder</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Settings
                  </CardTitle>
                  <CardDescription>Configure system parameters and security settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                          </div>
                          <div className="h-6 w-11 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Password Rotation</p>
                            <p className="text-sm text-muted-foreground">Require password change every 90 days</p>
                          </div>
                          <div className="h-6 w-11 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Session Timeout</p>
                            <p className="text-sm text-muted-foreground">Automatically log out after 30 minutes</p>
                          </div>
                          <div className="h-6 w-11 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium mb-4">System Configuration</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">API Key</label>
                          <div className="flex">
                            <input
                              type="password"
                              value="••••••••••••••••"
                              className="flex-1 rounded-l-md border px-3 py-2"
                              readOnly
                            />
                            <Button variant="outline" className="rounded-l-none">
                              Regenerate
                            </Button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Webhook URL</label>
                          <input
                            type="text"
                            value="https://api.finsight.com/webhook"
                            className="w-full rounded-md border px-3 py-2"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Data Retention Period</label>
                          <select className="w-full rounded-md border px-3 py-2">
                            <option>30 days</option>
                            <option>60 days</option>
                            <option selected>90 days</option>
                            <option>180 days</option>
                            <option>1 year</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
