"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Folder, ArrowRightLeft, Loader2 } from "lucide-react"
import type { CategoryDetail, SubCategory } from "@/features/category-service/types"

interface MoveSubCategoryModalProps {
  subCategory: SubCategory
  categories: CategoryDetail[]
  onClose: () => void
  onSubmit: (destinationCategoryId: string) => void
  isLoading: boolean
}

export default function MoveSubCategoryModal({
  subCategory,
  categories,
  onClose,
  onSubmit,
  isLoading,
}: MoveSubCategoryModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCategoryId) {
      onSubmit(selectedCategoryId)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-600">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <ArrowRightLeft className="w-5 h-5 mr-2" />
          Chuyển danh mục con
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-6">
          <div className="p-4 bg-purple-50 rounded-lg mb-4">
            <p className="text-sm text-gray-600 mb-2">Bạn đang chuyển danh mục con:</p>
            <div className="font-medium text-purple-700 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              {subCategory.name}
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">Chọn danh mục đích</label>

          {categories.length > 0 ? (
            <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`p-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-purple-50 transition-colors flex items-center ${
                    selectedCategoryId === category.id ? "bg-purple-50" : ""
                  }`}
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  <input
                    type="radio"
                    name="destinationCategory"
                    id={`category-${category.id}`}
                    value={category.id}
                    checked={selectedCategoryId === category.id}
                    onChange={() => setSelectedCategoryId(category.id)}
                    className="mr-3"
                  />
                  <label htmlFor={`category-${category.id}`} className="flex items-center cursor-pointer flex-1">
                    <Folder className="w-4 h-4 text-purple-500 mr-2" />
                    <span>{category.name}</span>
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center border border-gray-200 rounded-lg">
              <p className="text-gray-500">Không có danh mục đích nào khả dụng</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-600 border border-transparent rounded-md hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center"
            disabled={!selectedCategoryId || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Chuyển danh mục
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

