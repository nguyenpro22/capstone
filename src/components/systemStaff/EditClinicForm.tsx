"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useUpdateClinicMutation } from "@/features/clinic/api"
import { useGetProvincesQuery, useGetDistrictsQuery, useGetWardsQuery } from "@/features/address/api"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { X, AlertCircle, Building2, Mail, Phone, MapPin, FileText, CreditCard, Landmark, ImageIcon } from "lucide-react"
import Image from "next/image"
import type { Clinic } from "@/features/clinic/types"

// Interfaces
interface ClinicFormProps {
  initialData: Partial<Clinic>
  onClose: () => void
  onSaveSuccess: () => void
}

interface ValidationErrors {
  name?: string
  email?: string
  phoneNumber?: string
  address?: string
  city?: string
  district?: string
  ward?: string
  bankName?: string
  bankAccountNumber?: string
  profilePicture?: string
}

interface AddressDetail {
  provinceId: string
  provinceName: string
  districtId: string
  districtName: string
  wardId: string
  wardName: string
  streetAddress: string
}

export default function ClinicForm({ initialData, onClose, onSaveSuccess }: ClinicFormProps) {
  const [formData, setFormData] = useState({
    ...initialData,
    bankName: initialData.bankName || "",
    bankAccountNumber: initialData.bankAccountNumber || "",
  })

  const [addressDetail, setAddressDetail] = useState<AddressDetail>({
    provinceId: "",
    provinceName: initialData.city || "",
    districtId: "",
    districtName: initialData.district || "",
    wardId: "",
    wardName: initialData.ward || "",
    streetAddress: initialData.address || "",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [updateClinic, { isLoading }] = useUpdateClinicMutation()

  // RTK Query hooks
  const { data: provinces, isLoading: isLoadingProvinces } = useGetProvincesQuery()
  const { data: districts, isLoading: isLoadingDistricts } = useGetDistrictsQuery(addressDetail.provinceId, {
    skip: !addressDetail.provinceId,
  })
  const { data: wards, isLoading: isLoadingWards } = useGetWardsQuery(addressDetail.districtId, {
    skip: !addressDetail.districtId,
  })

  // Find province ID by name when provinces are loaded
  useEffect(() => {
    if (provinces?.data && addressDetail.provinceName && !addressDetail.provinceId) {
      const province = provinces.data.find((p) => p.name === addressDetail.provinceName)
      if (province) {
        setAddressDetail((prev) => ({
          ...prev,
          provinceId: province.id,
        }))
      }
    }
  }, [provinces, addressDetail.provinceName, addressDetail.provinceId])

  // Find district ID by name when districts are loaded
  useEffect(() => {
    if (districts?.data && addressDetail.districtName && !addressDetail.districtId) {
      const district = districts.data.find((d) => d.name === addressDetail.districtName)
      if (district) {
        setAddressDetail((prev) => ({
          ...prev,
          districtId: district.id,
        }))
      }
    }
  }, [districts, addressDetail.districtName, addressDetail.districtId])

  // Find ward ID by name when wards are loaded
  useEffect(() => {
    if (wards?.data && addressDetail.wardName && !addressDetail.wardId) {
      const ward = wards.data.find((w) => w.name === addressDetail.wardName)
      if (ward) {
        setAddressDetail((prev) => ({
          ...prev,
          wardId: ward.id,
        }))
      }
    }
  }, [wards, addressDetail.wardName, addressDetail.wardId])

  // Handle address selection changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "provinceId" && provinces) {
      const province = provinces.data.find((p) => p.id === value)
      setAddressDetail((prev) => ({
        ...prev,
        provinceId: value,
        provinceName: province?.name || "",
        districtId: "",
        districtName: "",
        wardId: "",
        wardName: "",
      }))
    } else if (name === "districtId" && districts) {
      const district = districts.data.find((d) => d.id === value)
      setAddressDetail((prev) => ({
        ...prev,
        districtId: value,
        districtName: district?.name || "",
        wardId: "",
        wardName: "",
      }))
    } else if (name === "wardId" && wards) {
      const ward = wards.data.find((w) => w.id === value)
      setAddressDetail((prev) => ({
        ...prev,
        wardId: value,
        wardName: ward?.name || "",
      }))
    } else if (name === "streetAddress") {
      setAddressDetail((prev) => ({
        ...prev,
        streetAddress: value,
      }))
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessages([])

    if (!formData.id) {
      setErrorMessages(["Clinic ID is missing"])
      return
    }

    const updatedFormData = new FormData()
    updatedFormData.append("clinicId", formData.id)
    updatedFormData.append("name", formData.name || "")
    updatedFormData.append("email", formData.email || "")
    updatedFormData.append("phoneNumber", formData.phoneNumber || "")

    // Send address components separately
    updatedFormData.append("address", addressDetail.streetAddress)
    updatedFormData.append("city", addressDetail.provinceName)
    updatedFormData.append("district", addressDetail.districtName)
    updatedFormData.append("ward", addressDetail.wardName)

    // Add banking information
    updatedFormData.append("bankName", formData.bankName)
    updatedFormData.append("bankAccountNumber", formData.bankAccountNumber)

    if (selectedFile) {
      updatedFormData.append("profilePicture", selectedFile)
    }

    try {
      await updateClinic({ clinicId: formData.id, data: updatedFormData }).unwrap()
      toast.success("Clinic updated successfully!")
      // Gọi onSaveSuccess trước khi đóng form
      onSaveSuccess()
      // Sau đó mới đóng form
      onClose()
    } catch (error: any) {
      console.error("Update failed:", error)
      if (error?.data?.status === 422 && error?.data?.errors) {
        const messages = error.data.errors.map((err: any) => err.message)
        setErrorMessages(messages)
      } else {
        setErrorMessages(["Failed to update clinic. Please try again."])
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4"
      onClick={(e) => {
        // Chỉ đóng modal khi click vào backdrop, không phải khi click vào nội dung
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan truyền
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Edit Clinic</h2>
          <p className="text-purple-100 mt-1">Update your clinic information</p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* Error Messages */}
          {errorMessages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg border border-red-200 overflow-hidden"
            >
              <div className="flex items-center gap-2 p-4 bg-red-50 border-b border-red-200">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-700 font-medium">Please fix the following errors:</p>
              </div>
              <div className="p-4 bg-white space-y-2">
                {errorMessages.map((message, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-red-600">
                    <span className="mt-0.5">•</span>
                    <span>{message}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-500" />
                <span>Basic Information</span>
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Clinic Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleFormChange}
                      className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter clinic name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleFormChange}
                      className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter email"
                      readOnly
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleFormChange}
                      className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter phone number"
                      required
                    />
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Banking Information Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-500" />
                <span>Banking Information</span>
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleFormChange}
                      className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter bank name"
                      required
                    />
                    <Landmark className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Bank Account Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleFormChange}
                      className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter account number"
                      required
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-500" />
                <span>Address Details</span>
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Province Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Province/City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {isLoadingProvinces ? (
                      <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500">
                        Loading provinces...
                      </div>
                    ) : (
                      <select
                        name="provinceId"
                        value={addressDetail.provinceId}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200 bg-white"
                        required
                      >
                        <option value="">Select Province/City</option>
                        {provinces?.data.map((province) => (
                          <option
                            key={province.id}
                            value={province.id}
                            selected={province.name === addressDetail.provinceName}
                          >
                            {province.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {!addressDetail.provinceId && addressDetail.provinceName && (
                      <div className="mt-1 text-sm text-amber-600">Current: {addressDetail.provinceName}</div>
                    )}
                  </div>
                </div>

                {/* District Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    District <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {!addressDetail.provinceId ? (
                      <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500">
                        Select province first
                      </div>
                    ) : isLoadingDistricts ? (
                      <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500">
                        Loading districts...
                      </div>
                    ) : (
                      <select
                        name="districtId"
                        value={addressDetail.districtId}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200 bg-white"
                        required
                      >
                        <option value="">Select District</option>
                        {districts?.data.map((district) => (
                          <option
                            key={district.id}
                            value={district.id}
                            selected={district.name === addressDetail.districtName}
                          >
                            {district.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {!addressDetail.districtId && addressDetail.districtName && (
                      <div className="mt-1 text-sm text-amber-600">Current: {addressDetail.districtName}</div>
                    )}
                  </div>
                </div>

                {/* Ward Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Ward <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {!addressDetail.districtId ? (
                      <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500">
                        Select district first
                      </div>
                    ) : isLoadingWards ? (
                      <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500">
                        Loading wards...
                      </div>
                    ) : (
                      <select
                        name="wardId"
                        value={addressDetail.wardId}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200 bg-white"
                        required
                      >
                        <option value="">Select Ward</option>
                        {wards?.data.map((ward) => (
                          <option key={ward.id} value={ward.id} selected={ward.name === addressDetail.wardName}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {!addressDetail.wardId && addressDetail.wardName && (
                      <div className="mt-1 text-sm text-amber-600">Current: {addressDetail.wardName}</div>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={addressDetail.streetAddress}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                    placeholder="Enter street address"
                    required
                  />
                </div>
              </div>

              {/* Preview Full Address */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100"
              >
                <p className="text-sm text-gray-600 font-medium">Full Address:</p>
                <p className="text-sm text-gray-800 mt-1">
                  {addressDetail.streetAddress && `${addressDetail.streetAddress}, `}
                  {addressDetail.wardName && `${addressDetail.wardName}, `}
                  {addressDetail.districtName && `${addressDetail.districtName}, `}
                  {addressDetail.provinceName}
                </p>
              </motion.div>
            </div>

            {/* Profile Picture */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                <span>Profile Picture</span>
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  Profile Picture <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                    accept=".jpg, .jpeg, .png"
                  />
                  <ImageIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">Accepted formats: JPG, PNG (max 5MB)</p>

                {formData.profilePictureUrl && (
                  <div className="mt-2 flex items-center gap-4">
                    <p className="text-sm text-gray-600">Current image:</p>
                    <Image
                      src={formData.profilePictureUrl || "/placeholder.svg"}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-md border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

