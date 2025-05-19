"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ReactMarkdown from "react-markdown"

interface AiRecommendationDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  selectedApplicant: string | null
  getApplicantData: (name: string) => any
  dtiAnalysisResult?: string | null
}

export function AiRecommendationDialog({
  open,
  setOpen,
  selectedApplicant,
  getApplicantData,
  dtiAnalysisResult,
}: AiRecommendationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">AI Recommendation</DialogTitle>
          <DialogDescription>Detailed analysis and recommendation for {selectedApplicant}</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {selectedApplicant && getApplicantData(selectedApplicant) && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">DTI Analysis</h3>
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium">DTI: {getApplicantData(selectedApplicant)?.dti}%</div>
                  <div
                    className={`text-sm font-medium ${
                      (getApplicantData(selectedApplicant)?.dti || 0) < 36
                        ? "text-green-600"
                        : (getApplicantData(selectedApplicant)?.dti || 0) < 43
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {(getApplicantData(selectedApplicant)?.dti || 0) < 36
                      ? "Healthy"
                      : (getApplicantData(selectedApplicant)?.dti || 0) < 43
                        ? "Moderate"
                        : "High Risk"}
                  </div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      (getApplicantData(selectedApplicant)?.dti || 0) < 36
                        ? "bg-green-600"
                        : (getApplicantData(selectedApplicant)?.dti || 0) < 43
                          ? "bg-yellow-500"
                          : "bg-red-600"
                    }`}
                    style={{ width: `${getApplicantData(selectedApplicant)?.dti || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* DTI Analysis Result - Show if available */}
              {dtiAnalysisResult && (
                <div className="mb-6 p-4 border rounded-lg bg-slate-50">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-4 mb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-3 mb-2" {...props} />,
                        p: ({ node, ...props }) => <p className="my-2" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
                        li: ({ node, ...props }) => <li className="my-1" {...props} />,
                        table: ({ node, ...props }) => (
                          <table className="border-collapse border border-gray-300 my-4 w-full" {...props} />
                        ),
                        thead: ({ node, ...props }) => <thead className="bg-gray-100" {...props} />,
                        tbody: ({ node, ...props }) => <tbody {...props} />,
                        tr: ({ node, ...props }) => <tr className="border-b border-gray-300" {...props} />,
                        th: ({ node, ...props }) => (
                          <th className="border border-gray-300 px-4 py-2 text-left" {...props} />
                        ),
                        td: ({ node, ...props }) => <td className="border border-gray-300 px-4 py-2" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                        blockquote: ({ node, ...props }) => (
                          <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
                        ),
                        code: ({ node, inline, ...props }) =>
                          inline ? (
                            <code className="bg-gray-100 px-1 py-0.5 rounded" {...props} />
                          ) : (
                            <pre className="bg-gray-100 p-4 rounded overflow-x-auto my-4">
                              <code {...props} />
                            </pre>
                          ),
                      }}
                    >
                      {dtiAnalysisResult}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Financial Overview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Income:</span>
                      <span className="font-medium">
                        ₹{getApplicantData(selectedApplicant)?.income.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Debt:</span>
                      <span className="font-medium">₹{getApplicantData(selectedApplicant)?.debt.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loan Amount:</span>
                      <span className="font-medium">
                        ₹{getApplicantData(selectedApplicant)?.loanAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loan Type:</span>
                      <span className="font-medium">{getApplicantData(selectedApplicant)?.loanType}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Monthly Expenses</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Housing:</span>
                      <span className="font-medium">
                        ₹{getApplicantData(selectedApplicant)?.expenses.housing.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transportation:</span>
                      <span className="font-medium">
                        ₹{getApplicantData(selectedApplicant)?.expenses.transportation.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Food:</span>
                      <span className="font-medium">
                        ₹{getApplicantData(selectedApplicant)?.expenses.food.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Entertainment:</span>
                      <span className="font-medium">
                        ₹{getApplicantData(selectedApplicant)?.expenses.entertainment.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Recommendation</h3>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">
                    Based on the DTI analysis and financial profile, this application is{" "}
                    <span className="font-bold">recommended for approval</span>. The applicant demonstrates a stable
                    income with manageable debt obligations.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button className="w-full">Approve</Button>
                <Button variant="destructive" className="w-full">
                  Reject
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
