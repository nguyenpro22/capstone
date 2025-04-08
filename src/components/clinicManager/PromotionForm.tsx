"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useCreatePromotionMutation } from "@/features/promotion-service/api"
import Image from "next/image"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Percent, X, Upload, AlertCircle } from "lucide-react"
import { useTheme } from "next-themes"

// Validation error interfaces
interface ValidationErrorItem {
  code: string
  message: string
}

interface ValidationErrorResponse {
  type: string
  title: string
  status: number
  detail: string
  errors: ValidationErrorItem[]
}

interface PromotionFormProps {
  serviceId: string
  onClose: () => void
  onSuccess?: () => void
}

// Interface for field errors
interface FieldErrors {
  name?: string
  discountPercent?: string
  image?: string
  startDay?: string
  endDate?: string
  general?: string
}

export default function PromotionForm({ serviceId, onClose, onSuccess }: PromotionFormProps) {
  const { theme } = useTheme()
  const startRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState("")
  const [discountPercent, setDiscountPercent] = useState(0)
  const [image, setImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [startDay, setStartDay] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const [createPromotion, { isLoading }] = useCreatePromotionMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    // Client-side validation
    if (new Date(endDate) < new Date(startDay)) {
      setFieldErrors((prev) => ({
        ...prev,
        endDate: "Ngày kết thúc phải sau ngày bắt đầu!",
      }))
      toast.error("Ngày kết thúc phải sau ngày bắt đầu!", {
        position: "top-right",
        theme: theme === "dark" ? "dark" : "light",
        className:
          theme === "dark"
            ? "bg-gray-800 border border-red-800 text-red-400"
            : "bg-white border border-red-100 text-red-600",
      })
      return
    }

    const formData = new FormData()
    formData.append("serviceId", serviceId)
    formData.append("name", name)
    formData.append("discountPercent", discountPercent.toString())
    if (image) formData.append("image", image)
    formData.append("startDay", startDay)
    formData.append("endDate", endDate)

    try {
      await createPromotion({ data: formData }).unwrap()
      toast.success("Khuyến mãi đã được tạo thành công!", {
        position: "top-right",
        theme: theme === "dark" ? "dark" : "light",
        className:
          theme === "dark"
            ? "bg-gray-800 border border-green-800 text-green-400"
            : "bg-white border border-green-100 text-green-600",
      })
      resetForm()
      onClose()
      // Add a delay before calling onSuccess (refetch)
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 400) // 400ms delay
      }
    } catch (err: any) {
      console.error("Complete error object:", err)

      // Handle validation errors
      if (err && err.data) {
        console.log("Error data:", err.data)

        // Check if it's a validation error with the expected structure
        if (err.data.errors && Array.isArray(err.data.errors) && err.data.errors.length > 0) {
          console.log("Validation errors:", err.data.errors)

          // Create a new errors object
          const newErrors: FieldErrors = {}

          // Map validation errors to specific fields
          err.data.errors.forEach((validationError: ValidationErrorItem) => {
            const errorMsg = validationError.message
            const errorCode = validationError.code.toLowerCase()

            // Map error code to field name
            if (errorCode.includes("name")) {
              newErrors.name = errorMsg
            } else if (errorCode.includes("discount") || errorCode.includes("percent")) {
              newErrors.discountPercent = errorMsg
            } else if (errorCode.includes("image")) {
              newErrors.image = errorMsg
            } else if (errorCode.includes("start")) {
              newErrors.startDay = errorMsg
            } else if (errorCode.includes("end")) {
              newErrors.endDate = errorMsg
            } else {
              // If we can't map to a specific field, set as general error
              newErrors.general = errorMsg
            }

            // Also show as toast for visibility
            toast.error(errorMsg, {
              position: "top-right",
              theme: theme === "dark" ? "dark" : "light",
              className:
                theme === "dark"
                  ? "bg-gray-800 border border-red-800 text-red-400"
                  : "bg-white border border-red-100 text-red-600",
            })
          })

          // Update field errors state
          setFieldErrors(newErrors)
          return
        }

        // If we have a detail message but no specific errors
        if (err.data.detail) {
          setFieldErrors({ general: err.data.detail })
          toast.error(err.data.detail, {
            position: "top-right",
            theme: theme === "dark" ? "dark" : "light",
            className:
              theme === "dark"
                ? "bg-gray-800 border border-red-800 text-red-400"
                : "bg-white border border-red-100 text-red-600",
          })
          return
        }
      }

      // If we have a message property
      if (err && err.message) {
        setFieldErrors({ general: err.message })
        toast.error(err.message, {
          position: "top-right",
          theme: theme === "dark" ? "dark" : "light",
          className:
            theme === "dark"
              ? "bg-gray-800 border border-red-800 text-red-400"
              : "bg-white border border-red-100 text-red-600",
        })
        return
      }

      // Fallback generic error message
      setFieldErrors({ general: "Tạo khuyến mãi thất bại, vui lòng thử lại!" })
      toast.error("Tạo khuyến mãi thất bại, vui lòng thử lại!", {
        position: "top-right",
        theme: theme === "dark" ? "dark" : "light",
        className:
          theme === "dark"
            ? "bg-gray-800 border border-red-800 text-red-400"
            : "bg-white border border-red-100 text-red-600",
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const resetForm = () => {
    setName("")
    setDiscountPercent(0)
    setImage(null)
    setPreviewImage(null)
    setStartDay("")
    setEndDate("")
    setFieldErrors({})
  }

  // Helper component for field error message
  const FieldError = ({ message }: { message?: string }) => {
    if (!message) return null

    return (
      <div className="flex items-center gap-1.5 mt-1.5 text-red-500 dark:text-red-400 text-sm">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>{message}</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/60 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-purple-100/20 dark:from-purple-900/20 to-transparent rounded-full translate-x-16 -translate-y-16" />

        {/* Header - Fixed at top */}
        <div className="p-6 pb-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl tracking-wide text-gray-800 dark:text-gray-100">Tạo Khuyến Mãi Mới</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Promotion Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tên Khuyến Mãi</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  fieldErrors.name
                    ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-600 focus:ring-red-200 dark:focus:ring-red-900"
                    : "border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-600 focus:ring-purple-200 dark:focus:ring-purple-900"
                } focus:ring focus:ring-opacity-50 transition-all duration-200 dark:bg-gray-700 dark:text-gray-100`}
                required
              />
              <FieldError message={fieldErrors.name} />
            </div>

            {/* Discount Percentage */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phần Trăm Giảm Giá</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Math.max(0, Number(e.target.value)))}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    fieldErrors.discountPercent
                      ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-600 focus:ring-red-200 dark:focus:ring-red-900"
                      : "border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-600 focus:ring-purple-200 dark:focus:ring-purple-900"
                  } focus:ring focus:ring-opacity-50 transition-all duration-200 dark:bg-gray-700 dark:text-gray-100`}
                  required
                />
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <FieldError message={fieldErrors.discountPercent} />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hình Ảnh Khuyến Mãi</label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-200
                  ${
                    fieldErrors.image
                      ? "border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-900/20"
                      : isDragging
                        ? "border-purple-400 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  id="promotion-image"
                  accept="image/*"
                />
                <label htmlFor="promotion-image" className="flex flex-col items-center gap-2 cursor-pointer">
                  {previewImage ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={previewImage || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-8">
                      <Upload
                        className={`w-8 h-8 ${fieldErrors.image ? "text-red-400 dark:text-red-500" : "text-purple-400 dark:text-purple-500"}`}
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Kéo thả hoặc click để tải ảnh lên</p>
                    </div>
                  )}
                </label>
              </div>
              <FieldError message={fieldErrors.image} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ngày Bắt Đầu</label>
                <div className="relative">
                  <input
                    ref={startRef}
                    type="datetime-local"
                    value={startDay}
                    onChange={(e) => setStartDay(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      fieldErrors.startDay
                        ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-600 focus:ring-red-200 dark:focus:ring-red-900"
                        : "border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-600 focus:ring-purple-200 dark:focus:ring-purple-900"
                    } focus:ring focus:ring-opacity-50 transition-all duration-200 dark:bg-gray-700 dark:text-gray-100`}
                    required
                    onFocus={(e) => e.target.showPicker()} // Opens date picker when focused
                  />
                  <Calendar
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 cursor-pointer"
                    onClick={() => startRef.current?.showPicker()} // Uses ref instead of querySelector
                  />
                </div>
                <FieldError message={fieldErrors.startDay} />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ngày Kết Thúc</label>
                <div className="relative">
                  <input
                    ref={endRef}
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      fieldErrors.endDate
                        ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-600 focus:ring-red-200 dark:focus:ring-red-900"
                        : "border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-600 focus:ring-purple-200 dark:focus:ring-purple-900"
                    } focus:ring focus:ring-opacity-50 transition-all duration-200 dark:bg-gray-700 dark:text-gray-100`}
                    required
                    onFocus={(e) => e.target.showPicker()} // Opens date picker when focused
                  />
                  <Calendar
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 cursor-pointer"
                    onClick={() => endRef.current?.showPicker()} // Uses ref instead of querySelector
                  />
                </div>
                <FieldError message={fieldErrors.endDate} />
              </div>
            </div>

            {/* General Error Message */}
            <AnimatePresence>
              {fieldErrors.general && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-2"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{fieldErrors.general}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Footer with buttons - Fixed at bottom */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault()
                const form = document.querySelector("form")
                if (form) form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
              }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white
                       hover:from-pink-600 hover:to-purple-600 transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200 dark:shadow-purple-900/20"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Đang tạo...</span>
                </div>
              ) : (
                "Tạo Khuyến Mãi"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
