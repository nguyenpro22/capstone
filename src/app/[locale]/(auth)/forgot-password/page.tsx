"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/forgot-password/verify-code")

    setIsLoading(false)
  }

  return (
    <>
      <div className="mb-8">
        <Link
          href="/login"
          className="group inline-flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-300" />
          Back to login
        </Link>
      </div>

      <div className="max-w-md">
        <h2 className="mb-3 text-4xl font-semibold tracking-tight text-gray-900">Forgot your password?</h2>
        <p className="mb-8 text-gray-600 text-lg">
          Don't worry, happens to all of us. Enter your email below to recover your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 px-4 text-lg bg-white border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 rounded-xl"
              placeholder="john.doe@example.com"
              required
            />
          </div>

          <Button
            type="submit"
            className={`w-full h-14 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
              isLoading ? "animate-pulse" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </>
  )
}

