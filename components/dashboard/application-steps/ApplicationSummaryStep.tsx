"use client"

import type { NewApplicationState } from "@/types/applicant"

interface ApplicationSummaryStepProps {
  newApplication: NewApplicationState
}

export function ApplicationSummaryStep({ newApplication }: ApplicationSummaryStepProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  // Function to truncate long filenames
  const truncateFilename = (filename: string, maxLength = 15) => {
    if (!filename) return ""
    if (filename.length <= maxLength) return filename

    const extension = filename.split(".").pop() || ""
    const nameWithoutExtension = filename.substring(0, filename.lastIndexOf("."))

    const truncatedName = nameWithoutExtension.substring(0, maxLength - extension.length - 3) + "..."
    return `${truncatedName}.${extension}`
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Application Summary</div>
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-1">
          <div className="text-muted-foreground">Loan Type:</div>
          <div>{newApplication.loan_type}</div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="text-muted-foreground">Proposal Amount:</div>
          <div>
            ₹
            {(typeof newApplication.proposal_amount === "number"
              ? newApplication.proposal_amount
              : Number.parseFloat(newApplication.proposal_amount)
            ).toLocaleString("en-IN")}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="text-muted-foreground">Application Date:</div>
          <div>{formatDate(new Date())}</div>
        </div>
      </div>

      <div className="text-sm font-medium mt-4">Document Status</div>
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-1">
          <div className="text-muted-foreground">PAN Card:</div>
          <div className={newApplication.documents.pan ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {newApplication.documents.pan ? (
              <div className="flex items-center gap-1">
                <span>Provided</span>
                <span className="text-xs text-gray-500">({truncateFilename(newApplication.fileNames.pan || "")})</span>
              </div>
            ) : (
              "Not Provided"
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="text-muted-foreground">Aadhar Card:</div>
          <div className={newApplication.documents.aadhar ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {newApplication.documents.aadhar ? (
              <div className="flex items-center gap-1">
                <span>Provided</span>
                <span className="text-xs text-gray-500">
                  ({truncateFilename(newApplication.fileNames.aadhar || "")})
                </span>
              </div>
            ) : (
              "Not Provided"
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="text-muted-foreground">Bank Statement:</div>
          <div
            className={
              newApplication.documents.bankStatement ? "text-green-600 font-medium" : "text-red-600 font-medium"
            }
          >
            {newApplication.documents.bankStatement ? (
              <div className="flex items-center gap-1">
                <span>Provided</span>
                <span className="text-xs text-gray-500">
                  ({truncateFilename(newApplication.fileNames.bankStatement || "")})
                </span>
              </div>
            ) : (
              "Not Provided"
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="text-muted-foreground">Form 16:</div>
          <div className={newApplication.documents.form16 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {newApplication.documents.form16 ? (
              <div className="flex items-center gap-1">
                <span>Provided</span>
                <span className="text-xs text-gray-500">
                  ({truncateFilename(newApplication.fileNames.form16 || "")})
                </span>
              </div>
            ) : (
              "Not Provided"
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="text-muted-foreground">Income Tax Return:</div>
          <div className={newApplication.documents.itr ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {newApplication.documents.itr ? (
              <div className="flex items-center gap-1">
                <span>Provided</span>
                <span className="text-xs text-gray-500">({truncateFilename(newApplication.fileNames.itr || "")})</span>
              </div>
            ) : (
              "Not Provided"
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mt-4">
        By submitting this application, you confirm that all information provided is accurate and complete. You also
        consent to the processing of your data as per our privacy policy.
      </div>
    </div>
  )
}
