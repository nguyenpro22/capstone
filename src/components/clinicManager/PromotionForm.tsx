"use client"

import type React from "react"

import { useState } from "react"
import { useCreatePromotionMutation } from "@/features/promotion-service/api"
import Image from "next/image"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Percent, X, Upload } from "lucide-react"
import { useRef } from "react"

interface PromotionFormProps {
  serviceId: string
  onClose: () => void
  onSuccess?: () => void
}

export default function PromotionForm({ serviceId, onClose, onSuccess }: PromotionFormProps) {
  const startRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState("")
  const [discountPercent, setDiscountPercent] = useState(0)
  const [image, setImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [startDay, setStartDay] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  const [createPromotion, { isLoading, error }] = useCreatePromotionMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (new Date(endDate) < new Date(startDay)) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu!", {
        position: "top-right",
        theme: "light",
        className: "bg-white border border-red-100 text-red-600",
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
        theme: "light",
        className: "bg-white border border-green-100 text-green-600",
      })
      resetForm()
      onClose()
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error("Lỗi khi tạo khuyến mãi:", err)
      toast.error("Tạo khuyến mãi thất bại, vui lòng thử lại!", {
        position: "top-right",
        theme: "light",
        className: "bg-white border border-red-100 text-red-600",
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
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-purple-100/20 to-transparent rounded-full translate-x-16 -translate-y-16" />

        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl tracking-wide text-gray-800">Tạo Khuyến Mãi Mới</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Promotion Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tên Khuyến Mãi</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                         focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                required
              />
            </div>

            {/* Discount Percentage */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phần Trăm Giảm Giá</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                           focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                  required
                />
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Hình Ảnh Khuyến Mãi</label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-200
                  ${isDragging ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:border-purple-300"}`}
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
                      <Upload className="w-8 h-8 text-purple-400" />
                      <p className="text-sm text-gray-500">Kéo thả hoặc click để tải ảnh lên</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ngày Bắt Đầu</label>
                <div className="relative">
                  <input
                    ref={startRef}
                    type="datetime-local"
                    value={startDay}
                    onChange={(e) => setStartDay(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                     focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                    required
                    onFocus={(e) => e.target.showPicker()} // Opens date picker when focused
                  />
                  <Calendar
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                    onClick={() => startRef.current?.showPicker()} // Uses ref instead of querySelector
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ngày Kết Thúc</label>
                <div className="relative">
                  <input
                    ref={endRef}
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                     focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                    required
                    onFocus={(e) => e.target.showPicker()} // Opens date picker when focused
                  />
                  <Calendar
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                    onClick={() => endRef.current?.showPicker()} // Uses ref instead of querySelector
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 
                         hover:bg-gray-50 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white
                         hover:from-pink-600 hover:to-purple-600 transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
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
          </form>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 rounded-lg bg-red-50 text-red-600 text-sm"
              >
                {(error as any)?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

