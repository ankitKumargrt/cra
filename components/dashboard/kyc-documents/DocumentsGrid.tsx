import { Loader2, AlertCircle, FileText } from "lucide-react"
import { DocumentCard } from "./DocumentCard"

interface DocumentsGridProps {
  isLoading: boolean
  error: string | null
  documents: any[]
  onViewDocument: (url: string) => void
}

export function DocumentsGrid({ isLoading, error, documents, onViewDocument }: DocumentsGridProps) {
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
        <div key={index} className="h-full">
          <DocumentCard document={doc} onViewClick={onViewDocument} />
        </div>
      ))}
    </div>
  )
}
