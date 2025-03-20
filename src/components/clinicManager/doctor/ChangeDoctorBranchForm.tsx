"use client"
import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, Check, Building, ArrowRight, Loader2 } from "lucide-react"
import { useChangeDoctorBranchMutation, useGetBranchesQuery } from "@/features/clinic/api"
import { toast } from "react-toastify"
import { useTranslations } from "next-intl"
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"
import type { Doctor, Branch } from "@/features/clinic/types"

// Define the form schema
const changeBranchSchema = z.object({
  newBranchId: z.string().min(1, "New branch is required"),
})

type ChangeBranchFormValues = z.infer<typeof changeBranchSchema>

interface ChangeDoctorBranchFormProps {
  doctor: Doctor
  onClose: () => void
  onSaveSuccess: () => void
}

export default function ChangeDoctorBranchForm({ doctor, onClose, onSaveSuccess }: ChangeDoctorBranchFormProps) {
  const t = useTranslations("doctor")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [changeDoctorBranch] = useChangeDoctorBranchMutation()
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  // Get the token and extract clinicId
  const token = getAccessToken()
  // Add null check for token
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null
  const clinicId = tokenData?.clinicId || ""

  // Fetch branches
  const { data: branchesData, isLoading: isLoadingBranches } = useGetBranchesQuery(clinicId)

  // Fix the typing issue by ensuring branches is always an array
  const branches = useMemo(() => branchesData?.value?.branches || [], [branchesData])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangeBranchFormValues>({
    resolver: zodResolver(changeBranchSchema),
    defaultValues: {
      newBranchId: "",
    },
  })

  // Watch for changes to newBranchId
  const newBranchId = watch("newBranchId")

  // Update selectedBranch when newBranchId changes
  useMemo(() => {
    if (newBranchId) {
      const branch = branches.find((b) => b.id === newBranchId)
      setSelectedBranch(branch || null)
    } else {
      setSelectedBranch(null)
    }
  }, [newBranchId, branches])

  const onSubmit = async (data: ChangeBranchFormValues) => {
    setIsSubmitting(true)

    try {
      // Create FormData object for the multipart/form-data request
      const formData = new FormData()
      formData.append("clinicId", data.newBranchId)
      formData.append("doctorId", doctor.employeeId) // Using doctor.id instead of employeeId

      await changeDoctorBranch({
        id: data.newBranchId, // Clinic ID for the URL path parameter
        data: formData,
      }).unwrap()

      toast.success(t("branchChangedSuccess") || "Doctor's branch changed successfully!")
      onSaveSuccess()
    } catch (error) {
      console.error("Failed to change doctor's branch:", error)
      toast.error(t("branchChangeFailed") || "Failed to change doctor's branch. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get current branch name
  const currentBranchName =
    doctor.branchs && doctor.branchs.length > 0 ? doctor.branchs[0].name : t("noBranch") || "No branch assigned"

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative">
          <h2 className="text-2xl font-bold">{t("changeDoctorBranch") || "Change Doctor's Branch"}</h2>
          <p className="text-purple-100 mt-1 opacity-90">
            {t("updateDoctorBranch") || "Update the branch assignment for this doctor"}
          </p>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor info card */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-600">
              {doctor.fullName?.charAt(0) || "D"}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{doctor.fullName}</h3>
              <p className="text-sm text-gray-500">{doctor.email || t("noEmail") || "No email provided"}</p>
            </div>
          </div>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Current branch display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-500 mb-2">
              {t("currentBranch") || "Current Branch"}
            </label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Building className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-700">{currentBranchName}</span>
            </div>
          </div>

          {/* Branch selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("newBranch") || "New Branch"}</label>
            <div className="relative">
              <select
                {...register("newBranchId")}
                className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white ${
                  errors.newBranchId ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isLoadingBranches}
              >
                <option value="">{t("selectBranch") || "Select branch"}</option>
                {branches.map((branch: Branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {errors.newBranchId && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.newBranchId.message}
              </motion.p>
            )}
          </div>

          {/* Branch change visualization */}
          <AnimatePresence>
            {selectedBranch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Building className="w-5 h-5 text-gray-500" />
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-600 text-center max-w-[100px] truncate">
                        {currentBranchName}
                      </span>
                    </div>

                    <ArrowRight className="w-5 h-5 text-purple-400 mx-2" />

                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                        <Building className="w-5 h-5 text-white" />
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-800 text-center max-w-[100px] truncate">
                        {selectedBranch.name}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              {t("cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !newBranchId}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-colors disabled:opacity-50 font-medium text-sm flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("saving") || "Saving..."}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {t("save") || "Save"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

