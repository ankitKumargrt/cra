"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { AnimatedFeatureIcon } from "./AnimatedFeatureIcon"

interface Feature {
  icon: "zap" | "check" | "chart" | "lock"
  color: string
  title: string
  description: string
}

export function VerticalFeatureScroller() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })

  const features: Feature[] = [
    {
      icon: "zap",
      color: "#f59e0b",
      title: "Lightning-Fast Analysis",
      description:
        "Our platform delivers complete credit evaluations in minutes—far quicker than the weeks required by traditional banks.",
    },
    {
      icon: "check",
      color: "#10b981",
      title: "Accurate & Transparent",
      description:
        "Precise verification with clear explanations of every calculation, giving you complete confidence in our recommendations.",
    },
    {
      icon: "chart",
      color: "#8b5cf6",
      title: "Intuitive, Animation-Heavy UI",
      description:
        "Enjoy interactive transitions, hover animations, and engaging microinteractions that make data come to life.",
    },
    {
      icon: "lock",
      color: "#3b82f6",
      title: "Secure & Trustworthy",
      description:
        "All your documents are processed securely, ensuring confidentiality and reliability throughout your evaluation.",
    },
  ]

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  // Animation variants for each feature card
  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <div className="w-full mx-auto px-0" ref={containerRef}>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Title and description */}
        <div className="md:w-1/3 mb-8 md:mb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="sticky top-24 px-0 py-6"
          >
            <h2 className="text-3xl font-bold mb-4">Unified Control Tower</h2>
            <p className="text-gray-600">
              Gain an insights-first view on a single dashboard to regularly monitor business health in real-time
            </p>
          </motion.div>
        </div>

        {/* Right side - Vertical scrolling features */}
        <motion.div
          className="md:w-2/3 space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
              variants={featureVariants}
              custom={index}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-start gap-6">
                <div className="p-4 bg-gray-50 rounded-lg inline-block relative overflow-hidden">
                  <AnimatedFeatureIcon icon={feature.icon} color={feature.color} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Categories section similar to the reference image */}
          <motion.div
            className="bg-white p-8 rounded-xl border border-gray-100 shadow-lg"
            variants={featureVariants}
            custom={features.length}
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Categories</h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded-md"></div>
                <div className="h-8 bg-gray-800 rounded-md flex items-center px-3">
                  <div className="h-2 w-16 bg-gray-400 rounded-full"></div>
                </div>
                <div className="h-8 bg-gray-800 rounded-md flex items-center px-3">
                  <div className="h-2 w-12 bg-gray-400 rounded-full"></div>
                </div>
                <div className="h-8 bg-gray-800 rounded-md flex items-center px-3">
                  <div className="h-2 w-14 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="h-10 bg-blue-600 rounded-md"></div>
                <div className="h-8 bg-gray-800 rounded-md flex items-center px-3 justify-between">
                  <div className="h-2 w-10 bg-white rounded-full"></div>
                  <div className="h-2 w-4 bg-red-500 rounded-full"></div>
                </div>
                <div className="h-8 bg-gray-800 rounded-md flex items-center px-3 justify-between">
                  <div className="h-2 w-12 bg-white rounded-full"></div>
                </div>
                <div className="h-8 bg-gray-800 rounded-md flex items-center px-3 justify-between">
                  <div className="h-2 w-8 bg-white rounded-full"></div>
                  <div className="h-2 w-4 bg-red-500 rounded-full"></div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-4">
                <div className="h-10 bg-gray-400 rounded-md"></div>
                <div className="h-8 bg-gray-800 rounded-md flex items-center px-3 justify-between">
                  <div className="h-2 w-10 bg-gray-300 rounded-full"></div>
                  <div className="h-2 w-4 bg-red-500 rounded-full"></div>
                </div>
                <div className="h-8 bg-gray-800 rounded-md flex items-center px-3 justify-between">
                  <div className="h-2 w-12 bg-gray-300 rounded-full"></div>
                </div>
                <div className="h-8 bg-gray-800 rounded-md flex items-center px-3 justify-between">
                  <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
                  <div className="h-2 w-4 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional animated card */}
          <motion.div
            className="bg-white p-8 rounded-xl border border-gray-100 shadow-lg"
            variants={featureVariants}
            custom={features.length + 1}
          >
            <div className="flex items-start gap-6">
              <div className="p-4 bg-gray-50 rounded-lg inline-block relative overflow-hidden">
                <AnimatedFeatureIcon icon="chart" color="#ec4899" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Real-time Analytics</h3>
                <p className="text-gray-600">
                  Monitor your financial metrics as they update in real-time, with beautiful visualizations that make
                  complex data easy to understand.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
