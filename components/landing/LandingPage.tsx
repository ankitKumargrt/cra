"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { MacbookScroll } from "@/components/ui/macbook-scroll"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Cover } from "@/components/ui/cover"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import AppleCardsCarouselDemo from "@/components/apple-cards-carousel-demo"
import FeaturesMarquee from "@/components/features-marquee"
import TestimonialsSection from "@/components/testimonials-section"
import { GridBackground } from "@/components/ui/grid-background"
import BackgroundBeamsDemo from "@/components/ui/background-beams-demo"
import { AnimatedNavbar } from "@/components/ui/animated-navbar"
import { ArrowRight } from "lucide-react"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { useRouter } from "next/navigation"

// Enhanced DynamicWord component with flip animation:
function DynamicWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [words.length])

  return (
    <span className="inline-block relative min-w-[120px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          initial={{
            opacity: 0,
            y: 20,
            rotateX: -90,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotateX: 0,
          }}
          exit={{
            opacity: 0,
            y: -20,
            rotateX: 90,
            position: "absolute",
            left: 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function LandingPage() {
  const router = useRouter()

  // Animation variants
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const scaleVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const featureCardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: (custom: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: custom * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 },
    },
  }

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      quote:
        "The AI-powered verification system saved me hours of paperwork. My loan was approved in just 30 minutes after document submission. The animated dashboard made tracking my application status incredibly intuitive.",
      author: "Rajiv Sharma",
      title: "Small Business Owner",
      date: "15 March 2025",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      quote:
        "As a relationship manager at an NBFC, this platform has transformed how we process applications. The automated verification reduced our processing time by 75%, and the visual analytics help us make better lending decisions.",
      author: "Priya Singh",
      title: "NBFC Relationship Manager",
      date: "22 March 2025",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      quote:
        "The document verification was seamless and secure. I appreciated how the system explained each step with clear animations. As a first-time loan applicant, this made the process much less intimidating.",
      author: "Amit Patel",
      title: "IT Professional",
      date: "18 March 2025",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    {
      id: 4,
      quote:
        "The real-time DTI calculation feature is revolutionary. Being able to see how different loan amounts would affect my financial health helped me make a more informed decision about how much to borrow.",
      author: "Neha Gupta",
      title: "Financial Analyst",
      date: "25 March 2025",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
    },
    {
      id: 5,
      quote:
        "I've been in banking for 15 years, and this platform is truly innovative. The AI recommendations are surprisingly accurate, and the interactive visualizations make complex financial data accessible to all customers.",
      author: "Vikram Mehta",
      title: "Banking Professional",
      date: "20 March 2025",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  ]

  // State for testimonial carousel
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const testimonialInterval = useRef<NodeJS.Timeout | null>(null)

  // Function to get testimonials with wrapping
  const getTestimonialsWithWrapping = (current: number, total: number) => {
    const prev = (current - 1 + total) % total
    const next = (current + 1) % total
    return {
      prev,
      current,
      next,
    }
  }

  // Auto-rotate testimonials
  useEffect(() => {
    testimonialInterval.current = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => {
      if (testimonialInterval.current) {
        clearInterval(testimonialInterval.current)
      }
    }
  }, [testimonials.length])

  // Handle manual navigation
  const handlePrevTestimonial = () => {
    if (testimonialInterval.current) clearInterval(testimonialInterval.current)
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNextTestimonial = () => {
    if (testimonialInterval.current) clearInterval(testimonialInterval.current)
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const { prev, current, next } = getTestimonialsWithWrapping(activeTestimonial, testimonials.length)

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
      <AnimatedNavbar />

      {/* Hero Section with Aurora Background */}
      <AuroraBackground className="overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        <div className="container mx-auto px-0 pt-40 pb-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div className="max-w-xl" variants={containerVariants} initial="hidden" animate="visible">
              <motion.h1 className="text-3xl md:text-5xl font-bold mb-6" variants={itemVariants}>
                <div className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  Instant Credit Analysis in Minutes
                </div>
                <div className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 flex items-center gap-2 perspective-[800px]">
                  for Your <DynamicWord words={["Business", "Home", "Dreams", "Goals"]} />
                </div>
              </motion.h1>

              <motion.p className="text-xl mb-10 text-gray-600 dark:text-gray-300" variants={itemVariants}>
                Powered by AI. Designed for speed. Built for your financial goals.
              </motion.p>

              <motion.div variants={itemVariants}>
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 text-lg font-medium flex items-center gap-2"
                >
                  <span>Begin</span>
                  <ArrowRight className="h-5 w-5" />
                </HoverBorderGradient>
              </motion.div>
            </motion.div>

            {/* MacBook Scroll Demo */}
            <div className="w-full md:w-1/2 relative">
              <MacbookScroll
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-06%20at%209.42.53%E2%80%AFAM-A7hOKewdC41MLF4drHqGWOm8mSGCqc.png"
                showGradient={false}
                title={
                  <span className="text-gray-800 dark:text-white">
                    Powerful Dashboard <br /> Real-time Analytics
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </AuroraBackground>

      {/* New Revolution Section */}
      <section className="min-h-screen py-24 flex flex-col justify-center bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-2 md:px-4">
          <motion.div
            className="max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
              variants={itemVariants}
            >
              Revolutionizing Credit Checks. Evaluations Done in <Cover>Minutes</Cover>, Not Weeks.
            </motion.h2>

            <motion.p className="text-xl mb-12 text-center text-gray-700 dark:text-gray-300" variants={itemVariants}>
              Say goodbye to endless waiting and manual verification. Our cutting-edge AI platform analyzes user
              financial documents—PAN, Aadhaar, Form 16, bank statements, and more—and delivers a full credit evaluation
              in just a few minutes.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BackgroundGradient className="p-8 rounded-3xl bg-white dark:bg-zinc-900">
                <h3 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-white">Time is Money</h3>
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  Traditional financial institutions often require 7 to 15 days to process and approve loan
                  applications, leading to significant delays for applicants. Recognizing the critical importance of
                  time, we've developed an innovative solution that accelerates this process.
                </p>
              </BackgroundGradient>

              <BackgroundGradient className="p-8 rounded-3xl bg-white dark:bg-zinc-900">
                <h3 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-white">AI-Powered Analysis</h3>
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  Our in-house AI engine processes and understands your uploaded documents at lightning speed. It
                  evaluates multiple financial parameters, calculates the debt-to-income ratio (DTI), and provides a
                  recommended loan amount based on your actual eligibility.
                </p>
              </BackgroundGradient>

              <BackgroundGradient className="p-8 rounded-3xl bg-white dark:bg-zinc-900">
                <h3 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-white whitespace-nowrap">
                  Accurate & Transparent
                </h3>
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  This isn't just fast. It's accurate, transparent, and designed to empower lenders and borrowers alike.
                  Whether you're a banker reviewing hundreds of applications or a customer seeking clarity—our platform
                  ensures you get answers in minutes, not months.
                </p>
              </BackgroundGradient>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Apple Cards Carousel Section with Grid Background */}
      <GridBackground className="min-h-screen py-24 flex flex-col justify-center bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 mb-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            How It Works
          </h2>
          <p className="text-xl mb-4 text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Let the AI Do the Heavy Lifting. Here's How.
          </p>
        </div>

        <AppleCardsCarouselDemo />

        {/* Quote moved below the carousel */}
        <div className="flex justify-end mt-12 mb-8 px-8">
          <blockquote className="italic text-lg text-gray-700 dark:text-gray-300 border-r-4 border-blue-500 pr-4 text-right max-w-xs">
            "What once took weeks of paperwork and follow-ups, now takes just minutes with AI. That's the future of
            credit analysis."
            <footer className="mt-2 font-semibold">– A Real User, Verified Borrower</footer>
          </blockquote>
        </div>
      </GridBackground>

      {/* Features That Set Us Apart */}
      <FeaturesMarquee />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Dynamic Visual Insights */}
      <BackgroundBeamsDemo />

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-zinc-800 py-6 border-t border-gray-200 dark:border-zinc-700">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInVariants}
          >
            <div className="flex flex-wrap justify-center gap-4">
              {["Privacy Policy", "Terms of Service", "Contact Us", "About Us"].map((item, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">© 2024 FinSight. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
