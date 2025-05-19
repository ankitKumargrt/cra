"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, FileText } from "lucide-react"
import Image from "next/image"
import { StatusBadge } from "./StatusBadge"

interface DocumentCardProps {
  document: any
  onViewClick: (url: string) => void
}

export function DocumentCard({ document, onViewClick }: DocumentCardProps) {
  const documentUrl = getDocumentUrl(document)

  if (!documentUrl) {
    return <PlaceholderCard document={document} />
  }

  const contentType = getDocumentContentType(document)
  const isPdf = contentType.includes("pdf") || documentUrl.toLowerCase().endsWith(".pdf")
  const filename = getDocumentFilename(document)

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="p-3 pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm truncate">{formatDocumentType(document.document_type)}</h3>
          {document.status && <StatusBadge status={document.status} />}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Document Preview Area */}
        <div className="relative h-48 w-full overflow-hidden">
          {isPdf ? (
            <div className="w-full h-full bg-gray-50 dark:bg-gray-900 flex flex-col">
              {/* PDF Preview - First page as iframe */}
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={`${documentUrl}#page=1&view=FitH`}
                  className="w-full h-full"
                  title={`${document.document_type} preview`}
                />
              </div>
              {/* PDF Overlay with gradient to indicate there's more */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900 pointer-events-none"></div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
              <Image
                src={documentUrl || "/placeholder.svg"}
                alt={`${document.document_type} preview`}
                fill
                className="object-contain"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300"
                }}
              />
            </div>
          )}

          {/* Overlay with view button */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
            <Button variant="secondary" size="sm" className="shadow-lg" onClick={() => onViewClick(documentUrl)}>
              <Eye className="h-4 w-4 mr-2" /> View
            </Button>
          </div>
        </div>

        {/* Document Footer */}
        <div className="p-3 flex justify-between items-center border-t">
          <span className="text-xs text-muted-foreground truncate max-w-[150px]">{filename}</span>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="h-7 w-7 p-0" asChild>
              <a href={documentUrl} download={filename}>
                <Download className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PlaceholderCard({ document }: { document: any }) {
  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="p-3 pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm truncate">{formatDocumentType(document.document_type)}</h3>
          {document.status && <StatusBadge status={document.status} />}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Placeholder Preview Area */}
        <div className="h-48 w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">{document.document_type}</p>
          </div>
        </div>

        {/* Document Footer */}
        <div className="p-3 flex justify-between items-center border-t">
          <span className="text-xs text-muted-foreground">Document not available</span>
          {document.s3_url && (
            <Button size="sm" variant="outline" className="h-7" asChild>
              <a href={document.s3_url} target="_blank" rel="noopener noreferrer">
                <Eye className="h-3 w-3 mr-1" /> View
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper functions
function formatDocumentType(type: string) {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getDocumentUrl(doc: any): string | null {
  if (doc.metadata?.url) {
    return doc.metadata.url
  } else if (doc.s3_url) {
    return doc.s3_url
  } else if (doc.url) {
    return doc.url
  }
  return null
}

function getDocumentContentType(doc: any): string {
  if (doc.metadata?.content_type) {
    return doc.metadata.content_type
  }

  const url = getDocumentUrl(doc)
  if (url) {
    if (url.toLowerCase().endsWith(".pdf")) return "application/pdf"
    if (url.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) return "image/jpeg"
  }

  return "application/octet-stream"
}

function getDocumentFilename(doc: any): string {
  if (doc.metadata?.original_filename) {
    return doc.metadata.original_filename
  }

  const url = getDocumentUrl(doc)
  if (url) {
    const parts = url.split("/")
    return parts[parts.length - 1]
  }

  return doc.document_type || "Document"
}
