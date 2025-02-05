"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function VerifyCode() {
  const [showCode, setShowCode] = useState(false)
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/forgot-password/reset-password")

    setIsLoading(false)
  }

  const handleResend = async () => {
    // Handle resend logic
  }

  return (
    <>
      <div className="mb-8">
        <Link
          href="/forgot-password"
          className="group inline-flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-300" />
          Back
        </Link>
      </div>

      <div className="max-w-md">
        <h2 className="mb-3 text-4xl font-semibold tracking-tight text-gray-900">Verify code</h2>
        <p className="mb-8 text-gray-600 text-lg">An authentication code has been sent to your email.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <Input
              type={showCode ? "text" : "password"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-16 px-4 text-2xl tracking-[0.5em] text-center font-mono bg-white border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 rounded-xl"
              placeholder="••••••"
              maxLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-300"
            >
              {showCode ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
            </button>
          </div>

          <div className="text-sm">
            <span className="text-gray-600">Didn't receive a code? </span>
            <button
              type="button"
              className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-300 underline-offset-4 hover:underline"
              onClick={handleResend}
            >
              Resend
            </button>
          </div>

          <Button
            type="submit"
            className={`w-full h-14 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
              isLoading ? "animate-pulse" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    </>
  )
}

