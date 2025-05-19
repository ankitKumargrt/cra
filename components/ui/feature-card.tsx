"use client"

import { cn } from "@/lib/utils"
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
  HeadphonesIcon,
} from "lucide-react"

interface FeatureCardProps {
  title: string
  className?: string
}

export function FeatureCard({ title, className }: FeatureCardProps) {
  // Map titles to colors and icons
  const getColorAndIcon = (title: string) => {
    switch (title) {
      case "Lightning-Fast Analysis":
        return { color: "#f59e0b", icon: <Zap className="h-8 w-8" /> }
      case "Accurate & Transparent":
        return { color: "#10b981", icon: <CheckCircle className="h-8 w-8" /> }
      case "Secure & Trustworthy":
        return { color: "#3b82f6", icon: <Shield className="h-8 w-8" /> }
      case "Real-Time Analytics":
        return { color: "#8b5cf6", icon: <BarChart className="h-8 w-8" /> }
      case "User-Friendly Interface":
        return { color: "#ec4899", icon: <UserCheck className="h-8 w-8" /> }
      case "Customizable Reports":
        return { color: "#06b6d4", icon: <FileText className="h-8 w-8" /> }
      case "Automated Workflows":
        return { color: "#f43f5e", icon: <Workflow className="h-8 w-8" /> }
      case "Comprehensive Risk Assessment":
        return { color: "#eab308", icon: <AlertTriangle className="h-8 w-8" /> }
      case "Seamless Integration":
        return { color: "#14b8a6", icon: <LinkIcon className="h-8 w-8" /> }
      case "Dedicated Support":
        return { color: "#6366f1", icon: <HeadphonesIcon className="h-8 w-8" /> }
      default:
        return { color: "#3b82f6", icon: <Zap className="h-8 w-8" /> }
    }
  }

  const { color, icon } = getColorAndIcon(title)

  return (
    <div
      className={cn("aspect-square w-full rounded-xl overflow-hidden shadow-lg relative group", className)}
      style={{
        background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
        borderTop: `4px solid ${color}`,
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 text-4xl" style={{ color }}>
          {icon}
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color }}>
          {title}
        </h3>
        <div className="w-12 h-1 rounded-full mt-2" style={{ backgroundColor: color }} />
      </div>

      {/* Animated gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${color}33 0%, transparent 70%)`,
        }}
        initial={{ scale: 0.8 }}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}
