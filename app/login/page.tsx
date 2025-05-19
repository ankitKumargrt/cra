"use client"

import { WavyBackground } from "@/components/ui/wavy-background"
import { LoginForm } from "@/components/auth/LoginForm"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const reset = searchParams.get("reset")
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  useEffect(() => {
    if (registered === "true") {
      setAlertMessage("Account created successfully! Please login with your credentials.")
      setShowAlert(true)
    } else if (reset === "true") {
      setAlertMessage("Password reset successfully! Please login with your new password.")
      setShowAlert(true)
    }

    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [registered, reset, showAlert])

  return (
    <WavyBackground
      className="w-full max-w-md"
      colors={["#6366f1", "#8b5cf6", "#d946ef", "#0ea5e9"]}
      backgroundFill="#020617"
      blur={5}
      speed="slow"
      waveOpacity={0.6}
    >
      {showAlert && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-md">
          <Alert className="bg-indigo-100 border-indigo-300 text-indigo-800">
            <CheckCircle className="h-4 w-4 mr-2 text-indigo-600" />
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        </div>
      )}
      <LoginForm />
    </WavyBackground>
  )
}
