"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedDonutChart } from "@/components/ui/animated-donut-chart"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { Button } from "@/components/ui/button"
import { Edit2, Save } from "lucide-react"
import { Input } from "@/components/ui/input"

export function TotalApplicationsSubmitted() {
  // Sample data for the donut chart
  const loanTypeData = [
    { value: 45, color: "#3b82f6", label: "Home Loans" },
    { value: 30, color: "#10b981", label: "Personal Loans" },
    { value: 15, color: "#f59e0b", label: "Auto Loans" },
    { value: 10, color: "#6366f1", label: "Education Loans" },
  ]

  const [targetAmount, setTargetAmount] = useState(10000000)
  const [achievedAmount, setAchievedAmount] = useState(7500000)
  const [isEditingTarget, setIsEditingTarget] = useState(false)
  const [editedTarget, setEditedTarget] = useState(targetAmount.toString())

  const achievementPercentage = Math.round((achievedAmount / targetAmount) * 100)
  const manHoursOptimized = 124 // Sample value

  const handleSaveTarget = () => {
    const newTarget = Number.parseInt(editedTarget)
    if (!isNaN(newTarget) && newTarget > 0) {
      setTargetAmount(newTarget)
    }
    setIsEditingTarget(false)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Total Applications Submitted</CardTitle>
        <CardDescription>Overview of loan applications by type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold">
                <AnimatedNumber value={124} />
              </div>
              <div className="text-sm text-muted-foreground">Total Applications</div>
            </div>

            <div className="h-48 w-48">
              <AnimatedDonutChart segments={loanTypeData} innerText="100%" innerSubtext="Processed" />
            </div>

            <div className="w-full space-y-2">
              {loanTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Achievement Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Target Achievement</h3>
              {isEditingTarget ? (
                <Button variant="ghost" size="sm" onClick={handleSaveTarget}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setIsEditingTarget(true)}>
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {isEditingTarget ? (
                <div className="flex items-center">
                  <span className="text-sm mr-2">₹</span>
                  <Input
                    value={editedTarget}
                    onChange={(e) => setEditedTarget(e.target.value)}
                    className="h-8"
                    type="number"
                    min="1"
                  />
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-sm">Target Amount:</span>
                  <span className="font-medium">₹{targetAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-sm">Achieved Amount:</span>
                <span className="font-medium">₹{achievedAmount.toLocaleString()}</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${achievementPercentage}%` }}></div>
              </div>

              <div className="text-right text-sm font-medium">{achievementPercentage}% Achieved</div>
            </div>
          </div>

          {/* Man-Hours Optimized Section */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Man-Hours Optimized</h3>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-500">
                <AnimatedNumber value={manHoursOptimized} />
              </div>
              <div className="text-sm text-muted-foreground">Hours saved this month</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Compared to manual processing</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
