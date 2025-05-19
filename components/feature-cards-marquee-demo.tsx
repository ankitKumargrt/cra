"use client"
import { ThreeDImageMarquee } from "@/components/ui/3d-image-marquee"

export default function FeatureCardsMarqueeDemo() {
  // Feature card images
  const featureImages = [
    {
      src: "/images/feature-cards/lightning-fast-analysis.png",
      alt: "Lightning-Fast Analysis",
    },
    {
      src: "/images/feature-cards/accurate-transparent.png",
      alt: "Accurate & Transparent",
    },
    {
      src: "/images/feature-cards/secure-trustworthy.png",
      alt: "Secure & Trustworthy",
    },
    {
      src: "/images/feature-cards/real-time-analytics.png",
      alt: "Real-Time Analytics",
    },
    {
      src: "/images/feature-cards/user-friendly-interface.png",
      alt: "User-Friendly Interface",
    },
    {
      src: "/images/feature-cards/customizable-reports.png",
      alt: "Customizable Reports",
    },
    {
      src: "/images/feature-cards/automated-workflows.png",
      alt: "Automated Workflows",
    },
    {
      src: "/images/feature-cards/risk-assessment.png",
      alt: "Comprehensive Risk Assessment",
    },
    {
      src: "/images/feature-cards/seamless-integration.png",
      alt: "Seamless Integration",
    },
    {
      src: "/images/feature-cards/dedicated-support.png",
      alt: "Dedicated Support",
    },
  ]

  // Duplicate the images to ensure we have enough for the grid
  const allImages = [...featureImages, ...featureImages, ...featureImages]

  return (
    <div className="mx-auto my-10 max-w-7xl rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800">
      <ThreeDImageMarquee images={allImages} />
    </div>
  )
}
