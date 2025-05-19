import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedDonutChart } from "@/components/ui/animated-donut-chart"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { Clock, FileCheck } from "lucide-react"

// Add onClose to the component props interface
interface FinancialHealthIndicatorsProps {
  onClose?: () => void
}

export function FinancialHealthIndicators({ onClose }: FinancialHealthIndicatorsProps) {
  return (
    <AnimatedContainer className="grid gap-6 mb-8">
      {/* Keep the 4-column grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        {/* Added h-full to all AnimatedCard components to ensure equal height */}
        {/* Target Achievement - Donut Chart */}
        <AnimatedCard delay={0.1} className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Achievement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-2">
              <AnimatedDonutChart
                className="h-36 w-36"
                innerText="78%"
                innerSubtext="Achieved"
                segments={[
                  { value: 78, color: "hsl(var(--chart-1))", label: "Achieved" },
                  { value: 22, color: "hsl(var(--chart-2))", label: "Target" },
                ]}
              />
            </div>
            {/* Added min-h-[60px] to ensure consistent height for legend area */}
            <div className="flex justify-center gap-4 text-xs mt-2 min-h-[60px]">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))] mr-1" />
                Achieved (₹7.8M)
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))] mr-1" />
                Target (₹10M)
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Most Popular Loan Types - Donut Chart */}
        <AnimatedCard delay={0.2} className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Selling Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-2">
              <AnimatedDonutChart
                className="w-36 h-36"
                innerText="85"
                innerSubtext="Applications"
                segments={[
                  { value: 38, color: "hsl(var(--chart-3))", label: "Personal" },
                  { value: 33, color: "hsl(var(--chart-2))", label: "Home" },
                  { value: 18, color: "hsl(var(--chart-4))", label: "Auto" },
                  { value: 11, color: "hsl(var(--chart-5))", label: "Other" },
                ]}
              />
              <div className="text-xs text-center max-w-[200px] mt-2 grid grid-cols-2 gap-1">
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--chart-3))] mr-1" />
                  <span>Personal: 38%</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--chart-2))] mr-1" />
                  <span>Home: 33%</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--chart-4))] mr-1" />
                  <span>Auto: 18%</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--chart-5))] mr-1" />
                  <span>Other: 11%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Total Applications Processed - Donut Chart */}
        <AnimatedCard delay={0.3} className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications Processed</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-2">
              <AnimatedDonutChart
                className="h-36 w-36"
                innerText="1247"
                innerSubtext="Applications"
                segments={[
                  { value: 70, color: "hsl(var(--chart-1))", label: "Approved" },
                  { value: 20, color: "hsl(var(--chart-3))", label: "Pending" },
                  { value: 10, color: "hsl(var(--chart-4))", label: "Rejected" },
                ]}
              />
            </div>
            <div className="flex justify-center gap-4 text-xs mt-2">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))] mr-1" />
                Approved (876)
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-3))] mr-1" />
                Pending (243)
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-4))] mr-1" />
                Rejected (128)
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Time Saved - Donut Chart */}
        <AnimatedCard delay={0.4} className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Man Hours Optimized</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-2">
              <AnimatedDonutChart
                className="h-36 w-36"
                innerText="456"
                innerSubtext="Hours"
                segments={[
                  { value: 95, color: "hsl(var(--chart-5))", label: "Saved" },
                  { value: 5, color: "hsl(var(--muted))", label: "Manual" },
                ]}
              />
            </div>
            {/* Added min-h-[60px] to ensure consistent height for legend area */}
            <div className="flex justify-center gap-4 text-xs mt-2 min-h-[60px]">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-5))] mr-1" />
                Saved (95%)
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-muted mr-1" />
                Manual (5%)
              </div>
            </div>
          </CardContent>
        </AnimatedCard>
      </div>
    </AnimatedContainer>
  )
}
