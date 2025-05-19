"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface AnimatedGetStartedButtonProps {
  className?: string
}

export function AnimatedGetStartedButton({ className }: AnimatedGetStartedButtonProps) {
  const router = useRouter()

  const navigateToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={className}>
      <Button
        onClick={navigateToDashboard}
        size="lg"
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg text-lg relative overflow-hidden group"
      >
        <span className="group-hover:translate-x-40 text-center transition duration-500">Begin</span>
        <div className="-translate-x-40 group-hover:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
          ₹
        </div>
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  )
}
