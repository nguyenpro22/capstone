"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useUpdateClinicMutation } from "@/features/clinic/api"
import { useGetProvincesQuery, useGetDistrictsQuery, useGetWardsQuery } from "@/features/address/api"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { X, AlertCircle, Building2, Mail, Phone, MapPin, FileText, CreditCard, ImageIcon, Search } from "lucide-react"
import Image from "next/image"
import type { Clinic } from "@/features/clinic/types"
import { useTranslations } from "next-intl"
import { Tabs, TabsContent } from "@/components/ui/tabs"
// Update the imports to include useTheme
import { useTheme } from "next-themes"

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

interface Bank {
  id: number
  name: string
  code: string
  bin: string
  shortName: string
  logo: string
  transferSupported: number
  lookupSupported: number
}

// Update the component to add dark mode support and match tab styling
export default function ClinicForm({ initialData, onClose, onSaveSuccess }: ClinicFormProps) {
  const t = useTranslations("clinic")
  const { theme } = useTheme()

  const [value, setValue] = useState("basic")

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

  // Bank list state
  const [banks, setBanks] = useState<Bank[]>([])
  const [isLoadingBanks, setIsLoadingBanks] = useState(false)
  const [bankSearchTerm, setBankSearchTerm] = useState("")
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)

  // RTK Query hooks
  const { data: provinces, isLoading: isLoadingProvinces } = useGetProvincesQuery()
  const { data: districts, isLoading: isLoadingDistricts } = useGetDistrictsQuery(addressDetail.provinceId, {
    skip: !addressDetail.provinceId,
  })
  const { data: wards, isLoading: isLoadingWards } = useGetWardsQuery(addressDetail.districtId, {
    skip: !addressDetail.districtId,
  })

  // Fetch banks from API
  useEffect(() => {
    const fetchBanks = async () => {
      setIsLoadingBanks(true)
      try {
        const response = await fetch("https://api.vietqr.io/v2/banks")
        const result = await response.json()
        if (result.code === "00" && Array.isArray(result.data)) {
          setBanks(result.data)

          // If we have a bank name from initialData, try to find the matching bank
          if (formData.bankName) {
            const matchingBank = result.data.find(
              (bank: Bank) => bank.name === formData.bankName || bank.shortName === formData.bankName,
            )
            if (matchingBank) {
              setSelectedBank(matchingBank)
            }
          }
        } else {
          console.error("Failed to fetch banks:", result)
        }
      } catch (error) {
        console.error("Error fetching banks:", error)
      } finally {
        setIsLoadingBanks(false)
      }
    }

    fetchBanks()
  }, [formData.bankName])

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

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank)
    setFormData((prev) => ({ ...prev, bankName: bank.name }))
    setBankSearchTerm("")
  }

  const filteredBanks = banks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase()) ||
      bank.shortName.toLowerCase().includes(bankSearchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessages([])

    if (!formData.id) {
      setErrorMessages([t("clinicIdMissing")])
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
      await updateClinic({
        clinicId: formData.id,
        data: updatedFormData,
      }).unwrap()
      toast.success(t("updateSuccess"))
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
        setErrorMessages([t("updateFailed")])
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
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-black/30 my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan truyền
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 p-6 text-white">
          <h2 className="text-2xl font-bold">{t("editClinic")}</h2>
          <p className="text-purple-100 dark:text-purple-50 mt-1">{t("updateClinicInfo")}</p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4">
          <button
            onClick={() => setValue("basic")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
              value === "basic"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <Building2 className="w-4 h-4" />
            {t("basicInfo")}
          </button>
          <button
            onClick={() => setValue("banking")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
              value === "banking"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            {t("bankingInfo")}
          </button>
          <button
            onClick={() => setValue("address")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
              value === "address"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <MapPin className="w-4 h-4" />
            {t("addressDetails")}
          </button>
        </div>

        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto dark:bg-gray-900">
          {/* Error Messages */}
          {errorMessages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg border border-red-200 dark:border-red-700 overflow-hidden"
            >
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-700">
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-400 font-medium">{t("fixErrors")}</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 space-y-2">
                {errorMessages.map((message, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                    <span className="mt-0.5">•</span>
                    <span>{message}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full" value={value} onValueChange={setValue}>
              <TabsContent value="basic" className="space-y-6 mt-0">
                {/* Basic Information Tab Content */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span>{t("basicInfo")}</span>
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        {t("clinicName")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ""}
                          onChange={handleFormChange}
                          className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring focus:ring-purple-200 dark:focus:ring-purple-700 focus:ring-opacity-50 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          placeholder={t("enterClinicName")}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        {t("email")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleFormChange}
                          className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring focus:ring-purple-200 dark:focus:ring-purple-700 focus:ring-opacity-50 transition-all duration-200 text-gray-900 dark:text-gray-100"
                          placeholder={t("enterEmail")}
                          readOnly
                        />
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        {t("phoneNumber")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber || ""}
                          onChange={handleFormChange}
                          className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring focus:ring-purple-200 dark:focus:ring-purple-700 focus:ring-opacity-50 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          placeholder={t("enterPhoneNumber")}
                          required
                        />
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* Profile Picture */}
                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      <span>{t("profilePicture")}</span>
                    </h3>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        {t("profilePicture")}{" "}
                        <span className="text-gray-400 text-xs font-normal">({t("optional")})</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 dark:file:bg-purple-900/30 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-100 dark:hover:file:bg-purple-800/40 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring focus:ring-purple-200 dark:focus:ring-purple-700 focus:ring-opacity-50 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          accept=".jpg, .jpeg, .png"
                        />
                        <ImageIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t("acceptedFormats")}</p>

                      {formData.profilePictureUrl && (
                        <div className="mt-2 flex items-center gap-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{t("currentImage")}:</p>
                          <Image
                            src={formData.profilePictureUrl || "/placeholder.svg"}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="banking" className="space-y-6 mt-0">
                {/* Banking Information Tab Content */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span>{t("bankingInfo")}</span>
                  </h3>

                  <div className="grid gap-4 md:grid-cols-1">
                    {/* Bank Selection - Replaced input with dropdown */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        {t("bankName")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        {isLoadingBanks ? (
                          <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            {t("loadingBanks")}
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="relative">
                              <input
                                type="text"
                                value={bankSearchTerm}
                                onChange={(e) => setBankSearchTerm(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring focus:ring-purple-200 dark:focus:ring-purple-700 focus:ring-opacity-50 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                placeholder={t("searchBank")}
                              />
                              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>

                            {selectedBank && (
                              <div className="mt-2 flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-100 dark:border-purple-800">
                                {selectedBank.logo && (
                                  <Image
                                    src={selectedBank.logo || "/placeholder.svg"}
                                    alt={selectedBank.shortName}
                                    className="h-6 w-auto"
                                    width={100}
                                    height={100}
                                  />
                                )}
                                <span className="font-medium text-purple-700 dark:text-purple-300">
                                  {selectedBank.name}
                                </span>
                              </div>
                            )}

                            {bankSearchTerm && (
                              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg max-h-60 overflow-y-auto">
                                {filteredBanks.length > 0 ? (
                                  filteredBanks.map((bank) => (
                                    <div
                                      key={bank.id}
                                      className="flex items-center gap-2 p-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer"
                                      onClick={() => handleBankSelect(bank)}
                                    >
                                      {bank.logo && (
                                        <Image
                                          src={bank.logo || "/placeholder.svg"}
                                          alt={bank.shortName}
                                          className="h-6 w-auto"
                                          width={100}
                                          height={100}
                                        />
                                      )}
                                      <div>
                                        <div className="font-medium text-gray-800 dark:text-gray-200">{bank.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{bank.shortName}</div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                                    {t("noBanksFound")}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        {t("bankAccountNumber")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="bankAccountNumber"
                          value={formData.bankAccountNumber}
                          onChange={handleFormChange}
                          className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring focus:ring-purple-200 dark:focus:ring-purple-700 focus:ring-opacity-50 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          placeholder={t("enterAccountNumber")}
                          required
                        />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* Banking information help text */}
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-100 dark:border-purple-800 mt-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{t("bankingInfoHelp")}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-6 mt-0">
                {/* Address Tab Content */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span>{t("addressDetails")}</span>
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Province Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        {t("provinceCity")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        {isLoadingProvinces ? (
                          <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            {t("loadingProvinces")}
                          </div>
                        ) : (
                          <select
                            name="provinceId"
                            value={addressDetail.provinceId}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring focus:ring-purple-200 dark:focus:ring-purple-700 focus:ring-opacity-50 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            required
                          >
                            <option value="">{t("selectProvinceCity")}</option>
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
                          <div className="mt-1 text-sm text-amber-600 dark:text-amber-500">
                            {t("current")}: {addressDetail.provinceName}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* District Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        {t("district")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        {!addressDetail.provinceId ? (
                          <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            {t("selectProvinceFirst")}
                          </div>
                        ) : isLoadingDistricts ? (
                          <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            {t("loadingDistricts")}
                          </div>
                        ) : (
                          <select
                            name="districtId"
                            value={addressDetail.districtId}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring focus:ring-purple-200 dark:focus:ring-purple-700 focus:ring-opacity-50 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            required
                          >
                            <option value="">{t("selectDistrict")}</option>
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
                          <div className="mt-1 text-sm text-amber-600 dark:text-amber-500">
                            {t("current")}: {addressDetail.districtName}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ward Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        {t("ward")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        {!addressDetail.districtId ? (
                          <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            {t("selectDistrictFirst")}
                          </div>
                        ) : isLoadingWards ? (
                          <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            {t("loadingWards")}
                          </div>
                        ) : (
                          <select
                            name="wardId"
                            value={addressDetail.wardId}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring focus:ring-purple-200 dark:focus:ring-purple-700 focus:ring-opacity-50 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            required
                          >
                            <option value="">{t("selectWard")}</option>
                            {wards?.data.map((ward) => (
                              <option key={ward.id} value={ward.id} selected={ward.name === addressDetail.wardName}>
                                {ward.name}
                              </option>
                            ))}
                          </select>
                        )}
                        {!addressDetail.wardId && addressDetail.wardName && (
                          <div className="mt-1 text-sm text-amber-600 dark:text-amber-500">
                            {t("current")}: {addressDetail.wardName}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Street Address */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        {t("streetAddress")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={addressDetail.streetAddress}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring focus:ring-purple-200 dark:focus:ring-purple-700 focus:ring-opacity-50 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        placeholder={t("enterStreetAddress")}
                        required
                      />
                    </div>
                  </div>

                  {/* Preview Full Address */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-100 dark:border-purple-800"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t("fullAddress")}:</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                      {addressDetail.streetAddress && `${addressDetail.streetAddress}, `}
                      {addressDetail.wardName && `${addressDetail.wardName}, `}
                      {addressDetail.districtName && `${addressDetail.districtName}, `}
                      {addressDetail.provinceName}
                    </p>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:ring-opacity-50 transition-all duration-200"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-700 dark:hover:from-purple-500 dark:hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-opacity-50 transition-all duration-200 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>{t("saving")}</span>
                  </>
                ) : (
                  <span>{t("saveChanges")}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}
