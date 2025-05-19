"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Check, X, AlertCircle, Download, Maximize } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface DocumentStatus {
  status: "approved" | "pending" | "rejected" | "missing"
  lastUpdated?: string
  url?: string
}

interface ApplicantDocuments {
  kyc: {
    panCard: DocumentStatus
    aadharCard: DocumentStatus
    voterID?: DocumentStatus
  }
  financial: {
    bankStatement: DocumentStatus
    itrStatement: DocumentStatus
    form16: DocumentStatus
  }
  additional?: {
    salarySlips?: DocumentStatus
    propertyDocuments?: DocumentStatus
  }
  ocrData?: {
    name?: string
    dob?: string
    pan?: string
    address?: string
    income?: string
  }
}

interface ApplicantDocumentViewerProps {
  applicantName: string
  applicantId: string
  documents: ApplicantDocuments
  onUploadDocument: (applicantId: string, category: string, documentType: string, file: File) => Promise<void>
}

export function ApplicantDocumentViewer({
  applicantName,
  applicantId,
  documents,
  onUploadDocument,
}: ApplicantDocumentViewerProps) {
  const [activeTab, setActiveTab] = useState("docs")
  const [selectedDocCategory, setSelectedDocCategory] = useState("kyc")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const getStatusBadge = (status: DocumentStatus["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <Check className="h-3 w-3 mr-1" /> Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <AlertCircle className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <X className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            <AlertCircle className="h-3 w-3 mr-1" /> Missing
          </Badge>
        )
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocType || !applicantId) return

    setIsUploading(true)
    try {
      await onUploadDocument(applicantId, selectedDocCategory, selectedDocType, selectedFile)
      setSelectedFile(null)
    } catch (error) {
      console.error("Error uploading document:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const renderDocumentThumbnail = (doc: DocumentStatus, type: string) => {
    const isPdf = doc.url?.endsWith(".pdf")

    return (
      <div
        className={`relative border rounded-md p-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
          selectedDocType === type ? "border-primary ring-2 ring-primary/20" : "border-border"
        }`}
        onClick={() => setSelectedDocType(type)}
      >
        <div className="flex items-center justify-center h-24 bg-muted/30 rounded-md mb-2 overflow-hidden">
          {doc.url ? (
            isPdf ? (
              <div className="relative w-16 h-20">
                <div className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-sm shadow-md flex items-center justify-center">
                  <FileText className="h-8 w-8 text-red-500/70" />
                </div>
                <div className="absolute inset-0 translate-x-1 translate-y-1 bg-white dark:bg-gray-800 rounded-sm shadow-md flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            ) : (
              <img
                src={doc.url || "/placeholder.svg"}
                alt={type}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=100&width=80"
                }}
              />
            )
          ) : (
            <FileText className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
        <div className="text-xs font-medium truncate mb-1">{type.replace(/([A-Z])/g, " $1").trim()}</div>
        <div className="absolute top-2 right-2">{getStatusBadge(doc.status)}</div>
      </div>
    )
  }

  const renderDocumentSection = (title: string, documents: Record<string, DocumentStatus>, category: string) => {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">{title}</h3>
          <Button variant="outline" size="sm" onClick={() => setSelectedDocCategory(category)}>
            View All
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(documents).map(([key, doc]) => (
            <div key={key}>{renderDocumentThumbnail(doc, key)}</div>
          ))}
        </div>
      </div>
    )
  }

  const renderDocumentPreview = () => {
    if (!selectedDocType || !selectedDocCategory) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Select a document to preview</p>
        </div>
      )
    }

    // Get the category object first
    const categoryDocs = documents[selectedDocCategory as keyof typeof documents]
    if (!categoryDocs) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Category not found</p>
        </div>
      )
    }

    // Then safely access the document
    const doc = categoryDocs[selectedDocType as keyof typeof categoryDocs] as DocumentStatus | undefined

    if (!doc || !doc.url) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No document available</p>
        </div>
      )
    }

    const isPdf = doc.url.endsWith(".pdf")

    if (isPdf) {
      return (
        <div className="h-full border rounded-lg overflow-hidden flex flex-col">
          <div className="p-2 bg-muted/30 border-b flex justify-between items-center">
            <span className="text-sm font-medium truncate">{selectedDocType.replace(/([A-Z])/g, " $1").trim()}</span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="h-7 w-7 p-0" asChild>
                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                  <Maximize className="h-3 w-3" />
                </a>
              </Button>
              <Button size="sm" variant="outline" className="h-7 w-7 p-0" asChild>
                <a href={doc.url} download>
                  <Download className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
          <iframe src={doc.url} className="w-full flex-1" title={`${selectedDocType} Document`} />
        </div>
      )
    }

    return (
      <div className="h-full border rounded-lg overflow-hidden flex flex-col">
        <div className="p-2 bg-muted/30 border-b flex justify-between items-center">
          <span className="text-sm font-medium truncate">{selectedDocType.replace(/([A-Z])/g, " $1").trim()}</span>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="h-7 w-7 p-0" asChild>
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                <Maximize className="h-3 w-3" />
              </a>
            </Button>
            <Button size="sm" variant="outline" className="h-7 w-7 p-0" asChild>
              <a href={doc.url} download>
                <Download className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1 bg-muted/10 p-4">
          <img
            src={doc.url || "/placeholder.svg"}
            alt={`${selectedDocType} Document`}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=300&width=400"
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{applicantName}'s Documents</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Download All
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="docs">Documents</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="docs" className="flex-1 flex flex-col">
          <div className="grid grid-cols-5 gap-6 h-full">
            <div className="col-span-2 overflow-y-auto pr-4">
              {renderDocumentSection("KYC", documents.kyc, "kyc")}
              {renderDocumentSection("Financial", documents.financial, "financial")}
              {documents.additional && renderDocumentSection("Additional", documents.additional, "additional")}
            </div>
            <div className="col-span-3 flex flex-col">
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Document Preview</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">{renderDocumentPreview()}</CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Upload Document</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="document-upload" className="mb-2 block text-xs">
                        Select file (.jpg, .jpeg, .png, .pdf)
                      </Label>
                      <Input
                        id="document-upload"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                        className="cursor-pointer text-xs"
                      />
                      {selectedFile && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <FileText className="h-3 w-3" />
                          <span className="truncate">{selectedFile.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0"
                            onClick={() => setSelectedFile(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || !selectedDocType || isUploading}
                        className="w-full text-xs"
                        size="sm"
                      >
                        {isUploading ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span> Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-3 w-3 mr-2" /> Upload
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results" className="flex-1">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-8">
                {/* KYC Verification Status */}
                <div>
                  <h3 className="text-lg font-medium mb-4">KYC Verification Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">PAN Card</span>
                        {getStatusBadge(documents.kyc.panCard.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {documents.kyc.panCard.status === "approved"
                          ? "PAN details verified successfully"
                          : documents.kyc.panCard.status === "rejected"
                            ? "PAN verification failed"
                            : "PAN verification pending"}
                      </p>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Aadhar Card</span>
                        {getStatusBadge(documents.kyc.aadharCard.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {documents.kyc.aadharCard.status === "approved"
                          ? "Aadhar details verified successfully"
                          : documents.kyc.aadharCard.status === "rejected"
                            ? "Aadhar verification failed"
                            : "Aadhar verification pending"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* OCR Data */}
                <div>
                  <h3 className="text-lg font-medium mb-4">OCR Extracted Data</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Personal Information</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <Label className="text-xs text-muted-foreground">Full Name</Label>
                          <div className="font-medium">{documents.ocrData?.name || applicantName}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                          <div className="font-medium">{documents.ocrData?.dob || "Not available"}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Label className="text-xs text-muted-foreground">PAN Number</Label>
                          <div className="font-medium">{documents.ocrData?.pan || "Not available"}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Label className="text-xs text-muted-foreground">Address</Label>
                          <div className="font-medium">{documents.ocrData?.address || "Not available"}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Financial Information</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <Label className="text-xs text-muted-foreground">Annual Income</Label>
                          <div className="font-medium">{documents.ocrData?.income || "Not available"}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Label className="text-xs text-muted-foreground">Source of Income</Label>
                          <div className="font-medium">Salary</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Financial Document Status */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Financial Document Status</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Bank Statement</span>
                        {getStatusBadge(documents.financial.bankStatement.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {documents.financial.bankStatement.status === "approved"
                          ? "Bank statement verified"
                          : documents.financial.bankStatement.status === "rejected"
                            ? "Bank statement verification failed"
                            : "Bank statement verification pending"}
                      </p>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">ITR Statement</span>
                        {getStatusBadge(documents.financial.itrStatement.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {documents.financial.itrStatement.status === "approved"
                          ? "ITR statement verified"
                          : documents.financial.itrStatement.status === "rejected"
                            ? "ITR statement verification failed"
                            : "ITR statement verification pending"}
                      </p>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Form 16</span>
                        {getStatusBadge(documents.financial.form16.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {documents.financial.form16.status === "approved"
                          ? "Form 16 verified"
                          : documents.financial.form16.status === "rejected"
                            ? "Form 16 verification failed"
                            : "Form 16 verification pending"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Final Conclusion */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Final Conclusion</h3>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          <Check className="h-3 w-3 mr-1" /> Verified
                        </Badge>
                        <span className="text-sm font-medium">All essential documents verified</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        The applicant has submitted all required documents and they have been verified successfully. The
                        application can proceed to the next stage of processing.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
