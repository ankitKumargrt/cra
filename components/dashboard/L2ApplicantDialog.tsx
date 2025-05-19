"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, AlertCircle, FileText, Loader2, Download, CheckCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmojiText } from "./EmojiText"
import { DocumentCard } from "./kyc-documents/DocumentCard"
import { ImagePreviewModal } from "./kyc-documents/ImagePreviewModal"
import { generateDtiPdf } from "./kyc-documents/pdfGenerator"
import { formatCombinedContent } from "./kyc-documents/formatContent"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface L2ApplicantDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  applicantId: string | null
  bankerId: string | number | null
}

interface DocumentMetadata {
  bucket: string
  content_type: string
  original_filename: string
  s3_key: string
  url: string
}

interface Document {
  applicant_id: string
  banker_id: number
  document_type: string
  s3_url: string
}

interface ApplicantDetails {
  applicant_id: string
  banker_id: number
  full_name: string
  father_name: string
  pan_number: string
  mobile: string
  dob: string
  loan_type: string
  proposal_amount: number
  kyc_status: boolean
  kyc_content?: string
  itr_content?: string
  dti?: number
  dti_content?: string
  spending_content?: string
  bank_transactions?: any
  documents?: Document[]
}

// Helper function to extract markdown content from code blocks
const extractMarkdownContent = (content: string | undefined): string => {
  if (!content) return ""

  // Check if the content is wrapped in markdown code block
  const markdownCodeBlockRegex = /^```markdown\n([\s\S]*)\n```$/
  const match = content.match(markdownCodeBlockRegex)

  // If it matches the pattern, extract the content between the markers
  if (match && match[1]) {
    return match[1]
  }

  // Otherwise return the original content
  return content
}

