"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface DocumentConsentStepProps {
  documentConsent: boolean
  setDocumentConsent: (consent: boolean) => void
}

export function DocumentConsentStep({ documentConsent, setDocumentConsent }: DocumentConsentStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        <h3 className="font-medium text-base mb-2">Consent for Document Usage</h3>
        <p className="mb-2">Please review our document usage policy before proceeding.</p>
        <p className="mb-2">
          We value your privacy and security. By proceeding, you acknowledge and agree that the documents you provide,
          including but not limited to PAN, Aadhaar, Form 16, bank statements, and other financial records, will be used
          solely for financial analysis purposes.
        </p>
        <h4 className="font-medium mt-3 mb-1">Key Points:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="font-medium">Purpose:</span> The collected documents will be analyzed to assess your
            financial profile, including income verification, creditworthiness, and risk assessment.
          </li>
          <li>
            <span className="font-medium">Confidentiality:</span> Your data will be securely processed and will not be
            shared with third parties without your explicit consent, except as required by law or regulatory bodies.
          </li>
          <li>
            <span className="font-medium">Compliance:</span> We adhere to strict banking and financial regulations,
            ensuring that your data is handled in accordance with applicable data protection laws.
          </li>
        </ul>
      </div>
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="documentConsent"
            checked={documentConsent}
            onCheckedChange={(checked) => setDocumentConsent(checked as boolean)}
          />
          <Label htmlFor="documentConsent" className="text-sm leading-tight">
            I consent to the collection and verification of my documents for the purpose of loan application processing.
            I understand that my documents will be securely stored and used only for verification purposes.
          </Label>
        </div>
      </div>
    </div>
  )
}
