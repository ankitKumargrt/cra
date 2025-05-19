"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useMemo } from "react"

interface DonutSegment {
  value: number
  color: string
  label: string
}

interface AnimatedDonutChartProps {
  segments: DonutSegment[]
  className?: string
  innerText?: string
  innerSubtext?: string
}

export function AnimatedDonutChart({ segments = [], className, innerText, innerSubtext }: AnimatedDonutChartProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Calculate total and segments offsets
  const total = useMemo(() => segments.reduce((sum, segment) => sum + segment.value, 0), [segments])
  const segmentDetails = useMemo(() => {
    const circumference = 2 * Math.PI * 40 // r = 40
    let currentOffset = 0

    return segments.map((segment) => {
      const percentage = segment.value / total
      const strokeDasharray = circumference
      const strokeDashoffset = circumference * (1 - percentage)
      const rotationAngle = (currentOffset / total) * 360

      currentOffset += segment.value

      return {
        ...segment,
        percentage,
        strokeDasharray,
        strokeDashoffset,
        rotationAngle,
        strokeDasharrayValue: circumference,
      }
    })
  }, [segments, total])

  return (
    <div className={`relative ${className}`} ref={ref}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle className="stroke-muted stroke-[10] fill-none" cx="50" cy="50" r="40" />

        {/* Animated segments */}
        {isInView &&
          total > 0 &&
          segmentDetails.map((segment, index) => (
            <motion.circle
              key={index}
              className={`stroke-[10] fill-none`}
              style={{ stroke: segment.color }}
              cx="50"
              cy="50"
              r="40"
              strokeDasharray={segment.strokeDasharrayValue}
              initial={{ strokeDashoffset: segment.strokeDasharrayValue }}
              animate={{ strokeDashoffset: segment.strokeDashoffset }}
              transition={{
                duration: 1.5,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              transform={`rotate(-90 50 50) rotate(${segment.rotationAngle} 50 50)`}
            />
          ))}
      </svg>

      {(innerText || innerSubtext) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {innerText && (
            <motion.div
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: (segments.length || 0) * 0.2 + 0.2, duration: 0.5 }}
            >
              {innerText}
            </motion.div>
          )}
          {innerSubtext && (
            <motion.div
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: (segments.length || 0) * 0.2 + 0.4, duration: 0.5 }}
            >
              {innerSubtext}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
