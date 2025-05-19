import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MarketInsightsProps {
  onClose?: () => void
}

export function MarketInsights({ onClose }: MarketInsightsProps) {
  return (
    <div className="grid gap-6 mb-8">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Most Popular Loan Types */}
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Loan Types</CardTitle>
            <CardDescription>By number of applications and average amount</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground">
                <div>Loan Type</div>
                <div className="text-right">Applications</div>
                <div className="text-right">Avg. Amount</div>
              </div>

              <div className="grid grid-cols-3 items-center">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-cyan-600 mr-2" />
                  <span className="font-medium">Personal</span>
                </div>
                <div className="text-right">32 (38%)</div>
                <div className="text-right font-medium">₹65,000</div>
              </div>

              <div className="grid grid-cols-3 items-center">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-600 mr-2" />
                  <span className="font-medium">Home</span>
                </div>
                <div className="text-right">28 (33%)</div>
                <div className="text-right font-medium">₹3,500,000</div>
              </div>

              <div className="grid grid-cols-3 items-center">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-indigo-500 mr-2" />
                  <span className="font-medium">Auto</span>
                </div>
                <div className="text-right">15 (18%)</div>
                <div className="text-right font-medium">₹850,000</div>
              </div>

              <div className="grid grid-cols-3 items-center">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-violet-500 mr-2" />
                  <span className="font-medium">Business</span>
                </div>
                <div className="text-right">8 (9%)</div>
                <div className="text-right font-medium">₹2,200,000</div>
              </div>

              <div className="grid grid-cols-3 items-center">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-purple-500 mr-2" />
                  <span className="font-medium">Education</span>
                </div>
                <div className="text-right">2 (2%)</div>
                <div className="text-right font-medium">₹1,200,000</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NBFC & CIBIL Focus */}
        <Card>
          <CardHeader>
            <CardTitle>NBFC & CIBIL Focus</CardTitle>
            <CardDescription>Performance with target partners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 py-2">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">NBFC Conversions</div>
                  <div className="text-sm font-medium">64% (32 / 50)</div>
                </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: "64%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">CIBIL Score Improvements</div>
                  <div className="text-sm font-medium">72% (36 / 50)</div>
                </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: "72%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Document Verification Success</div>
                  <div className="text-sm font-medium">85% (34 / 40)</div>
                </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-600 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">New Partner Acquisitions</div>
                  <div className="text-sm font-medium">60% (6 / 10)</div>
                </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
