"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { RadialGauge } from "./RadialGauge"

export function FinancialMetrics() {
  const [targetAmount, setTargetAmount] = useState(10000000)
  const [achievedAmount, setAchievedAmount] = useState(7800000)
  const [isEditingTarget, setIsEditingTarget] = useState(false)
  const [editedTarget, setEditedTarget] = useState(targetAmount.toString())

  const achievementPercentage = Math.round((achievedAmount / targetAmount) * 100)

  // Loan application data
  const loanApplications = {
    total: 85,
    personal: 38,
    home: 33,
    auto: 18,
    other: 11,
  }

  // Man hours data
  const manHours = {
    total: 456,
    saved: 433, // 95%
    manual: 23, // 5%
  }

  const handleSaveTarget = () => {
    const newTarget = Number.parseInt(editedTarget)
    if (!isNaN(newTarget) && newTarget > 0) {
      setTargetAmount(newTarget)
    }
    setIsEditingTarget(false)
  }

  // Standardized chart settings
  const chartSize = 160
  const strokeWidth = 15
  const textColor = "currentColor"

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Target Achievement */}
      <Card>
        <CardContent className="p-4">
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

          <div className="flex flex-col items-center">
            <RadialGauge
              percentage={achievementPercentage}
              size={chartSize}
              strokeWidth={strokeWidth}
              primaryColor="hsl(var(--chart-1))"
              secondaryColor="hsl(var(--secondary))"
              textColor={textColor}
              label="Achieved"
            />

            <div className="mt-4 w-full space-y-2 text-sm">
              {isEditingTarget ? (
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">₹</span>
                  <Input
                    value={editedTarget}
                    onChange={(e) => setEditedTarget(e.target.value)}
                    className="h-8"
                    type="number"
                    min="1"
                  />
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Achieved</span>
                    <span className="font-medium text-green-500 dark:text-green-400">
                      ₹{(achievedAmount / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target</span>
                    <span className="font-medium">₹{(targetAmount / 1000000).toFixed(1)}M</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highest Selling Loans */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Highest Selling Loans</h3>

          <div className="flex flex-col items-center">
            <RadialGauge
              percentage={100}
              size={chartSize}
              strokeWidth={strokeWidth}
              primaryColor="hsl(var(--chart-2))"
              secondaryColor="hsl(var(--secondary))"
              textColor={textColor}
              centerText={loanApplications.total.toString()}
              label="Applications"
              segments={[
                { percentage: 38, color: "hsl(var(--chart-4))" }, // Personal: 38%
                { percentage: 33, color: "hsl(var(--chart-1))" }, // Home: 33%
                { percentage: 18, color: "hsl(var(--chart-2))" }, // Auto: 18%
                { percentage: 11, color: "hsl(var(--chart-3))" }, // Other: 11%
              ]}
            />

            <div className="mt-4 w-full grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-red-500 dark:bg-red-400 mr-1.5"></div>
                <span className="text-muted-foreground">Personal: {loanApplications.personal}%</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400 mr-1.5"></div>
                <span className="text-muted-foreground">Home: {loanApplications.home}%</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-cyan-500 dark:bg-cyan-400 mr-1.5"></div>
                <span className="text-muted-foreground">Auto: {loanApplications.auto}%</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-purple-500 dark:bg-purple-400 mr-1.5"></div>
                <span className="text-muted-foreground">Other: {loanApplications.other}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Man Hours Optimized */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Man Hours Optimized</h3>

          <div className="flex flex-col items-center">
            <RadialGauge
              percentage={100}
              size={chartSize}
              strokeWidth={strokeWidth}
              primaryColor="hsl(var(--chart-3))"
              secondaryColor="hsl(var(--secondary))"
              textColor={textColor}
              centerText={manHours.total.toString()}
              label="Hours"
              segments={[
                { percentage: 95, color: "hsl(var(--chart-3))" }, // Saved: 95%
                { percentage: 5, color: "hsl(var(--muted))" }, // Manual: 5%
              ]}
            />

            <div className="mt-4 w-full space-y-2 text-sm">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-purple-500 dark:bg-purple-400 mr-1.5"></div>
                  <span className="text-muted-foreground">Saved</span>
                </div>
                <span className="font-medium text-purple-500 dark:text-purple-400">{manHours.saved} hrs (95%)</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-gray-500 dark:bg-gray-400 mr-1.5"></div>
                  <span className="text-muted-foreground">Manual</span>
                </div>
                <span className="font-medium text-muted-foreground">{manHours.manual} hrs (5%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
