"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"
import { useState, useEffect } from "react"
import { useUpdateServiceMutation } from "@/features/clinic-service/api"
import { useGetBranchesQuery } from "@/features/clinic/api"
import type { Service, UpdateService } from "@/features/clinic-service/types"
import Image from "next/image"
import type { CategoryDetail } from "@/features/category-service/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePlus, Loader2, Save, XCircle, Trash2, Edit, FileText, Building } from "lucide-react"
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"
import { toast } from "react-toastify"
import dynamic from "next/dynamic"
import ReactSelect from "react-select"

// Dynamically import QuillEditor to avoid SSR issues
const QuillEditor = dynamic(() => import("@/components/ui/quill-editor"), {
  ssr: false,
  loading: () => <div className="h-40 w-full border rounded-md bg-muted/20 animate-pulse" />,
})

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
  const [imagesToDelete, setImagesToDelete] = useState<{
    coverImages: number[]
  }>({
    coverImages: [],
  })
  const [updateService, { isLoading }] = useUpdateServiceMutation()
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [selectedBranches, setSelectedBranches] = useState<{ value: string; label: string }[]>([])
  // Add a new state for validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Fetch branches data
  const { data: branchesData, isLoading: isLoadingBranches } = useGetBranchesQuery(clinicId || "")

  // Ensure editor is loaded
  useEffect(() => {
    setEditorLoaded(true)
  }, [])

  // Initialize selected branches from initialData when component mounts
  useEffect(() => {
    if (initialData.clinics && initialData.clinics.length > 0) {
      const initialBranches = initialData.clinics.map((clinic) => ({
        value: clinic.id,
        label: clinic.name,
      }))
      setSelectedBranches(initialBranches)
    }
  }, [initialData.clinics])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }))
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

  // Extract branches from the response, handling both possible structures
  const getBranchesFromResponse = () => {
    if (!branchesData) return []

    // Check if the response has branches in the nested structure
    if (branchesData.value?.branches?.items && Array.isArray(branchesData.value.branches.items)) {
      return branchesData.value.branches.items
    }

    // If we have a single branch with nested branches
    if (branchesData.value?.id && branchesData.value?.branches?.items) {
      return branchesData.value.branches.items
    }

    return []
  }

  const branches = getBranchesFromResponse()

  const branchOptions = branches.map((branch) => ({
    value: branch.id,
    label: branch.name,
  }))

  // Update the handleSaveChanges function to include validation for branches
  const handleSaveChanges = async () => {
    if (!formData.id) return

    // Reset validation errors
    setValidationErrors({})

    // Validate branch selection
    if (selectedBranches.length === 0) {
      setValidationErrors((prev) => ({ ...prev, branches: "At least one branch must be selected" }))
      toast.error("Please select at least one branch")
      return
    }

    const updatedFormData = new FormData()

    // Add basic fields
    updatedFormData.append("id", formData.id)
    if (formData.name) updatedFormData.append("name", formData.name)
    if (formData.description) updatedFormData.append("description", formData.description)
    updatedFormData.append("categoryId", formData.category?.id || "")

    // Add selected branch IDs
    const branchIds = selectedBranches.map((branch) => branch.value)
    updatedFormData.append("clinicId", JSON.stringify(branchIds))

    // Add indices of images to delete/replace as JSON array strings
    if (imagesToDelete.coverImages.length > 0) {
      updatedFormData.append("indexCoverImagesChange", JSON.stringify(imagesToDelete.coverImages))
    }

    // Add files if selected
    if (selectedCoverFiles.length > 0) {
      selectedCoverFiles.forEach((file) => updatedFormData.append("coverImages", file))
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

  // React-select styles
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      border: "1px solid #e2e8f0",
      borderRadius: "0.5rem",
      padding: "0.25rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#cbd5e1",
      },
    }),
    option: (base: any, state: { isSelected: boolean }) => ({
      ...base,
      backgroundColor: state.isSelected ? "#f8f9fa" : "white",
      color: "#1e293b",
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "#f1f5f9",
      borderRadius: "0.375rem",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: "#4a5568",
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "#a0aec0",
      "&:hover": {
        color: "#718096",
        backgroundColor: "#e2e8f0",
      },
    }),
  }

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
          <Label htmlFor="description" className="text-sm font-medium flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Description
          </Label>
          <div
            style={{
              marginBottom: "80px", // Increase space below the editor
              position: "relative", // Create a new stacking context
              zIndex: 1, // Lower z-index
            }}
          >
            {editorLoaded && (
              <QuillEditor
                value={formData.description || ""}
                onChange={handleDescriptionChange}
                placeholder="Enter service description"
              />
            )}
          </div>
        </div>

        {/* Clear div to prevent overlap */}
        <div className="clear-both h-4"></div>

        <div
          className="space-y-2"
          style={{
            position: "relative", // Create a new stacking context
            zIndex: 2, // Higher z-index
            backgroundColor: "white", // Add background color
          }}
        >
          <Label
            htmlFor="category"
            className="text-sm font-medium block py-2"
            style={{
              position: "relative", // Create a new stacking context
              zIndex: 3, // Even higher z-index
              backgroundColor: "white", // Add background color
              display: "block", // Ensure it's a block element
              marginBottom: "8px", // Add some margin
            }}
          >
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

        {/* Branch Selection (Multiple) */}
        <div className="space-y-2 mt-6">
          <Label className="text-sm font-medium flex items-center gap-1">
            <Building className="h-4 w-4" />
            Branches <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            isMulti
            value={selectedBranches}
            onChange={(selected) => {
              setSelectedBranches(selected as { value: string; label: string }[])
              // Clear validation error when branches are selected
              if (selected && selected.length > 0) {
                setValidationErrors((prev) => {
                  const newErrors = { ...prev }
                  delete newErrors.branches
                  return newErrors
                })
              }
            }}
            options={branchOptions}
            isDisabled={isLoadingBranches}
            isSearchable
            placeholder="Select Branches"
            styles={{
              ...selectStyles,
              control: (base: any) => ({
                ...base,
                border: validationErrors.branches ? "1px solid #ef4444" : "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                padding: "0.25rem",
                boxShadow: validationErrors.branches ? "0 0 0 1px #ef4444" : "none",
                "&:hover": {
                  borderColor: validationErrors.branches ? "#ef4444" : "#cbd5e1",
                },
              }),
            }}
            className="react-select-container"
            classNamePrefix="react-select"
          />
          {validationErrors.branches && (
            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {validationErrors.branches}
            </p>
          )}
          {branchOptions.length === 0 && !isLoadingBranches && (
            <p className="text-sm text-amber-600">No branches available. Please create a branch first.</p>
          )}
          {selectedBranches.length > 0 && !validationErrors.branches && (
            <p className="text-sm text-green-600">
              {selectedBranches.length} branch{selectedBranches.length > 1 ? "es" : ""} selected
            </p>
          )}
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
                    {/* Overlay with edit and delete buttons */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => triggerFileInput("cover-image-input")}
                        className="p-2 rounded-full bg-white text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Change image"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCoverImage(img.index)}
                        className="p-2 rounded-full bg-white text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
        }
        
        /* Fix for the Quill editor to not extend beyond its bounds */
        .ql-editor {
          max-height: 150px;
          overflow-y: auto;
        }
        
        /* Clear float to prevent overlap */
        .clear-both {
          clear: both;
          display: block;
          width: 100%;
        }
      `}</style>
    </Card>
  )
}

export default UpdateServiceForm

