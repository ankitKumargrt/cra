"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import TestimonialLamp from "./testimonial-lamp"

// Testimonial data
const testimonials = [
  {
    id: 1,
    quote:
      "Exceptional Service. To be honest I have never seen any bank in India being this honest and so dedicated with customer support.",
    author: "Dayakar Boppana",
    date: "23 March 2025",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    quote:
      "Want to share the wonderful experience I had - to resolve the query, my Relationship Banker Ms. Riya Singh from Noida 16 Branch, not only called to help, she with her personal touch having a warm and caring attitude, ensured that the solution is provided. As a senior citizen, it was indeed a delightful feeling... God bless it!",
    author: "Rajiv Sharma",
    date: "15 March 2025",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    id: 3,
    quote: "Good Response.Really best Bank.Thank you for your help.",
    author: "Priya Singh",
    date: "22 March 2025",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 4,
    quote:
      "The document verification was seamless and secure. I appreciated how the system explained each step with clear animations. As a first-time loan applicant, this made the process much less intimidating.",
    author: "Amit Patel",
    date: "18 March 2025",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: 5,
    quote:
      "The real-time DTI calculation feature is revolutionary. Being able to see how different loan amounts would affect my financial health helped me make a more informed decision about how much to borrow.",
    author: "Neha Gupta",
    date: "25 March 2025",
    image: "https://randomuser.me/api/portraits/women/63.jpg",
  },
]

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-advance the carousel
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        setDirection(1)
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
      }, 8000) // Change testimonial every 8 seconds
    }

    startAutoPlay()

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [])

  const handlePrevious = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    setDirection(-1)
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    setDirection(1)
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  // Get previous, current, and next testimonials
  const getPrevIndex = (current: number) => (current - 1 + testimonials.length) % testimonials.length
  const getNextIndex = (current: number) => (current + 1) % testimonials.length

  const prevIndex = getPrevIndex(activeIndex)
  const nextIndex = getNextIndex(activeIndex)

  // Animation variants
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 10,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.3 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      zIndex: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  }

  // Profile images animation
  const profileImages = [
    { top: "10%", left: "5%", delay: 0.1 },
    { top: "30%", left: "2%", delay: 0.3 },
    { top: "50%", left: "8%", delay: 0.2 },
    { top: "70%", left: "4%", delay: 0.4 },
    { top: "15%", right: "5%", delay: 0.2 },
    { top: "35%", right: "3%", delay: 0.1 },
    { top: "55%", right: "7%", delay: 0.3 },
    { top: "75%", right: "4%", delay: 0.4 },
  ]

  return (
    <section className="min-h-screen flex flex-col justify-center bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Add the lamp component at the top */}
      <TestimonialLamp />

      <div className="container mx-auto px-4 relative pt-20">
        {/* Profile images floating on sides */}
        <div className="hidden md:block">
          {profileImages.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute z-10"
              style={{
                top: pos.top,
                left: pos.left,
                right: pos.right,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: pos.delay,
                  duration: 0.5,
                },
              }}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                <Image
                  src={testimonials[i % testimonials.length].image || "/placeholder.svg"}
                  alt={`Customer ${i}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="flex justify-center items-center">
            {/* Previous testimonial (left side) */}
            <div className="hidden md:block w-1/4 mr-4">
              <div className="bg-gray-100 dark:bg-zinc-800 p-6 rounded-xl shadow-sm opacity-60">
                <p className="text-lg text-gray-600 dark:text-gray-300 line-clamp-4">
                  "{testimonials[prevIndex].quote}"
                </p>
              </div>
            </div>

            {/* Main testimonial */}
            <div className="w-full md:w-1/2 relative">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl shadow-lg"
                >
                  <p className="text-xl mb-6">"{testimonials[activeIndex].quote}"</p>
                  <div>
                    <p className="font-bold">{testimonials[activeIndex].author}</p>
                    <p className="text-lg opacity-80">{testimonials[activeIndex].date}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next testimonial (right side) */}
            <div className="hidden md:block w-1/4 ml-4">
              <div className="bg-gray-100 dark:bg-zinc-800 p-6 rounded-xl shadow-sm opacity-60">
                <p className="text-lg text-gray-600 dark:text-gray-300 line-clamp-4">
                  "{testimonials[nextIndex].quote}"
                </p>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 md:translate-x-0 bg-white dark:bg-zinc-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-zinc-700 z-20"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 md:translate-x-0 bg-white dark:bg-zinc-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-zinc-700 z-20"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > activeIndex ? 1 : -1)
                  setActiveIndex(index)
                }}
                className={`h-2 w-2 mx-1 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 w-6"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Section divider */}
      <div className="w-full border-t border-gray-200 dark:border-gray-700 mt-20"></div>
    </section>
  )
}
