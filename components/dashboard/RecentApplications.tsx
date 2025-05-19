"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NewApplicationDialog } from "@/components/dashboard/NewApplicationDialog"
import type { ApplicantData } from "@/types/applicant"
import { Search, MessageSquare, RefreshCcw, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Add onClose to the component props interface
interface RecentApplicationsProps {
  applications: ApplicantData
  openTransactionDialog: (name: string) => void
  newApplication: any
  setNewApplication: (application: any) => void
  handleNewApplicationSubmit: () => void
  isSubmitting: boolean
  onClose?: () => void
}

export function RecentApplications({
  applications,
  openTransactionDialog,
  newApplication,
  setNewApplication,
  handleNewApplicationSubmit,
  isSubmitting,
  onClose,
}: RecentApplicationsProps) {
  const [isNewApplicationOpen, setIsNewApplicationOpen] = useState(false)
  const [applicationStep, setApplicationStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false) // Added isLoading state

  const nextStep = () => {
    setApplicationStep(applicationStep + 1)
  }

  const prevStep = () => {
    setApplicationStep(applicationStep - 1)
  }

  // Update the filteredApplications function to search by PAN number
  const filteredApplications = Object.entries(applications).filter(([name, data]) => {
    const pan = data.personalDetails?.pan || ""
    return (
      pan.toLowerCase().includes(searchQuery.toLowerCase()) || name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const getKycStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
            Pending
          </Badge>
        )
      case "Approved":
        return (
          <Badge variant="outline" className="bg-green-600/10 text-green-600 border-green-600/20">
            Approved
          </Badge>
        )
      case "Denied":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            Denied
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-300/10 text-gray-500 border-gray-300/20">
            {status}
          </Badge>
        )
    }
  }

  const refreshApplicants = () => {
    setIsLoading(true)
    // Simulate a refresh by setting isLoading to false after a delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const openChatDialog = (name: string) => {
    alert(`Opening chat dialog for ${name}`)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Applications</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshApplicants?.()}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
            <Button size="sm" onClick={() => setIsNewApplicationOpen(true)} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>New Application</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or PAN number..."
              className="pl-9 h-10 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[500px]">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Loading applications...</p>
              </div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No applications found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background z-10">
                <tr className="border-b font-medium text-muted-foreground">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">PAN Number</th>
                  <th className="py-3 px-4 text-left">Date of Application</th>
                  <th className="py-3 px-4 text-left">Loan Type</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">DTI (%)</th>
                  <th className="py-3 px-4 text-left">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map(([name, data]) => (
                  <tr key={name} className="border-b">
                    <td className="py-4 px-4 align-middle">
                      <div
                        className="text-primary hover:text-primary/80 cursor-pointer"
                        onClick={() => openTransactionDialog(name)}
                      >
                        {name}
                      </div>
                    </td>
                    <td className="py-4 px-4 align-middle">{data.personalDetails?.pan || "N/A"}</td>
                    <td className="py-4 px-4 align-middle">{data.applicationDate || "N/A"}</td>
                    <td className="py-4 px-4 align-middle">{data.loanType || "N/A"}</td>
                    <td className="py-4 px-4 align-middle">₹{data.loanAmount.toLocaleString()}</td>
                    <td className="py-4 px-4 align-middle">
                      {data.dti ? (
                        <span
                          className={`font-medium ${data.dti > 40 ? "text-red-500" : data.dti > 35 ? "text-amber-500" : "text-green-500"}`}
                        >
                          {data.dti}%
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-4 px-4 align-middle max-w-[300px]">
                      <div
                        className="flex items-center gap-2 cursor-pointer text-primary hover:text-primary/80"
                        onClick={() => openChatDialog(name)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>View Feedback</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* New Application Dialog */}
        <NewApplicationDialog
          isOpen={isNewApplicationOpen}
          setIsOpen={setIsNewApplicationOpen}
          applicationStep={applicationStep}
          setApplicationStep={setApplicationStep}
          newApplication={newApplication}
          setNewApplication={setNewApplication}
          handleNewApplicationSubmit={handleNewApplicationSubmit}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      </CardContent>
    </Card>
  )
}
