"use client"
import { motion } from "framer-motion"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"

export function RiskAssessment() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Risk Assessment</h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium mb-2">Overall Risk Level</h4>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <motion.div
                className="bg-green-500 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "25%" }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="ml-4 font-medium text-green-600">Low Risk</span>
          </div>
          <TextGenerateEffect
            words="Based on the comprehensive analysis of financial data, credit history, and income stability, this applicant presents a low risk profile for the requested loan amount."
            className="text-base font-normal mt-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium mb-2">Risk Factors</h4>
            <ul className="space-y-2">
              <li>
                <TextGenerateEffect
                  words="• Multiple credit cards with potential for revolving debt"
                  className="text-base font-normal"
                />
              </li>
              <li>
                <TextGenerateEffect
                  words="• High discretionary spending in shopping category"
                  className="text-base font-normal"
                  duration={0.3}
                />
              </li>
              <li>
                <TextGenerateEffect
                  words="• Emergency savings below recommended threshold"
                  className="text-base font-normal"
                  duration={0.3}
                />
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-2">Mitigating Factors</h4>
            <ul className="space-y-2">
              <li>
                <TextGenerateEffect
                  words="• Stable employment with consistent income"
                  className="text-base font-normal"
                />
              </li>
              <li>
                <TextGenerateEffect
                  words="• Good credit score (745)"
                  className="text-base font-normal"
                  duration={0.3}
                />
              </li>
              <li>
                <TextGenerateEffect words="• Low DTI ratio (25%)" className="text-base font-normal" duration={0.3} />
              </li>
              <li>
                <TextGenerateEffect
                  words="• No history of late payments"
                  className="text-base font-normal"
                  duration={0.3}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
