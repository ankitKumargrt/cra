import { Badge } from "@/components/ui/badge"
import { Check, X, AlertCircle } from "lucide-react"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
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
