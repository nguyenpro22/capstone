"use client"
import { Clock, CreditCard, Building2, Video, Eye } from "lucide-react"
import { useState } from "react"
import {
  useGetPackagesQuery,
  useChangeStatusPackageMutation,
  useLazyGetPackagesByIdQuery,
  useDeletePackageMutation,
} from "@/features/package/api"
import { motion } from "framer-motion"
import PackageForm from "@/components/systemAdmin/PackageForm"
import EditPackageForm from "@/components/systemAdmin/EditPackageForm"
import Pagination from "@/components/common/Pagination/Pagination"
import { useTranslations } from "next-intl"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { MoreVertical, Search, Plus } from "lucide-react"
import Modal from "@/components/systemAdmin/Modal"
import type { Package } from "@/features/package/types"
import { useDelayedRefetch } from "@/hooks/use-delayed-refetch"
import { formatPrice } from "@/utils/format"
import { useTheme } from "next-themes"

export default function PackagePage() {
  const t = useTranslations("package")
  const { theme } = useTheme()

  const [viewPackage, setViewPackage] = useState<any | null>(null)
  const [editPackage, setEditPackage] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 5

  const { data, error, isLoading, refetch } = useGetPackagesQuery({
    pageIndex,
    pageSize,
    searchTerm,
  })
  console.log("API Response:", data)

  const delayedRefetch = useDelayedRefetch(refetch)

  const [changeStatusPackage] = useChangeStatusPackageMutation()
  const [fetchPackageById] = useLazyGetPackagesByIdQuery()
  const [deletePackage] = useDeletePackageMutation()

  const packages = data?.value?.items || []
  console.log("Package Data:", packages)

  const totalCount = data?.value?.totalCount || 0
  const hasNextPage = data?.value?.hasNextPage
  const hasPreviousPage = data?.value?.hasPreviousPage

  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [localPackages, setLocalPackages] = useState<any[]>([]) // Giữ nguyên setLocalPackages

  const handleToggleMenu = (packageId: string) => {
    setMenuOpen(menuOpen === packageId ? null : packageId)
  }

  const handleToggleStatus = async (packageId: string) => {
    try {
      const packageToUpdate = packages.find((pkg: Package) => pkg.id === packageId)
      if (!packageToUpdate) return

      const updatedPackages = packages.map((pkg: Package) =>
        pkg.id === packageId ? { ...pkg, isActivated: !pkg.isActivated } : pkg,
      )
      setLocalPackages(updatedPackages)

      await changeStatusPackage({ packageId }).unwrap()
      toast.success(t("statusUpdated"))
      delayedRefetch()
    } catch (error) {
      console.error(error)
      toast.error(t("errorOccurred"))
    }
  }

  const handleCloseMenu = () => {
    setMenuOpen(null)
  }

  const handleMenuAction = async (action: string, pkgId: string) => {
    if (action === "view") {
      try {
        const result = await fetchPackageById(pkgId).unwrap()
        setViewPackage(result.value)
      } catch (error) {
        console.error(error)
        toast.error(t("cannotGetPackageInfo"))
        setViewPackage({
          name: "",
          description: "",
          price: "0",
          duration: "",
          isActivated: false,
        })
      }
    }

    if (action === "edit") {
      try {
        const result = await fetchPackageById(pkgId).unwrap()
        setEditPackage(result.value)
      } catch (error) {
        console.error(error)
        toast.error(t("cannotGetPackageInfo"))
        setEditPackage({
          name: "",
          description: "",
          price: "0",
          duration: "",
          isActivated: false,
        })
      }
      setShowEditForm(true)
    }

    setMenuOpen(null)
  }

  const handleDeletePackage = async (packageId: string) => {
    if (window.confirm(t("confirmDeletePackage"))) {
      try {
        await deletePackage(packageId).unwrap()
        toast.success(t("packageDeletedSuccess"))
        delayedRefetch()
      } catch (error) {
        console.error(error)
        toast.error(t("packageDeleteFailed"))
      }
    }
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen" onClick={handleCloseMenu}>
      <ToastContainer theme={theme === "dark" ? "dark" : "light"} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t("packageLists")}</h1>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder={t("searchByPackageName")}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500 focus:ring-opacity-50 transition-all dark:bg-gray-800 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Search className="h-5 w-5" />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-700 dark:hover:from-purple-500 dark:hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium tracking-wide">{t("addNewPackage")}</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-900/30 rounded-lg relative">
        {isLoading && <p className="text-gray-500 dark:text-gray-400">{t("loadingPackages")}</p>}
        {error && <p className="text-red-600 dark:text-red-400">{t("failedToLoad")}</p>}
        {!isLoading && !error && packages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                  <th className="p-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                    {t("no")}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                    {t("packageName")}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                    {t("description")}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                    {t("price")}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                    {t("duration")}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                    {t("status")}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                    {t("action")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg: any, index: number) => (
                  <tr key={pkg.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="p-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                      {(pageIndex - 1) * pageSize + index + 1}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                      {pkg.name}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                      {pkg.description}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-600 text-purple-600 dark:text-purple-400 font-medium">
                      {formatPrice(pkg.price)}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                      {pkg.duration}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={pkg.isActivated}
                          className="toggle-checkbox rounded h-4 w-4 text-purple-600 dark:text-purple-500 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800"
                          onChange={() => handleToggleStatus(pkg.id)}
                        />
                        <span
                          className={
                            pkg.isActivated ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }
                        >
                          {pkg.isActivated ? t("active") : t("inactive")}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-600 relative">
                      <button
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleMenu(pkg.id)
                        }}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {menuOpen === pkg.id && (
                        <ul className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-900/50 rounded-md text-sm py-2 z-50">
                          <li
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-200"
                            onClick={() => handleMenuAction("view", pkg.id)}
                          >
                            {t("viewPackageInfo")}
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-200"
                            onClick={() => handleMenuAction("edit", pkg.id)}
                          >
                            {t("editPackageInfo")}
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 cursor-pointer"
                            onClick={() => handleDeletePackage(pkg.id)}
                          >
                            {t("deletePackage")}
                          </li>
                        </ul>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !isLoading && !error ? (
          <p className="text-gray-500 dark:text-gray-400 py-8 text-center">{t("noPackagesAvailable")}</p>
        ) : null}
      </div>

      {showEditForm && editPackage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <EditPackageForm
            initialData={editPackage}
            onClose={() => {
              setShowEditForm(false)
              setEditPackage(null)
            }}
            onSaveSuccess={() => {
              setShowEditForm(false)
              setEditPackage(null)
              delayedRefetch()
            }}
          />
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <PackageForm
            onClose={() => setShowForm(false)}
            onSaveSuccess={() => {
              setShowForm(false)
              delayedRefetch()
              toast.success(t("packageAddedSuccess"))
            }}
          />
        </div>
      )}

      <div className="mt-6">
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalCount={totalCount}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onPageChange={setPageIndex}
        />
      </div>

      {/* View Package Modal */}
      {viewPackage && (
        <Modal onClose={() => setViewPackage(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-3xl font-serif font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {viewPackage.name}
              </h2>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    viewPackage.isActivated
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  <span
                    className={`mr-1.5 h-2 w-2 rounded-full ${viewPackage.isActivated ? "bg-emerald-400" : "bg-gray-400"}`}
                  ></span>
                  {viewPackage.isActivated ? t("active") : t("inactive")}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">{viewPackage.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow-sm dark:shadow-gray-900/30 transition-all hover:shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("price")}</h3>
                    <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {formatPrice(viewPackage.price)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow-sm dark:shadow-gray-900/30 transition-all hover:shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("duration")}</h3>
                    <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {viewPackage.duration} {viewPackage.duration === 1 ? t("month") : t("months")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow-sm dark:shadow-gray-900/30 transition-all hover:shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg">
                    <Building2 className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("branchLimit")}</h3>
                    <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {viewPackage.limitBranch} {viewPackage.limitBranch === 1 ? t("branch") : t("branches")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow-sm dark:shadow-gray-900/30 transition-all hover:shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                    <Video className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("liveStreamLimit")}</h3>
                    <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {viewPackage.limitLiveStream} {t("streams")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow-sm dark:shadow-gray-900/30 transition-all hover:shadow-md md:col-span-2">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                    <Eye className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t("enhancedViewerCapacity")}
                    </h3>
                    <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {viewPackage.enhancedViewer} {t("viewers")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewPackage(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
