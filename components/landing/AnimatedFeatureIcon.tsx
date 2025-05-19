"use client"

import { motion } from "framer-motion"
import { CheckCircle, Lock, PieChart, Zap } from "lucide-react"

interface AnimatedFeatureIconProps {
  icon: "zap" | "check" | "chart" | "lock"
  color: string
}

export function AnimatedFeatureIcon({ icon, color }: AnimatedFeatureIconProps) {
  // Animation variants for different icons
  const zapVariants = {
    initial: { scale: 1, opacity: 1 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.8, 1],
      filter: ["brightness(100%)", "brightness(150%)", "brightness(100%)"],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop" as const,
      },
    },
  }

  const checkVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.5 },
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop" as const,
        repeatDelay: 2,
      },
    },
  }

  const chartVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop" as const,
        repeatDelay: 1,
      },
    },
  }

  const lockVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -3, 0],
      transition: {
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop" as const,
        repeatDelay: 1.5,
      },
    },
  }

  // Render the appropriate animated icon
  const renderIcon = () => {
    switch (icon) {
      case "zap":
        return (
          <motion.div variants={zapVariants} initial="initial" animate="animate">
            <Zap className="h-8 w-8" style={{ color }} />
          </motion.div>
        )
      case "check":
        return (
          <motion.div>
            <CheckCircle className="h-8 w-8" style={{ color }} />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              variants={checkVariants}
              initial="initial"
              animate="animate"
            >
              <CheckCircle className="h-8 w-8" style={{ color, opacity: 0.5 }} />
            </motion.div>
          </motion.div>
        )
      case "chart":
        return (
          <motion.div variants={chartVariants} initial="initial" animate="animate">
            <PieChart className="h-8 w-8" style={{ color }} />
          </motion.div>
        )
      case "lock":
        return (
          <motion.div variants={lockVariants} initial="initial" animate="animate">
            <Lock className="h-8 w-8" style={{ color }} />
          </motion.div>
        )
      default:
        return <div className="h-8 w-8" style={{ color }} />
    }
  }

  return <div className="relative flex items-center justify-center h-12 w-12">{renderIcon()}</div>
}
