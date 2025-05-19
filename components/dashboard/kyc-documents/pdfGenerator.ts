import { jsPDF } from "jspdf"
// Remove the jspdf-autotable import since it's not available

export function generatePdf(content: string, _unusedContent = "", applicantName = "Applicant") {
  return new Promise<void>((resolve, reject) => {
    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      })

      // Define PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const margin = 40
      const contentWidth = pdfWidth - margin * 2

      // Add title
      const title = `${applicantName}'s Document Verification Report`
      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.text(title, margin, margin + 10)

      let yPosition = margin + 40 // Start position after title

      // Process content in smaller chunks to prevent freezing
      const lines = content ? content.split("\n").filter((line) => line && typeof line === "string") : []
      const maxLinesPerChunk = 50 // Process content in chunks to prevent UI blocking

      for (let i = 0; i < lines.length; i += maxLinesPerChunk) {
        const chunk = lines.slice(i, i + maxLinesPerChunk)

        // Process each line in the chunk
        chunk.forEach((line) => {
          // Skip if line is undefined or null
          if (!line) return

          // Safely trim the line
          line = typeof line === "string" ? line.trim() : ""
          if (!line) return

          // Skip processing if we've gone too far (safety check)
          if (yPosition > 10000) {
            console.warn("PDF generation safety limit reached")
            return
          }

          // Check if we need a new page
          if (yPosition + 30 > pdf.internal.pageSize.getHeight() - margin) {
            pdf.addPage()
            yPosition = margin
          }

          // Handle different line types
          if (line.startsWith("# ")) {
            // Main header (h1)
            const headerText = line.replace(/^# /, "")
            pdf.setFontSize(18)
            pdf.setFont("helvetica", "bold")
            pdf.text(headerText, margin, yPosition)
            yPosition += 25
          } else if (line.startsWith("## ")) {
            // Subheader (h2)
            const headerText = line.replace(/^## /, "")
            pdf.setFontSize(16)
            pdf.setFont("helvetica", "bold")
            pdf.text(headerText, margin, yPosition)
            yPosition += 20
          } else if (line.startsWith("### ")) {
            // Sub-subheader (h3)
            const headerText = line.replace(/^### /, "")
            pdf.setFontSize(14)
            pdf.setFont("helvetica", "bold")
            pdf.text(headerText, margin, yPosition)
            yPosition += 18
          } else if (line === "---") {
            // Horizontal rule
            pdf.setDrawColor(200, 200, 200)
            pdf.line(margin, yPosition - 5, pdfWidth - margin, yPosition - 5)
            yPosition += 15
          } else if (line.startsWith("* ") || line.startsWith("- ")) {
            // Bullet point
            const bulletText = line.replace(/^[*-] /, "• ").replace(/\*\*/g, "")
            pdf.setFontSize(12)
            pdf.setFont("helvetica", "normal")

            const textLines = pdf.splitTextToSize(bulletText, contentWidth)
            pdf.text(textLines, margin, yPosition)
            yPosition += textLines.length * 14 + 5
          } else if (line.startsWith("|")) {
            // Table row - collect all table rows
            const tableRows = []
            let j = i
            while (j < lines.length && lines[j] && typeof lines[j] === "string" && lines[j].trim().startsWith("|")) {
              tableRows.push(lines[j])
              j++
            }

            // Skip header separator row (|---|---|)
            const tableData = tableRows
              .filter((row) => !row.match(/^\|\s*[-:]+\s*\|/))
              .map((row) =>
                row
                  .split("|")
                  .filter(Boolean)
                  .map((cell) => (cell && typeof cell === "string" ? cell.trim() : "")),
              )

            // Extract header and body
            const headers = tableData[0]
            const body = tableData.slice(1)

            // Manually create a simple table since we don't have autoTable
            if (headers && body.length > 0) {
              // Check if we need a new page for the table
              if (yPosition + 30 + body.length * 20 > pdf.internal.pageSize.getHeight() - margin) {
                pdf.addPage()
                yPosition = margin
              }

              // Calculate column widths
              const numColumns = headers.length
              const colWidth = contentWidth / numColumns

              // Draw table header
              pdf.setFillColor(240, 240, 240)
              pdf.rect(margin, yPosition - 15, contentWidth, 20, "F")
              pdf.setFont("helvetica", "bold")
              pdf.setFontSize(12)

              headers.forEach((header, idx) => {
                const xPos = margin + idx * colWidth
                pdf.text(header || "", xPos + 5, yPosition)
              })

              yPosition += 15

              // Draw table rows
              pdf.setFont("helvetica", "normal")

              body.forEach((row, rowIdx) => {
                // Alternate row background
                if (rowIdx % 2 === 0) {
                  pdf.setFillColor(250, 250, 250)
                  pdf.rect(margin, yPosition - 15, contentWidth, 20, "F")
                }

                row.forEach((cell, cellIdx) => {
                  const xPos = margin + cellIdx * colWidth
                  const cellText = pdf.splitTextToSize(cell || "", colWidth - 10)
                  pdf.text(cellText, xPos + 5, yPosition)

                  // Adjust row height if needed for multi-line cells
                  if (cellText.length > 1 && cellIdx === 0) {
                    yPosition += (cellText.length - 1) * 14
                  }
                })

                yPosition += 20
              })

              // Add some space after the table
              yPosition += 15
            }

            // Skip the table rows we've processed
            i = j - 1
          } else {
            // Regular text
            const text = line.replace(/\*\*/g, "")
            pdf.setFontSize(12)
            pdf.setFont("helvetica", "normal")

            // Check for bold text with **
            if (line.includes("**")) {
              // Handle bold text
              const parts = line.split(/(\*\*.*?\*\*)/g)
              let xPos = margin

              for (const part of parts) {
                if (part && typeof part === "string") {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    // Bold text
                    const boldText = part.replace(/\*\*/g, "")
                    pdf.setFont("helvetica", "bold")
                    const width = pdf.getTextWidth(boldText)
                    pdf.text(boldText, xPos, yPosition)
                    xPos += width
                    pdf.setFont("helvetica", "normal")
                  } else if (part.trim()) {
                    // Regular text
                    const width = pdf.getTextWidth(part)
                    pdf.text(part, xPos, yPosition)
                    xPos += width
                  }
                }
              }
              yPosition += 14
            } else {
              // Regular text without bold
              const textLines = pdf.splitTextToSize(text, contentWidth)
              pdf.text(textLines, margin, yPosition)
              yPosition += textLines.length * 14 + 5
            }
          }
        })
      }

      // Add footer with date
      const date = new Date().toLocaleDateString()
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Generated on ${date}`, margin, pdf.internal.pageSize.getHeight() - 20)

      // Save the PDF
      const pdfName = applicantName.replace(/\s+/g, "_")
      pdf.save(`${pdfName}_verification_report.pdf`)

      resolve()
    } catch (error) {
      console.error("PDF generation error:", error)
      reject(error)
    }
  })
}

// Keep the generateDtiPdf function for backward compatibility
export function generateDtiPdf(dtiContent: string, dtiScore: number | undefined, applicantName: string | null) {
  return new Promise<void>((resolve, reject) => {
    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      })

      // Define PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const margin = 40
      const contentWidth = pdfWidth - margin * 2

      // Add title
      const title = applicantName ? `${applicantName}'s DTI Analysis` : "DTI Analysis"

      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.text(title, margin, margin + 10)

      let yPosition = margin + 40 // Start position after title

      // Add DTI score if available
      if (dtiScore !== undefined) {
        pdf.setFontSize(14)
        pdf.setFont("helvetica", "bold")
        pdf.text(`DTI Score: ${dtiScore}`, margin, yPosition)
        yPosition += 25
      }

      // Process content in smaller chunks to prevent freezing
      const lines = dtiContent.split("\n").filter((line) => line.trim() !== "")
      const maxLinesPerChunk = 50 // Process content in chunks to prevent UI blocking

      for (let i = 0; i < lines.length; i += maxLinesPerChunk) {
        const chunk = lines.slice(i, i + maxLinesPerChunk)

        // Process each line in the chunk
        chunk.forEach((line) => {
          line = line.trim()
          if (!line) return

          // Skip processing if we've gone too far (safety check)
          if (yPosition > 10000) {
            console.warn("PDF generation safety limit reached")
            return
          }

          // Check if we need a new page
          if (yPosition + 30 > pdf.internal.pageSize.getHeight() - margin) {
            pdf.addPage()
            yPosition = margin
          }

          // Handle different line types
          if (line.startsWith("# ") || line.startsWith("## ") || line.startsWith("### ")) {
            // Section header
            const headerText = line.replace(/^#+\s/, "")
            pdf.setFontSize(14)
            pdf.setFont("helvetica", "bold")
            pdf.text(headerText, margin, yPosition)
            yPosition += 20
          } else if (line.includes(":")) {
            // Key-value pair
            const parts = line.split(":")
            const key = parts[0].trim().replace(/\*\*/g, "")
            const value = parts.slice(1).join(":").trim().replace(/\*\*/g, "")

            pdf.setFontSize(12)
            pdf.setFont("helvetica", "bold")

            // Split text to fit page width
            const keyLines = pdf.splitTextToSize(key + ":", contentWidth * 0.4)
            pdf.text(keyLines, margin, yPosition)

            pdf.setFont("helvetica", "normal")
            const valueLines = pdf.splitTextToSize(value, contentWidth * 0.6)
            pdf.text(valueLines, margin + contentWidth * 0.4, yPosition)

            // Calculate the height needed for this row
            const lineHeight = Math.max(keyLines.length, valueLines.length) * 14
            yPosition += lineHeight + 5
          } else if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
            // Bullet point
            const bulletText = line.replace(/^[•\-*]\s*/, "• ").replace(/\*\*/g, "")
            pdf.setFontSize(12)
            pdf.setFont("helvetica", "normal")

            const textLines = pdf.splitTextToSize(bulletText, contentWidth)
            pdf.text(textLines, margin, yPosition)
            yPosition += textLines.length * 14 + 5
          } else {
            // Regular text
            const text = line.replace(/\*\*/g, "")
            pdf.setFontSize(12)
            pdf.setFont("helvetica", "normal")

            const textLines = pdf.splitTextToSize(text, contentWidth)
            pdf.text(textLines, margin, yPosition)
            yPosition += textLines.length * 14 + 5
          }
        })
      }

      // Add footer with date
      const date = new Date().toLocaleDateString()
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Generated on ${date}`, margin, pdf.internal.pageSize.getHeight() - 20)

      // Save the PDF
      const pdfName = applicantName ? applicantName.replace(/\s+/g, "_") : "applicant"
      pdf.save(`${pdfName}_dti_analysis.pdf`)

      resolve()
    } catch (error) {
      console.error("PDF generation error:", error)
      reject(error)
    }
  })
}
