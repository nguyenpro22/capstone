"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUpdateBranchMutation } from "@/features/clinic/api"
import { useGetProvincesQuery, useGetDistrictsQuery, useGetWardsQuery } from "@/features/address/api"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  AlertCircle,
  MapPin,
  Phone,
  FileCode,
  Building2,
  Check,
  FileText,
  Mail,
  CreditCard,
  Upload,
  User,
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
  const [activeSection, setActiveSection] = useState<string>("basic")

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

    // Clear all validation errors when user types
    setValidationErrors({})
  }

  // Handle address selection changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target

    // Clear all validation errors when user makes any change
    setValidationErrors({})

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

    // Clear all validation errors when user makes any change
    setValidationErrors({})
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setValidationErrors({})
    }
  }

  // Add these handlers after the existing handler functions
  const handleBusinessLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedBusinessLicense(e.target.files[0])
      setSendEmptyBusinessLicense(false)
      setValidationErrors({})
    }
  }

  const handleOperatingLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedOperatingLicense(e.target.files[0])
      setSendEmptyOperatingLicense(false)
      setValidationErrors({})
    }
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOperatingLicenseExpiryDate(e.target.value)
    setSendEmptyExpiryDate(false)
    setValidationErrors({})
  }

  // Get full address for display purposes
  const getFullAddress = (): string => {
    const parts: string[] = []

    if (addressDetail.streetAddress) parts.push(addressDetail.streetAddress)
    if (addressDetail.wardName) parts.push(addressDetail.wardName)
    if (addressDetail.districtName) parts.push(addressDetail.districtName)
    if (addressDetail.provinceName) parts.push(addressDetail.provinceName)

    return parts.join(", ")
  }

  // Add this function after your other handler functions
  const clearAllValidationErrors = () => {
    setValidationErrors({})
  }

  // Modify the setActiveSection function to clear errors when switching tabs
  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    setValidationErrors({})
  }

  // Update the handleSubmit function to include the new fields
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formDataToSend = new FormData()

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

        // toast.success("Branch updated successfully!")
        onSaveSuccess()
        onClose()
      } else {
        toast.error("Clinic ID is required but not available")
      }
    } catch (error: any) {
      console.error("Error response:", error)

      // Reset validation errors first
      setValidationErrors({})

      if (error?.status === 400 || error?.status === 422) {
        const validationErrors = error?.data?.errors || []
        const newErrors: ValidationErrors = {}

        // Log the errors to see their format
        console.log("API validation errors:", validationErrors)

        validationErrors.forEach((err: { code: string; message: string }) => {
          // Convert the error code to lowercase for consistency
          const errorKey = err.code.toLowerCase()
          console.log(`Processing error: ${errorKey} - ${err.message}`)
          newErrors[errorKey as keyof ValidationErrors] = err.message
        })

        setValidationErrors(newErrors)
        toast.error(error?.data?.detail || "Invalid data provided!")
      } else {
        toast.error("An error occurred, please try again!")
      }
    }
  }

  // Add this near your other useEffect hooks
  useEffect(() => {
    // Clear validation errors when component mounts
    setValidationErrors({})
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative">
          <h2 className="text-2xl font-bold">Edit Branch</h2>
          <p className="text-purple-100 mt-1">Update branch information and settings</p>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 overflow-x-auto">
          <button
            onClick={() => handleSectionChange("basic")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSection === "basic"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <User className="w-4 h-4" />
            Basic Info
          </button>
          <button
            onClick={() => handleSectionChange("address")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSection === "address"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <MapPin className="w-4 h-4" />
            Address
          </button>
          <button
            onClick={() => handleSectionChange("photo")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSection === "photo"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Upload className="w-4 h-4" />
            Photo
          </button>
          <button
            onClick={() => handleSectionChange("license")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSection === "license"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FileText className="w-4 h-4" />
            Licenses
          </button>
          <button
            onClick={() => handleSectionChange("bank")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSection === "bank"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Bank Info
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="overflow-y-auto flex-1 p-6">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            {activeSection === "basic" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Branch ID */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Branch ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="id"
                        value={formData.id}
                        className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 border-gray-300"
                        readOnly
                      />
                      <FileCode className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Branch Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          validationErrors.name ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Enter branch name"
                        required
                      />
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {validationErrors.name && <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 border-gray-300"
                      readOnly
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        validationErrors.phoneNumber ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter phone number"
                      required
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {validationErrors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.phoneNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Branch Status</label>
                  <div className="flex items-center h-[50px] px-4 rounded-md border border-gray-300 bg-white">
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
                    <p className="mt-1 text-sm text-red-600">{validationErrors.isActivated}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Address Section */}
            {activeSection === "address" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Province Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Province/City</label>
                    <select
                      name="provinceId"
                      value={addressDetail.provinceId}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    >
                      <option value="">{addressDetail.provinceName || "Select Province/City"}</option>
                      {isLoadingProvinces ? (
                        <option disabled>Loading provinces...</option>
                      ) : (
                        provinces?.data.map((province) => (
                          <option key={province.id} value={province.id}>
                            {province.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* District Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">District</label>
                    <select
                      name="districtId"
                      value={addressDetail.districtId}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      disabled={!addressDetail.provinceId || isLoadingDistricts}
                    >
                      <option value="">
                        {addressDetail.districtName ||
                          (!addressDetail.provinceId
                            ? "Select province first"
                            : isLoadingDistricts
                              ? "Loading districts..."
                              : "Select District")}
                      </option>
                      {districts?.data.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ward Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Ward</label>
                    <select
                      name="wardId"
                      value={addressDetail.wardId}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      disabled={!addressDetail.districtId || isLoadingWards}
                    >
                      <option value="">
                        {addressDetail.wardName ||
                          (!addressDetail.districtId
                            ? "Select district first"
                            : isLoadingWards
                              ? "Loading wards..."
                              : "Select Ward")}
                      </option>
                      {wards?.data.map((ward) => (
                        <option key={ward.id} value={ward.id}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Street Address */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Street Address</label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={addressDetail.streetAddress}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="123 Main St"
                    />
                  </div>
                </div>

                {/* Preview Full Address */}
                {(addressDetail.provinceName || addressDetail.provinceId || addressDetail.streetAddress) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
                  >
                    <p className="text-sm text-gray-600 font-medium">Full Address:</p>
                    <p className="text-sm text-gray-800 mt-1">{getFullAddress()}</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Profile Picture Section */}
            {activeSection === "photo" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="mb-6 text-center">
                    <h3 className="text-lg font-medium mb-2">Profile Picture</h3>
                    <p className="text-sm text-gray-500">Upload a profile picture for this branch</p>
                  </div>

                  <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-purple-500 transition-colors bg-gray-50">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <div className="flex flex-col items-center">
                      {selectedFile || previewUrl || formData.profilePictureUrl ? (
                        <div className="relative w-full h-full">
                          {selectedFile ? (
                            <>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Check className="w-10 h-10 text-green-500" />
                              </div>
                              <p className="text-sm text-gray-600 mt-2 text-center">
                                {selectedFile.name.length > 20
                                  ? selectedFile.name.substring(0, 20) + "..."
                                  : selectedFile.name}
                              </p>
                            </>
                          ) : (
                            <div className="w-full h-full overflow-hidden rounded-full">
                              <Image
                                src={previewUrl || formData.profilePictureUrl || "/placeholder.svg"}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                                width={160}
                                height={160}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">Upload Image</span>
                        </>
                      )}
                    </div>
                  </label>

                  {selectedFile && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="mt-4 px-3 py-1 text-sm text-red-500 hover:text-red-700 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}

            {/* License Information Section */}
            {activeSection === "license" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                {/* Business License */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Business License</label>
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
                  <label className="block text-sm font-medium text-gray-700">Operating License</label>
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
                  <label className="block text-sm font-medium text-gray-700">Operating License Expiry Date</label>
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
              </motion.div>
            )}

            {/* Bank Information Section */}
            {activeSection === "bank" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bank Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName || ""}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          validationErrors.bankName ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Enter bank name"
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {validationErrors.bankName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.bankName}</p>
                    )}
                  </div>

                  {/* Bank Account Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="bankAccountNumber"
                        value={formData.bankAccountNumber || ""}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          validationErrors.bankAccountNumber ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Enter bank account number"
                      />
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {validationErrors.bankAccountNumber && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.bankAccountNumber}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        {/* Footer with Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-sm text-gray-500">
                {activeSection === "basic"
                  ? "Editing basic information"
                  : activeSection === "address"
                    ? "Editing address information"
                    : activeSection === "photo"
                      ? "Editing profile photo"
                      : activeSection === "license"
                        ? "Editing license information"
                        : "Editing bank information"}
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-md hover:from-purple-600 hover:to-pink-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

