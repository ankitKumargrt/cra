"use client"
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
    color: "#f59e0b",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Accurate & Transparent",
    color: "#10b981",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    title: "Secure & Trustworthy",
    color: "#3b82f6",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Real-Time Analytics",
    color: "#8b5cf6",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: "User-Friendly Interface",
    color: "#ec4899",
    icon: <UserCheck className="h-5 w-5" />,
  },
  {
    title: "Customizable Reports",
    color: "#06b6d4",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Automated Workflows",
    color: "#f43f5e",
    icon: <Workflow className="h-5 w-5" />,
  },
  {
    title: "Comprehensive Risk Assessment",
    color: "#eab308",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    title: "Seamless Integration",
    color: "#14b8a6",
    icon: <LinkIcon className="h-5 w-5" />,
  },
  {
    title: "Dedicated Support",
    color: "#6366f1",
    icon: <Headphones className="h-5 w-5" />,
  },
]

export default function CompactFeatureCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow border border-gray-100 dark:border-zinc-700 flex flex-col items-center text-center"
          style={{ borderTop: `3px solid ${feature.color}` }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
            style={{ backgroundColor: `${feature.color}15` }}
          >
            <div style={{ color: feature.color }}>{feature.icon}</div>
          </div>
          <h4 className="text-sm font-medium" style={{ color: feature.color }}>
            {feature.title}
          </h4>
        </div>
      ))}
    </div>
  )
}
