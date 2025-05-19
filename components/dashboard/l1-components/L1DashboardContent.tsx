import type React from "react"
import { FinancialMetrics } from "../FinancialMetrics"
import { L1RecentApplications } from "../L1RecentApplications"
import { LoadingSparkles } from "@/components/ui/loading-sparkles"
import type { ApplicantData, NewApplicationState } from "@/types/applicant"

interface L1DashboardContentProps {
  isLoading: boolean
  applications: ApplicantData
  openRemarksDialog: (key: string) => void
  openChatDialog: (key: string) => void
  openKycDocumentsDialog: (key: string) => void
  newApplication: NewApplicationState
  setNewApplication: React.Dispatch<React.SetStateAction<NewApplicationState>>
  handleNewApplicationSubmit: () => void
  isSubmitting: boolean
  refreshApplicants: (showLoadingSparkles?: boolean) => Promise<void>
  applicationStep: number
  setApplicationStep: React.Dispatch<React.SetStateAction<number>>
}

export function L1DashboardContent({
  isLoading,
  applications,
  openRemarksDialog,
  openChatDialog,
  openKycDocumentsDialog,
  newApplication,
  setNewApplication,
  handleNewApplicationSubmit,
  isSubmitting,
  refreshApplicants,
  applicationStep,
  setApplicationStep,
}: L1DashboardContentProps) {
  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Metrics Section - 1/3 width */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Financial Health Indicators</h2>
          <FinancialMetrics />
        </div>

        {/* Recent Applications Section - 2/3 width */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Recent Applications</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSparkles />
            </div>
          ) : (
            <L1RecentApplications
              applications={applications}
              openRemarksDialog={openRemarksDialog}
              openChatDialog={openChatDialog}
              openKycDocumentsDialog={openKycDocumentsDialog}
              newApplication={newApplication}
              setNewApplication={setNewApplication}
              handleNewApplicationSubmit={handleNewApplicationSubmit}
              isSubmitting={isSubmitting}
              refreshApplicants={refreshApplicants}
              applicationStep={applicationStep}
              setApplicationStep={setApplicationStep}
            />
          )}
        </div>
      </div>
    </div>
  )
}
