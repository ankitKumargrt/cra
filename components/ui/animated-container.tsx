"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedContainerProps {
  children: ReactNode
  className?: string
}

export function AnimatedContainer({ children, className }: AnimatedContainerProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
