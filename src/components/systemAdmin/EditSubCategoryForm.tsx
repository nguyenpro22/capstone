"use client"

import type React from "react"

import { useState } from "react"
import { useUpdateCategoryMutation } from "@/features/category-service/api"
import { toast } from "react-toastify"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { SubCategory } from "@/features/category-service/types"



interface EditSubCategoryFormProps {
  initialData: SubCategory
  onClose: () => void
  onSaveSuccess: () => void
}

export default function EditSubCategoryForm({ initialData, onClose, onSaveSuccess }: EditSubCategoryFormProps) {
  const [name, setName] = useState(initialData.name)
  const [description, setDescription] = useState(initialData.description)
  const [isActivated, setIsActivated] = useState(initialData.isDeleted)

  const [updateSubCategory, { isLoading }] = useUpdateCategoryMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Tên danh mục con không được để trống!")
      return
    }

    try {
      await updateSubCategory({
        data: {
          id: initialData.id,
          name,
          description,
          parentId: initialData.parentId,
        }
      }).unwrap()

      toast.success("Cập nhật danh mục con thành công!")
      onSaveSuccess()
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục con:", error)
      toast.error("Cập nhật danh mục con thất bại!")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-2xl w-full max-w-md"
    >
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-r from-purple-500 to-pink-600 p-5 rounded-t-xl">
        <h2 className="text-2xl font-bold text-white">Chỉnh sửa Danh mục con</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Tên Danh mục con</label>
          <input
            type="text"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên danh mục con"
            required
          />
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
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

