"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"
import { useState } from "react"
import { useUpdateServiceMutation } from "@/features/clinic-service/api"
import type { Service, UpdateService } from "@/features/clinic-service/types"
import Image from "next/image"
import type { CategoryDetail } from "@/features/category-service/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePlus, Loader2, Save, XCircle, Trash2 } from "lucide-react"
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"
import { toast } from "react-toastify"

interface UpdateServiceFormProps {
  initialData: Partial<Service>
  categories: CategoryDetail[]
  onClose: () => void
  onSaveSuccess: () => void
}

const UpdateServiceForm: React.FC<UpdateServiceFormProps> = ({ initialData, categories, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState<UpdateService>({
    ...initialData,
    clinicId: "",
  })
  const token = getAccessToken()
  // Add null check for token
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null
  const clinicId = tokenData?.clinicId || ""

  const [selectedCoverFiles, setSelectedCoverFiles] = useState<File[]>([])
  const [selectedDescriptionFiles, setSelectedDescriptionFiles] = useState<File[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<{
    coverImages: number[]
    descriptionImages: number[]
  }>({
    coverImages: [],
    descriptionImages: [],
  })
  const [updateService, { isLoading }] = useUpdateServiceMutation()

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    const category = categories.find((cat) => cat.id === value)
    if (category) {
      setFormData((prev) => ({
        ...prev,
        category: {
          id: category.id,
          name: category.name,
          description: category.description || "",
        },
        categoryId: category.id, // Set categoryId for API request
      }))
    }
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
  ) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleDeleteCoverImage = (index: number) => {
    setImagesToDelete((prev) => ({
      ...prev,
      coverImages: [...prev.coverImages, index],
    }))
  }

  const handleDeleteDescriptionImage = (index: number) => {
    setImagesToDelete((prev) => ({
      ...prev,
      descriptionImages: [...prev.descriptionImages, index],
    }))
  }

  const handleSaveChanges = async () => {
    if (!formData.id) return

    const updatedFormData = new FormData()

    // Add basic fields
    updatedFormData.append("id", formData.id)
    if (formData.name) updatedFormData.append("name", formData.name)
    if (formData.description) updatedFormData.append("description", formData.description)
    updatedFormData.append("categoryId", formData.category?.id || "")
    // Format clinicId as a JSON array string
    updatedFormData.append("clinicId", JSON.stringify([clinicId]))

    // Add indices of images to delete/replace as JSON array strings
    if (imagesToDelete.coverImages.length > 0) {
      updatedFormData.append("indexCoverImagesChange", JSON.stringify(imagesToDelete.coverImages))
    }

    if (imagesToDelete.descriptionImages.length > 0) {
      updatedFormData.append("indexDescriptionImagesChange", JSON.stringify(imagesToDelete.descriptionImages))
    }

    // Add files if selected
    if (selectedCoverFiles.length > 0) {
      selectedCoverFiles.forEach((file) => updatedFormData.append("coverImages", file))
    }

    if (selectedDescriptionFiles.length > 0) {
      selectedDescriptionFiles.forEach((file) => updatedFormData.append("descriptionImages", file))
    }

    try {
      await updateService({ id: formData.id, data: updatedFormData }).unwrap()
      toast.success("Service updated successfully!")
      onSaveSuccess()
    } catch (error) {
      console.error("Update failed:", error)
      toast.error("Failed to update service. Please try again.")
    }
  }

  const triggerFileInput = (id: string) => {
    document.getElementById(id)?.click()
  }

  // Filter out deleted images for display
  const displayCoverImages = formData.coverImage?.filter((img) => !imagesToDelete.coverImages.includes(img.index)) || []

  const displayDescriptionImages =
    formData.descriptionImage?.filter((img) => !imagesToDelete.descriptionImages.includes(img.index)) || []

  return (
    <Card className="w-[650px] max-h-[85vh] border-none shadow-lg flex flex-col">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-lg">
        <CardTitle className="text-2xl font-semibold text-gray-800">Update Service</CardTitle>
        <CardDescription className="text-gray-600">Update your service details and images</CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6 max-h-[60vh] overflow-y-auto pr-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Service Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleFormChange}
            placeholder="Enter service name"
            className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleFormChange}
            placeholder="Enter service description"
            className="min-h-[100px] border-gray-200 focus:border-pink-300 focus:ring-pink-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Category
          </Label>
          <Select value={formData.category?.id} onValueChange={handleCategoryChange}>
            <SelectTrigger className="border-gray-200 focus:border-pink-300 focus:ring-pink-200">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <Label className="text-sm font-medium">Cover Images</Label>

          {displayCoverImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 mb-3">
              {displayCoverImages.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="overflow-hidden rounded-lg aspect-square bg-gray-50 border border-gray-100">
                    <Image
                      src={img.url || "/placeholder.svg"}
                      alt={`Cover ${img.index}`}
                      width={150}
                      height={150}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {img.index}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoverImage(img.index)}
                      className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic mb-3">No existing cover images</div>
          )}

          {imagesToDelete.coverImages.length > 0 && (
            <div className="text-sm text-amber-600 mb-2">
              {imagesToDelete.coverImages.length} image(s) marked for deletion
            </div>
          )}

          {selectedCoverFiles.length > 0 && (
            <>
              <Label className="text-sm font-medium">Newly Selected Cover Images:</Label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {Array.from(selectedCoverFiles).map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="overflow-hidden rounded-lg aspect-square bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <div className="text-sm text-center p-2 text-gray-600">
                        {file.name.length > 15 ? file.name.substring(0, 15) + "..." : file.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-2">
            <input
              id="cover-image-input"
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, setSelectedCoverFiles)}
              className="hidden"
              accept="image/*"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => triggerFileInput("cover-image-input")}
              className="w-full border-dashed border-gray-300 hover:border-pink-300 hover:bg-pink-50 text-gray-600 hover:text-pink-600"
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              {selectedCoverFiles.length > 0
                ? `${selectedCoverFiles.length} files selected - Click to change`
                : "Select Cover Images"}
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <Label className="text-sm font-medium">Description Images</Label>

          {displayDescriptionImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 mb-3">
              {displayDescriptionImages.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="overflow-hidden rounded-lg aspect-square bg-gray-50 border border-gray-100">
                    <Image
                      src={img.url || "/placeholder.svg"}
                      alt={`Description ${img.index}`}
                      width={150}
                      height={150}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {img.index}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteDescriptionImage(img.index)}
                      className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic mb-3">No existing description images</div>
          )}

          {imagesToDelete.descriptionImages.length > 0 && (
            <div className="text-sm text-amber-600 mb-2">
              {imagesToDelete.descriptionImages.length} image(s) marked for deletion
            </div>
          )}

          {selectedDescriptionFiles.length > 0 && (
            <>
              <Label className="text-sm font-medium">Newly Selected Description Images:</Label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {Array.from(selectedDescriptionFiles).map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="overflow-hidden rounded-lg aspect-square bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <div className="text-sm text-center p-2 text-gray-600">
                        {file.name.length > 15 ? file.name.substring(0, 15) + "..." : file.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-2">
            <input
              id="description-image-input"
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, setSelectedDescriptionFiles)}
              className="hidden"
              accept="image/*"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => triggerFileInput("description-image-input")}
              className="w-full border-dashed border-gray-300 hover:border-pink-300 hover:bg-pink-50 text-gray-600 hover:text-pink-600"
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              {selectedDescriptionFiles.length > 0
                ? `${selectedDescriptionFiles.length} files selected - Click to change`
                : "Select Description Images"}
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-lg">
        <Button variant="outline" onClick={onClose} className="text-gray-600 hover:text-gray-800">
          <XCircle className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button
          onClick={handleSaveChanges}
          disabled={isLoading}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default UpdateServiceForm

