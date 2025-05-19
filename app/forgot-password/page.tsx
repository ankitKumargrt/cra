"use client"

import { WavyBackground } from "@/components/ui/wavy-background"
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"

export default function ForgotPasswordPage() {
  return (
    <WavyBackground
      className="w-full max-w-md"
      colors={["#6366f1", "#8b5cf6", "#d946ef", "#0ea5e9"]}
      backgroundFill="#020617"
      blur={5}
      speed="slow"
      waveOpacity={0.6}
    >
      <ForgotPasswordForm />
    </WavyBackground>
  )
}
