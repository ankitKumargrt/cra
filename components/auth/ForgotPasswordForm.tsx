"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, CheckCircle2, XCircle, ArrowLeft } from "lucide-react"

export function ForgotPasswordForm() {
  const router = useRouter()
  const [apiUrl, setApiUrl] = useState<string>("http://localhost:8000")
  const [formData, setFormData] = useState({
    email: "",
    question: "What was your first pet's name?",
    answer: "",
    new_password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    specialChar: false,
    digit: false,
  })
  const [passwordsMatch, setPasswordsMatch] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const securityQuestions = [
    "What was your first pet's name?",
    "What is your mother's maiden name?",
    "What was the name of your first school?",
    "What city were you born in?",
    "What was your childhood nickname?",
    "What is the name of your favorite childhood teacher?",
    "What is the make of your first car?",
  ]

  // Get API URL from environment
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL
    if (url) {
      setApiUrl(url)
    }
  }, [])

  // Validate password as user types
  useEffect(() => {
    const { new_password } = formData
    setPasswordValidation({
      length: new_password.length >= 8,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(new_password),
      digit: /\d/.test(new_password),
    })
  }, [formData])

  // Check if passwords match
  useEffect(() => {
    const { new_password, confirmPassword } = formData
    setPasswordsMatch(new_password === confirmPassword && new_password !== "")
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.email) {
      setError("Please enter your email address")
      return
    }

    if (!formData.answer) {
      setError("Please answer the security question")
      return
    }

    const { length, specialChar, digit } = passwordValidation
    if (!(length && specialChar && digit)) {
      setError("Please ensure your password meets all requirements")
      return
    }

    if (!passwordsMatch) {
      setError("Passwords do not match")
      return
    }

    // Form is valid, submit
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch(`${apiUrl}api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          question: formData.question,
          answer: formData.answer,
          new_password: formData.new_password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Password reset failed")
      }

      // Password reset successful
      setSuccess(true)

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/login?reset=true")
      }, 2000)
    } catch (error) {
      console.error("Password reset error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:bg-gray-800/90 dark:border-gray-700">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Enter your details to reset your password</p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded dark:bg-red-900/50 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded dark:bg-green-900/50 dark:border-green-800 dark:text-green-300">
          Password reset successful! Redirecting to login...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-primary-500 focus:border-primary-500
            dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
            placeholder="your.email@example.com"
            disabled={isSubmitting || success}
            required
          />
        </div>

        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Security Question
          </label>
          <select
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900
            focus:outline-none focus:ring-primary-500 focus:border-primary-500
            dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={isSubmitting || success}
            required
          >
            {securityQuestions.map((question, index) => (
              <option key={index} value={question}>
                {question}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Answer
          </label>
          <input
            type="text"
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-primary-500 focus:border-primary-500
            dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
            placeholder="Your answer"
            disabled={isSubmitting || success}
            required
          />
        </div>

        <div>
          <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 pr-10 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-primary-500 focus:border-primary-500
              dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              placeholder="••••••••"
              disabled={isSubmitting || success}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isSubmitting || success}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>

          <div className="mt-2 space-y-1 text-sm">
            <div className="flex items-center">
              {passwordValidation.length ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={
                  passwordValidation.length ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }
              >
                At least 8 characters
              </span>
            </div>

            <div className="flex items-center">
              {passwordValidation.specialChar ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={
                  passwordValidation.specialChar
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              >
                At least one special character
              </span>
            </div>

            <div className="flex items-center">
              {passwordValidation.digit ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={
                  passwordValidation.digit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }
              >
                At least one digit
              </span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 pr-10 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-primary-500 focus:border-primary-500
              dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              placeholder="••••••••"
              disabled={isSubmitting || success}
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              disabled={isSubmitting || success}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>

          {formData.confirmPassword && (
            <div className="mt-2 flex items-center text-sm">
              {passwordsMatch ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600 dark:text-green-400">Passwords match</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-600 dark:text-red-400">Passwords do not match</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            {isSubmitting ? "Processing..." : "Reset Password"}
          </button>
        </div>

        <div className="text-center mt-4">
          <Link
            href="/login"
            className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  )
}
