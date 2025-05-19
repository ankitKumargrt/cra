"use client"

import { motion } from "framer-motion"
import {
  Zap,
  CheckCircle,
  Shield,
  BarChart,
  UserCheck,
  FileText,
  Workflow,
  AlertTriangle,
  LinkIcon,
  Headphones,
} from "lucide-react"

// Feature card data
const features = [
  {
    title: "Lightning-Fast Analysis",
    description:
      "Our platform delivers complete credit evaluations in minutes—far quicker than the weeks required by traditional banks.",
    color: "#f59e0b",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    title: "Accurate & Transparent",
    description:
      "Precise verification with clear explanations of every calculation, giving you complete confidence in our recommendations.",
    color: "#10b981",
    icon: <CheckCircle className="h-6 w-6" />,
  },
  {
    title: "Secure & Trustworthy",
    description:
      "All your documents are processed securely, ensuring confidentiality and reliability throughout your evaluation.",
    color: "#3b82f6",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    title: "Real-Time Analytics",
    description:
      "Monitor your financial metrics as they update in real-time, with beautiful visualizations that make complex data easy to understand.",
    color: "#8b5cf6",
    icon: <BarChart className="h-6 w-6" />,
  },
  {
    title: "User-Friendly Interface",
    description:
      "Intuitive design with clear navigation and helpful guidance at every step of the verification process.",
    color: "#ec4899",
    icon: <UserCheck className="h-6 w-6" />,
  },
  {
    title: "Customizable Reports",
    description: "Generate detailed financial reports tailored to your specific needs and requirements.",
    color: "#06b6d4",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    title: "Automated Workflows",
    description: "Streamlined processes that eliminate manual steps and reduce the potential for human error.",
    color: "#f43f5e",
    icon: <Workflow className="h-6 w-6" />,
  },
  {
    title: "Comprehensive Risk Assessment",
    description: "Thorough evaluation of financial risks with actionable insights to improve your credit profile.",
    color: "#eab308",
    icon: <AlertTriangle className="h-6 w-6" />,
  },
  {
    title: "Seamless Integration",
    description: "Easily connects with existing banking systems and financial platforms for a unified experience.",
    color: "#14b8a6",
    icon: <LinkIcon className="h-6 w-6" />,
  },
  {
    title: "Dedicated Support",
    description: "Expert assistance available whenever you need help understanding your financial evaluation.",
    color: "#6366f1",
    icon: <Headphones className="h-6 w-6" />,
  },
]

export default function FeatureCardsSection() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <section className="py-16 bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Features That Set Us Apart
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with user-friendly design to deliver a superior financial
            verification experience.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-zinc-700 flex flex-col h-full"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <div style={{ color: feature.color }}>{feature.icon}</div>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: feature.color }}>
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 flex-grow">{feature.description}</p>
              <div className="w-16 h-1 rounded-full mt-4" style={{ backgroundColor: feature.color }} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
