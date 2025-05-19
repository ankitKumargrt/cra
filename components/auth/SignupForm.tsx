"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react"

export function SignupForm() {
  const router = useRouter()
  const [apiUrl, setApiUrl] = useState<string>("http://localhost:8000")
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    organisation: "",
    designation: "",
    role_type: "L1",
    password: "",
    confirmPassword: "",
    question: "What was your first pet's name?",
    answer: "",
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

  const roleOptions = [
    { value: "L1", label: "L1 - KYC Officer" },
    { value: "L2", label: "L2 - Senior Officer" },
    { value: "L3", label: "L3 - Manager" },
  ]

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
    const { password } = formData
    setPasswordValidation({
      length: password.length >= 9,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      digit: /\d/.test(password),
    })
  }, [formData])

  // Check if passwords match
  useEffect(() => {
    const { password, confirmPassword } = formData
    setPasswordsMatch(password === confirmPassword && password !== "")
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.full_name || !formData.email || !formData.phone || !formData.organisation || !formData.designation) {
      setError("Please fill in all required fields")
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

    if (!formData.answer) {
      setError("Please answer the security question")
      return
    }

    // Form is valid, submit
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          organisation: formData.organisation,
          designation: formData.designation,
          role_type: formData.role_type,
          password: formData.password,
          question: formData.question,
          answer: formData.answer,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Registration failed")
      }

      // Registration successful
      setSuccess(true)

      // Redirect to login page immediately instead of waiting
      router.push("/login?registered=true")
    } catch (error) {
      console.error("Registration error:", error)
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
    <div className="w-full max-w-4xl p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:bg-gray-800/90 dark:border-gray-700 overflow-y-auto max-h-[90vh]">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Sign up to get started</p>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-100 border border-red-300 text-red-700 rounded dark:bg-red-900/50 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 mb-4 bg-green-100 border border-green-300 text-green-700 rounded dark:bg-green-900/50 dark:border-green-800 dark:text-green-300">
          Registration successful! Redirecting to login...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-primary-500 focus:border-primary-500
              dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              placeholder="John Doe"
              disabled={isSubmitting || success}
              required
            />
          </div>

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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-primary-500 focus:border-primary-500
              dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              placeholder="+1234567890"
              disabled={isSubmitting || success}
              required
            />
          </div>

          <div>
            <label htmlFor="organisation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Organization
            </label>
            <input
              type="text"
              id="organisation"
              name="organisation"
              value={formData.organisation}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-primary-500 focus:border-primary-500
              dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              placeholder="ABC Bank"
              disabled={isSubmitting || success}
              required
            />
          </div>

          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Designation
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-primary-500 focus:border-primary-500
              dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              placeholder="Loan Officer"
              disabled={isSubmitting || success}
              required
            />
          </div>

          <div>
            <label htmlFor="role_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              id="role_type"
              name="role_type"
              value={formData.role_type}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900
              focus:outline-none focus:ring-primary-500 focus:border-primary-500
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isSubmitting || success}
              required
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
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

              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div className="flex items-center">
                  {passwordValidation.length ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-1 flex-shrink-0" />
                  )}
                  <span
                    className={
                      passwordValidation.length
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    9+ chars
                  </span>
                </div>

                <div className="flex items-center">
                  {passwordValidation.specialChar ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-1 flex-shrink-0" />
                  )}
                  <span
                    className={
                      passwordValidation.specialChar
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    Special char
                  </span>
                </div>

                <div className="flex items-center">
                  {passwordValidation.digit ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-1 flex-shrink-0" />
                  )}
                  <span
                    className={
                      passwordValidation.digit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }
                  >
                    One digit
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
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
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
                      <span className="text-green-600 dark:text-green-400">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500 mr-1 flex-shrink-0" />
                      <span className="text-red-600 dark:text-red-400">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>
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

          <div className="md:col-span-2">
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
        </div>

        <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-4">
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full md:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            {isSubmitting ? "Processing..." : "Sign up"}
          </button>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
