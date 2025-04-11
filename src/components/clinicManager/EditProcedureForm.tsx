"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUpdateProcedureMutation } from "@/features/clinic-service/api"
import { toast, ToastContainer } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Modal from "@/components/systemAdmin/Modal"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { Procedure } from "@/features/clinic-service/types"

interface PriceType {
  id?: string // Only used for display, not sent in the request
  name: string
  price: number
  duration: number
  isDefault: boolean
}

interface EditProcedureFormProps {
  procedure: Procedure | null
  serviceId: string
  onClose: () => void
  onSuccess: () => void
}

export default function EditProcedureForm({ procedure, serviceId, onClose, onSuccess }: EditProcedureFormProps) {
  const [updateProcedure, { isLoading }] = useUpdateProcedureMutation()

  const [formData, setFormData] = useState({
    name: "",
    stepIndex: 1,
    description: "",
    procedurePriceTypes: [] as PriceType[],
  })

  // Initialize form data when procedure changes
  useEffect(() => {
    if (procedure) {
      setFormData({
        name: procedure.name || "",
        stepIndex: procedure.stepIndex || 1,
        description: procedure.description || "",
        procedurePriceTypes:
          procedure.procedurePriceTypes?.map((pt) => ({
            id: pt.id, // Store ID for reference only
            name: pt.name || "",
            price: pt.price || 0,
            duration: pt.duration || 30, // Default to 30 minutes if not provided
            isDefault: pt.isDefault || false,
          })) || [],
      })
    }
  }, [procedure])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stepIndex" ? Number.parseInt(value) || 1 : value,
    }))
  }

  // Handle price type changes
  const handlePriceTypeChange = (index: number, field: string, value: string | number | boolean) => {
    const updatedPriceTypes = [...formData.procedurePriceTypes]

    if (field === "price" || field === "duration") {
      updatedPriceTypes[index] = {
        ...updatedPriceTypes[index],
        [field]: typeof value === "string" ? Number.parseFloat(value) || 0 : value,
      }
    } else if (field === "isDefault") {
      // If setting this one as default, unset others
      if (value === true) {
        updatedPriceTypes.forEach((pt, i) => {
          if (i !== index) {
            pt.isDefault = false
          }
        })
      }
      updatedPriceTypes[index] = {
        ...updatedPriceTypes[index],
        [field]: Boolean(value), // Ensure it's a boolean
      }
    } else {
      updatedPriceTypes[index] = {
        ...updatedPriceTypes[index],
        [field]: value,
      }
    }

    setFormData((prev) => ({
      ...prev,
      procedurePriceTypes: updatedPriceTypes,
    }))
  }

  // Add new price type
  const addPriceType = () => {
    // If this is the first price type, set it as default
    const isDefault = formData.procedurePriceTypes.length === 0

    setFormData((prev) => ({
      ...prev,
      procedurePriceTypes: [
        ...prev.procedurePriceTypes,
        {
          name: "",
          price: 0,
          duration: 30,
          isDefault: isDefault,
        },
      ],
    }))
  }

  // Remove price type
  const removePriceType = (index: number) => {
    const updatedPriceTypes = [...formData.procedurePriceTypes]
    const isRemovingDefault = updatedPriceTypes[index].isDefault

    updatedPriceTypes.splice(index, 1)

    // If we removed the default and there are other price types, set the first one as default
    if (isRemovingDefault && updatedPriceTypes.length > 0) {
      updatedPriceTypes[0].isDefault = true
    }

    setFormData((prev) => ({
      ...prev,
      procedurePriceTypes: updatedPriceTypes,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!procedure?.id) {
      toast.error("ID giai đoạn không hợp lệ")
      return
    }

    try {
      // Format data for API according to the required structure
      const updateData = {
        serviceId: serviceId,
        procedureId: procedure.id,
        name: formData.name,
        stepIndex: formData.stepIndex,
        description: formData.description,
        procedurePriceTypes: formData.procedurePriceTypes.map((pt) => ({
          // Do not include id in the request
          name: pt.name,
          price: pt.price,
          duration: pt.duration,
          isDefault: pt.isDefault,
        })),
      }

      await updateProcedure({
        id: procedure.id,
        data: updateData as any,
      }).unwrap()

      toast.success("Cập nhật giai đoạn thành công")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Failed to update procedure:", error)
      toast.error("Không thể cập nhật giai đoạn. Vui lòng thử lại sau.")
    }
  }

  if (!procedure) return null

  return (
    
    <Modal onClose={onClose} >
       <ToastContainer/>
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="space-y-4">
          {/* Procedure Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên giai đoạn</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên giai đoạn"
              required
            />
          </div>

          {/* Step Index */}
          <div className="space-y-2">
            <Label htmlFor="stepIndex">Thứ tự bước</Label>
            <Input
              id="stepIndex"
              name="stepIndex"
              type="number"
              min="1"
              value={formData.stepIndex}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả giai đoạn"
              rows={5}
            />
          </div>

          {/* Price Types */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Các loại giá</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPriceType}
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Thêm loại giá
              </Button>
            </div>

            {formData.procedurePriceTypes.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm border border-dashed border-gray-300 rounded-md">
                Chưa có loại giá nào. Nhấn Thêm loại giá để bắt đầu.
              </div>
            ) : (
              <div className="space-y-3">
                {formData.procedurePriceTypes.map((priceType, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-2">
                        <Label htmlFor={`priceName-${index}`}>Tên loại giá</Label>
                        <Input
                          id={`priceName-${index}`}
                          value={priceType.name}
                          onChange={(e) => handlePriceTypeChange(index, "name", e.target.value)}
                          placeholder="VD: Cơ bản, Cao cấp..."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`priceValue-${index}`}>Giá (VNĐ)</Label>
                        <Input
                          id={`priceValue-${index}`}
                          type="number"
                          min="0"
                          value={priceType.price}
                          onChange={(e) => handlePriceTypeChange(index, "price", e.target.value)}
                          placeholder="Nhập giá"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-2">
                        <Label htmlFor={`duration-${index}`}>Thời gian (phút)</Label>
                        <Input
                          id={`duration-${index}`}
                          type="number"
                          min="1"
                          value={priceType.duration}
                          onChange={(e) => handlePriceTypeChange(index, "duration", e.target.value)}
                          placeholder="Thời gian thực hiện"
                          required
                        />
                      </div>
                      <div className="flex items-center h-full pt-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`isDefault-${index}`}
                            checked={priceType.isDefault}
                            onCheckedChange={(checked) => handlePriceTypeChange(index, "isDefault", Boolean(checked))}
                          />
                          <Label
                            htmlFor={`isDefault-${index}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Đặt làm mặc định
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePriceType(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

