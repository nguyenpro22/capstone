"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAddProcedureMutation } from "@/features/clinic-service/api"
import { toast, ToastContainer } from "react-toastify"
import { X, Plus, Clock, DollarSign, Trash2, AlertCircle, FileText } from "lucide-react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"

// Dynamically import QuillEditor to avoid SSR issues
const QuillEditor = dynamic(() => import("@/components/ui/quill-editor"), {
  ssr: false,
  loading: () => <div className="h-40 w-full border rounded-md bg-muted/20 dark:bg-muted/40 animate-pulse" />,
})

// Define error types based on the API response
interface ValidationError {
  code: string
  message: string
}

// Update the ApiError interface to handle cases where errors might be null
interface ApiError {
  type: string
  title: string
  status: number
  detail: string
  errors: ValidationError[] | null
}

const AddProcedure = ({
  onClose,
  clinicServiceId,
  onSuccess,
}: {
  onClose: () => void
  clinicServiceId: string
  onSuccess?: () => void
}) => {
  const { theme } = useTheme()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [stepIndex, setStepIndex] = useState(0)
  const [priceTypes, setPriceTypes] = useState([{ name: "", duration: 0, price: 0, isDefault: true }])
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [editorLoaded, setEditorLoaded] = useState(false)

  const [addProcedure, { isLoading }] = useAddProcedureMutation()

  // Ensure editor is loaded
  useEffect(() => {
    setEditorLoaded(true)
  }, [])

  const handleAddPriceType = () => {
    setPriceTypes([...priceTypes, { name: "", duration: 0, price: 0, isDefault: false }])
  }

  const handleRemovePriceType = (index: number) => {
    const updatedPriceTypes = priceTypes.filter((_, i) => i !== index)

    // If we removed the default price type and there are other price types, set the first one as default
    if (priceTypes[index].isDefault && updatedPriceTypes.length > 0) {
      updatedPriceTypes[0].isDefault = true
    }

    setPriceTypes(updatedPriceTypes)
  }

  const handlePriceTypeChange = (index: number, field: string, value: any) => {
    const updatedPriceTypes = [...priceTypes]

    if (field === "isDefault" && value === true) {
      // If setting this one as default, unset others
      updatedPriceTypes.forEach((pt, i) => {
        pt.isDefault = i === index
      })
    } else {
      updatedPriceTypes[index] = {
        ...updatedPriceTypes[index],
        [field]: field === "price" || field === "duration" ? Number(value) : value,
      }
    }

    setPriceTypes(updatedPriceTypes)
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    if (value.trim().length >= 2) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.Description
        return newErrors
      })
    }
  }

  // Helper function to display field error
  const getFieldError = (fieldName: string) => {
    return validationErrors[fieldName] || ""
  }

  // Update the handleSubmit function to use JSON request body instead of FormData
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Clear previous validation errors
    setValidationErrors({})

    // Client-side validation
    const errors: Record<string, string> = {}

    if (!name.trim()) {
      errors.Name = "Tên giai đoạn không được để trống!"
    } else if (name.trim().length < 2) {
      errors.Name = "Tên giai đoạn phải có ít nhất 2 ký tự!"
    }

    if (!description.trim()) {
      errors.Description = "Mô tả không được để trống!"
    } else if (description.trim().length < 2) {
      errors.Description = "Mô tả phải có ít nhất 2 ký tự!"
    }

    if (priceTypes.length === 0) {
      errors.PriceTypes = "Phải có ít nhất một loại giá!"
    }

    // Ensure at least one price type is set as default
    if (priceTypes.length > 0 && !priceTypes.some((pt) => pt.isDefault)) {
      errors.DefaultPriceType = "Phải có ít nhất một loại giá được đặt làm mặc định!"
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      // Show the first error as a toast
      const firstError = Object.values(errors)[0]
      toast.error(firstError)
      return
    }

    // Format the data according to the API requirements
    const procedurePriceTypes = priceTypes.map((item) => ({
      name: item.name,
      duration: item.duration,
      price: item.price,
      isDefault: item.isDefault,
    }))

    // Create the request body as a JSON object
    const requestBody = {
      clinicServiceId: clinicServiceId,
      name: name,
      description: description,
      stepIndex: stepIndex,
      procedurePriceTypes: procedurePriceTypes,
    }

    try {
      await addProcedure({ data: requestBody }).unwrap()
      toast.success("Thêm giai đoạn thành công!")
      // Reset form data instead of closing
      setName("")
      setDescription("")
      setStepIndex(0)
      setPriceTypes([{ name: "", duration: 0, price: 0, isDefault: true }])
      setValidationErrors({})
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Lỗi khi thêm Procedure:", error)

      if (error.data) {
        const apiError = error.data as ApiError

        // Handle case where there are specific field errors
        if (apiError.errors) {
          const newErrors: Record<string, string> = {}

          apiError.errors.forEach((err) => {
            newErrors[err.code] = err.message
          })

          setValidationErrors(newErrors)

          // Show the first error as a toast
          if (apiError.errors.length > 0) {
            toast.error(apiError.errors[0].message)
          } else {
            toast.error("Thêm thất bại, vui lòng thử lại.")
          }
        }
        // Handle case where there's a general error message but no specific field errors
        else if (apiError.detail) {
          // For step index already exists error
          if (apiError.detail.includes("Step Index Exist")) {
            setValidationErrors((prev) => ({
              ...prev,
              StepIndex: "Thứ tự bước này đã tồn tại!",
            }))
            toast.error("Thứ tự bước này đã tồn tại!")
          } else {
            toast.error(apiError.detail)
          }
        } else {
          toast.error("Thêm thất bại, vui lòng thử lại.")
        }
      } else {
        toast.error("Thêm thất bại, vui lòng thử lại.")
      }
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
       
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header with gradient - Fixed at top */}
        <div className="relative bg-gradient-to-r from-purple-500 to-pink-600 p-5 rounded-t-xl top-0 z-10">
          <h2 className="text-2xl font-bold text-white">Thêm Giai Đoạn</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên Giai Đoạn</label>
              <input
                type="text"
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-400 transition-all ${
                  getFieldError("Name")
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
                    : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                }`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (e.target.value.trim().length >= 2) {
                    setValidationErrors((prev) => {
                      const newErrors = { ...prev }
                      delete newErrors.Name
                      return newErrors
                    })
                  }
                }}
                placeholder="Nhập tên giai đoạn"
                required
              />
              {getFieldError("Name") && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {getFieldError("Name")}
                </p>
              )}
            </div>

            {/* Description - Quill Editor */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Mô Tả
              </label>
              <div className="quill-editor-container">
                {editorLoaded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={getFieldError("Description") ? "quill-error" : ""}
                  >
                    <QuillEditor
                      value={description}
                      onChange={handleDescriptionChange}
                      placeholder="Nhập mô tả chi tiết về giai đoạn"
                      error={!!getFieldError("Description")}
                    />
                  </div>
                )}
              </div>
              {getFieldError("Description") && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {getFieldError("Description")}
                </p>
              )}
            </div>

            {/* Clear div to prevent overlap */}
            <div className="clear-both h-16"></div>

            {/* Step Index */}
            <div className="space-y-1.5 relative z-20 bg-white dark:bg-gray-800 pt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 relative z-20">
                Thứ tự bước
              </label>
              <input
                type="number"
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-400 transition-all relative z-20 ${
                  getFieldError("StepIndex")
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
                    : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                }`}
                value={stepIndex}
                onChange={(e) => {
                  setStepIndex(Number(e.target.value))
                  // Clear the step index error when the user changes the value
                  if (getFieldError("StepIndex")) {
                    setValidationErrors((prev) => {
                      const newErrors = { ...prev }
                      delete newErrors.StepIndex
                      return newErrors
                    })
                  }
                }}
                min="0"
                required
              />
              {getFieldError("StepIndex") && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center relative z-20">
                  <AlertCircle size={14} className="mr-1" />
                  {getFieldError("StepIndex")}
                </p>
              )}
            </div>

            <div className="space-y-3 relative z-20 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loại Giá Dịch Vụ</label>
                <button
                  type="button"
                  onClick={handleAddPriceType}
                  className="flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Thêm Loại Giá
                </button>
              </div>

              {getFieldError("DefaultPriceType") && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {getFieldError("DefaultPriceType")}
                </p>
              )}

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {priceTypes.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex-1 space-y-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400 mr-1"></span>
                        Tên
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Cơ bản"
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-400 transition-all dark:bg-gray-800 dark:text-gray-100"
                        value={item.name}
                        onChange={(e) => handlePriceTypeChange(index, "name", e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock size={12} className="mr-1" />
                        Thời gian (phút)
                      </label>
                      <input
                        type="number"
                        placeholder="30"
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-400 transition-all dark:bg-gray-800 dark:text-gray-100"
                        value={item.duration}
                        onChange={(e) => handlePriceTypeChange(index, "duration", e.target.value)}
                        min="0"
                        required
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <DollarSign size={12} className="mr-1" />
                        Giá (VND)
                      </label>
                      <input
                        type="number"
                        placeholder="100,000"
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-400 transition-all dark:bg-gray-800 dark:text-gray-100"
                        value={item.price}
                        onChange={(e) => handlePriceTypeChange(index, "price", e.target.value)}
                        min="0"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id={`default-${index}`}
                          checked={item.isDefault}
                          onCheckedChange={(checked) => handlePriceTypeChange(index, "isDefault", checked)}
                        />
                        <Label htmlFor={`default-${index}`} className="text-xs text-gray-500 dark:text-gray-400">
                          Đặt làm mặc định
                        </Label>
                      </div>

                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePriceType(index)}
                          className="self-end sm:self-center p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                          title="Xóa loại giá này"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {getFieldError("PriceTypes") && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {getFieldError("PriceTypes")}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang thêm..." : "Thêm giai đoạn"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Global styles to fix the QuillEditor overlap issue */}
      <style jsx global>{`
        .quill-editor-container {
          position: relative;
          z-index: 10;
          margin-bottom: 60px; /* Add extra space below the editor */
        }
        
        .ql-toolbar.ql-snow,
        .ql-container.ql-snow {
          position: relative;
          z-index: 10;
          background-color: white;
        }
        
        /* Fix for the Quill editor to not extend beyond its bounds */
        .ql-editor {
          max-height: 150px;
          overflow-y: auto;
          background-color: white;
          color: #1e293b;
        }
        
        /* Dark mode styles for Quill */
        [data-theme='dark'] .ql-toolbar.ql-snow,
        [data-theme='dark'] .ql-container.ql-snow {
          background-color: #1f2937;
          border-color: #4b5563;
        }
        
        [data-theme='dark'] .ql-editor {
          background-color: #1f2937;
          color: #d1d5db;
        }
        
        [data-theme='dark'] .ql-picker-label {
          color: #d1d5db;
        }
        
        [data-theme='dark'] .ql-stroke {
          stroke: #d1d5db;
        }
        
        [data-theme='dark'] .ql-fill {
          fill: #d1d5db;
        }
        
        [data-theme='dark'] .ql-picker-options {
          background-color: #1f2937;
          border-color: #4b5563;
        }
        
        [data-theme='dark'] .ql-picker-item {
          color: #d1d5db;
        }
        
        /* Clear float to prevent overlap */
        .clear-both {
          clear: both;
          display: block;
          width: 100%;
        }
      `}</style>
    </div>
  )
}

export default AddProcedure
