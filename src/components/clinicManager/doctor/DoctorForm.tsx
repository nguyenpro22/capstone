"use client"
import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, Building2 } from "lucide-react"
import { useAddDoctorMutation, useGetBranchesQuery } from "@/features/clinic/api"
import { toast } from "react-toastify"
import { useTranslations } from "next-intl"
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"
import { useTheme } from "next-themes"

// Define the form schema
const doctorSchema = z.object({
  email: z.string().email("Invalid email format"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  // Keep roleType in schema but it will be fixed
  roleType: z.number(),
  branchId: z.string().min(1, "Branch is required"),
})

type DoctorFormValues = z.infer<typeof doctorSchema>

interface DoctorFormProps {
  onClose: () => void
  onSaveSuccess: () => void
}

export default function DoctorForm({ onClose, onSaveSuccess }: DoctorFormProps) {
  const t = useTranslations("staffDoctor")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addDoctor] = useAddDoctorMutation()
  const { theme } = useTheme()

  // Get the token and extract clinicId
  const token = getAccessToken()
  // Add null check for token
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null
  const clinicId = tokenData?.clinicId || ""

  // Fetch branches
  const { data: branchesData, isLoading: isLoadingBranches } = useGetBranchesQuery(clinicId)

  // Extract branches from the response structure using useMemo
  const branches = useMemo(() => {
    // Check if data exists and has the expected structure
    if (branchesData?.value?.branches?.items) {
      return branchesData.value.branches.items || []
    }
    return []
  }, [branchesData])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      roleType: 1, // Fixed to Clinic Staff (2) as requested
      branchId: "",
    },
  })

  // Set default branch if only one branch is available
  useEffect(() => {
    if (Array.isArray(branches) && branches.length === 1) {
      setValue("branchId", branches[0].id)
    }
  }, [branches, setValue])

  // Updated to use FormData like createBranch
  const onSubmit = async (data: DoctorFormValues) => {
    setIsSubmitting(true)

    // Check if clinicId is available
    if (!clinicId) {
      toast.error("Clinic ID not found. Please try again or contact support.")
      setIsSubmitting(false)
      return
    }

    try {
      // Create FormData object
      const formData = new FormData()
      formData.append("email", data.email)
      formData.append("firstName", data.firstName)
      formData.append("lastName", data.lastName)
      formData.append("roleType", "1") // Fixed to Clinic Staff (2)
      formData.append("clinicId", data.branchId) // Use selected branchId as clinicId

      await addDoctor({
        id: data.branchId, // Main clinicId for the API endpoint
        data: formData,
      }).unwrap()

      onSaveSuccess()
    } catch (error) {
      console.error("Failed to add doctor:", error)
      toast.error(t("doctorAddedFailed") || "Failed to add doctor. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-gray-800/30 w-full max-w-md p-6 relative"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
        {t("addNewDoctor") || "Add New Doctor"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("email") || "Email"}
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="email@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("firstName") || "First Name"}
          </label>
          <input
            type="text"
            {...register("firstName")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="John"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("lastName") || "Last Name"}
          </label>
          <input
            type="text"
            {...register("lastName")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Doe"
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("branch") || "Branch"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <select
              {...register("branchId")}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              disabled={isLoadingBranches}
            >
              <option value="">{isLoadingBranches ? "Loading branches..." : "Select branch"}</option>
              {Array.isArray(branches) &&
                branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400 dark:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          {errors.branchId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.branchId.message}</p>}
        </div>

        {/* Hidden input for roleType */}
        <input type="hidden" {...register("roleType")} value={2} />

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {t("cancel") || "Cancel"}
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoadingBranches}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-700 dark:hover:from-purple-500 dark:hover:to-pink-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? t("saving") || "Saving..." : t("save") || "Save"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
