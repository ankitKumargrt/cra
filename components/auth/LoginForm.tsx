"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/components/ui/use-toast"

export function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetSuccess = searchParams?.get("reset") === "true"

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (resetSuccess) {
      setSuccessMessage("Password reset successful! Please log in with your new password.")
      toast({
        title: "Password Reset",
        description: "Password reset successful! Please log in with your new password.",
        variant: "destructive",
      })
    }
  }, [resetSuccess])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await login(formData.username, formData.password)
      // No need to redirect here as the AuthContext will handle it
    } catch (error: any) {
      // Use 'any' type to handle various error formats
      console.error("Login error:", error)

      // Handle API error response
      if (error instanceof Response) {
        const status = error.status

        if (status === 401) {
          try {
            // Try to parse the response body
            const errorData = await error.json()
            const errorMessage = errorData?.detail || "Invalid username or password"
            setError(errorMessage)
            toast({
              title: "Login Failed",
              description: errorMessage,
              variant: "destructive",
            })
          } catch (parseError) {
            // If we can't parse the response, show a generic error
            setError("Invalid username or password")
            toast({
              title: "Login Failed",
              description: "Invalid username or password",
              variant: "destructive",
            })
          }
        } else {
          setError("An error occurred during login. Please try again.")
          toast({
            title: "Login Error",
            description: "An error occurred during login. Please try again.",
            variant: "destructive",
          })
        }
      } else if (error && typeof error === "object" && "status" in error) {
        // Handle error objects with status property
        const status = error.status as number

        if (status === 401) {
          let errorMessage = "Invalid username or password"

          if ("detail" in error) {
            errorMessage = (error.detail as string) || errorMessage
          }

          setError(errorMessage)
          toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
          })
        } else {
          setError("An error occurred during login. Please try again.")
          toast({
            title: "Login Error",
            description: "An error occurred during login. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        // For other types of errors
        setError(error instanceof Error ? error.message : "Invalid username or password")
        toast({
          title: "Login Failed",
          description: error instanceof Error ? error.message : "Invalid username or password",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:bg-gray-800/90 dark:border-gray-700">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Sign in to your account</p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded dark:bg-red-900/50 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded dark:bg-green-900/50 dark:border-green-800 dark:text-green-300">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-primary-500 focus:border-primary-500
            dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
            placeholder="your.email@example.com"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 pr-10 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-primary-500 focus:border-primary-500
              dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              placeholder="••••••••"
              disabled={isSubmitting}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isSubmitting}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
