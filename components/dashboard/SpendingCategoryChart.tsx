"use client"
import { motion } from "framer-motion"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"

interface SpendingCategory {
  name: string
  percentage: number
  color: string
}

interface SpendingCategoryChartProps {
  categories: SpendingCategory[]
}

export function SpendingCategoryChart({ categories }: SpendingCategoryChartProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Spending by Category</h3>
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div key={category.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span>{category.name}</span>
                <span className="font-medium">{category.percentage}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${category.color}`}
                  style={{ width: `${category.percentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${category.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Key Insights:</h3>
        <div className="space-y-2">
          <TextGenerateEffect
            words="• Housing represents your largest expense category at 32% of total spending."
            className="text-base font-normal"
          />
          <TextGenerateEffect
            words="• Your shopping expenses (23%) are higher than the recommended 15% for your income bracket."
            className="text-base font-normal"
            duration={0.4}
          />
          <TextGenerateEffect
            words="• Consider reducing discretionary spending in shopping and dining categories."
            className="text-base font-normal"
            duration={0.3}
          />
        </div>
      </div>
    </div>
  )
}
