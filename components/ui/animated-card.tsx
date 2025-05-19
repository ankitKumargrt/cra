"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { Card } from "./card"

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1.0], // Custom cubic bezier for smoother motion
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 },
      }}
    >
      <Card className={className}>{children}</Card>
    </motion.div>
  )
}
