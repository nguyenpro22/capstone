"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUpdateBranchMutation } from "@/features/clinic/api"
import { useGetProvincesQuery, useGetDistrictsQuery, useGetWardsQuery } from "@/features/address/api"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import {
  Layers,
  X,
  AlertCircle,
  MapPin,
  Phone,
  FileCode,
  Building2,
  ImageIcon,
  Check,
  FileText,
  Mail,
  CreditCard,
} from "lucide-react"
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"
import Image from "next/image"

interface EditBranchFormProps {
  initialData: any // Initial branch data from API
  onClose: () => void
  onSaveSuccess: () => void
}

// Update the interface to include the new fields
interface AddressDetail {
  provinceId: string
  provinceName: string
  districtId: string
  districtName: string
  wardId: string
  wardName: string
  streetAddress: string
}

// Add these fields to the ValidationErrors interface
interface ValidationErrors {
  branchId?: string
  name?: string
  phoneNumber?: string
  address?: string
  city?: string
  district?: string
  ward?: string
  profilePicture?: string
  isActivated?: string
  businessLicense?: string
  operatingLicense?: string
  operatingLicenseExpiryDate?: string
  bankName?: string
  bankAccountNumber?: string
}

export default function EditBranchForm({ initialData, onClose, onSaveSuccess }: EditBranchFormProps) {
  const [formData, setFormData] = useState(initialData)
  const token = getAccessToken() as string
  const { clinicId } = GetDataByToken(token) as TokenData

  const [updateBranch, { isLoading }] = useUpdateBranchMutation()
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Add these state variables after the existing useState declarations
  const [selectedBusinessLicense, setSelectedBusinessLicense] = useState<File | null>(null)
  const [selectedOperatingLicense, setSelectedOperatingLicense] = useState<File | null>(null)
  const [sendEmptyBusinessLicense, setSendEmptyBusinessLicense] = useState(false)
  const [sendEmptyOperatingLicense, setSendEmptyOperatingLicense] = useState(false)
  const [sendEmptyExpiryDate, setSendEmptyExpiryDate] = useState(false)
  const [operatingLicenseExpiryDate, setOperatingLicenseExpiryDate] = useState<string>(
    initialData.operatingLicenseExpiryDate || "",
  )

  // Address state
  const [addressDetail, setAddressDetail] = useState<AddressDetail>({
    provinceId: "",
    provinceName: initialData.city || "",
    districtId: "",
    districtName: initialData.district || "",
    wardId: "",
    wardName: initialData.ward || "",
    streetAddress: initialData.address || "",
  })

  // RTK Query hooks for address data
  const { data: provinces, isLoading: isLoadingProvinces } = useGetProvincesQuery()
  const { data: districts, isLoading: isLoadingDistricts } = useGetDistrictsQuery(addressDetail.provinceId, {
    skip: !addressDetail.provinceId,
  })
  const { data: wards, isLoading: isLoadingWards } = useGetWardsQuery(addressDetail.districtId, {
    skip: !addressDetail.districtId,
  })

  // Create preview URL for selected file
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [selectedFile])

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: checked,
    }))
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setValidationErrors((prev) => ({
        ...prev,
        profilePicture: "",
      }))
    }
  }

  // Add these handlers after the existing handler functions
  const handleBusinessLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedBusinessLicense(e.target.files[0])
      setSendEmptyBusinessLicense(false)
      setValidationErrors((prev) => ({
        ...prev,
        businessLicense: "",
      }))
    }
  }

  const handleOperatingLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedOperatingLicense(e.target.files[0])
      setSendEmptyOperatingLicense(false)
      setValidationErrors((prev) => ({
        ...prev,
        operatingLicense: "",
      }))
    }
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOperatingLicenseExpiryDate(e.target.value)
    setSendEmptyExpiryDate(false)
    setValidationErrors((prev) => ({
      ...prev,
      operatingLicenseExpiryDate: "",
    }))
  }

  // Update the handleSubmit function to include the new fields
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formDataToSend = new FormData()

    // Không cần thêm clinicId và branchId vào FormData nữa
    // vì chúng sẽ được sử dụng trong URL

    // Add basic branch information
    formDataToSend.append("name", formData.name)
    formDataToSend.append("phoneNumber", formData.phoneNumber)
    formDataToSend.append("isActivated", formData.isActivated.toString())

    // Send address components separately
    formDataToSend.append("address", addressDetail.streetAddress)
    formDataToSend.append("city", addressDetail.provinceName)
    formDataToSend.append("district", addressDetail.districtName)
    formDataToSend.append("ward", addressDetail.wardName)

    // Add bank information if provided
    if (formData.bankName) {
      formDataToSend.append("bankName", formData.bankName)
    }

    if (formData.bankAccountNumber) {
      formDataToSend.append("bankAccountNumber", formData.bankAccountNumber)
    }

    // Add profile picture if selected
    if (selectedFile) {
      formDataToSend.append("profilePicture", selectedFile)
    }

    // Add business license if selected or send empty value
    if (selectedBusinessLicense) {
      formDataToSend.append("businessLicense", selectedBusinessLicense)
    } else if (sendEmptyBusinessLicense) {
      formDataToSend.append("businessLicense", "")
    }

    // Add operating license if selected or send empty value
    if (selectedOperatingLicense) {
      formDataToSend.append("operatingLicense", selectedOperatingLicense)
    } else if (sendEmptyOperatingLicense) {
      formDataToSend.append("operatingLicense", "")
    }

    // Add operating license expiry date if provided or send empty value
    if (operatingLicenseExpiryDate && !sendEmptyExpiryDate) {
      formDataToSend.append("operatingLicenseExpiryDate", operatingLicenseExpiryDate)
    } else if (sendEmptyExpiryDate) {
      formDataToSend.append("operatingLicenseExpiryDate", "")
    }

    try {
      // Gọi API với clinicId và branchId là path parameters
      if (clinicId) {
        await updateBranch({
          clinicId: clinicId,
          branchId: formData.id,
          data: formDataToSend,
        }).unwrap()

        toast.success("Branch updated successfully!")
        onSaveSuccess()
        onClose()
      } else {
        toast.error("Clinic ID is required but not available")
      }
    } catch (error: any) {
      console.error("Error response:", error)
      if (error?.status === 400 || error?.status === 422) {
        const validationErrors = error?.data?.errors || []
        const newErrors: ValidationErrors = {}
        validationErrors.forEach((err: { code: string; message: string }) => {
          newErrors[err.code.toLowerCase() as keyof ValidationErrors] = err.message
        })
        setValidationErrors(newErrors)
        toast.error(error?.data?.detail || "Invalid data provided!")
      } else {
        toast.error("An error occurred, please try again!")
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8"
      >
        {/* Decorative header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Building2 className="w-7 h-7 text-white/90" />
              <div>
                <h2 className="text-2xl font-bold">Edit Branch</h2>
                <p className="text-purple-100 text-sm mt-1">Update branch information and settings</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* Error Messages */}
          <AnimatePresence>
            {Object.keys(validationErrors).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 rounded-lg border border-red-200 overflow-hidden"
              >
                <div className="flex items-center gap-2 p-4 bg-red-50 border-b border-red-200">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-red-700 font-medium">Please fix the following errors:</p>
                </div>
                <div className="p-4 bg-white space-y-2">
                  {Object.entries(validationErrors).map(
                    ([field, message], index) =>
                      message && (
                        <div key={index} className="flex items-start gap-2 text-sm text-red-600">
                          <span className="mt-0.5">•</span>
                          <span>{message}</span>
                        </div>
                      ),
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                <Layers className="h-5 w-5 text-purple-500" />
                <span>Basic Information</span>
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Branch ID */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Branch ID <span className="text-gray-400 text-xs font-normal">(Read only)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                      readOnly
                    />
                    <FileCode className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Branch Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter branch name"
                      required
                    />
                    <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
                </div>

                {/* Email - Read Only */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Email <span className="text-gray-400 text-xs font-normal">(Read only)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                      readOnly
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter phone number"
                      required
                    />
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {validationErrors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.phoneNumber}</p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Branch Status</label>
                  <div className="flex items-center h-[50px] px-4 rounded-lg border border-gray-200 bg-white">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="isActivated"
                          checked={formData.isActivated}
                          onChange={handleCheckboxChange}
                          className="sr-only"
                        />
                        <div
                          className={`w-11 h-6 rounded-full transition ${formData.isActivated ? "bg-purple-500" : "bg-gray-300"}`}
                        ></div>
                        <div
                          className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform transform ${formData.isActivated ? "translate-x-5" : ""}`}
                        ></div>
                      </div>
                      <span className={`font-medium ${formData.isActivated ? "text-purple-700" : "text-gray-500"}`}>
                        {formData.isActivated ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </div>
                  {validationErrors.isActivated && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.isActivated}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                <MapPin className="h-5 w-5 text-purple-500" />
                <span>Address Details</span>
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Province Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Province/City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {isLoadingProvinces ? (
                      <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        <span>Loading provinces...</span>
                      </div>
                    ) : (
                      <select
                        name="provinceId"
                        value={addressDetail.provinceId}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200 bg-white appearance-none"
                        required
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                          backgroundPosition: "right 0.5rem center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "1.5em 1.5em",
                          paddingRight: "2.5rem",
                        }}
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
                      <div className="mt-1 text-sm text-amber-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>Current: {addressDetail.provinceName}</span>
                      </div>
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
                      <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        <span>Loading districts...</span>
                      </div>
                    ) : (
                      <select
                        name="districtId"
                        value={addressDetail.districtId}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200 bg-white appearance-none"
                        required
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                          backgroundPosition: "right 0.5rem center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "1.5em 1.5em",
                          paddingRight: "2.5rem",
                        }}
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
                      <div className="mt-1 text-sm text-amber-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>Current: {addressDetail.districtName}</span>
                      </div>
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
                      <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        <span>Loading wards...</span>
                      </div>
                    ) : (
                      <select
                        name="wardId"
                        value={addressDetail.wardId}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200 bg-white appearance-none"
                        required
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                          backgroundPosition: "right 0.5rem center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "1.5em 1.5em",
                          paddingRight: "2.5rem",
                        }}
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
                      <div className="mt-1 text-sm text-amber-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>Current: {addressDetail.wardName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="streetAddress"
                      value={addressDetail.streetAddress}
                      onChange={handleAddressChange}
                      className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter street address"
                      required
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Preview Full Address */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
              >
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  <span>Full Address:</span>
                </p>
                <p className="text-sm text-gray-800 mt-2 pl-6">
                  {addressDetail.streetAddress && `${addressDetail.streetAddress}, `}
                  {addressDetail.wardName && `${addressDetail.wardName}, `}
                  {addressDetail.districtName && `${addressDetail.districtName}, `}
                  {addressDetail.provinceName}
                </p>
              </motion.div>
            </div>

            {/* Profile Picture Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                <ImageIcon className="h-5 w-5 text-purple-500" />
                <span>Profile Picture</span>
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Upload Image <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                      accept="image/*"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Accepted formats: JPG, PNG (max 5MB)</p>
                  {validationErrors.profilePicture && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.profilePicture}</p>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                    {previewUrl || formData.profilePictureUrl ? (
                      <Image
                        src={previewUrl || formData.profilePictureUrl || "/placeholder.svg"}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                        width="100"
                        height="100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                    {selectedFile && (
                      <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-tl-lg">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* License Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                <FileText className="h-5 w-5 text-purple-500" />
                <span>License Information</span>
              </h3>

              <div className="space-y-6">
                {/* Business License */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Business License</label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <input
                        type="file"
                        onChange={handleBusinessLicenseChange}
                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sendEmptyBusinessLicense"
                        checked={sendEmptyBusinessLicense}
                        onChange={(e) => setSendEmptyBusinessLicense(e.target.checked)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="sendEmptyBusinessLicense" className="text-sm text-gray-600">
                        Send empty value
                      </label>
                    </div>
                    {formData.businessLicenseUrl && (
                      <div className="flex items-center space-x-2 text-sm text-purple-600">
                        <a
                          href={formData.businessLicenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-1" /> View current business license
                        </a>
                      </div>
                    )}
                  </div>
                  {validationErrors.businessLicense && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.businessLicense}</p>
                  )}
                </div>

                {/* Operating License */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Operating License</label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <input
                        type="file"
                        onChange={handleOperatingLicenseChange}
                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sendEmptyOperatingLicense"
                        checked={sendEmptyOperatingLicense}
                        onChange={(e) => setSendEmptyOperatingLicense(e.target.checked)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="sendEmptyOperatingLicense" className="text-sm text-gray-600">
                        Send empty value
                      </label>
                    </div>
                    {formData.operatingLicenseUrl && (
                      <div className="flex items-center space-x-2 text-sm text-purple-600">
                        <a
                          href={formData.operatingLicenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-1" /> View current operating license
                        </a>
                      </div>
                    )}
                  </div>
                  {validationErrors.operatingLicense && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.operatingLicense}</p>
                  )}
                </div>

                {/* Operating License Expiry Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Operating License Expiry Date</label>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="datetime-local"
                      value={operatingLicenseExpiryDate ? operatingLicenseExpiryDate.substring(0, 16) : ""}
                      onChange={handleExpiryDateChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sendEmptyExpiryDate"
                        checked={sendEmptyExpiryDate}
                        onChange={(e) => setSendEmptyExpiryDate(e.target.checked)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="sendEmptyExpiryDate" className="text-sm text-gray-600">
                        Send empty value
                      </label>
                    </div>
                  </div>
                  {validationErrors.operatingLicenseExpiryDate && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.operatingLicenseExpiryDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bank Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                <CreditCard className="h-5 w-5 text-purple-500" />
                <span>Bank Information</span>
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Bank Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">Bank Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName || ""}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter bank name"
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {validationErrors.bankName && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.bankName}</p>
                  )}
                </div>

                {/* Bank Account Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    Bank Account Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber || ""}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter bank account number"
                    />
                    <FileText className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {validationErrors.bankAccountNumber && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.bankAccountNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200/50 font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

