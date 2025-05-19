"use client"

import { FeatureCardImage } from "@/components/ui/feature-card-image"

export default function FeatureCardsGrid() {
  const features = [
    "Lightning-Fast Analysis",
    "Accurate & Transparent",
    "Secure & Trustworthy",
    "Real-Time Analytics",
    "User-Friendly Interface",
    "Customizable Reports",
    "Automated Workflows",
    "Comprehensive Risk Assessment",
    "Seamless Integration",
    "Dedicated Support",
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
      {features.map((feature, index) => (
        <div key={index} className="aspect-square">
          <FeatureCardImage title={feature} />
        </div>
      ))}
    </div>
  )
}
