"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

interface RadialGaugeProps {
  percentage: number
  size?: number
  strokeWidth?: number
  primaryColor?: string
  secondaryColor?: string
  textColor?: string
  centerText?: string
  label?: string
  segments?: { percentage: number; color: string }[]
}

export function RadialGauge({
  percentage,
  size = 120,
  strokeWidth = 10,
  primaryColor = "hsl(var(--primary))",
  secondaryColor = "hsl(var(--secondary))",
  textColor = "currentColor",
  centerText,
  label,
  segments,
}: RadialGaugeProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Calculate radius and circumference
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  // Calculate stroke dashoffset for the primary circle
  const strokeDashoffset = circumference * (1 - percentage / 100)

  // Calculate segment offsets if segments are provided
  const segmentOffsets = segments
    ? segments.reduce(
        (acc, segment, index) => {
          const previousEndAngle = index > 0 ? acc[index - 1].endAngle : 0
          const segmentAngle = (segment.percentage / 100) * 360
          const startAngle = previousEndAngle
          const endAngle = startAngle + segmentAngle

          acc.push({
            color: segment.color,
            startAngle,
            endAngle,
            percentage: segment.percentage,
          })

          return acc
        },
        [] as { color: string; startAngle: number; endAngle: number; percentage: number }[],
      )
    : []

  return (
    <div className="relative" style={{ width: size, height: size }} ref={ref}>
      {/* Background circle */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={secondaryColor} strokeWidth={strokeWidth} />

        {/* If segments are provided, render them */}
        {segments && isInView
          ? segmentOffsets.map((segment, index) => {
              const segmentLength = (segment.percentage / 100) * circumference
              const dashArray = `${segmentLength} ${circumference - segmentLength}`
              const dashOffset = (segment.startAngle / 360) * circumference

              return (
                <motion.circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              )
            })
          : isInView && (
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={primaryColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            )}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ color: textColor }}>
        {centerText ? (
          <motion.div
            className="text-2xl font-bold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {centerText}
          </motion.div>
        ) : (
          <motion.div
            className="text-2xl font-bold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {percentage}%
          </motion.div>
        )}
        {label && (
          <motion.div
            className="text-xs opacity-70"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.7 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {label}
          </motion.div>
        )}
      </div>
    </div>
  )
}
