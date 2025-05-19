export function formatCombinedContent(kycContent?: string, itrContent?: string): string {
  if (!kycContent && !itrContent) return ""

  // 1. FINAL VERDICT SECTION
  // Extract KYC status from the KYC content
  const kycFinalVerdictRegex = /\*\*Final Verdict:\*\*\s*(.*?)(?:\.|$)/i
  const kycFinalVerdictMatch = kycContent?.match(kycFinalVerdictRegex)
  const kycStatus = kycFinalVerdictMatch ? kycFinalVerdictMatch[1].trim() : "KYC Successful"

  // Extract ITR conclusion from the ITR content
  const itrConclusionRegex = /\*\*Conclusion:\*\*([\s\S]*?)(?=\n\n|\n$|$)/i
  const itrConclusionMatch = itrContent?.match(itrConclusionRegex)
  const itrConclusion = itrConclusionMatch
    ? itrConclusionMatch[1].trim()
    : "All extracted details and comparisons indicate a high degree of consistency and accuracy in the provided documents."

  // Check for discrepancies
  const discrepanciesRegex = /\*\*Discrepancies.*?:\*\*([\s\S]*?)(?=\*\*|\n\n\*\*[^D]|\n\n##|\n\n###|$)/i
  const discrepanciesMatch = itrContent?.match(discrepanciesRegex)
  const discrepanciesContent = discrepanciesMatch ? discrepanciesMatch[1].trim() : ""

  // Determine if there are discrepancies
  const hasNoDiscrepancies =
    discrepanciesContent.toLowerCase().includes("no discrepancies") ||
    discrepanciesContent.toLowerCase().includes("no significant discrepancies") ||
    !discrepanciesContent.includes("discrepancies were found")

  const itrVerificationStatus = hasNoDiscrepancies
    ? "All essential details match, and no significant discrepancies were found."
    : "Some discrepancies were found in the documents."

  // 2. COMPARISON AND FINDINGS SECTION
  // More flexible regex patterns for extracting sections

  // Try to extract PAN vs Aadhar comparison - multiple patterns
  let panVsAadharContent = ""
  const panVsAadharPatterns = [
    /\*\*PAN vs Aadhar:\*\*([\s\S]*?)(?=\*\*Bank|\*\*Final Verdict|\n\n\*\*[^P]|\n\n##|\n\n###|$)/i,
    /\*\*Name Comparison $$PAN vs\. Aadhar$$:\*\*([\s\S]*?)(?=\*\*Date|\*\*Bank|\*\*Final Verdict|\n\n\*\*[^N]|\n\n##|\n\n###|$)/i,
  ]

  for (const pattern of panVsAadharPatterns) {
    const match = kycContent?.match(pattern)
    if (match && match[1].trim()) {
      panVsAadharContent = match[1].trim()
      break
    }
  }

  // Try to extract Bank vs Aadhar comparison - multiple patterns
  let bankVsAadharContent = ""
  const bankVsAadharPatterns = [
    /\*\*Bank Statement vs Aadhar:\*\*([\s\S]*?)(?=\*\*Final Verdict|\n\n\*\*[^B]|\n\n##|\n\n###|$)/i,
    /\*\*Bank vs Aadhar:\*\*([\s\S]*?)(?=\*\*Final Verdict|\n\n\*\*[^B]|\n\n##|\n\n###|$)/i,
    /\*\*Address Comparison $$Aadhar vs\. Bank Statement$$:\*\*([\s\S]*?)(?=\*\*Final Verdict|\n\n\*\*[^A]|\n\n##|\n\n###|$)/i,
  ]

  for (const pattern of bankVsAadharPatterns) {
    const match = kycContent?.match(pattern)
    if (match && match[1].trim()) {
      bankVsAadharContent = match[1].trim()
      break
    }
  }

  // Extract name and PAN matching from ITR content - multiple patterns
  let namePanMatching = ""
  const namePanMatchingPatterns = [
    /\*\*Name and PAN Number Matching:\*\*([\s\S]*?)(?=\*\*Employer|\n\n\*\*[^N]|\n\n##|\n\n###|$)/i,
    /\*\*Name and PAN Number Matching\*\*([\s\S]*?)(?=\*\*Employer|\n\n\*\*[^N]|\n\n##|\n\n###|$)/i,
    /Name and PAN Number Matching:([\s\S]*?)(?=Employer|Discrepancies|\n\n|$)/i,
    /Name and PAN Number Matching([\s\S]*?)(?=Employer|Discrepancies|\n\n|$)/i,
  ]

  for (const pattern of namePanMatchingPatterns) {
    const match = itrContent?.match(pattern)
    if (match && match[1].trim()) {
      namePanMatching = match[1].trim()
      break
    }
  }

  // Try to extract from Comparison Results section if still not found
  if (!namePanMatching && itrContent) {
    const comparisonResultsRegex = /### Comparison Results([\s\S]*?)(?=###|$)/i
    const comparisonResultsMatch = itrContent.match(comparisonResultsRegex)

    if (comparisonResultsMatch) {
      const namePanSection = comparisonResultsMatch[1].match(
        /\*\*Name and PAN Number Matching:\*\*([\s\S]*?)(?=\*\*Employer|\n\n\*\*|$)/i,
      )
      if (namePanSection) {
        namePanMatching = namePanSection[1].trim()
      }
    }
  }

  // Extract employer matching from ITR content - multiple patterns
  let employerMatching = ""
  const employerMatchingPatterns = [
    /\*\*Employer Name Matching:\*\*([\s\S]*?)(?=\*\*Discrepancies|\n\n\*\*[^E]|\n\n##|\n\n###|$)/i,
    /\*\*Employer Name Matching\*\*([\s\S]*?)(?=\*\*Discrepancies|\n\n\*\*[^E]|\n\n##|\n\n###|$)/i,
    /Employer Name Matching:([\s\S]*?)(?=Discrepancies|\n\n|$)/i,
    /Employer Name Matching([\s\S]*?)(?=Discrepancies|\n\n|$)/i,
  ]

  for (const pattern of employerMatchingPatterns) {
    const match = itrContent?.match(pattern)
    if (match && match[1].trim()) {
      employerMatching = match[1].trim()
      break
    }
  }

  // Try to extract from Comparison Results section if still not found
  if (!employerMatching && itrContent) {
    const comparisonResultsRegex = /### Comparison Results([\s\S]*?)(?=###|$)/i
    const comparisonResultsMatch = itrContent.match(comparisonResultsRegex)

    if (comparisonResultsMatch) {
      const employerSection = comparisonResultsMatch[1].match(
        /\*\*Employer Name Matching:\*\*([\s\S]*?)(?=\*\*Discrepancies|\n\n\*\*|$)/i,
      )
      if (employerSection) {
        employerMatching = employerSection[1].trim()
      }
    }
  }

  // 3. KYC DOCUMENT ANALYSIS
  // Extract PAN Card Details table - multiple patterns
  let panCardDetailsTable = ""
  const panCardDetailsPatterns = [
    /\*\*PAN Card Details:\*\*\n\n\| Field \| Value \|\n\|[-|]*\|([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /\*\*PAN Card Details:\*\*\s*\n\s*\| Field \| Value \|\s*\n\s*\|[-|]*\|\s*([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /\*\*PAN Card Details\*\*\s*\n\s*\| Field \| Value \|\s*\n\s*\|[-|]*\|\s*([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
  ]

  for (const pattern of panCardDetailsPatterns) {
    const match = kycContent?.match(pattern)
    if (match && match[1].trim()) {
      panCardDetailsTable = "| Field | Value |\n|---|---|\n" + match[1].trim()
      break
    }
  }

  // Extract Aadhar Card Details table - multiple patterns
  let aadharCardDetailsTable = ""
  const aadharCardDetailsPatterns = [
    /\*\*Aadhar Card Details:\*\*\n\n\| Field \| Value \|\n\|[-|]*\|([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /\*\*Aadhar Card Details:\*\*\s*\n\s*\| Field \| Value \|\s*\n\s*\|[-|]*\|\s*([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /\*\*Aadhar Card Details\*\*\s*\n\s*\| Field \| Value \|\s*\n\s*\|[-|]*\|\s*([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
  ]

  for (const pattern of aadharCardDetailsPatterns) {
    const match = kycContent?.match(pattern)
    if (match && match[1].trim()) {
      aadharCardDetailsTable = "| Field | Value |\n|---|---|\n" + match[1].trim()
      break
    }
  }

  // Extract Bank Statement Details table - multiple patterns
  let bankStatementDetailsTable = ""
  const bankStatementDetailsPatterns = [
    /\*\*Bank Statement Details:\*\*\n\n\| Field \| Value \|\n\|[-|]*\|([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /\*\*Bank Statement Details:\*\*\s*\n\s*\| Field \| Value \|\s*\n\s*\|[-|]*\|\s*([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /\*\*Bank Statement Details\*\*\s*\n\s*\| Field \| Value \|\s*\n\s*\|[-|]*\|\s*([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
  ]

  for (const pattern of bankStatementDetailsPatterns) {
    const match = kycContent?.match(pattern)
    if (match && match[1].trim()) {
      bankStatementDetailsTable = "| Field | Value |\n|---|---|\n" + match[1].trim()
      break
    }
  }

  // 4. ITR DOCUMENT ANALYSIS
  // Extract PAN Card table from ITR - multiple patterns
  let itrPanCardTable = ""
  const itrPanCardPatterns = [
    /\*\*PAN Card:\*\*\n\| Field \| Value \|\n\|[-|]*\|([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /\*\*PAN Card:\*\*\s*\n\s*\| Field \| Value \|\s*\n\s*\|[-|]*\|\s*([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /\*\*PAN Card\*\*\s*\n\s*\| Field \| Value \|\s*\n\s*\|[-|]*\|\s*([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /PAN Card:([\s\S]*?)(?=ITR:|Form 16:|\n\n|$)/i,
  ]

  for (const pattern of itrPanCardPatterns) {
    const match = itrContent?.match(pattern)
    if (match && match[1].trim()) {
      // Check if it already contains the table header
      if (match[1].trim().startsWith("| Field | Value |")) {
        itrPanCardTable = match[1].trim()
      } else {
        itrPanCardTable = "| Field | Value |\n|---|---|\n" + match[1].trim()
      }
      break
    }
  }

  // Try to extract from Extracted Details section if still not found
  if (!itrPanCardTable && itrContent) {
    const extractedDetailsRegex = /### Extracted Details([\s\S]*?)(?=### Comparison|$)/i
    const extractedDetailsMatch = itrContent.match(extractedDetailsRegex)

    if (extractedDetailsMatch) {
      const panCardSection = extractedDetailsMatch[1].match(
        /\*\*PAN Card:\*\*([\s\S]*?)(?=\*\*ITR|\*\*Form|\n\n\*\*|$)/i,
      )
      if (panCardSection && panCardSection[1].includes("| Field | Value |")) {
        itrPanCardTable = panCardSection[1].trim()
      }
    }
  }

  // Extract ITR table - multiple patterns
  let itrTable = ""
  const itrTablePatterns = [
    /\*\*ITR:\*\*\n\| Field \| Value \|\n\|[-|]*\|([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /\*\*ITR:\*\*\s*\n\s*\| Field \| Value \|\s*\n\s*\|[-|]*\|\s*([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /\*\*ITR\*\*\s*\n\s*\| Field \| Value \|\s*\n\s*\|[-|]*\|\s*([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /ITR:([\s\S]*?)(?=Form 16:|\n\n|$)/i,
  ]

  for (const pattern of itrTablePatterns) {
    const match = itrContent?.match(pattern)
    if (match && match[1].trim()) {
      // Check if it already contains the table header
      if (match[1].trim().startsWith("| Field | Value |")) {
        itrTable = match[1].trim()
      } else {
        itrTable = "| Field | Value |\n|---|---|\n" + match[1].trim()
      }
      break
    }
  }

  // Try to extract from Extracted Details section if still not found
  if (!itrTable && itrContent) {
    const extractedDetailsRegex = /### Extracted Details([\s\S]*?)(?=### Comparison|$)/i
    const extractedDetailsMatch = itrContent.match(extractedDetailsRegex)

    if (extractedDetailsMatch) {
      const itrSection = extractedDetailsMatch[1].match(/\*\*ITR:\*\*([\s\S]*?)(?=\*\*Form|\n\n\*\*|$)/i)
      if (itrSection && itrSection[1].includes("| Field | Value |")) {
        itrTable = itrSection[1].trim()
      }
    }
  }

  // Extract Form 16 table - multiple patterns
  let form16Table = ""
  const form16Patterns = [
    /\*\*Form 16:\*\*\n\| Field \| Value \|\n\|[-|]*\|([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /\*\*Form 16:\*\*\s*\n\s*\| Field \| Value \|\s*\n\s*\|[-|]*\|\s*([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /\*\*Form 16\*\*\s*\n\s*\| Field \| Value \|\s*\n\s*\|[-|]*\|\s*([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i,
    /Form 16:([\s\S]*?)(?=\n\n|$)/i,
  ]

  for (const pattern of form16Patterns) {
    const match = itrContent?.match(pattern)
    if (match && match[1].trim()) {
      // Check if it already contains the table header
      if (match[1].trim().startsWith("| Field | Value |")) {
        form16Table = match[1].trim()
      } else {
        form16Table = "| Field | Value |\n|---|---|\n" + match[1].trim()
      }
      break
    }
  }

  // Try to extract from Extracted Details section if still not found
  if (!form16Table && itrContent) {
    const extractedDetailsRegex = /### Extracted Details([\s\S]*?)(?=### Comparison|$)/i
    const extractedDetailsMatch = itrContent.match(extractedDetailsRegex)

    if (extractedDetailsMatch) {
      const form16Section = extractedDetailsMatch[1].match(/\*\*Form 16:\*\*([\s\S]*?)(?=\n\n\*\*|$)/i)
      if (form16Section && form16Section[1].includes("| Field | Value |")) {
        form16Table = form16Section[1].trim()
      }
    }
  }

  // Extract note from ITR content
  const noteRegex = /\*\*Note:\*\*([\s\S]*?)(?=\n\n\*\*|\n\n##|\n\n###|$)/i
  const noteMatch = itrContent?.match(noteRegex)
  const note = noteMatch ? noteMatch[1].trim() : ""

  // Alternative approach: Try to extract tables directly using a more general pattern
  if (!panCardDetailsTable && kycContent) {
    const tableMatch = kycContent.match(
      /PAN Card Details[\s\S]*?\| Field \| Value \|[\s\S]*?\|([\s\S]*?)(?=\n\n|\n\*\*|$)/i,
    )
    if (tableMatch) {
      panCardDetailsTable = "| Field | Value |\n|---|---|\n" + tableMatch[1].trim()
    }
  }

  if (!aadharCardDetailsTable && kycContent) {
    const tableMatch = kycContent.match(
      /Aadhar Card Details[\s\S]*?\| Field \| Value \|[\s\S]*?\|([\s\S]*?)(?=\n\n|\n\*\*|$)/i,
    )
    if (tableMatch) {
      aadharCardDetailsTable = "| Field | Value |\n|---|---|\n" + tableMatch[1].trim()
    }
  }

  if (!bankStatementDetailsTable && kycContent) {
    const tableMatch = kycContent.match(
      /Bank Statement Details[\s\S]*?\| Field \| Value \|[\s\S]*?\|([\s\S]*?)(?=\n\n|\n\*\*|$)/i,
    )
    if (tableMatch) {
      bankStatementDetailsTable = "| Field | Value |\n|---|---|\n" + tableMatch[1].trim()
    }
  }

  // Direct table extraction for ITR tables
  if (!itrPanCardTable && itrContent) {
    // Look for a table that contains PAN Number and Name
    const tableMatch = itrContent.match(/\| Field \| Value \|[\s\S]*?PAN Number[\s\S]*?Name[\s\S]*?(?=\n\n|\n\*\*|$)/i)
    if (tableMatch) {
      itrPanCardTable = tableMatch[0].trim()
    }
  }

  if (!itrTable && itrContent) {
    // Look for a table that contains Assessment Year and Total Income
    const tableMatch = itrContent.match(
      /\| Field \| Value \|[\s\S]*?Assessment Year[\s\S]*?Total Income[\s\S]*?(?=\n\n|\n\*\*|$)/i,
    )
    if (tableMatch) {
      itrTable = tableMatch[0].trim()
    }
  }

  if (!form16Table && itrContent) {
    // Look for a table that contains Employee Name and Employer Name
    const tableMatch = itrContent.match(
      /\| Field \| Value \|[\s\S]*?Employee Name[\s\S]*?Employer Name[\s\S]*?(?=\n\n|\n\*\*|$)/i,
    )
    if (tableMatch) {
      form16Table = tableMatch[0].trim()
    }
  }

  // Extract comparison findings as a fallback
  const comparisonFindingsRegex =
    /\*\*Comparison and Findings:\*\*([\s\S]*?)(?=\*\*Final Verdict|\n\n\*\*[^C]|\n\n##|\n\n###|$)/i
  const comparisonFindingsMatch = kycContent?.match(comparisonFindingsRegex)
  const comparisonFindings = comparisonFindingsMatch ? comparisonFindingsMatch[1].trim() : ""

  // If we still don't have PAN vs Aadhar content, try to extract it from the general comparison findings
  if (!panVsAadharContent && comparisonFindings) {
    panVsAadharContent = comparisonFindings
  }

  // Build the combined content according to the requested structure
  return `# 1. Final Verdict

**KYC Status:** ${kycStatus}

**ITR Verification:** ${itrVerificationStatus}

---

# 2. Comparison and Findings

## PAN vs Aadhar
${panVsAadharContent || "*No comparison data available*"}

## Bank vs Aadhar
${bankVsAadharContent || "*No comparison data available*"}

## Name and PAN Number Matching (ITR)
${namePanMatching || "*No matching data available*"}

## Employer Name Matching
${employerMatching || "*No matching data available*"}

## Discrepancies (if any)
${discrepanciesContent || "*No discrepancies found*"}

---

# 3. KYC Document Analysis

## PAN Card Details
${panCardDetailsTable || "*No PAN card details available*"}

## Aadhar Card Details
${aadharCardDetailsTable || "*No Aadhar card details available*"}

## Bank Statement Details
${bankStatementDetailsTable || "*No bank statement details available*"}

---

# 4. ITR Document Analysis

## PAN Card
${itrPanCardTable || "*No PAN card details available in ITR*"}

## ITR
${itrTable || "*No ITR details available*"}

## Form 16
${form16Table || "*No Form 16 details available*"}

---

# 5. Financial Document Comparison Report

${itrConclusion || "*No comparison report available*"}

${note ? `\n**Note:** ${note}` : ""}

---

# 6. Conclusion

All KYC and financial document verifications have been completed. The verification process has analyzed and compared information across multiple documents to ensure consistency and accuracy.
`
}
