"use client";
import type React from "react";
import { useState } from "react";
import {
  useGetPartnershipRequestsQuery,
  useUpdatePartnershipRequestMutation,
} from "@/features/partnership/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@/components/common/Pagination/Pagination";
import type { RequestItem } from "@/features/partnership/types";
import {
  Search,
  CheckCircle,
  XCircle,
  Ban,
  X,
  AlertCircle,
  Loader2,
  Eye,
  ChevronDown,
  Clock,
} from "lucide-react";
import { useDelayedRefetch } from "@/hooks/use-delayed-refetch";
import { useDebounce } from "@/hooks/use-debounce";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import PartnershipRequestDetail from "@/components/systemStaff/partnership-request-detail";
import { useTranslations } from "next-intl";

const PartnershipRequest: React.FC = () => {
  const t = useTranslations("clinic");
  const { theme } = useTheme();
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [rejectReasons, setRejectReasons] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const searchTerm = useDebounce(searchInput, 500); // Debounce search input with 500ms delay
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState<"reject" | "ban" | null>(null);
  const [processingAction, setProcessingAction] = useState<{
    id: string;
    action: "accept" | "reject" | "ban" | null;
  } | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailRequestId, setDetailRequestId] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState<string>("");

  const { data, isLoading, isError, refetch } = useGetPartnershipRequestsQuery({
    pageIndex,
    pageSize,
    searchTerm,
  });

  // Use the delayed refetch hook
  const delayedRefetch = useDelayedRefetch(refetch);

  const [updatePartnershipRequest, { isLoading: isUpdating }] =
    useUpdatePartnershipRequestMutation();

  const handleAction = async (
    id: string,
    action: "accept" | "reject" | "ban"
  ) => {
    try {
      if (action === "accept") {
        setProcessingAction({ id, action });

        const result = await updatePartnershipRequest({
          requestId: id,
          action: 0,
        });

        // Check if the response has the expected structure
        if ("data" in result && result.data && result.data.isSuccess) {
          toast.success(t("partnershipRequestAccepted"));
          delayedRefetch();
        } else {
          // If we can't find isSuccess or it's false, show error
          toast.error(t("failedToUpdateRequest"));
        }

        setProcessingAction(null);
      } else {
        setSelectedRequestId(id);
        setActionType(action);
      }
    } catch (error) {
      console.error("Error in handleAction:", error);
      toast.error(t("failedToUpdateRequest"));
      setProcessingAction(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedRequestId || !actionType) return;

    const actionNumber = actionType === "reject" ? 1 : 2;

    // Get translated reasons
    const translatedReasons = rejectReasons
      .filter((reason) => reason !== "other")
      .map((reason) => t(reason));

    // Add custom reason if "other" was selected
    if (rejectReasons.includes("other") && customReason.trim()) {
      translatedReasons.push(customReason.trim());
    }

    // If no reasons selected, use default
    const finalReason =
      translatedReasons.length > 0
        ? translatedReasons.join("; ")
        : actionType === "reject"
        ? t("defaultRejectReason")
        : t("defaultBanReason");

    setIsSubmitting(true);
    setProcessingAction({ id: selectedRequestId, action: actionType });

    try {
      const result = await updatePartnershipRequest({
        requestId: selectedRequestId,
        action: actionNumber,
        rejectReason: finalReason,
      });

      // Check if the response has the expected structure
      if ("data" in result && result.data && result.data.isSuccess) {
        toast.success(
          actionType === "reject"
            ? t("partnershipRequestRejected")
            : t("partnershipRequestBanned")
        );
        delayedRefetch();
      } else {
        // If we can't find isSuccess or it's false, show error
        const errorMessage =
          "data" in result &&
          result.data &&
          result.data.error &&
          result.data.error.message
            ? result.data.error.message
            : t("failedToUpdateRequest");
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error in handleConfirmReject:", error);
      toast.error(t("failedToUpdateRequest"));
    } finally {
      setSelectedRequestId(null);
      setRejectReasons([]);
      setCustomReason("");
      setActionType(null);
      setIsSubmitting(false);
      setProcessingAction(null);
    }
  };

  const handleViewDetail = (id: string) => {
    setDetailRequestId(id);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setDetailRequestId(null);
  };

  const requests: RequestItem[] =
    data?.value?.items?.filter(
      (request: RequestItem) =>
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const totalCount = data?.value?.totalCount || 0;
  const hasNextPage = data?.value?.hasNextPage || false;
  const hasPreviousPage = data?.value?.hasPreviousPage || false;

  // Calculate the starting index for the current page
  const startIndex = (pageIndex - 1) * pageSize;

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 md:mb-0">
          {t("partnershipRequests")}
          <span className="ml-2 text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            {totalCount} {t("totalRequests")}
          </span>
        </h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <input
            type="text"
            placeholder={t("searchByNameOrEmail")}
            className="pl-10 pr-4 py-2.5 w-full md:w-64 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50 transition-all duration-200 dark:bg-gray-700 dark:text-gray-100"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-blue-500 dark:text-blue-400 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {t("loadingPartnershipRequests")}
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center text-red-500 dark:text-red-400">
            <AlertCircle className="h-8 w-8 mb-4" />
            <p>{t("errorLoadingData")}</p>
            <button
              onClick={() => delayedRefetch()} // Use delayed refetch instead of immediate refetch
              className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors duration-200"
            >
              {t("retry")}
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
                  <th className="px-4 py-4 font-medium w-12">{t("stt")}</th>
                  <th className="px-4 py-4 font-medium w-40">
                    {t("clinicName")}
                  </th>
                  <th className="px-4 py-4 font-medium w-48">{t("email")}</th>
                  <th className="px-4 py-4 font-medium w-40">{t("address")}</th>
                  <th className="px-4 py-4 font-medium w-28">
                    {t("dateApplied")}
                  </th>
                  <th className="px-4 py-4 font-medium w-20 text-center">
                    {t("totalApply")}
                  </th>
                  <th className="px-4 py-4 font-medium w-32 text-center">
                    {t("action")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      {t("noPartnershipRequestsFound")}
                    </td>
                  </tr>
                ) : (
                  requests.map((request: RequestItem, index: number) => (
                    <tr
                      key={request.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px]"
                          title={request.name}
                        >
                          {request.name}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className="text-gray-600 dark:text-gray-300 truncate max-w-[140px]"
                          title={request.email}
                        >
                          {request.email}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className="text-gray-600 dark:text-gray-300 truncate max-w-[120px]"
                          title={request.fullAddress}
                        >
                          {request.fullAddress}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-gray-600 dark:text-gray-300">
                          {request.dateApplied ? (
                            <div className="flex flex-col items-center">
                              <div>
                                {new Date(
                                  request.dateApplied
                                ).toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(
                                  request.dateApplied
                                ).toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {request.totalApply}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center space-x-1">
                          {/* View Detail Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="inline-flex items-center justify-center h-8 px-2 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            onClick={() => handleViewDetail(request.id)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>

                          {/* Action Dropdown Menu */}
                          {processingAction?.id === request.id ? (
                            <Button
                              disabled
                              className="h-8 px-2 py-1 bg-gray-400 text-white rounded-lg"
                            >
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            </Button>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2"
                                >
                                  <ChevronDown className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                  className="flex items-center text-emerald-600 dark:text-emerald-400 focus:text-emerald-700 dark:focus:text-emerald-300 focus:bg-emerald-50 dark:focus:bg-emerald-900/20"
                                  onClick={() =>
                                    handleAction(request.id, "accept")
                                  }
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  {t("accept")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 focus:bg-red-50 dark:focus:bg-red-900/20"
                                  onClick={() =>
                                    handleAction(request.id, "reject")
                                  }
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  {t("reject")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center text-amber-600 dark:text-amber-400 focus:text-amber-700 dark:focus:text-amber-300 focus:bg-amber-50 dark:focus:bg-amber-900/20"
                                  onClick={() =>
                                    handleAction(request.id, "ban")
                                  }
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  {t("ban")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                <h2 className="text-xl font-semibold">
                  {actionType === "reject"
                    ? t("rejectRequest")
                    : t("banRequest")}
                </h2>
                <button
                  onClick={() => {
                    setSelectedRequestId(null);
                    setRejectReasons([]);
                    setCustomReason("");
                    setActionType(null);
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
                {actionType === "reject"
                  ? t("provideRejectReason")
                  : t("provideBanReason")}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("selectReasons")}
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="reason-expired"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={rejectReasons.includes("expiredLicense")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRejectReasons([
                              ...rejectReasons,
                              "expiredLicense",
                            ]);
                          } else {
                            setRejectReasons(
                              rejectReasons.filter(
                                (reason) => reason !== "expiredLicense"
                              )
                            );
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor="reason-expired"
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {t("expiredLicense")}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="reason-tax"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={rejectReasons.includes("invalidTaxCode")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRejectReasons([
                              ...rejectReasons,
                              "invalidTaxCode",
                            ]);
                          } else {
                            setRejectReasons(
                              rejectReasons.filter(
                                (reason) => reason !== "invalidTaxCode"
                              )
                            );
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor="reason-tax"
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {t("invalidTaxCode")}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="reason-business"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={rejectReasons.includes(
                          "invalidBusinessLicense"
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRejectReasons([
                              ...rejectReasons,
                              "invalidBusinessLicense",
                            ]);
                          } else {
                            setRejectReasons(
                              rejectReasons.filter(
                                (reason) => reason !== "invalidBusinessLicense"
                              )
                            );
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor="reason-business"
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {t("invalidBusinessLicense")}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="reason-operation"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={rejectReasons.includes(
                          "invalidOperatingLicense"
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRejectReasons([
                              ...rejectReasons,
                              "invalidOperatingLicense",
                            ]);
                          } else {
                            setRejectReasons(
                              rejectReasons.filter(
                                (reason) => reason !== "invalidOperatingLicense"
                              )
                            );
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor="reason-operation"
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {t("invalidOperatingLicense")}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="reason-info"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={rejectReasons.includes("invalidContactInfo")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRejectReasons([
                              ...rejectReasons,
                              "invalidContactInfo",
                            ]);
                          } else {
                            setRejectReasons(
                              rejectReasons.filter(
                                (reason) => reason !== "invalidContactInfo"
                              )
                            );
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor="reason-info"
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {t("invalidContactInfo")}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="reason-other"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={rejectReasons.includes("other")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRejectReasons([...rejectReasons, "other"]);
                          } else {
                            setRejectReasons(
                              rejectReasons.filter(
                                (reason) => reason !== "other"
                              )
                            );
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor="reason-other"
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {t("otherReason")}
                      </label>
                    </div>
                  </div>
                </div>

                {rejectReasons.includes("other") && (
                  <div>
                    <label
                      htmlFor="custom-reason"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      {t("otherReason")}
                    </label>
                    <textarea
                      id="custom-reason"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50 transition-all duration-200 dark:bg-gray-700 dark:text-gray-100"
                      rows={3}
                      placeholder={
                        actionType === "reject"
                          ? t("enterCustomRejectReason")
                          : t("enterCustomBanReason")
                      }
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => {
                    setSelectedRequestId(null);
                    setRejectReasons([]);
                    setCustomReason("");
                    setActionType(null);
                  }}
                  disabled={isSubmitting}
                >
                  {t("cancel")}
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
                      {t("processing")}
                    </>
                  ) : (
                    <>
                      {actionType === "reject"
                        ? t("rejectRequestButton")
                        : t("banRequestButton")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partnership Request Detail Component */}
      <PartnershipRequestDetail
        requestId={detailRequestId}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};

export default PartnershipRequest;
