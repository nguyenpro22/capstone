"use client"
import type React from "react"
import { useState } from "react"
import { useGetPartnershipRequestsQuery, useUpdatePartnershipRequestMutation } from "@/features/partnership/api"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Pagination from "@/components/common/Pagination/Pagination"
import type { RequestItem } from "@/features/partnership/types"
import { Filter, Search, CheckCircle, XCircle, Ban, Calendar, RefreshCw, X, AlertCircle, Loader2 } from "lucide-react"
import { useDelayedRefetch } from "@/hooks/use-delayed-refetch"
import { useTheme } from "next-themes"

const PartnershipRequest: React.FC = () => {
  const { theme } = useTheme()
  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 5
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionType, setActionType] = useState<"reject" | "ban" | null>(null)
  const [processingAction, setProcessingAction] = useState<{
    id: string
    action: "accept" | "reject" | "ban" | null
  } | null>(null)

  const { data, isLoading, isError, refetch } = useGetPartnershipRequestsQuery({
    pageIndex,
    pageSize,
    searchTerm,
  })

  // Use the delayed refetch hook
  const delayedRefetch = useDelayedRefetch(refetch)

  const [updatePartnershipRequest, { isLoading: isUpdating }] = useUpdatePartnershipRequestMutation()

  const handleAction = async (id: string, action: "accept" | "reject" | "ban") => {
    try {
      if (action === "accept") {
        setProcessingAction({ id, action })

        const result = await updatePartnershipRequest({
          requestId: id,
          action: 0,
        })

        // Log the entire response to see its structure
        console.log("API Response:", result)

        // Check if the response has the expected structure
        if ("data" in result && result.data && result.data.isSuccess) {
          toast.success(`Partnership request accepted successfully`)
          delayedRefetch()
        } else {
          // If we can't find isSuccess or it's false, show error
          toast.error("Failed to update the request")
        }

        setProcessingAction(null)
      } else {
        setSelectedRequestId(id)
        setActionType(action)
      }
    } catch (error) {
      console.error("Error in handleAction:", error)
      toast.error("Failed to update the request")
      setProcessingAction(null)
    }
  }

  const handleConfirmReject = async () => {
    if (!selectedRequestId || !actionType) return

    const actionNumber = actionType === "reject" ? 1 : 2
    const reason =
      rejectReason.trim() ||
      (actionType === "reject" ? "Your request has been rejected" : "Your request has been banned")

    setIsSubmitting(true)
    setProcessingAction({ id: selectedRequestId, action: actionType })

    try {
      const result = await updatePartnershipRequest({
        requestId: selectedRequestId,
        action: actionNumber,
        rejectReason: reason,
      })

      // Log the entire response to see its structure
      console.log("API Response:", result)

      // Check if the response has the expected structure
      if ("data" in result && result.data && result.data.isSuccess) {
        toast.success(`Partnership request ${actionType === "reject" ? "rejected" : "banned"} successfully`)
        delayedRefetch()
      } else {
        // If we can't find isSuccess or it's false, show error
        const errorMessage =
          "data" in result && result.data && result.data.error && result.data.error.message
            ? result.data.error.message
            : "Failed to update the request"
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Error in handleConfirmReject:", error)
      toast.error("Failed to update the request")
    } finally {
      setSelectedRequestId(null)
      setRejectReason("")
      setActionType(null)
      setIsSubmitting(false)
      setProcessingAction(null)
    }
  }

  const requests: RequestItem[] =
    data?.value?.items?.filter(
      (request: RequestItem) =>
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const totalCount = data?.value?.totalCount || 0
  const hasNextPage = data?.value?.hasNextPage || false
  const hasPreviousPage = data?.value?.hasPreviousPage || false

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700">
      <ToastContainer theme={theme === "dark" ? "dark" : "light"} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 md:mb-0">
          Partnership Requests
          <span className="ml-2 text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            {totalCount} Total
          </span>
        </h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="pl-10 pr-4 py-2.5 w-full md:w-64 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50 transition-all duration-200 dark:bg-gray-700 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
            <Filter className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span>Filter By</span>
          </button>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <select className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 appearance-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50 transition-all duration-200">
              <option>14 Feb 2019</option>
              <option>15 Feb 2019</option>
              <option>16 Feb 2019</option>
            </select>
          </div>

          <button className="flex items-center px-4 py-2.5 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200">
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Reset Filter</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-blue-500 dark:text-blue-400 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading partnership requests...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center text-red-500 dark:text-red-400">
            <AlertCircle className="h-8 w-8 mb-4" />
            <p>Error loading data. Please try again later.</p>
            <button
              onClick={() => delayedRefetch()} // Use delayed refetch instead of immediate refetch
              className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full border-collapse table-auto text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Clinic Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Address</th>
                  <th className="px-6 py-4 font-medium">Total Apply</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No partnership requests found
                    </td>
                  </tr>
                ) : (
                  requests.map((request: RequestItem) => (
                    <tr
                      key={request.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{request.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{request.name}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{request.email}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {request.address}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {request.totalApply}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {/* Accept Button */}
                          {processingAction?.id === request.id && processingAction?.action === "accept" ? (
                            <button className="inline-flex items-center justify-center w-28 px-3 py-2 bg-emerald-500 text-white rounded-lg">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </button>
                          ) : (
                            <button
                              className="inline-flex items-center justify-center w-24 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors duration-200"
                              onClick={() => handleAction(request.id, "accept")}
                              disabled={processingAction !== null}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Accept
                            </button>
                          )}

                          {/* Reject Button */}
                          {processingAction?.id === request.id && processingAction?.action === "reject" ? (
                            <button className="inline-flex items-center justify-center w-28 px-3 py-2 bg-red-500 text-white rounded-lg">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </button>
                          ) : (
                            <button
                              className="inline-flex items-center justify-center w-24 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors duration-200"
                              onClick={() => handleAction(request.id, "reject")}
                              disabled={processingAction !== null}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </button>
                          )}

                          {/* Ban Button */}
                          {processingAction?.id === request.id && processingAction?.action === "ban" ? (
                            <button className="inline-flex items-center justify-center w-28 px-3 py-2 bg-amber-500 text-white rounded-lg">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </button>
                          ) : (
                            <button
                              className="inline-flex items-center justify-center w-24 px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors duration-200"
                              onClick={() => handleAction(request.id, "ban")}
                              disabled={processingAction !== null}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Ban
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
        </>
      )}

      {/* Modal for reject/ban reason */}
      {selectedRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900/50 w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{actionType === "reject" ? "Reject Request" : "Ban Request"}</h2>
                <button
                  onClick={() => {
                    setSelectedRequestId(null)
                    setActionType(null)
                  }}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Please provide a reason for {actionType === "reject" ? "rejecting" : "banning"} this partnership
                request:
              </p>

              <textarea
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50 transition-all duration-200 dark:bg-gray-700 dark:text-gray-100"
                rows={4}
                placeholder={`Enter reason for ${actionType}...`}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                disabled={isSubmitting}
              />

              <div className="flex justify-end mt-6 gap-3">
                <button
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => {
                    setSelectedRequestId(null)
                    setActionType(null)
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-white flex items-center ${
                    isSubmitting
                      ? "bg-blue-400 dark:bg-blue-500 cursor-not-allowed"
                      : "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
                  } transition-colors duration-200`}
                  onClick={handleConfirmReject}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Processing...
                    </>
                  ) : (
                    <>{actionType === "reject" ? "Reject" : "Ban"} Request</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PartnershipRequest
