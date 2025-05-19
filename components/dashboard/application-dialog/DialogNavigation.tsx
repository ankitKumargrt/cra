"use client"
import { Button } from "@/components/ui/button"

interface DialogNavigationProps {
  applicationStep: number
  isStepValid: boolean
  isLoading: boolean
  isAnyDocumentUploading: boolean
  analysisLoading: boolean
  handlePrevStep: () => void
  handleNextStep: () => void
  handleAnalysisSubmit: () => void
}

export function DialogNavigation({
  applicationStep,
  isStepValid,
  isLoading,
  isAnyDocumentUploading,
  analysisLoading,
  handlePrevStep,
  handleNextStep,
  handleAnalysisSubmit,
}: DialogNavigationProps) {
  return (
    <div className="flex justify-between mt-4">
      {applicationStep > 0 ? (
        <Button variant="outline" onClick={handlePrevStep}>
          Back
        </Button>
      ) : (
        <div></div>
      )}
      {applicationStep < 3 ? (
        <Button
          onClick={handleNextStep}
          disabled={
            (applicationStep === 0 && !isStepValid) || (applicationStep === 2 && isAnyDocumentUploading) || isLoading
          }
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-primary"></span>
              Processing...
            </>
          ) : applicationStep === 2 && isAnyDocumentUploading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-primary"></span>
              Uploading...
            </>
          ) : (
            "Next"
          )}
        </Button>
      ) : (
        <Button onClick={handleAnalysisSubmit} disabled={analysisLoading}>
          {analysisLoading ? "Processing..." : "Submit Application"}
        </Button>
      )}
    </div>
  )
}
