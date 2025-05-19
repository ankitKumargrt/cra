"use client"
import { motion } from "framer-motion"
import { LampContainer } from "@/components/ui/lamp"

export default function TestimonialLamp() {
  return (
    <LampContainer className="mb-0 pb-0">
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-blue-400 to-purple-600 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        But don't take our word for it, <br /> Hear from our customers
      </motion.h1>
    </LampContainer>
  )
}