// Custom MarkdownContent component specifically for L2
function L2MarkdownContent({ content }: { content: string }) {
  if (!content || typeof content !== "string") {
    return <p className="text-muted-foreground italic">No content available</p>
  }

  // Extract KYC status
  const kycStatusMatch = content.match(/\*\*KYC Status:\*\*\s*(.*?)(?:\.|$)/i)
  const isKycSuccessful = kycStatusMatch
    ? kycStatusMatch[1].toLowerCase().includes("successful")
    : content.toLowerCase().includes("kyc successful")

  const kycStatusText = kycStatusMatch ? kycStatusMatch[1].trim() : isKycSuccessful ? "KYC Successful" : "KYC Failed"

  // Extract ITR verification status
  const itrStatusMatch = content.match(/\*\*ITR Verification:\*\*\s*(.*?)(?:\.|$)/i)

  // Check if the ITR verification mentions "no discrepancies" or similar phrases
  const isItrSuccessful = itrStatusMatch
    ? itrStatusMatch[1].toLowerCase().includes("no discrepancies") ||
      itrStatusMatch[1].toLowerCase().includes("no significant") ||
      itrStatusMatch[1].toLowerCase().includes("all essential details match") ||
      !itrStatusMatch[1].toLowerCase().includes("discrepancies were found")
    : content.toLowerCase().includes("no discrepancies found") ||
      !content.toLowerCase().includes("discrepancies were found")

  // Also check the Discrepancies section directly
  const discrepanciesSection = content.match(/## Discrepancies $$if any$$([\s\S]*?)(?=##|$)/i)
  const hasNoDiscrepancies = discrepanciesSection
    ? discrepanciesSection[1].toLowerCase().includes("no discrepancies") ||
      !discrepanciesSection[1].toLowerCase().includes("discrepancies were found")
    : true

  return (
    <div className="prose dark:prose-invert max-w-none">
      {/* KYC Status Indicator */}
      <div
        className={`flex items-center p-3 mb-4 rounded-md ${
          isKycSuccessful
            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
            : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
        }`}
      >
        {isKycSuccessful ? <Check className="h-5 w-5 mr-2" /> : <X className="h-5 w-5 mr-2" />}
        <span className="font-medium">{kycStatusText}</span>
      </div>

      {/* ITR Verification Status Indicator (if available) */}
      {itrStatusMatch && (
        <div
          className={`flex items-center p-3 mb-4 rounded-md ${
            isItrSuccessful && hasNoDiscrepancies
              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
              : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
          }`}
        >
          {isItrSuccessful && hasNoDiscrepancies ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertTriangle className="h-5 w-5 mr-2" />
          )}
          <span className="font-medium">
            {isItrSuccessful && hasNoDiscrepancies
              ? "ITR Verification Successful"
              : "ITR Verification Found Discrepancies"}
          </span>
        </div>
      )}

      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({
              node,
              className,
              children,
              ...props
            }: {
              node?: any
              className?: string
              children?: React.ReactNode
            } & React.TableHTMLAttributes<HTMLTableElement>) => (
              <table
                className="border-collapse w-full my-4 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
                {...props}
              >
                {children}
              </table>
            ),
            thead: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.HTMLAttributes<HTMLTableSectionElement>) => (
              <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
                {children}
              </thead>
            ),
            tbody: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props}>{children}</tbody>,
            tr: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.HTMLAttributes<HTMLTableRowElement>) => (
              <tr className="even:bg-gray-50 dark:even:bg-gray-800" {...props}>
                {children}
              </tr>
            ),
            th: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold" {...props}>
                {children}
              </th>
            ),
            td: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" {...props}>
                {children}
              </td>
            ),
            h1: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.HTMLAttributes<HTMLHeadingElement>) => (
              <h1
                className="text-2xl font-bold mt-6 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
                {...props}
              >
                {children}
              </h1>
            ),
            h2: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.HTMLAttributes<HTMLHeadingElement>) => (
              <h2 className="text-xl font-bold mt-5 mb-3" {...props}>
                {children}
              </h2>
            ),
            h3: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.HTMLAttributes<HTMLHeadingElement>) => (
              <h3 className="text-lg font-semibold mt-4 mb-2" {...props}>
                {children}
              </h3>
            ),
            p: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.HTMLAttributes<HTMLParagraphElement>) => (
              <p className="my-3" {...props}>
                {children}
              </p>
            ),
            ul: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.HTMLAttributes<HTMLUListElement>) => (
              <ul className="list-disc pl-6 my-3" {...props}>
                {children}
              </ul>
            ),
            ol: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.HTMLAttributes<HTMLOListElement>) => (
              <ol className="list-decimal pl-6 my-3" {...props}>
                {children}
              </ol>
            ),
            li: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.LiHTMLAttributes<HTMLLIElement>) => (
              <li className="mb-1" {...props}>
                {children}
              </li>
            ),
            hr: ({
              node,
              ...props
            }: {
              node?: any
            } & React.HTMLAttributes<HTMLHRElement>) => (
              <hr className="my-6 border-t border-gray-200 dark:border-gray-700" {...props} />
            ),
            strong: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.HTMLAttributes<HTMLElement>) => (
              <strong className="font-bold" {...props}>
                {children}
              </strong>
            ),
            em: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.HTMLAttributes<HTMLElement>) => (
              <em className="italic" {...props}>
                {children}
              </em>
            ),
            a: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
              <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props}>
                {children}
              </a>
            ),
            blockquote: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
              <blockquote className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic my-4" {...props}>
                {children}
              </blockquote>
            ),
            code: ({
              node,
              inline,
              className,
              children,
              ...props
            }: {
              node?: any
              inline?: boolean
              className?: string
              children?: React.ReactNode
            } & React.HTMLAttributes<HTMLElement>) =>
              inline ? (
                <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              ) : (
                <code
                  className="block bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm overflow-x-auto my-4"
                  {...props}
                >
                  {children}
                </code>
              ),
            pre: ({
              node,
              children,
              ...props
            }: {
              node?: any
              children?: React.ReactNode
            } & React.HTMLAttributes<HTMLPreElement>) => (
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto my-4" {...props}>
                {children}
              </pre>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      <style jsx global>{`
        .markdown-content h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .dark .markdown-content h1 {
          border-color: #2d3748;
        }
        
        .markdown-content h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
        }
        
        .markdown-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .markdown-content p {
          margin-bottom: 0.75rem;
        }
        
        .markdown-content ul, .markdown-content ol {
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .markdown-content li {
          margin-bottom: 0.25rem;
        }
        
        .markdown-content hr {
          margin: 1.5rem 0;
          border: 0;
          border-top: 1px solid #e2e8f0;
        }
        
        .dark .markdown-content hr {
          border-color: #2d3748;
        }
        
        .markdown-content strong {
          font-weight: 600;
        }
        
        .markdown-content em {
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

export function L2ApplicantDialog({ open, setOpen, applicantId, bankerId }: L2ApplicantDialogProps) {
  const [activeTab, setActiveTab] = useState("documents")
  const [activeAnalysisTab, setActiveAnalysisTab] = useState("dti")
  const [applicantDetails, setApplicantDetails] = useState<ApplicantDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { toast } = useToast()
  const { tokens } = useAuth()

  // Fetch applicant details when the dialog opens and an applicant is selected
  useEffect(() => {
    if (open && applicantId && bankerId) {
      fetchApplicantDetails()
    } else {
      // Reset state when dialog closes
      setApplicantDetails(null)
      setError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, applicantId, bankerId])

  const fetchApplicantDetails = async () => {
    if (!applicantId || !bankerId || !tokens?.access_token) {
      setError("Missing required information")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || ""
      const endpoint = `${apiUrl}/api/${bankerId}/applicant/${applicantId}`

      console.log(`Fetching applicant details from: ${endpoint}`)

      const response = await fetch(endpoint, {
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
      setApplicantDetails(data)
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

  // Effect to resize iframe to fit content
  useEffect(() => {
    if (activeTab === "analysis" && activeAnalysisTab === "spending" && iframeRef.current) {
      const resizeIframe = () => {
        if (iframeRef.current) {
          try {
            const iframe = iframeRef.current
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

            if (iframeDoc) {
              // Set iframe height to match content
              const height = iframeDoc.body.scrollHeight
              iframe.style.height = `${height}px`
            }
          } catch (e) {
            console.error("Error resizing iframe:", e)
          }
        }
      }

      // Try to resize after a short delay to ensure content is loaded
      const timer = setTimeout(resizeIframe, 300)
      return () => clearTimeout(timer)
    }
  }, [activeTab, activeAnalysisTab, applicantDetails?.spending_content])

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <Check className="h-3 w-3 mr-1" /> Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <AlertCircle className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <X className="h-3 w-3 mr-1" /> Failed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            <AlertCircle className="h-3 w-3 mr-1" /> {status}
          </Badge>
        )
    }
  }

  const formatDocumentType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const handleViewDocument = (url: string) => {
    setPreviewUrl(url)
  }

  const handleDownloadDti = async () => {
    if (!applicantDetails?.dti_content) {
      toast({
        title: "Error",
        description: "No DTI analysis content available to download.",
        variant: "destructive",
      })
      return
    }

    setIsDownloading(true)

    try {
      await generateDtiPdf(
        extractMarkdownContent(applicantDetails.dti_content),
        applicantDetails.dti,
        applicantDetails.full_name,
      )

      toast({
        title: "Success",
        description: "DTI analysis PDF downloaded successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error generating DTI PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate DTI analysis PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const renderDocumentsTab = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading documents...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p>{error}</p>
        </div>
      )
    }

    const documents = applicantDetails?.documents || []

    if (documents.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <FileText className="h-8 w-8 mb-2" />
          <p>No documents found for this applicant</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc, index) => (
          <DocumentCard key={index} document={doc} onViewClick={handleViewDocument} />
        ))}
      </div>
    )
  }

  const renderOcrDataTab = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading OCR data...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p>{error}</p>
        </div>
      )
    }

    // Check if we have KYC or ITR content
    if (!applicantDetails?.kyc_content && !applicantDetails?.itr_content) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <FileText className="h-8 w-8 mb-2" />
          <p>No OCR data found for this applicant</p>
        </div>
      )
    }

    // Format the content using the same formatter as L1
    const combinedContent = formatCombinedContent(
      applicantDetails?.kyc_content || "",
      applicantDetails?.itr_content || "",
    )

    // Log the formatted content for debugging
    console.log("L2 formatted content:", combinedContent)

    return (
      <div className="pt-2">
        <L2MarkdownContent content={combinedContent} />
      </div>
    )
  }

  const renderDtiAnalysisTab = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading DTI analysis...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p>{error}</p>
        </div>
      )
    }

    if (!applicantDetails?.dti_content) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <FileText className="h-8 w-8 mb-2" />
          <p>No DTI analysis found for this applicant</p>
          {applicantDetails?.dti !== undefined && <p className="mt-2">DTI Score: {applicantDetails.dti}</p>}
        </div>
      )
    }

    return (
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center mb-4">
          {applicantDetails?.dti !== undefined && (
            <div className="text-lg font-medium">DTI Score: {applicantDetails.dti}</div>
          )}
          <Button variant="outline" size="sm" onClick={handleDownloadDti} disabled={isDownloading} className="ml-auto">
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>

        <div className="mb-6">
          <L2MarkdownContent content={extractMarkdownContent(applicantDetails.dti_content)} />
        </div>
      </div>
    )
  }

  const renderSpendingHabitsTab = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading spending habits analysis...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p>{error}</p>
        </div>
      )
    }

    if (!applicantDetails?.spending_content) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <FileText className="h-8 w-8 mb-2" />
          <p>No spending habits analysis found for this applicant</p>
        </div>
      )
    }

    // Check if the content is HTML
    const isHtml =
      applicantDetails.spending_content.trim().startsWith("<!DOCTYPE html>") ||
      applicantDetails.spending_content.trim().startsWith("<html")

    if (isHtml) {
      return (
        <div className="w-full h-[60vh]">
          <iframe
            ref={iframeRef}
            srcDoc={applicantDetails.spending_content}
            title="Spending Habits Analysis"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            onLoad={() => {
              if (iframeRef.current) {
                try {
                  const iframe = iframeRef.current
                  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

                  if (iframeDoc) {
                    // Set iframe height to match content
                    const height = iframeDoc.body.scrollHeight
                    iframe.style.height = `${height}px`
                  }
                } catch (e) {
                  console.error("Error resizing iframe:", e)
                }
              }
            }}
          />
        </div>
      )
    } else {
      // Use the EmojiText component to render the spending habits text
      return (
        <div className="w-full">
          <EmojiText text={applicantDetails.spending_content} />
        </div>
      )
    }
  }

  const renderAnalysisTab = () => {
    return (
      <div className="w-full">
        <Tabs value={activeAnalysisTab} onValueChange={setActiveAnalysisTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 w-full">
            <TabsTrigger value="dti">DTI Analysis</TabsTrigger>
            <TabsTrigger value="spending">Spending Habits</TabsTrigger>
          </TabsList>

          <TabsContent value="dti" className="mt-4 w-full">
            {renderDtiAnalysisTab()}
          </TabsContent>

          <TabsContent value="spending" className="mt-4 w-full">
            {renderSpendingHabitsTab()}
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl">
              {applicantDetails?.full_name ? `${applicantDetails.full_name}'s Details` : "Applicant Details"}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 w-full">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="ocr">Extracted Data</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="mt-2 w-full">
              <div className="h-[60vh] overflow-y-auto pr-1">{renderDocumentsTab()}</div>
            </TabsContent>

            <TabsContent value="ocr" className="mt-2 w-full">
              <ScrollArea className="h-[60vh]">{renderOcrDataTab()}</ScrollArea>
            </TabsContent>

            <TabsContent value="analysis" className="mt-2 w-full">
              <ScrollArea className="h-[60vh]">{renderAnalysisTab()}</ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ImagePreviewModal imageUrl={previewUrl} onClose={() => setPreviewUrl(null)} />
    </>
  )
}
