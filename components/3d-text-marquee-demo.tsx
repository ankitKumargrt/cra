"use client"
import { ThreeDTextMarquee } from "@/components/ui/3d-text-marquee"

export default function ThreeDTextMarqueeDemo() {
  // Text content from the "How It Works" section
  const cards = [
    {
      category: "Step 1",
      title: "Document Upload",
      description:
        "Drag and drop your five financial documents (PAN, Aadhaar, Form 16, etc.). Enjoy smooth animations that confirm each successful upload.",
      color: "#3b82f6", // blue
    },
    {
      category: "Step 2",
      title: "Data Extraction",
      description:
        "Our system quickly reads and extracts critical data from your documents, populating interactive fields with real-time feedback.",
      color: "#8b5cf6", // purple
    },
    {
      category: "Step 3",
      title: "Credit Score Calculation",
      description:
        "AI will compute your creditworthiness, using precise algorithms that consider every financial nuance.",
      color: "#ec4899", // pink
    },
    {
      category: "Step 4",
      title: "Loan Recommendation",
      description:
        "Receive a personalized loan amount recommendation along with an AI generated report of financial wellbeing and spending habits.",
      color: "#10b981", // green
    },
    {
      category: "Feature",
      title: "Lightning-Fast Analysis",
      description:
        "Our platform delivers complete credit evaluations in minutes—far quicker than the weeks required by traditional banks.",
      color: "#f59e0b", // amber
    },
    {
      category: "Feature",
      title: "Accurate & Transparent",
      description:
        "Precise verification with clear explanations of every calculation, giving you complete confidence in our recommendations.",
      color: "#10b981", // green
    },
    {
      category: "Feature",
      title: "Intuitive UI",
      description:
        "Enjoy interactive transitions, hover animations, and engaging microinteractions that make data come to life.",
      color: "#8b5cf6", // purple
    },
    {
      category: "Feature",
      title: "Secure & Trustworthy",
      description:
        "All your documents are processed securely, ensuring confidentiality and reliability throughout your evaluation.",
      color: "#3b82f6", // blue
    },
    {
      category: "Benefit",
      title: "Time Savings",
      description:
        "Traditional financial institutions often require 7 to 15 days to process applications. Our solution delivers results in minutes.",
      color: "#f59e0b", // amber
    },
    {
      category: "Benefit",
      title: "AI-Powered Analysis",
      description: "Our in-house AI engine processes and understands your uploaded documents at lightning speed.",
      color: "#8b5cf6", // purple
    },
    {
      category: "Benefit",
      title: "Real-time Analytics",
      description:
        "Monitor your financial metrics as they update in real-time, with beautiful visualizations that make complex data easy to understand.",
      color: "#ec4899", // pink
    },
    {
      category: "Benefit",
      title: "Personalized Recommendations",
      description:
        "Get tailored loan amount suggestions based on your actual financial situation and spending patterns.",
      color: "#10b981", // green
    },
    // Repeat the main cards to ensure we have enough for the grid
    {
      category: "Step 1",
      title: "Document Upload",
      description:
        "Drag and drop your five financial documents (PAN, Aadhaar, Form 16, etc.). Enjoy smooth animations that confirm each successful upload.",
      color: "#3b82f6", // blue
    },
    {
      category: "Step 2",
      title: "Data Extraction",
      description:
        "Our system quickly reads and extracts critical data from your documents, populating interactive fields with real-time feedback.",
      color: "#8b5cf6", // purple
    },
    {
      category: "Step 3",
      title: "Credit Score Calculation",
      description:
        "AI will compute your creditworthiness, using precise algorithms that consider every financial nuance.",
      color: "#ec4899", // pink
    },
    {
      category: "Step 4",
      title: "Loan Recommendation",
      description:
        "Receive a personalized loan amount recommendation along with an AI generated report of financial wellbeing and spending habits.",
      color: "#10b981", // green
    },
  ]

  return (
    <div className="mx-auto my-10 max-w-7xl rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800">
      <ThreeDTextMarquee cards={cards} />
    </div>
  )
}
