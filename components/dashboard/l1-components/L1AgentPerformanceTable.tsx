"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Save, X, ArrowUpDown } from "lucide-react"
import type { AgentData, SortField } from "../L1AgentPerformanceTracker"

interface L1AgentPerformanceTableProps {
  sortedAgents: AgentData[]
  handleSort: (field: SortField) => void
  toggleEdit: (id: number) => void
  editValues: Record<number, number>
  handleTargetChange: (id: number, value: string) => void
  saveTarget: (id: number) => void
  cancelEdit: (id: number) => void
}

export function L1AgentPerformanceTable({
  sortedAgents,
  handleSort,
  toggleEdit,
  editValues,
  handleTargetChange,
  saveTarget,
  cancelEdit,
}: L1AgentPerformanceTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getSuccessRateBadge = (rate: number) => {
    if (rate >= 95) return <Badge className="bg-green-500">Excellent</Badge>
    if (rate >= 90) return <Badge className="bg-emerald-500">Good</Badge>
    if (rate >= 85) return <Badge className="bg-amber-500">Average</Badge>
    return <Badge className="bg-red-500">Needs Improvement</Badge>
  }

  const getTargetAchievement = (volume: number, target: number) => {
    const percentage = Math.round((volume / target) * 100)

    if (percentage >= 100) return <Badge className="bg-green-500">{percentage}% Achieved</Badge>
    if (percentage >= 90) return <Badge className="bg-emerald-500">{percentage}% On Track</Badge>
    if (percentage >= 75) return <Badge className="bg-amber-500">{percentage}% Behind</Badge>
    return <Badge className="bg-red-500">{percentage}% At Risk</Badge>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px]">
            <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
              Agent Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort("kycSuccessRate")}>
              KYC Success Rate
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort("totalApplications")}>
              Total Applications
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort("loanVolume")}>
              Loan Volume
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort("target")}>
              Target
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead>Achievement</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedAgents.map((agent) => (
          <TableRow key={agent.id}>
            <TableCell className="font-medium">{agent.name}</TableCell>
            <TableCell>
              {agent.kycSuccessRate}% {getSuccessRateBadge(agent.kycSuccessRate)}
            </TableCell>
            <TableCell>{agent.totalApplications}</TableCell>
            <TableCell>{formatCurrency(agent.loanVolume)}</TableCell>
            <TableCell>
              {agent.isEditing ? (
                <Input
                  value={editValues[agent.id]?.toLocaleString() || ""}
                  onChange={(e) => handleTargetChange(agent.id, e.target.value)}
                  className="w-32"
                />
              ) : (
                formatCurrency(agent.target)
              )}
            </TableCell>
            <TableCell>{getTargetAchievement(agent.loanVolume, agent.target)}</TableCell>
            <TableCell className="text-right">
              {agent.isEditing ? (
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => saveTarget(agent.id)}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => cancelEdit(agent.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => toggleEdit(agent.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
