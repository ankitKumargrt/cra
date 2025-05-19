"use client"
import { useEffect, useState } from "react"
import { useInView } from "framer-motion"
import { useRef } from "react"

interface AnimatedNumberProps {
  value: number
  duration?: number
  formatOptions?: Intl.NumberFormatOptions
  className?: string
  prefix?: string
  suffix?: string
}

export function AnimatedNumber({
  value,
  duration = 2,
  formatOptions = {},
  className = "",
  prefix = "",
  suffix = "",
}: AnimatedNumberProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)
        const currentValue = Math.floor(progress * value)
        setDisplayValue(currentValue)

        if (progress < 1) {
          window.requestAnimationFrame(step)
        } else {
          setDisplayValue(value)
        }
      }

      window.requestAnimationFrame(step)
    }
  }, [isInView, value, duration])

  const formattedValue = new Intl.NumberFormat(undefined, formatOptions).format(displayValue)

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}
