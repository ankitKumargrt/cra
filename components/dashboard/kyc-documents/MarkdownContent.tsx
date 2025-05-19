"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content || typeof content !== "string") {
    return <p className="text-muted-foreground italic">No content available</p>
  }

  console.log("MarkdownContent received:", content?.substring(0, 200) + "...")

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
        {isKycSuccessful ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
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
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>

      <style jsx global>{`
        .markdown-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          overflow: hidden;
        }
        
        .markdown-content th {
          background-color: #f8fafc;
          font-weight: 600;
          text-align: left;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
        }
        
        .markdown-content td {
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
        }
        
        .markdown-content tr:nth-child(even) {
          background-color: #f8fafc;
        }
        
        .dark .markdown-content table {
          border-color: #2d3748;
        }
        
        .dark .markdown-content th {
          background-color: #1a202c;
          border-color: #2d3748;
        }
        
        .dark .markdown-content td {
          border-color: #2d3748;
        }
        
        .dark .markdown-content tr:nth-child(even) {
          background-color: #1a202c;
        }
        
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
      `}</style>
    </div>
  )
}
