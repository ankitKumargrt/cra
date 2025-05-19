"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { ApplicantData } from "@/types/applicant"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"

// Import our custom components
import { DocumentsGrid } from "./kyc-documents/DocumentsGrid"
import { ExtractedDataView } from "./kyc-documents/ExtractedDataView"
import { ImagePreviewModal } from "./kyc-documents/ImagePreviewModal"
import { generatePdf } from "./kyc-documents/pdfGenerator"
import { formatCombinedContent } from "./kyc-documents/formatContent"

interface KYCDocumentsDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  selectedApplicant: string | null
  applications: ApplicantData
  updateDocuments: (applicantName: string, documentType: string, file: File) => void
  applicantDetails?: any // Using any for now to accommodate the API response format
}

export function KYCDocumentsDialog({
  open,
  setOpen,
  selectedApplicant,
  applications,
  updateDocuments,
  applicantDetails,
}: KYCDocumentsDialogProps) {
  const [activeTab, setActiveTab] = useState("documents")
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const { toast } = useToast()
  const { tokens, user } = useAuth()

  // Get the banker_id from auth context
  const bankerId = user?.id || 1

  // Get the applicant ID for the selected applicant
  const getApplicantId = () => {
    if (!selectedApplicant || !applications[selectedApplicant]) return null
    return applications[selectedApplicant].id
  }

  // Fetch documents when the dialog opens and an applicant is selected
  useEffect(() => {
    if (open && selectedApplicant && !applicantDetails) {
      fetchDocuments()
    } else {
      // Reset state when dialog closes
      setDocuments([])
      setError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedApplicant])

  const fetchDocuments = async () => {
    const applicantId = getApplicantId()
    if (!applicantId) {
      setError("Applicant ID not found")
      return
    }

    if (!tokens?.access_token) {
      setError("Authentication required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || ""

      // Updated API endpoint to use banker_id and applicant_id
      const response = await fetch(`${apiUrl}/api/${bankerId}/applicant/${applicantId}`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch applicant details: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched applicant details:", data)

      // Set documents if available
      if (data.documents) {
        setDocuments(data.documents)
      }

      // Store the entire response as applicantDetails
      // This would normally be handled by the parent component (L1Dashboard)
    } catch (err) {
      console.error("Error fetching applicant details:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch applicant details")
      toast({
        title: "Error",
        description: "Failed to load applicant details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Generate PDF with the formatted content
  const handleGeneratePdf = async () => {
    try {
      setIsGeneratingPdf(true)
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your PDF...",
      })

      const kycContent = applicantDetails?.kyc_content || ""
      const itrContent = applicantDetails?.itr_content || ""

      // Format the content the same way it's displayed in the tab
      let formattedContent = ""

      try {
        // Check if formatCombinedContent function exists
        if (typeof formatCombinedContent === "function") {
          formattedContent = formatCombinedContent(kycContent, itrContent)
        } else {
          // Fallback to using raw content
          formattedContent = `# Document Verification Report\n\n## KYC Document Analysis\n${kycContent}\n\n## ITR Document Analysis\n${itrContent}`
          console.warn("formatCombinedContent function not found, using raw content")
        }

        // Log the first 200 characters of formatted content for debugging
        console.log("Formatted content (first 200 chars):", formattedContent?.substring(0, 200))
      } catch (formatError) {
        console.error("Error formatting content:", formatError)
        // Fallback to using raw content
        formattedContent = `# Document Verification Report\n\n## KYC Document Analysis\n${kycContent}\n\n## ITR Document Analysis\n${itrContent}`
      }

      // Use setTimeout to prevent UI freezing
      setTimeout(async () => {
        try {
          // Use the formatted content for the PDF
          await generatePdf(formattedContent, "", selectedApplicant || "Applicant")

          toast({
            title: "PDF Generated",
            description: "Your PDF has been successfully generated and downloaded.",
            variant: "success",
          })
        } catch (error) {
          console.error("Error generating PDF:", error)
          toast({
            title: "Error",
            description: "Failed to generate PDF. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsGeneratingPdf(false)
        }
      }, 100)
    } catch (error) {
      console.error("Error initiating PDF generation:", error)
      toast({
        title: "Error",
        description: "Failed to start PDF generation. Please try again.",
        variant: "destructive",
      })
      setIsGeneratingPdf(false)
    }
  }

  // Get applicant data from either the API response or the applications state
  const getApplicantData = () => {
    if (!selectedApplicant) return null

    if (applicantDetails) {
      // Map API response to the format expected by the component
      return {
        dti: null,
        income: 0,
        debt: 0,
        loanAmount: applicantDetails.proposal_amount || 0,
        expenses: {
          housing: 0,
          transportation: 0,
          food: 0,
          entertainment: 0,
        },
        verified: applicantDetails.kyc_status || false,
        personalDetails: {
          pan: applicantDetails.pan_number || "",
          aadhar: "",
          address: "",
          phone: applicantDetails.mobile || "",
          email: "",
          occupation: "",
          employer: "",
          fatherName: applicantDetails.father_name || "",
          dob: applicantDetails.dob || "",
        },
        kycStatus: applicantDetails.kyc_status ? "Approved" : "Pending",
        remarks: "",
        applicationDate: new Date().toLocaleDateString(),
        loanType: applicantDetails.loan_type || "",
        id: applicantDetails.applicant_id,
      }
    }

    return applications[selectedApplicant]
  }

  const applicant = getApplicantData()
  if (!applicant) return null

  // Combine documents from both sources
  const allDocuments = [...(applicantDetails?.documents || []), ...documents]

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedApplicant ? `${selectedApplicant}'s Documents` : "Applicant Documents"}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="ocr">Extracted Data</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-4">
              <DocumentsGrid
                isLoading={isLoading}
                error={error}
                documents={allDocuments}
                onViewDocument={(url) => setExpandedImage(url)}
              />
            </TabsContent>

            <TabsContent value="ocr" className="space-y-4">
              <ScrollArea className="h-[60vh]">
                <ExtractedDataView
                  isLoading={isLoading}
                  error={error}
                  kycContent={applicantDetails?.kyc_content || ""}
                  itrContent={applicantDetails?.itr_content || ""}
                  applicantName={selectedApplicant}
                  onGeneratePdf={handleGeneratePdf}
                  isGeneratingPdf={isGeneratingPdf}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ImagePreviewModal imageUrl={expandedImage} onClose={() => setExpandedImage(null)} />
    </>
  )
}
