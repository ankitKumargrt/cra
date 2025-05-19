"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, AlertCircle } from "lucide-react"

interface L1ApplicationsTableProps {
  filteredApplications: [string, any][]
  isNewApplication: (key: string) => boolean
  handleRowClick: (key: string) => void
}

export function L1ApplicationsTable({
  filteredApplications,
  isNewApplication,
  handleRowClick,
}: L1ApplicationsTableProps) {
  // Function to get KYC status badge with updated labels
  const getKycStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge variant="outline" className="bg-green-600/10 text-green-600 border-green-600/20">
            Successful
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="outline" className="bg-red-600/10 text-red-600 border-red-600/20">
            Failed
          </Badge>
        )
      case "Denied":
        return (
          <Badge variant="outline" className="bg-red-600/10 text-red-600 border-red-600/20">
            Failed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-300/10 text-gray-500 border-gray-300/20">
            {status}
          </Badge>
        )
    }
  }

  // Format timestamp to a readable date and time
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date"
      }

      // Format: DD/MM/YYYY, HH:MM
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear()
      const hours = date.getHours().toString().padStart(2, "0")
      const minutes = date.getMinutes().toString().padStart(2, "0")

      return `${day}/${month}/${year}, ${hours}:${minutes}`
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-medium">Name</th>
            <th className="text-left p-3 font-medium">PAN</th>
            <th className="text-left p-3 font-medium">Loan Type</th>
            <th className="text-left p-3 font-medium">Amount</th>
            <th className="text-left p-3 font-medium">Date & Time</th>
            <th className="text-left p-3 font-medium">KYC Status</th>
            <th className="text-left p-3 font-medium sticky right-0 bg-background z-10">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.map(([key, data], index) => {
            // Use full_name property if available, otherwise use the key
            const displayName = data.full_name || key
            return (
              <tr
                key={`${key}-${index}`}
                className={`border-b hover:bg-muted/50 transition-colors duration-300 cursor-pointer ${
                  isNewApplication(key) ? "bg-green-100 dark:bg-green-900/20" : ""
                }`}
                onClick={() => handleRowClick(key)}
              >
                <td className="p-3">
                  <div className="flex items-center">
                    <span className="font-medium">{displayName}</span>
                    {isNewApplication(key) && <Badge className="ml-2 bg-green-500 text-white">New</Badge>}
                  </div>
                </td>
                <td className="p-3">{data.personalDetails?.pan || data.pan_number || "N/A"}</td>
                <td className="p-3">{data.loanType || data.loan_type || "N/A"}</td>
                <td className="p-3">₹{(data.loanAmount || data.proposed_amount || 0).toLocaleString()}</td>
                <td className="p-3" title={data.createdAt || data.applicationDate}>
                  {data.createdAt ? formatTimestamp(data.createdAt) : data.applicationDate}
                </td>
                <td className="p-3">{getKycStatusBadge(data.kycStatus || "Pending")}</td>
                <td className="p-3 sticky right-0 bg-background z-10" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" disabled={true} title="Add/View Remarks (Disabled)">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" disabled={true} title="Chat with AI (Disabled)">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
