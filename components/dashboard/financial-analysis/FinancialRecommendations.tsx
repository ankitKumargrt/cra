"use client"
import { motion } from "framer-motion"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { Badge } from "@/components/ui/badge"

export function FinancialRecommendations() {
  const recommendations = [
    {
      title: "Consolidate Existing Loans",
      description:
        "Consider consolidating existing loans to reduce monthly obligations and potentially secure a lower interest rate.",
      priority: "High",
      color: "bg-red-100 text-red-800 border-red-200",
    },
    {
      title: "Reduce Discretionary Spending",
      description:
        "Reduce spending in Shopping and Dining categories to free up more funds for savings and debt reduction.",
      priority: "Medium",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    {
      title: "Increase Emergency Fund",
      description:
        "Increase emergency savings fund to at least 3 months of expenses to provide better financial security.",
      priority: "Medium",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    {
      title: "Review Credit Card Usage",
      description: "Review and optimize credit card usage to minimize interest payments and avoid revolving debt.",
      priority: "Low",
      color: "bg-green-100 text-green-800 border-green-200",
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">AI-Powered Recommendations</h3>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.title}
            className="border rounded-lg p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-lg">{rec.title}</h4>
              <Badge variant="outline" className={rec.color}>
                {rec.priority} Priority
              </Badge>
            </div>
            <div className="mt-2">
              <TextGenerateEffect words={rec.description} className="text-base font-normal" duration={0.3} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
