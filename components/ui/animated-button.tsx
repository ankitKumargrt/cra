"use client"

import { motion } from "framer-motion"
import { Button } from "./button"
import type { ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends ButtonProps {
  isLoading?: boolean
}

export function AnimatedButton({ children, className, isLoading = false, ...props }: AnimatedButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
      <Button className={cn("relative overflow-hidden", className)} disabled={isLoading || props.disabled} {...props}>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-black/10 dark:bg-white/10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
        {children}
      </Button>
    </motion.div>
  )
}
