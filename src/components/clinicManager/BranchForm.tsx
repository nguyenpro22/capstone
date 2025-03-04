"use client"

import type React from "react"

import { useState } from "react"
import { useCreateBranchMutation } from "@/features/clinic/api"
import { useGetProvincesQuery, useGetDistrictsQuery, useGetWardsQuery } from "@/features/address/api"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { X, AlertCircle } from "lucide-react"

// Interfaces
interface BranchFormProps {
  onClose: () => void
  onSaveSuccess: () => void
}

interface ValidationErrors {
  name?: string
  email?: string
  phoneNumber?: string
  address?: string
  operatingLicense?: string
  operatingLicenseExpiryDate?: string
  profilePictureUrl?: string
}

interface AddressDetail {
  provinceId: string
  districtId: string
  wardId: string
  streetAddress: string
}

export default function BranchForm({ onClose, onSaveSuccess }: BranchFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    streetAddress: "", // Changed from address to streetAddress
    operatingLicense: null as File | null,
    operatingLicenseExpiryDate: "",
    profilePictureUrl: null as File | null,
  })

  const [addressDetail, setAddressDetail] = useState<AddressDetail>({
    provinceId: "",
    districtId: "",
    wardId: "",
    streetAddress: "",
  })

  // RTK Query hooks
  const { data: provinces, isLoading: isLoadingProvinces } = useGetProvincesQuery()
  const { data: districts, isLoading: isLoadingDistricts } = useGetDistrictsQuery(addressDetail.provinceId, {
    skip: !addressDetail.provinceId,
  })
  const { data: wards, isLoading: isLoadingWards } = useGetWardsQuery(addressDetail.districtId, {
    skip: !addressDetail.districtId,
  })

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [createBranch, { isLoading }] = useCreateBranchMutation()

  // Handle address selection changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setAddressDetail((prev) => {
      const newDetail = {
        ...prev,
        [name]: value,
      }

      // Reset dependent fields
      if (name === "provinceId") {
        newDetail.districtId = ""
        newDetail.wardId = ""
      } else if (name === "districtId") {
        newDetail.wardId = ""
      }

      return newDetail
    })

    // Clear address validation error when any address field changes
    if (validationErrors.address) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.address
        return newErrors
      })
    }
  }

  // Combine address parts into full address string
  const getFullAddress = (): string => {
    const parts: string[] = []

    if (addressDetail.streetAddress) parts.push(addressDetail.streetAddress)
    if (addressDetail.wardId && wards) {
      const ward = wards.data.find((w) => w.id === addressDetail.wardId)
      if (ward) parts.push(ward.name)
    }
    if (addressDetail.districtId && districts) {
      const district = districts.data.find((d) => d.id === addressDetail.districtId)
      if (district) parts.push(district.name)
    }
    if (addressDetail.provinceId && provinces) {
      const province = provinces.data.find((p) => p.id === addressDetail.provinceId)
      if (province) parts.push(province.name)
    }

    return parts.join(", ")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear all previous errors before submitting
    setValidationErrors({})

    const formDataToSend = new FormData()
    formDataToSend.append("name", formData.name)
    formDataToSend.append("email", formData.email)
    formDataToSend.append("phoneNumber", formData.phoneNumber)
    formDataToSend.append("address", getFullAddress())
    formDataToSend.append("operatingLicenseExpiryDate", formData.operatingLicenseExpiryDate)
    if (formData.operatingLicense) {
      formDataToSend.append("operatingLicense", formData.operatingLicense)
    }
    if (formData.profilePictureUrl) {
      formDataToSend.append("profilePictureUrl", formData.profilePictureUrl)
    }

    try {
      await createBranch({ data: formDataToSend }).unwrap()
      toast.success("Branch created successfully!")
      onSaveSuccess()
      onClose()
    } catch (error: any) {
      console.error("Error response:", error)

      // Handle API validation errors
      if (error?.data?.errors) {
        const formattedErrors: ValidationErrors = {}

        // Assuming error.data.errors is an array of error objects
        error.data.errors.forEach((err: any) => {
          // Get the field name from either field or code property
          const fieldName = err.field || err.code

          // Map API field names to display names
          const fieldDisplayNames: Record<string, string> = {
            name: "Branch Name",
            email: "Email",
            phoneNumber: "Phone Number",
            address: "Address",
            operatingLicense: "Operating License",
            operatingLicenseExpiryDate: "Operating License Expiry Date",
            profilePictureUrl: "Profile Picture",
          }

          // Format the error message with the display name
          const displayName = fieldDisplayNames[fieldName] || fieldName
          formattedErrors[fieldName as keyof ValidationErrors] = `${displayName}: ${err.message}`
        })

        setValidationErrors(formattedErrors)
        toast.error("Please check the form for errors")
      } else {
        // Handle unexpected errors
        toast.error(error?.data?.message || "An unexpected error occurred. Please try again later.")
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear the specific error when input changes
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof ValidationErrors]
        return newErrors
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0]
    setFormData((prev) => ({ ...prev, [fieldName]: file }))

    // Clear the specific error when file changes
    if (validationErrors[fieldName as keyof ValidationErrors]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName as keyof ValidationErrors]
        return newErrors
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg my-8"
      >
        <div className="p-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none"
          >
            <X size={20} />
          </button>

          {Object.entries(validationErrors).filter(([_, message]) => message).length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-500 font-medium">Please fix the following errors:</p>
              </div>
              <div className="mt-3 space-y-2">
                {Object.entries(validationErrors)
                  .filter(([_, message]) => message) // Only show non-empty error messages
                  .map(([field, message]) => (
                    <div key={field} className="text-sm text-red-500 pl-4">
                      • {message}
                    </div>
                  ))}
              </div>
            </div>
          )}

          <h2 className="text-xl font-bold mb-4">Create New Branch</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Branch Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Enter branch name"
                required
              />
              {validationErrors.name && <p className="text-red-500 text-xs italic">{validationErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Enter email"
                required
              />
              {validationErrors.email && <p className="text-red-500 text-xs italic">{validationErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Enter phone number"
                required
              />
              {validationErrors.phoneNumber && (
                <p className="text-red-500 text-xs italic">{validationErrors.phoneNumber}</p>
              )}
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Address Details</h3>

              {/* Province Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Province/City</label>
                <select
                  name="provinceId"
                  value={addressDetail.provinceId}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                  required
                >
                  <option value="">Select Province/City</option>
                  {provinces?.data.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {validationErrors.address && <p className="text-red-500 text-xs italic">{validationErrors.address}</p>}
              </div>

              {/* District Selection */}
              {addressDetail.provinceId && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">District</label>
                  <select
                    name="districtId"
                    value={addressDetail.districtId}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                    required
                  >
                    <option value="">Select District</option>
                    {districts?.data.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Ward Selection */}
              {addressDetail.districtId && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Ward</label>
                  <select
                    name="wardId"
                    value={addressDetail.wardId}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                    required
                  >
                    <option value="">Select Ward</option>
                    {wards?.data.map((ward) => (
                      <option key={ward.id} value={ward.id}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Street Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Street Address</label>
                <input
                  type="text"
                  name="streetAddress"
                  value={addressDetail.streetAddress}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                  placeholder="Enter street address"
                  required
                />
              </div>

              {/* Preview Full Address */}
              {addressDetail.provinceId && (
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">Full Address:</p>
                  <p className="text-sm font-medium text-gray-800">{getFullAddress()}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Operating License</label>
              <input
                type="file"
                name="operatingLicense"
                onChange={(e) => handleFileChange(e, "operatingLicense")}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                accept=".pdf, .jpg, .jpeg, .png"
                required
              />
              {validationErrors.operatingLicense && (
                <p className="text-red-500 text-xs italic">{validationErrors.operatingLicense}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Operating License Expiry Date</label>
              <input
                type="date"
                name="operatingLicenseExpiryDate"
                value={formData.operatingLicenseExpiryDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                required
              />
              {validationErrors.operatingLicenseExpiryDate && (
                <p className="text-red-500 text-xs italic">{validationErrors.operatingLicenseExpiryDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Profile Picture</label>
              <input
                type="file"
                name="profilePictureUrl"
                onChange={(e) => handleFileChange(e, "profilePictureUrl")}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                accept=".jpg, .jpeg, .png"
              />
              {validationErrors.profilePictureUrl && (
                <p className="text-red-500 text-xs italic">{validationErrors.profilePictureUrl}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
              >
                {isLoading ? "Creating..." : "Create Branch"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

