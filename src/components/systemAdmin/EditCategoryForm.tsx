"use client"

import type React from "react"

import { useState } from "react"
import { useUpdateCategoryMutation } from "@/features/category-service/api"
import { toast } from "react-toastify"
import { X, Save, FileText, Tag, FolderTree, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

// Dynamically import the rich text editor to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/ui/rich-text-editor-with-buttons"), {
  ssr: false,
  loading: () => <div className="h-32 w-full border rounded-md bg-muted/20 animate-pulse" />,
})

interface EditCategoryFormProps {
  initialData: any
  onClose: () => void
  onSaveSuccess: () => void
}

interface ValidationErrors {
  name?: string
  description?: string
  parentId?: string
}

export default function EditCategoryForm({ initialData, onClose, onSaveSuccess }: EditCategoryFormProps) {
  const [formData, setFormData] = useState({
    id: initialData.id,
    name: initialData.name || "",
    description: initialData.description || "",
    parentId: initialData.parentId || "",
  })

  const [updateCategory, { isLoading }] = useUpdateCategoryMutation()
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user edits input
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }))

    // Clear error when user edits description
    setValidationErrors((prev) => ({
      ...prev,
      description: "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateCategory(formData).unwrap()
      toast.success("Cập nhật danh mục thành công!")
      onSaveSuccess()
    } catch (error: any) {
      console.log("Error response:", error)

      if (error?.status === 400 || error?.status === 422) {
        const validationErrors = error?.data?.errors || []
        if (validationErrors.length > 0) {
          const newErrors: Record<string, string> = {}
          validationErrors.forEach((err: { code: string; message: string }) => {
            newErrors[err.code.toLowerCase()] = err.message
          })

          setValidationErrors(newErrors)
        }
        toast.error(error?.data?.detail || "Dữ liệu không hợp lệ!")
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!")
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <Card className="border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Chỉnh sửa danh mục</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4">
              {/* ID (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="id" className="flex items-center gap-1 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  ID
                </Label>
                <Input id="id" name="id" value={formData.id} className="bg-muted/30 font-mono text-sm" readOnly />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1 text-sm font-medium">
                  <Tag className="h-4 w-4" />
                  Tên danh mục <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên danh mục"
                  className={validationErrors.name ? "border-destructive" : ""}
                />
                {validationErrors.name && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Description - Rich Text Editor */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-1 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  Mô tả
                </Label>
                <RichTextEditor
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  error={!!validationErrors.description}
                />
                {validationErrors.description && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {validationErrors.description}
                  </p>
                )}
              </div>

              {/* Parent ID */}
              <div className="space-y-2">
                <Label htmlFor="parentId" className="flex items-center gap-1 text-sm font-medium">
                  <FolderTree className="h-4 w-4" />
                  Parent ID
                </Label>
                <Input
                  id="parentId"
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  placeholder="Nhập ID danh mục cha (nếu có)"
                  className={validationErrors.parentId ? "border-destructive" : ""}
                />
                {validationErrors.parentId && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {validationErrors.parentId}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="gap-1">
                <X className="h-4 w-4" />
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-1">
                <Save className="h-4 w-4" />
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
