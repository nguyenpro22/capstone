"use client"

import type React from "react"

import { useState } from "react"
import { useCreateCategoryMutation } from "@/features/category-service/api"
import { toast } from "react-toastify"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"

interface SubCategoryFormProps {
  parentId: string
  onClose: () => void
  onSaveSuccess: () => void
}

export default function SubCategoryForm({ parentId, onClose, onSaveSuccess }: SubCategoryFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isActivated, setIsActivated] = useState(true)
  // Thay đổi phần khai báo state error
  const [errors, setErrors] = useState<{ code: string; message: string }[]>([])

  const [addSubCategory, { isLoading }] = useCreateCategoryMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Tên danh mục con không được để trống!")
      return
    }

    try {
      await addSubCategory({
        name,
        description,
        isActivated,
        parentId,
      }).unwrap()

      toast.success("Subcategory created successfully!", {
        position: "top-right",
        className: "bg-white border border-green-100 text-green-600",
      })
      onSaveSuccess()
      onClose()
    } catch (error: any) {
      console.error("Error creating subcategory:", error)

      // Xử lý lỗi từ API response
      if (error.data && error.data.errors) {
        setErrors(error.data.errors)
        // Hiển thị toast với lỗi đầu tiên
        if (error.data.errors.length > 0) {
          toast.error(error.data.errors[0].message, {
            position: "top-right",
            className: "bg-white border border-red-100 text-red-600",
          })
        }
      } else {
        setErrors([{ code: "general", message: "Failed to create subcategory" }])
        toast.error("Failed to create subcategory", {
          position: "top-right",
          className: "bg-white border border-red-100 text-red-600",
        })
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-2xl w-full max-w-md"
    >
      {/* Header with gradient - Fixed at top */}
      <div className="relative bg-gradient-to-r from-purple-500 to-pink-600 p-5 rounded-t-xl sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-white">Thêm Danh mục con</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Error Messages */}
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 rounded-lg bg-red-50 overflow-hidden"
            >
              {errors.map((error, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 border-b border-red-100 last:border-b-0 text-red-700"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error.message}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Tên Danh mục con</label>
          {/* Thêm xử lý validation cho input name */}
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              // Xóa lỗi liên quan đến Name khi người dùng nhập
              if (errors.some((err) => err.code === "Name")) {
                setErrors(errors.filter((err) => err.code !== "Name"))
              }
            }}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.some((err) => err.code === "Name")
                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                : "border-gray-200 focus:border-purple-300 focus:ring-purple-200"
            } focus:ring focus:ring-opacity-50 transition-all duration-200`}
            placeholder="Enter subcategory name"
            required
          />
          {errors.some((err) => err.code === "Name") && (
            <p className="mt-1 text-xs text-red-600">{errors.find((err) => err.code === "Name")?.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Mô tả</label>
          <textarea
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả chi tiết về danh mục con"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActivated"
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            checked={isActivated}
            onChange={(e) => setIsActivated(e.target.checked)}
          />
          <label htmlFor="isActivated" className="ml-2 text-sm font-medium text-gray-700">
            Kích hoạt
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang thêm..." : "Thêm danh mục con"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

