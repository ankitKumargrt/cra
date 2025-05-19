"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload, Check, AlertCircle } from "lucide-react"
import type { NewApplicationState, DocumentType } from "@/types/applicant"
import { LoanType } from "@/types/applicant"

interface DocumentUploadStepProps {
  newApplication: NewApplicationState
  documentUploading: Record<DocumentType, boolean>
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => void
  handleRemoveDocument: (documentType: DocumentType) => void
}

export function DocumentUploadStep({
  newApplication,
  documentUploading,
  handleFileChange,
  handleRemoveDocument,
}: DocumentUploadStepProps) {
  // Check if any document is currently uploading
  const isAnyDocumentUploading = Object.values(documentUploading).some((status) => status === true)

  // Define the upload sequence based on loan type
  const getUploadSequence = (): DocumentType[] => {
    const baseSequence: DocumentType[] = ["pan", "aadhar", "bankStatement", "form16", "itr"]

    // Add propertyDeed document for Home Loan
    if (newApplication.loan_type === LoanType.HOME) {
      return [...baseSequence, "propertyDeed"]
    }

    return baseSequence
  }

  const uploadSequence = getUploadSequence()

  // Determine which document types should be enabled
  const getDocumentEnabled = (documentType: DocumentType) => {
    // If any document is uploading, disable all other document uploads
    if (isAnyDocumentUploading) {
      return documentUploading[documentType] // Only enable the one that's currently uploading
    }

    const currentIndex = uploadSequence.findIndex((type) => type === documentType)

    // First document is always enabled if no uploads are in progress
    if (currentIndex === 0) return true

    // For other documents, they're only enabled if the previous document is uploaded
    const previousType = uploadSequence[currentIndex - 1]
    return newApplication.documents[previousType] === true
  }

  // Get the name of the previous document in the sequence
  const getPreviousDocumentName = (documentType: DocumentType): string => {
    const currentIndex = uploadSequence.findIndex((type) => type === documentType)
    if (currentIndex <= 0) return ""

    const previousType = uploadSequence[currentIndex - 1]
    return getDocumentName(previousType)
  }

  // Get a user-friendly document name
  const getDocumentName = (documentType: DocumentType): string => {
    const documentNames: Record<DocumentType, string> = {
      pan: "PAN Card",
      aadhar: "Aadhar Card",
      bankStatement: "Bank Statement",
      form16: "Form 16",
      itr: "ITR",
      propertyDeed: "Property Deed",
    }
    return documentNames[documentType]
  }

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Please upload the following documents in sequence. Each document must be uploaded before proceeding to the
          next.
        </p>
      </div>

      {/* Document Upload Fields */}
      {uploadSequence.map((documentType) => (
        <div key={documentType} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${documentType}-upload`} className="text-sm font-medium">
              {getDocumentName(documentType)}
              {documentType === "propertyDeed" && (
                <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(Required for Home Loan)</span>
              )}
            </Label>
            {newApplication.documents[documentType] && (
              <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                <Check className="h-3 w-3 mr-1" />
                Uploaded
              </div>
            )}
          </div>

          <div className="relative">
            {newApplication.documents[documentType] ? (
              <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                <span className="text-sm truncate max-w-[200px]">
                  {newApplication.fileNames[documentType] || "Document uploaded"}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDocument(documentType)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    type="file"
                    id={`${documentType}-upload`}
                    onChange={(e) => handleFileChange(e, documentType)}
                    accept=".jpg,.jpeg,.png,.pdf"
                    disabled={!getDocumentEnabled(documentType) || documentUploading[documentType]}
                    className={`cursor-pointer ${
                      !getDocumentEnabled(documentType) && !documentUploading[documentType]
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  />
                  {documentUploading[documentType] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-primary"></div>
                        <span className="text-sm font-medium">Uploading...</span>
                      </div>
                    </div>
                  )}
                </div>

                {!getDocumentEnabled(documentType) && !documentUploading[documentType] && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {documentType === "pan"
                      ? "Ready to upload"
                      : `Please upload ${getPreviousDocumentName(documentType)} first`}
                  </div>
                )}

                {getDocumentEnabled(documentType) && !documentUploading[documentType] && (
                  <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
                    <Upload className="h-3 w-3 mr-1" />
                    Ready to upload
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="text-xs text-muted-foreground mt-4">
        <p>Supported file formats: JPG, JPEG, PNG, PDF</p>
        <p>Maximum file size: 5MB</p>
      </div>
    </div>
  )
}

export default DocumentUploadStep
