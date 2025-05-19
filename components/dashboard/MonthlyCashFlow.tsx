"use client"
import { motion } from "framer-motion"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"

interface MonthlyCashFlowProps {
  income: number
  expenses: number
  savings: number
}

export function MonthlyCashFlow({ income, expenses, savings }: MonthlyCashFlowProps) {
  const savingsRate = Math.round((savings / income) * 100)

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Monthly Cash Flow</h3>

      <div className="grid grid-cols-3 gap-4">
        <motion.div
          className="bg-blue-50 p-4 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-blue-600 text-sm font-medium">Income</div>
          <div className="text-2xl font-bold">₹{income.toLocaleString()}</div>
        </motion.div>

        <motion.div
          className="bg-red-50 p-4 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-red-600 text-sm font-medium">Expenses</div>
          <div className="text-2xl font-bold">₹{expenses.toLocaleString()}</div>
        </motion.div>

        <motion.div
          className="bg-green-50 p-4 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-green-600 text-sm font-medium">Savings</div>
          <div className="text-2xl font-bold">₹{savings.toLocaleString()}</div>
        </motion.div>
      </div>

      <div className="mt-4">
        <TextGenerateEffect
          words={`Your current savings rate is ${savingsRate}% of your income. Financial experts recommend saving at least 20% of your income. Consider increasing your monthly savings to build a stronger financial foundation.`}
          className="text-base font-normal"
        />
      </div>
    </div>
  )
}
