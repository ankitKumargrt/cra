"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProcessStep {
  id: number
  title: string
  description: string
  imageUrl: string
}

export function ProcessStepsCarousel() {
  const steps: ProcessStep[] = [
    {
      id: 1,
      title: "Document Upload",
      description:
        "Drag and drop your five financial documents (PAN, Aadhaar, Form 16, etc.). Enjoy smooth animations that confirm each successful upload.",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250403_1456_Document%20Upload%20Animations_simple_compose_01jqxfj7zkfbds0ydx9yramnv7-MdFS1xCZurvAA41oET0zF4nQkUqvkV.png",
    },
    {
      id: 2,
      title: "Data Extraction",
      description:
        "Our system quickly reads and extracts critical data from your documents, populating interactive fields with real-time feedback.",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250403_1501_Efficient%20Data%20Extraction_simple_compose_01jqxfvze5e0fba1stavxvsn3y-1DePkuxISIkG24Za89N13dk4aYDdPF.png",
    },
    {
      id: 3,
      title: "Credit Score Calculation",
      description:
        "AI will compute your creditworthiness, using precise algorithms that consider every financial nuance.",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250403_1513_AI%20Credit%20Analysis_simple_compose_01jqxghjexf3jab1z9rezxv6by-lLQRsFPc2MvqdoAUwmFwrTf3h9qKcE.png",
    },
    {
      id: 4,
      title: "Loan Recommendation",
      description:
        "Receive a personalized loan amount recommendation along with an AI generated report of financial wellbeing and spending habits.",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250403_1511_Personalized%20Loan%20Advice_simple_compose_01jqxgd3pqe51bsefne4cjws3h-P37r01GnT3AjcKzGlhUjZ1HzsgIsLB.png",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const totalSteps = steps.length

  // Auto-advance the carousel
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        setDirection(1)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSteps)
      }, 5000) // Change slide every 5 seconds
    }

    startAutoPlay()

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [totalSteps])

  const handlePrevious = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSteps) % totalSteps)
  }

  const handleNext = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSteps)
  }

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  }

  return (
    <div
      className="relative w-screen overflow-hidden"
      style={{ marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", width: "100vw" }}
    >
      <h3 className="text-xl font-semibold mb-6 text-center">Step-by-Step Process</h3>

      {/* Main carousel container */}
      <div className="relative h-[600px] bg-gradient-to-r from-blue-100/80 via-indigo-100/70 to-purple-100/80 shadow-lg overflow-hidden w-full">
        {/* Navigation buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 z-10 transform -translate-y-1/2 bg-white/50 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white/90 transition-all opacity-60 hover:opacity-100"
          aria-label="Previous step"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 z-10 transform -translate-y-1/2 bg-white/50 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white/90 transition-all opacity-60 hover:opacity-100"
          aria-label="Next step"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Step indicators */}
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (autoPlayRef.current) clearInterval(autoPlayRef.current)
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-gradient-to-r from-blue-600 to-purple-600 w-8" : "bg-gray-300 w-2"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Slides */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 flex flex-col md:flex-row items-center p-6"
          >
            <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-2">
                  Step {currentIndex + 1} of {totalSteps}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">{steps[currentIndex].title}</h2>
                <p className="text-gray-600">{steps[currentIndex].description}</p>
              </div>
            </div>

            <div className="w-full md:w-1/2 p-4 flex items-center justify-center">
              <motion.img
                src={steps[currentIndex].imageUrl}
                alt={steps[currentIndex].title}
                className="max-w-full max-h-[400px] rounded-lg object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -5, 0],
                  transition: {
                    opacity: { duration: 0.5 },
                    scale: { duration: 0.5 },
                    y: {
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 3,
                      ease: "easeInOut",
                    },
                  },
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
