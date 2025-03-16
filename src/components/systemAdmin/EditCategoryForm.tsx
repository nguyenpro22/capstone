"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUpdateCategoryMutation } from "@/features/category-service/api"
import { toast } from "react-toastify"
import { X, Save, FileText, Tag, FolderTree, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

// Dynamically import QuillEditor to avoid SSR issues
const QuillEditor = dynamic(() => import("@/components/ui/quill-editor"), {
  ssr: false,
  loading: () => <div className="h-64 w-full border rounded-md bg-muted/20 animate-pulse" />,
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
  const [editorLoaded, setEditorLoaded] = useState(false)

  // Ensure editor is loaded
  useEffect(() => {
    setEditorLoaded(true)
    console.log("🔍 EditCategoryForm mounted")
  }, [])

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
    console.log("🔍 Description changed:", value.substring(0, 50) + "...")
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

  // Sửa hàm handleSubmit để đảm bảo form chỉ đóng khi submit thành công
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Ngăn sự kiện lan truyền

    try {
      // Sửa lại cách gọi mutation để phù hợp với cấu trúc API
      await updateCategory({ data: formData }).unwrap()
      toast.success("Cập nhật danh mục thành công!")
      onSaveSuccess() // Chỉ đóng form khi cập nhật thành công
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

  // Sửa hàm onClose để ngăn sự kiện lan truyền
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }

  // Ngăn sự kiện click từ bên trong form lan truyền ra ngoài
  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        // Chỉ đóng modal khi click vào backdrop, không phải khi click vào nội dung
        if (e.target === e.currentTarget) {
          e.preventDefault()
          e.stopPropagation()
          onClose()
        }
      }}
    >
      <div className="w-full max-w-md max-h-[90vh] overflow-auto" onClick={handleFormClick}>
        <Card className="border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Chỉnh sửa danh mục</CardTitle>
            <Button type="button" variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleSubmit(e)
            }}
            onClick={handleFormClick}
          >
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

              {/* Description - Quill Editor */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-1 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  Mô tả
                </Label>
                {editorLoaded && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <QuillEditor
                      value={formData.description}
                      onChange={handleDescriptionChange}
                      error={!!validationErrors.description}
                      placeholder="Nhập mô tả danh mục"
                    />
                  </div>
                )}
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
              <Button type="button" variant="outline" onClick={handleClose} className="gap-1">
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

