"use client"
import { motion } from "framer-motion"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"

interface DtiAnalysisChartProps {
  dtiRatio: number
}

export function DtiAnalysisChart({ dtiRatio }: DtiAnalysisChartProps) {
  // Calculate the stroke dash offset based on the DTI ratio
  const circumference = 2 * Math.PI * 70 // 70 is the radius of the circle
  const strokeDashoffset = circumference - (circumference * dtiRatio) / 100

  const dtiColor = dtiRatio <= 36 ? "text-green-500" : dtiRatio <= 43 ? "text-yellow-500" : "text-red-500"
  const dtiStatus = dtiRatio <= 36 ? "Healthy DTI Ratio" : dtiRatio <= 43 ? "Moderate DTI Ratio" : "High DTI Ratio"
  const dtiStatusColor = dtiRatio <= 36 ? "text-green-600" : dtiRatio <= 43 ? "text-yellow-600" : "text-red-600"

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64">
        {/* Background circle */}
        <svg className="w-full h-full" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#e6e6e6" strokeWidth="12" />
          {/* Animated progress circle */}
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={dtiColor}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {dtiRatio}%
          </motion.span>
          <motion.span
            className="text-gray-500 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Debt-to-Income
          </motion.span>
        </div>
      </div>
      <motion.div
        className={`mt-4 text-xl font-semibold ${dtiStatusColor}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        {dtiStatus}
      </motion.div>
      <div className="mt-4 text-gray-600">
        <TextGenerateEffect
          words="Lenders typically prefer a DTI ratio below 36%. Your current ratio indicates good financial health and loan eligibility."
          className="text-base font-normal"
        />
      </div>
    </div>
  )
}
