"use client"
import Image from "next/image"

interface FeatureCardImageProps {
  title: string
  className?: string
}

export function FeatureCardImage({ title, className }: FeatureCardImageProps) {
  // Map titles to image paths
  const getImagePath = (title: string) => {
    switch (title) {
      case "Lightning-Fast Analysis":
        return "/images/feature-cards/lightning-fast-analysis.png"
      case "Accurate & Transparent":
        return "/images/feature-cards/accurate-transparent.png"
      case "Secure & Trustworthy":
        return "/images/feature-cards/secure-trustworthy.png"
      case "Real-Time Analytics":
        return "/images/feature-cards/real-time-analytics.png"
      case "User-Friendly Interface":
        return "/images/feature-cards/user-friendly-interface.png"
      case "Customizable Reports":
        return "/images/feature-cards/customizable-reports.png"
      case "Automated Workflows":
        return "/images/feature-cards/automated-workflows.png"
      case "Comprehensive Risk Assessment":
        return "/images/feature-cards/risk-assessment.png"
      case "Seamless Integration":
        return "/images/feature-cards/seamless-integration.png"
      case "Dedicated Support":
        return "/images/feature-cards/dedicated-support.png"
      default:
        return "/images/feature-cards/lightning-fast-analysis.png"
    }
  }

  return (
    <div className={`aspect-square relative ${className}`}>
      <Image src={getImagePath(title) || "/placeholder.svg"} alt={title} fill className="object-cover rounded-lg" />
    </div>
  )
}
