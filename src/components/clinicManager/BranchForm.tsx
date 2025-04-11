"use client"

import type React from "react"
import { useState } from "react"
import { useCreateBranchMutation } from "@/features/clinic/api"
import { useGetProvincesQuery, useGetDistrictsQuery, useGetWardsQuery } from "@/features/address/api"
import { toast, ToastContainer } from "react-toastify"
import { motion } from "framer-motion"
import { X, AlertCircle, Building2, Mail, Phone, MapPin, FileText, Calendar, ImageIcon, Loader2 } from "lucide-react"
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"

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
  city?: string
  district?: string
  ward?: string
  operatingLicense?: string
  operatingLicenseExpiryDate?: string
  profilePictureUrl?: string
}

interface AddressDetail {
  provinceId: string
  provinceName: string
  districtId: string
  districtName: string
  wardId: string
  wardName: string
  streetAddress: string
  bankAccountNumber: string
  bankName: string
}

export default function BranchForm({ onClose, onSaveSuccess }: BranchFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    operatingLicense: null as File | null,
    operatingLicenseExpiryDate: "",
    profilePictureUrl: null as File | null,
  })
  const token = getAccessToken()
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null
  const clinicId = tokenData?.clinicId || ""

  const [addressDetail, setAddressDetail] = useState<AddressDetail>({
    provinceId: "",
    provinceName: "",
    districtId: "",
    districtName: "",
    wardId: "",
    wardName: "",
    streetAddress: "",
    bankAccountNumber: "",
    bankName: "",
  })

  const { data: provinces, isLoading: isLoadingProvinces } = useGetProvincesQuery()
  const { data: districts, isLoading: isLoadingDistricts } = useGetDistrictsQuery(addressDetail.provinceId, {
    skip: !addressDetail.provinceId,
  })
  const { data: wards, isLoading: isLoadingWards } = useGetWardsQuery(addressDetail.districtId, {
    skip: !addressDetail.districtId,
  })

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [createBranch, { isLoading }] = useCreateBranchMutation()

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

    if (validationErrors.address || validationErrors.city || validationErrors.district || validationErrors.ward) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.address
        delete newErrors.city
        delete newErrors.district
        delete newErrors.ward
        return newErrors
      })
    }
  }

  const getFullAddress = (): string => {
    const parts: string[] = []
    if (addressDetail.streetAddress) parts.push(addressDetail.streetAddress)
    if (addressDetail.wardName) parts.push(addressDetail.wardName)
    if (addressDetail.districtName) parts.push(addressDetail.districtName)
    if (addressDetail.provinceName) parts.push(addressDetail.provinceName)
    return parts.join(", ")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors({})
    setGeneralError(null)

    const formDataToSend = new FormData()
    formDataToSend.append("name", formData.name)
    formDataToSend.append("email", formData.email)
    formDataToSend.append("phoneNumber", formData.phoneNumber)
    formDataToSend.append("address", addressDetail.streetAddress)
    formDataToSend.append("city", addressDetail.provinceName)
    formDataToSend.append("district", addressDetail.districtName)
    formDataToSend.append("ward", addressDetail.wardName)
    formDataToSend.append("bankName", addressDetail.bankName)
    formDataToSend.append("bankAccountNumber", addressDetail.bankAccountNumber)
    formDataToSend.append("operatingLicenseExpiryDate", formData.operatingLicenseExpiryDate)
    if (formData.operatingLicense) formDataToSend.append("operatingLicense", formData.operatingLicense)
    if (formData.profilePictureUrl) formDataToSend.append("profilePictureUrl", formData.profilePictureUrl)

    try {
      await createBranch({ clinicId, data: formDataToSend }).unwrap()
      toast.success("Branch created successfully!")
      onSaveSuccess()
      onClose()
    } catch (error: any) {
      console.error("Error response:", error)
      if (error?.data?.detail) {
        setGeneralError(error.data.detail)
        toast.error(error.data.detail)
      }
      if (error?.data?.errors) {
        const formattedErrors: ValidationErrors = {}
        error.data.errors.forEach((err: any) => {
          const fieldName = err.field || err.code
          const fieldDisplayNames: Record<string, string> = {
            name: "Branch Name",
            email: "Email",
            phoneNumber: "Phone Number",
            address: "Street Address",
            city: "Province/City",
            district: "District",
            ward: "Ward",
            operatingLicense: "Operating License",
            operatingLicenseExpiryDate: "Operating License Expiry Date",
            profilePictureUrl: "Profile Picture",
          }
          const displayName = fieldDisplayNames[fieldName] || fieldName
          formattedErrors[fieldName as keyof ValidationErrors] = `${displayName}: ${err.message}`
        })
        setValidationErrors(formattedErrors)
        if (!error?.data?.detail) toast.error("Please check the form for errors")
      } else if (!error?.data?.detail) {
        toast.error(error?.data?.message || "An unexpected error occurred. Please try again later.")
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-gray-900/80 backdrop-blur-sm overflow-y-auto p-4"
    >
       <ToastContainer/>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900 my-8 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Create New Branch</h2>
          <p className="text-purple-100 dark:text-purple-200 mt-1">Add a new location to your clinic network</p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* General Error Message */}
          {generalError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 dark:text-red-300 font-medium">Error</p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{generalError}</p>
              </div>
            </motion.div>
          )}

          {/* Validation Errors */}
          {Object.entries(validationErrors).filter(([_, message]) => message).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg border border-red-200 dark:border-red-800 overflow-hidden"
            >
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800">
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-300 font-medium">Please fix the following errors:</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 space-y-2">
                {Object.entries(validationErrors)
                  .filter(([_, message]) => message)
                  .map(([field, message]) => (
                    <div key={field} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
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
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                <span>Basic Information</span>
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    Branch Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-4 pr-10 py-3 rounded-lg border ${
                        validationErrors.name
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-700/50"
                          : "border-gray-200 focus:border-purple-400 focus:ring-purple-200 dark:border-gray-600 dark:focus:border-purple-500 dark:focus:ring-purple-600/50"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                      placeholder="Enter branch name"
                      required
                    />
                  </div>
                  {validationErrors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{validationErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-4 pr-10 py-3 rounded-lg border ${
                        validationErrors.email
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-700/50"
                          : "border-gray-200 focus:border-purple-400 focus:ring-purple-200 dark:border-gray-600 dark:focus:border-purple-500 dark:focus:ring-purple-600/50"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                      placeholder="Enter email"
                      required
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  {validationErrors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{validationErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-4 pr-10 py-3 rounded-lg border ${
                        validationErrors.phoneNumber
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-700/50"
                          : "border-gray-200 focus:border-purple-400 focus:ring-purple-200 dark:border-gray-600 dark:focus:border-purple-500 dark:focus:ring-purple-600/50"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                      placeholder="Enter phone number"
                      required
                    />
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  {validationErrors.phoneNumber && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">{validationErrors.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                <span>Address Details</span>
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    Province/City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="provinceId"
                    value={addressDetail.provinceId}
                    onChange={handleAddressChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      validationErrors.city
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-700/50"
                        : "border-gray-200 focus:border-purple-400 focus:ring-purple-200 dark:border-gray-600 dark:focus:border-purple-500 dark:focus:ring-purple-600/50"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                    required
                  >
                    <option value="">Select Province/City</option>
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
                  {validationErrors.city && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{validationErrors.city}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="districtId"
                    value={addressDetail.districtId}
                    onChange={handleAddressChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      validationErrors.district
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-700/50"
                        : "border-gray-200 focus:border-purple-400 focus:ring-purple-200 dark:border-gray-600 dark:focus:border-purple-500 dark:focus:ring-purple-600/50"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                    required
                    disabled={!addressDetail.provinceId || isLoadingDistricts}
                  >
                    <option value="">
                      {!addressDetail.provinceId
                        ? "Select province first"
                        : isLoadingDistricts
                          ? "Loading districts..."
                          : "Select District"}
                    </option>
                    {districts?.data.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.district && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">{validationErrors.district}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    Ward <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="wardId"
                    value={addressDetail.wardId}
                    onChange={handleAddressChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      validationErrors.ward
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-700/50"
                        : "border-gray-200 focus:border-purple-400 focus:ring-purple-200 dark:border-gray-600 dark:focus:border-purple-500 dark:focus:ring-purple-600/50"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                    required
                    disabled={!addressDetail.districtId || isLoadingWards}
                  >
                    <option value="">
                      {!addressDetail.districtId
                        ? "Select district first"
                        : isLoadingWards
                          ? "Loading wards..."
                          : "Select Ward"}
                    </option>
                    {wards?.data.map((ward) => (
                      <option key={ward.id} value={ward.id}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.ward && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{validationErrors.ward}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={addressDetail.streetAddress}
                    onChange={handleAddressChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      validationErrors.address
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-700/50"
                        : "border-gray-200 focus:border-purple-400 focus:ring-purple-200 dark:border-gray-600 dark:focus:border-purple-500 dark:focus:ring-purple-600/50"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                    placeholder="Enter street address"
                    required
                  />
                  {validationErrors.address && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{validationErrors.address}</p>}
                </div>
              </div>

              {(addressDetail.provinceName || addressDetail.provinceId) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-100 dark:border-purple-800"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Full Address:</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{getFullAddress()}</p>
                </motion.div>
              )}
            </div>

            {/* Documents Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                <span>Documents & Media</span>
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    Operating License <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="operatingLicense"
                      onChange={(e) => handleFileChange(e, "operatingLicense")}
                      className={`w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 dark:file:bg-purple-900/50 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-100 dark:hover:file:bg-purple-900 px-4 py-3 rounded-lg border ${
                        validationErrors.operatingLicense
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-700/50"
                          : "border-gray-200 focus:border-purple-400 focus:ring-purple-200 dark:border-gray-600 dark:focus:border-purple-500 dark:focus:ring-purple-600/50"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                      accept=".pdf, .jpg, .jpeg, .png"
                      required
                    />
                  </div>
                  {validationErrors.operatingLicense && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">{validationErrors.operatingLicense}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">Accepted formats: PDF, JPG, PNG</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    Operating License Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="operatingLicenseExpiryDate"
                      value={formData.operatingLicenseExpiryDate}
                      onChange={handleInputChange}
                      className={`w-full pl-4 pr-10 py-3 rounded-lg border ${
                        validationErrors.operatingLicenseExpiryDate
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-700/50"
                          : "border-gray-200 focus:border-purple-400 focus:ring-purple-200 dark:border-gray-600 dark:focus:border-purple-500 dark:focus:ring-purple-600/50"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  {validationErrors.operatingLicenseExpiryDate && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">{validationErrors.operatingLicenseExpiryDate}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    Profile Picture <span className="text-gray-400 dark:text-gray-500 text-xs font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="profilePictureUrl"
                      onChange={(e) => handleFileChange(e, "profilePictureUrl")}
                      className={`w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 dark:file:bg-purple-900/50 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-100 dark:hover:file:bg-purple-900 px-4 py-3 rounded-lg border ${
                        validationErrors.profilePictureUrl
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-700/50"
                          : "border-gray-200 focus:border-purple-400 focus:ring-purple-200 dark:border-gray-600 dark:focus:border-purple-500 dark:focus:ring-purple-600/50"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                      accept=".jpg, .jpeg, .png"
                    />
                    <ImageIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  {validationErrors.profilePictureUrl && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">{validationErrors.profilePictureUrl}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">Accepted formats: JPG, PNG (max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
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
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Branch</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}