"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

interface AnimatedProgressProps {
  value: number
  className?: string
  color?: string
  height?: string
}

export function AnimatedProgress({ value, className, color = "bg-blue-600", height = "h-2" }: AnimatedProgressProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div className={`w-full bg-muted rounded-full overflow-hidden ${height} ${className}`} ref={ref}>
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: "0%" }}
        animate={isInView ? { width: `${value}%` } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  )
}
