"use client"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { useRouter } from "next/navigation"

export function AnimatedBeginButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push("/login")
  }

  return (
    <HoverBorderGradient
      containerClassName="rounded-full"
      as="button"
      onClick={handleClick}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center space-x-2 px-8 py-4 text-lg font-medium"
    >
      <span className="relative group">
        <span className="group-hover:translate-x-40 inline-block transition duration-500">Begin</span>
        <div className="-translate-x-40 group-hover:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
        
        </div>
      </span>
    </HoverBorderGradient>
  )
}
