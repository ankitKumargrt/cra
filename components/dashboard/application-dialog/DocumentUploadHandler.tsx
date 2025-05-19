"use client"

import type React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import type { DocumentType, NewApplicationState } from "@/types/applicant"

interface DocumentUploadHandlerProps {
  applicationId: string | null
  documentUploading: Record<DocumentType, boolean>
  setDocumentUploading: React.Dispatch<React.SetStateAction<Record<DocumentType, boolean>>>
  newApplication: NewApplicationState
  setNewApplication: React.Dispatch<React.SetStateAction<NewApplicationState>>
}

export function useDocumentUploadHandler({
  applicationId,
  documentUploading,
  setDocumentUploading,
  newApplication,
  setNewApplication,
}: DocumentUploadHandlerProps) {
  const { tokens } = useAuth()
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Set document as uploading
      setDocumentUploading((prev) => ({
        ...prev,
        [documentType]: true,
      }))

      try {
        // Get the application ID from state or local storage
        const appId = applicationId || localStorage.getItem("current_application_id")

        if (!appId) {
          throw new Error("Application ID not found. Please try again.")
        }

        if (!tokens || !tokens.access_token) {
          throw new Error("Authentication token is missing. Please log in again.")
        }

        // Create FormData for file upload
        const formData = new FormData()

        // Map "bankStatement" to "bank" for the API
        const apiDocumentType =
          documentType === "bankStatement" ? "bank" : documentType === "propertyDeed" ? "property" : documentType
        formData.append("document_type", apiDocumentType)
        formData.append("file", file)

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
        const uploadUrl = `${apiUrl}api/documents/${appId}/upload`

        console.log(`Uploading document to: ${uploadUrl}`)
        console.log(`Document type: ${apiDocumentType}`)

        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("Document Upload Error:", errorData)
          throw new Error(`Failed to upload document: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Document uploaded successfully:", data)

        // If we got here, the response was OK (status 200-299)
        // Consider it a success even if specific success flags aren't present
        console.log("Upload response data:", data)

        // Update application state to reflect uploaded document
        setNewApplication((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            [documentType]: true,
          },
          fileNames: {
            ...prev.fileNames,
            [documentType]: file.name,
          },
        }))

        toast({
          title: "Document uploaded",
          description: `${file.name} has been uploaded successfully.`,
        })
      } catch (error) {
        console.error("Error uploading document:", error)
        toast({
          title: "Upload failed",
          description: `${error instanceof Error ? error.message : "Failed to upload document"}`,
          variant: "destructive",
        })

        // Reset the file input
        e.target.value = ""
      } finally {
        // Set document as no longer uploading
        setDocumentUploading((prev) => ({
          ...prev,
          [documentType]: false,
        }))
      }
    }
  }

  const handleRemoveDocument = (documentType: DocumentType) => {
    setNewApplication((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: false,
      },
      fileNames: {
        ...prev.fileNames,
        [documentType]: "",
      },
    }))
  }

  return {
    handleFileChange,
    handleRemoveDocument,
  }
}
