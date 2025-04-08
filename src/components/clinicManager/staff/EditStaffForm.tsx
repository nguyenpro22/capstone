"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, Upload, User, Mail, Phone, MapPin, Check } from "lucide-react"
import { useUpdateStaffMutation } from "@/features/clinic/api"
import { useGetProvincesQuery, useGetDistrictsQuery, useGetWardsQuery } from "@/features/address/api"
import { toast } from "react-toastify"
import { useTranslations } from "next-intl"
import type { Staff } from "@/features/clinic/types"
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"
import type { AddressDetail } from "@/features/address/types"
import { useTheme } from "next-themes"

// Define the form schema with additional fields
const staffSchema = z.object({
  id: z.string(),
  clinicId: z.string(),
  email: z.string().email("Invalid email format"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  roleType: z.number().optional(), // Changed from min(1) to optional
  // Additional fields from API
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  profilePictureUrl: z.string().optional(),
})

type StaffFormValues = z.infer<typeof staffSchema>

interface EditStaffFormProps {
  initialData: Staff
  onClose: () => void
  onSaveSuccess: () => void
}

export default function EditStaffForm({ initialData, onClose, onSaveSuccess }: EditStaffFormProps) {
  const t = useTranslations("staff")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updateStaff, { isLoading: isUpdating, error: updateError }] = useUpdateStaffMutation()
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string>("basic")
  const { theme } = useTheme()

  // Get the token and extract clinicId
  const token = getAccessToken()
  // Add null check for token
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null
  const clinicId = tokenData?.clinicId || initialData.clinicId || ""
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      id: initialData.id,
      clinicId: initialData.clinicId,
      email: initialData.email,
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      phoneNumber: initialData.phoneNumber || "",
      address: initialData.address || "",
      profilePictureUrl: initialData.profilePictureUrl || "",
    },
  })

  // Log any errors from the mutation
  useEffect(() => {
    if (updateError) {
      console.error("Update staff mutation error:", updateError)
    }
  }, [updateError])

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePicture(file)

      // Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  // Clean up the preview URL when component unmounts or when a new file is selected
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Get full address for display purposes
  const getFullAddress = (): string => {
    const parts: string[] = []

    if (addressDetail.streetAddress) parts.push(addressDetail.streetAddress)
    if (addressDetail.wardName) parts.push(addressDetail.wardName)
    if (addressDetail.districtName) parts.push(addressDetail.districtName)
    if (addressDetail.provinceName) parts.push(addressDetail.provinceName)

    return parts.join(", ")
  }

  // Updated to use FormData with all fields
  const onSubmit = async (data: StaffFormValues) => {
    console.log("Form submission started", data)
    setIsSubmitting(true)

    try {
      // Create FormData object
      const formData = new FormData()
      formData.append("userId", initialData.employeeId)
      formData.append("firstName", data.firstName)
      formData.append("lastName", data.lastName)
      // Add address components
      formData.append("address", addressDetail.streetAddress)
      formData.append("city", addressDetail.provinceName)
      formData.append("district", addressDetail.districtName)
      formData.append("ward", addressDetail.wardName)

      // Add phone number
      if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber)

      // Add profile picture if selected
      if (profilePicture) {
        formData.append("profilePicture", profilePicture)
      }

      console.log("FormData prepared, sending to API", {
        clinicId,
        employeeId: initialData.employeeId,
        // Fix the TypeScript error by not using spread operator on FormData entries
        formDataEntries: Array.from(formData.entries()).map((entry) => ({ key: entry[0], value: entry[1] })),
      })

      const result = await updateStaff({
        id: clinicId,
        data: formData,
      }).unwrap()

      console.log("API call successful", result)
      toast.success(t("staffUpdatedSuccess") || "Staff updated successfully!")
      onSaveSuccess()
    } catch (error) {
      console.error("Failed to update staff:", error)
      toast.error(t("staffUpdatedFailed") || "Failed to update staff. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Direct submit handler for testing
  const handleDirectSubmit = () => {
    console.log("Direct submit button clicked")
    handleSubmit(onSubmit)()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-black/30 w-full max-w-xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 p-6 text-white relative">
          <h2 className="text-2xl font-bold">{t("editStaff") || "Edit Staff"}</h2>
          <p className="text-purple-100 dark:text-purple-50 mt-1">
            {t("updateStaffInfo") || "Update staff information"}
          </p>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4">
          <button
            onClick={() => setActiveSection("basic")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeSection === "basic"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <User className="w-4 h-4" />
            {t("basicInfo") || "Basic Info"}
          </button>
          <button
            onClick={() => setActiveSection("address")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeSection === "address"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <MapPin className="w-4 h-4" />
            {t("address") || "Address"}
          </button>
          <button
            onClick={() => setActiveSection("photo")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeSection === "photo"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <Upload className="w-4 h-4" />
            {t("photo") || "Photo"}
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="overflow-y-auto flex-1 p-6 dark:bg-gray-900">
          <form id="staff-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
            <input type="hidden" {...register("id")} />
            <input type="hidden" {...register("clinicId")} />

            {/* Basic Information Section */}
            {activeSection === "basic" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("firstName") || "First Name"}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        {...register("firstName")}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent ${
                          errors.firstName
                            ? "border-red-300 dark:border-red-700"
                            : "border-gray-300 dark:border-gray-600"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                        placeholder="John"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("lastName") || "Last Name"}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        {...register("lastName")}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent ${
                          errors.lastName
                            ? "border-red-300 dark:border-red-700"
                            : "border-gray-300 dark:border-gray-600"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                        placeholder="Doe"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("email") || "Email"}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...register("email")}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent ${
                        errors.email ? "border-red-300 dark:border-red-700" : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                      placeholder="email@example.com"
                      readOnly
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("phoneNumber") || "Phone Number"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("phoneNumber")}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="+1234567890"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>

                {/* Add direct submit button for testing */}
                <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={handleDirectSubmit}
                    className="px-4 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors text-sm"
                  >
                    Test Submit (Basic Info Only)
                  </button>
                </div>
              </motion.div>
            )}

            {/* Address Information Section */}
            {activeSection === "address" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Province Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("city") || "Province/City"}
                    </label>
                    <select
                      name="provinceId"
                      value={addressDetail.provinceId}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("district") || "District"}
                    </label>
                    <select
                      name="districtId"
                      value={addressDetail.districtId}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("ward") || "Ward"}
                    </label>
                    <select
                      name="wardId"
                      value={addressDetail.wardId}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("address") || "Street Address"}
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={addressDetail.streetAddress}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="123 Main St"
                    />
                  </div>
                </div>

                {/* Preview Full Address */}
                {(addressDetail.provinceName || addressDetail.provinceId || addressDetail.streetAddress) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-100 dark:border-purple-700"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {t("fullAddress") || "Full Address"}:
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{getFullAddress()}</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Profile Picture Section */}
            {activeSection === "photo" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="mb-6 text-center">
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
                      {t("profilePicture") || "Profile Picture"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("uploadProfilePictureDesc") || "Upload a profile picture for this staff member"}
                    </p>
                  </div>

                  <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors bg-gray-50 dark:bg-gray-800 overflow-hidden relative">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      {profilePicture ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {previewUrl ? (
                            <img
                              src={previewUrl || "/placeholder.svg"}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Check className="w-10 h-10 text-green-500 dark:text-green-400" />
                          )}
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center absolute bottom-2 bg-white/70 dark:bg-gray-800/70 w-full py-1">
                            {profilePicture.name.length > 20
                              ? profilePicture.name.substring(0, 20) + "..."
                              : profilePicture.name}
                          </p>
                        </div>
                      ) : initialData.profilePictureUrl ? (
                        <div className="w-full h-full">
                          <img
                            src={initialData.profilePictureUrl || "/placeholder.svg"}
                            alt="Current profile"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Upload className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                          <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {t("uploadImage") || "Upload Image"}
                          </span>
                        </>
                      )}
                    </div>
                  </label>

                  {profilePicture && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="button"
                      onClick={() => {
                        setProfilePicture(null)
                        if (previewUrl) {
                          URL.revokeObjectURL(previewUrl)
                          setPreviewUrl(null)
                        }
                      }}
                      className="mt-4 px-3 py-1 text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-200 dark:border-red-700 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      {t("remove") || "Remove"}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </form>
        </div>

        {/* Footer with Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400 mr-2"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {activeSection === "basic"
                  ? t("editingBasicInfo") || "Editing basic information"
                  : activeSection === "address"
                    ? t("editingAddress") || "Editing address information"
                    : t("editingPhoto") || "Editing profile photo"}
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t("cancel") || "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleDirectSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-700 dark:hover:from-purple-500 dark:hover:to-pink-600 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
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
                    {t("saving") || "Saving..."}
                  </>
                ) : (
                  t("save") || "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
