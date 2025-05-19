"use client"

import { useState } from "react"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Users } from "lucide-react"
import { L1AgentPerformanceTable } from "./l1-components/L1AgentPerformanceTable"

// Define the agent data type
export interface AgentData {
  id: number
  name: string
  kycSuccessRate: number
  totalApplications: number
  loanVolume: number
  target: number
  isEditing: boolean
}

// Mock data for L1 agents
const initialAgentsData: AgentData[] = [
  {
    id: 1,
    name: "Amit Kumar",
    kycSuccessRate: 94,
    totalApplications: 156,
    loanVolume: 8750000,
    target: 10000000,
    isEditing: false,
  },
  {
    id: 2,
    name: "Priya Sharma",
    kycSuccessRate: 97,
    totalApplications: 187,
    loanVolume: 12450000,
    target: 12000000,
    isEditing: false,
  },
  {
    id: 3,
    name: "Rahul Verma",
    kycSuccessRate: 89,
    totalApplications: 134,
    loanVolume: 7250000,
    target: 8000000,
    isEditing: false,
  },
  {
    id: 4,
    name: "Neha Patel",
    kycSuccessRate: 92,
    totalApplications: 142,
    loanVolume: 9120000,
    target: 9000000,
    isEditing: false,
  },
  {
    id: 5,
    name: "Vikram Singh",
    kycSuccessRate: 86,
    totalApplications: 112,
    loanVolume: 5430000,
    target: 7000000,
    isEditing: false,
  },
]

export type SortField = keyof Omit<AgentData, "isEditing">
export type SortDirection = "asc" | "desc"

export function L1AgentPerformanceTracker() {
  const [agentsData, setAgentsData] = useState(initialAgentsData)
  const [sortField, setSortField] = useState<SortField>("kycSuccessRate")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [editValues, setEditValues] = useState<Record<number, number>>({})

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedAgents = [...agentsData].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (sortDirection === "asc") {
      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue)
      }
      return (aValue as number) - (bValue as number)
    } else {
      if (typeof aValue === "string" && typeof bValue === "string") {
        return bValue.localeCompare(aValue)
      }
      return (bValue as number) - (aValue as number)
    }
  })

  const toggleEdit = (id: number) => {
    setAgentsData(
      agentsData.map((agent) => {
        if (agent.id === id) {
          if (!agent.isEditing) {
            setEditValues({ ...editValues, [id]: agent.target })
          }
          return { ...agent, isEditing: !agent.isEditing }
        }
        return agent
      }),
    )
  }

  const handleTargetChange = (id: number, value: string) => {
    const numValue = Number.parseInt(value.replace(/,/g, ""), 10) || 0
    setEditValues({ ...editValues, [id]: numValue })
  }

  const saveTarget = (id: number) => {
    setAgentsData(
      agentsData.map((agent) => {
        if (agent.id === id) {
          return { ...agent, target: editValues[id], isEditing: false }
        }
        return agent
      }),
    )
  }

  const cancelEdit = (id: number) => {
    setAgentsData(
      agentsData.map((agent) => {
        if (agent.id === id) {
          return { ...agent, isEditing: false }
        }
        return agent
      }),
    )
  }

  return (
    <AnimatedContainer className="grid gap-6 mb-8 mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          L1 Agent Performance Tracker
        </h2>
      </div>

      <AnimatedCard>
        <div className="p-4">
          <L1AgentPerformanceTable
            sortedAgents={sortedAgents}
            handleSort={handleSort}
            toggleEdit={toggleEdit}
            editValues={editValues}
            handleTargetChange={handleTargetChange}
            saveTarget={saveTarget}
            cancelEdit={cancelEdit}
          />
        </div>
      </AnimatedCard>
    </AnimatedContainer>
  )
}
