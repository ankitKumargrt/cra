"use client"

import { WavyBackground } from "@/components/ui/wavy-background"
import { SignupForm } from "@/components/auth/SignupForm"

export default function SignupPage() {
  return (
    <WavyBackground
      className="w-full max-w-2xl"
      colors={["#6366f1", "#8b5cf6", "#d946ef", "#0ea5e9"]}
      backgroundFill="#020617"
      blur={5}
      speed="slow"
      waveOpacity={0.6}
    >
      <SignupForm />
    </WavyBackground>
  )
}
