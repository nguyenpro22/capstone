"use client"

import type React from "react"
import { useState } from "react"
import { useAddProcedureMutation } from "@/features/clinic-service/api"
import { toast } from "react-toastify"
import { X, Plus, ImageIcon, Clock, DollarSign, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

const AddProcedure = ({ onClose, clinicServiceId }: { onClose: () => void; clinicServiceId: string }) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [stepIndex, setStepIndex] = useState(0)
  const [procedureCoverImage, setProcedureCoverImage] = useState<File | null>(null)
  const [priceTypes, setPriceTypes] = useState([{ name: "", duration: 0, price: 0 }])
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [addProcedure, { isLoading }] = useAddProcedureMutation()

  const handleAddPriceType = () => {
    setPriceTypes([...priceTypes, { name: "", duration: 0, price: 0 }])
  }

  const handleRemovePriceType = (index: number) => {
    setPriceTypes(priceTypes.filter((_, i) => i !== index))
  }

  const handlePriceTypeChange = (index: number, field: string, value: any) => {
    const updatedPriceTypes = priceTypes.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setPriceTypes(updatedPriceTypes)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setProcedureCoverImage(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Tên thủ tục không được để trống!")
      return
    }
    if (!description.trim()) {
      toast.error("Mô tả không được để trống!")
      return
    }
    if (priceTypes.length === 0) {
      toast.error("Phải có ít nhất một loại giá!")
      return
    }

    // Chuyển đổi format đúng theo API yêu cầu
    const procedurePriceTypes = priceTypes.map((item) => ({
      Name: item.name,
      Duration: item.duration,
      Price: item.price,
    }))
    const formData = new FormData()
    formData.append("clinicServiceId", clinicServiceId)
    formData.append("name", name)
    formData.append("description", description)
    formData.append("stepIndex", stepIndex.toString())
    if (procedureCoverImage) {
      formData.append("procedureCoverImage", procedureCoverImage)
    }
    formData.append("procedurePriceTypes", JSON.stringify(procedurePriceTypes))

    try {
      await addProcedure({ data: formData }).unwrap()
      toast.success("Thêm thủ tục thành công!")
      onClose()
    } catch (error) {
      console.error("Lỗi khi thêm Procedure:", error)
      toast.error("Thêm thất bại, vui lòng thử lại.")
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header with gradient - Fixed at top */}
        <div className="relative bg-gradient-to-r from-purple-500 to-pink-600 p-5 rounded-t-xl sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-white">Thêm Giai Đoạn</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Tên Thủ Tục</label>
              <input
                type="text"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên thủ tục"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Mô Tả</label>
              <textarea
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả chi tiết về thủ tục"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Thứ tự bước</label>
              <input
                type="number"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
                value={stepIndex}
                onChange={(e) => setStepIndex(Number(e.target.value))}
                min="0"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Hình Ảnh</label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Nhấp để tải lên</span> hoặc kéo thả
                      </p>
                    </div>
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  </label>
                </div>

                {imagePreview && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProcedureCoverImage(null)
                        setImagePreview(null)
                      }}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Loại Giá Dịch Vụ</label>
                <button
                  type="button"
                  onClick={handleAddPriceType}
                  className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Thêm Loại Giá
                </button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {priceTypes.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1 space-y-1">
                      <label className="text-xs text-gray-500 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
                        Tên
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Cơ bản"
                        className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
                        value={item.name}
                        onChange={(e) => handlePriceTypeChange(index, "name", e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <label className="text-xs text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        Thời gian (phút)
                      </label>
                      <input
                        type="number"
                        placeholder="30"
                        className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
                        value={item.duration}
                        onChange={(e) => handlePriceTypeChange(index, "duration", Number(e.target.value))}
                        min="0"
                        required
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <label className="text-xs text-gray-500 flex items-center">
                        <DollarSign size={12} className="mr-1" />
                        Giá (VND)
                      </label>
                      <input
                        type="number"
                        placeholder="100,000"
                        className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
                        value={item.price}
                        onChange={(e) => handlePriceTypeChange(index, "price", Number(e.target.value))}
                        min="0"
                        required
                      />
                    </div>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePriceType(index)}
                        className="self-end sm:self-center p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="Xóa loại giá này"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
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
                {isLoading ? "Đang thêm..." : "Thêm thủ tục"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default AddProcedure

