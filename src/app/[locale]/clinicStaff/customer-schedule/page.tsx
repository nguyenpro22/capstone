"use client";
import { useState, useEffect } from "react";
import type React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Filter,
  MoreHorizontal,
  Search,
  Loader2,
  AlertCircle,
  User,
  Phone,
  Calendar,
  ArrowRight,
  CreditCard,
  Eye,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ArrowUpDown,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useLazyGetCustomerSchedulesQuery,
  useLazyGetClinicSchedulesQuery,
  useUpdateScheduleStatusMutation,
  useLazyGetNextScheduleAvailabilityQuery,
  useLazyGetScheduleByIdQuery,
  useCancelScheduleMutation,
} from "@/features/customer-schedule/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import type { CustomerSchedule } from "@/features/customer-schedule/types";
import ScheduleDetailsModal from "@/components/clinicStaff/customer-schedule/schedule-details-modal";
import SchedulePaymentModal from "@/components/clinicStaff/customer-schedule/schedule-payment-modal";
import { useDelayedRefetch } from "@/hooks/use-delayed-refetch";
import ScheduleFollowUpModal from "@/components/clinicStaff/customer-schedule/schedule-follow-up-modal";
import NextScheduleNotification from "@/components/clinicStaff/customer-schedule/next-schedule-notification";
import Pagination from "@/components/common/Pagination/Pagination";
import { useTranslations } from "next-intl";
import FollowUpSelectionModal from "@/components/clinicStaff/customer-schedule/follow-up-selection-modal";
import EarlyCheckInModal from "@/components/clinicStaff/customer-schedule/early-check-in-modal";
import ScheduleChangeForCustomerModal from "@/components/clinicStaff/customer-schedule/schedule-change-for-customer";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";

// Types
interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors: any;
}

interface ScheduleWithFollowUpStatus extends CustomerSchedule {
  needsFollowUp?: boolean;
  isCheckingFollowUp?: boolean;
  checkCompleted?: boolean;
  followUpStatus?: string | null;
}

export default function SchedulesPage() {
  const t = useTranslations("customerSchedule");

  // RTK Query hooks
  const [
    getCustomerSchedules,
    {
      data: scheduleResponse,
      isLoading: isLoadingCustomer,
      error: customerError,
    },
  ] = useLazyGetCustomerSchedulesQuery();
  const [
    getClinicSchedules,
    {
      data: clinicSchedulesResponse,
      isLoading: isLoadingClinic,
      error: clinicError,
    },
  ] = useLazyGetClinicSchedulesQuery();
  const [updateScheduleStatus, { isLoading: isUpdatingStatus }] =
    useUpdateScheduleStatusMutation();
  const [cancelSchedule, { isLoading: isCancellingSchedule }] =
    useCancelScheduleMutation();
  const [getNextScheduleAvailability, { isLoading: isCheckingNextSchedule }] =
    useLazyGetNextScheduleAvailabilityQuery();
  const [getScheduleById, { isLoading: isLoadingNextSchedule }] =
    useLazyGetScheduleByIdQuery();

  // Delayed refetch functions
  const delayedGetCustomerSchedules = useDelayedRefetch(getCustomerSchedules);
  const delayedGetClinicSchedules = useDelayedRefetch(getClinicSchedules);

  // Search states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(
    null
  );

  // Pagination and filtering states
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [sortColumn, setSortColumn] = useState("bookingDate");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modal states
  const [selectedSchedule, setSelectedSchedule] =
    useState<CustomerSchedule | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isFollowUpSelectionModalOpen, setIsFollowUpSelectionModalOpen] =
    useState(false);
  const [isEarlyCheckInModalOpen, setIsEarlyCheckInModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [scheduleToCancel, setScheduleToCancel] =
    useState<CustomerSchedule | null>(null);

  // Schedule states
  const [schedulesNeedingFollowUp, setSchedulesNeedingFollowUp] = useState<
    CustomerSchedule[]
  >([]);
  const [scheduleNeedingFollowUp, setScheduleNeedingFollowUp] =
    useState<CustomerSchedule | null>(null);
  const [schedulesWithFollowUpStatus, setSchedulesWithFollowUpStatus] =
    useState<ScheduleWithFollowUpStatus[]>([]);
  const [earlyCheckInSchedule, setEarlyCheckInSchedule] =
    useState<CustomerSchedule | null>(null);
  const [scheduleToReschedule, setScheduleToReschedule] =
    useState<CustomerSchedule | null>(null);
  const [minutesEarly, setMinutesEarly] = useState(0);

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Thêm biến để theo dõi kết quả tìm kiếm hiện tại
  const [searchResults, setSearchResults] = useState<CustomerSchedule[]>([]);

  // Extract data from responses
  // Thay thế dòng:
  // const scheduleItems = scheduleResponse?.value?.items || []
  // Bằng:
  const scheduleItems = searchPerformed
    ? searchResults
    : scheduleResponse?.value?.items || [];
  const searchTotalCount = scheduleResponse?.value?.totalCount || 0;
  const searchTotalPages = Math.ceil(searchTotalCount / pageSize);
  const clinicSchedules = clinicSchedulesResponse?.value?.items || [];
  const totalCount = clinicSchedulesResponse?.value?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const clinicErrorMessage = clinicError
    ? "error" in clinicError
      ? (clinicError.error as string)
      : t("error")
    : null;

  // Kiểm tra xem có lỗi máy chủ hay không
  const hasServerError = errorResponse && errorResponse.status >= 500;

  // Helper functions
  const formatDateForApi = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  const formatTimeRange = (
    startTime: string | null,
    endTime: string | null
  ) => {
    const formattedStart = startTime ? startTime.substring(0, 5) : "--:--";
    const formattedEnd = endTime ? endTime.substring(0, 5) : "--:--";
    return `${formattedStart} - ${formattedEnd}`;
  };

  const getDefaultDateRange = () => {
    const today = new Date();
    const futureDate = addDays(today, 180); // Thay đổi từ 90 ngày thành 180 ngày (6 tháng)
    return { from: today, to: futureDate };
  };

  const createDateRangeSearchTerm = (from?: Date, to?: Date) => {
    if (!from && !to) {
      const defaultRange = getDefaultDateRange();
      from = defaultRange.from;
      to = defaultRange.to;
    } else if (from && !to) {
      to = addDays(from, 30);
    } else if (!from && to) {
      from = addDays(to, -30);
    }
    return `${formatDateForApi(from)} to ${formatDateForApi(to)}`;
  };

  // Status and UI helpers
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
            {t("completed")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700">
            {t("pending")}
          </Badge>
        );
      case "in progress":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
            {t("inProgress")}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
            {t("cancelled")}
          </Badge>
        );
      default:
        return <Badge>{t("waitingApproval")}</Badge>;
    }
  };

  const getScheduleWithStatus = (
    schedule: CustomerSchedule
  ): ScheduleWithFollowUpStatus => {
    const scheduleWithStatus = schedulesWithFollowUpStatus.find(
      (s) => s.id === schedule.id
    );
    if (scheduleWithStatus) {
      return scheduleWithStatus;
    }
    return {
      ...schedule,
      needsFollowUp: false,
      isCheckingFollowUp: false,
      checkCompleted: false,
      followUpStatus: null,
    };
  };

  // Add a new helper function to check if there are any menu items to display for a schedule
  const hasMenuItems = (schedule: CustomerSchedule) => {
    // Check if the schedule has any actions that would appear in the dropdown
    return (
      schedule.status.toLowerCase() === "completed" || // For follow-up
      schedule.status.toLowerCase() === "pending" // For reschedule and cancel
    );
  };

  // Update the shouldShowDropdownMenu function to also check if there are menu items
  const shouldShowDropdownMenu = (
    scheduleWithStatus: ScheduleWithFollowUpStatus
  ) => {
    return (
      !(
        scheduleWithStatus.checkCompleted &&
        scheduleWithStatus.followUpStatus === "Already scheduled for next step"
      ) && hasMenuItems(scheduleWithStatus)
    );
  };

  const shouldShowCheckInButton = (schedule: CustomerSchedule) => {
    if (schedule.status.toLowerCase() !== "pending") {
      return false;
    }

    const bookingDate = new Date(schedule.bookingDate);
    const today = new Date();

    bookingDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return bookingDate.getTime() === today.getTime();
  };

  const renderCompletedScheduleButton = (
    schedule: CustomerSchedule,
    scheduleWithStatus: ScheduleWithFollowUpStatus
  ) => {
    if (scheduleWithStatus.isCheckingFollowUp) {
      return (
        <Button
          variant="default"
          size="sm"
          className="bg-gray-400 dark:bg-gray-600 text-white"
          disabled
        >
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
          {t("checking")}
        </Button>
      );
    }

    if (scheduleWithStatus.checkCompleted) {
      if (
        scheduleWithStatus.followUpStatus === "Need to schedule for next step"
      ) {
        return (
          <Button
            variant="default"
            size="sm"
            className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
            onClick={() => handleScheduleFollowUp(schedule)}
          >
            <Calendar className="h-4 w-4 mr-1" />
            {t("followUp")}
          </Button>
        );
      } else if (
        scheduleWithStatus.followUpStatus === "Already scheduled for next step"
      ) {
        return (
          <Button
            variant="default"
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            onClick={() => handleViewNextAppointment(schedule)}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            {t("viewNext")}
          </Button>
        );
      } else if (
        scheduleWithStatus.followUpStatus ===
        "Next Customer Schedule Not Found !"
      ) {
        return null;
      }
    }

    if (!scheduleWithStatus.checkCompleted && schedule.isFirstCheckIn) {
      return (
        <Button
          variant="default"
          size="sm"
          className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white"
          onClick={() => handleCheckout(schedule)}
        >
          <CreditCard className="h-4 w-4 mr-1" />
          {t("checkout")}
        </Button>
      );
    }

    return null;
  };

  // Data fetching functions
  const fetchClinicSchedules = async () => {
    let searchTerm = "";

    // Chỉ tạo searchTerm có khoảng thời gian khi người dùng đã chọn tab hoặc đã chọn ngày
    if (fromDate && toDate) {
      searchTerm = createDateRangeSearchTerm(fromDate, toDate);
    } else if (activeTab !== "all" || fromDate || toDate) {
      const today = new Date();

      if (activeTab === "upcoming") {
        const futureDate = addDays(today, 180);
        searchTerm = `${formatDateForApi(today)} to ${formatDateForApi(
          futureDate
        )}`;
      } else if (activeTab === "past") {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        searchTerm = `${formatDateForApi(sixMonthsAgo)} to ${formatDateForApi(
          yesterday
        )}`;
      } else if (fromDate || toDate) {
        // Nếu người dùng đã chọn ít nhất một ngày
        searchTerm = createDateRangeSearchTerm(fromDate, toDate);
      }
    }

    try {
      const result = await delayedGetClinicSchedules({
        pageIndex: currentPage,
        pageSize,
        searchTerm,
        sortColumn,
        sortOrder,
      });

      if (result.data?.value?.items) {
        await checkAllSchedulesFollowUpStatus(result.data.value.items);
      }

      return result;
    } catch (error) {
      console.error("Failed to fetch clinic schedules:", error);
      return { data: null, error };
    }
  };

  // Tương tự, sửa hàm fetchClinicSchedulesWithTab
  const fetchClinicSchedulesWithTab = async (tabValue: string) => {
    let searchTerm = "";

    // Chỉ tạo searchTerm có khoảng thời gian khi người dùng đã chọn tab khác "all" hoặc đã chọn ngày
    if (fromDate && toDate) {
      searchTerm = createDateRangeSearchTerm(fromDate, toDate);
    } else if (tabValue !== "all" || fromDate || toDate) {
      const today = new Date();

      if (tabValue === "upcoming") {
        const futureDate = addDays(today, 180);
        searchTerm = `${formatDateForApi(today)} to ${formatDateForApi(
          futureDate
        )}`;
      } else if (tabValue === "past") {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        searchTerm = `${formatDateForApi(sixMonthsAgo)} to ${formatDateForApi(
          yesterday
        )}`;
      } else if (fromDate || toDate) {
        // Nếu người dùng đã chọn ít nhất một ngày
        searchTerm = createDateRangeSearchTerm(fromDate, toDate);
      }
    }

    try {
      const result = await delayedGetClinicSchedules({
        pageIndex: currentPage,
        pageSize,
        searchTerm,
        sortColumn,
        sortOrder,
      });

      if (result.data?.value?.items) {
        await checkAllSchedulesFollowUpStatus(result.data.value.items);
      }

      return result;
    } catch (error) {
      console.error("Failed to fetch clinic schedules:", error);
      return { data: null, error };
    }
  };

  // Sửa hàm searchSchedules để cập nhật searchResults
  const searchSchedules = async () => {
    if (!customerName && !customerPhone) {
      setErrorResponse({
        type: "400",
        title: t("badRequest"),
        status: 400,
        detail: t("pleaseEnterNameOrPhone"),
        errors: null,
      });
      // Đặt kết quả tìm kiếm về mảng rỗng khi có lỗi
      setSearchResults([]);
      return;
    }

    setErrorResponse(null);

    try {
      // Set searchPerformed to true BEFORE making the API call to prevent clinic schedules fetch
      setSearchPerformed(true);
      // Đặt kết quả tìm kiếm về mảng rỗng trước khi tìm kiếm mới
      setSearchResults([]);

      // Remove pageIndex and pageSize from the search parameters
      const result = await getCustomerSchedules({
        customerName,
        customerPhone,
      });

      if ("error" in result) {
        const errorData = result.error as any;
        if (errorData?.data) {
          setErrorResponse(errorData.data as ErrorResponse);

          // Clear previous search results when error occurs
          if (
            errorData?.data?.detail === "No customer schedules found" ||
            errorData?.data?.detail === "No matching users found" ||
            errorData?.data?.status === 404
          ) {
            // Đặt kết quả tìm kiếm về mảng rỗng khi không tìm thấy
            setSearchResults([]);
            // Show a toast notification
            toast.warning(
              t("noSchedulesFound") + " " + (customerName || customerPhone)
            );
          } else if (errorData?.data?.status >= 500) {
            // Đặt kết quả tìm kiếm về mảng rỗng khi có lỗi máy chủ
            setSearchResults([]);
            // Hiển thị thông báo lỗi máy chủ
            toast.error(
              t("serverError") + ": " + errorData?.data?.detail ||
                t("unexpectedError")
            );
          }
        } else {
          setErrorResponse({
            type: "500",
            title: t("serverError"),
            status: 500,
            detail: t("unexpectedError"),
            errors: null,
          });
          // Đặt kết quả tìm kiếm về mảng rỗng khi có lỗi máy chủ
          setSearchResults([]);
          toast.error(t("serverError") + ": " + t("unexpectedError"));
        }
      } else if (result.data) {
        // Clear any previous error
        setErrorResponse(null);

        const schedules = result.data.value?.items || [];
        // Cập nhật kết quả tìm kiếm mới
        setSearchResults(schedules);

        if (Array.isArray(schedules)) {
          await checkAllSchedulesFollowUpStatus(schedules);
        }
      }
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
      setErrorResponse({
        type: "500",
        title: t("serverError"),
        status: 500,
        detail: t("unexpectedError"),
        errors: null,
      });
      // Đặt kết quả tìm kiếm về mảng rỗng khi có lỗi
      setSearchResults([]);
      toast.error(t("serverError") + ": " + t("unexpectedError"));
    }
  };

  // Follow-up status functions
  const checkFollowUpStatus = async (schedule: CustomerSchedule) => {
    if (schedule.status.toLowerCase() !== "completed") {
      return {
        ...schedule,
        needsFollowUp: false,
        isCheckingFollowUp: false,
        checkCompleted: false,
        followUpStatus: null,
      };
    }

    try {
      setSchedulesWithFollowUpStatus((prev) =>
        prev.map((s) =>
          s.id === schedule.id
            ? { ...s, isCheckingFollowUp: true, checkCompleted: false }
            : s
        )
      );

      const result = await getNextScheduleAvailability(schedule.id).unwrap();
      console.log(`Follow-up check result for ${schedule.id}:`, result);

      const needsFollowUp =
        result.isSuccess && result.value === "Need to schedule for next step";
      const followUpStatus = result.isSuccess ? result.value : null;

      setSchedulesWithFollowUpStatus((prev) =>
        prev.map((s) =>
          s.id === schedule.id
            ? {
                ...s,
                needsFollowUp,
                isCheckingFollowUp: false,
                checkCompleted: true,
                followUpStatus,
              }
            : s
        )
      );

      return {
        ...schedule,
        needsFollowUp,
        isCheckingFollowUp: false,
        checkCompleted: true,
        followUpStatus,
      };
    } catch (error) {
      console.error(
        `Failed to check follow-up status for schedule ${schedule.id}:`,
        error
      );

      setSchedulesWithFollowUpStatus((prev) =>
        prev.map((s) =>
          s.id === schedule.id
            ? {
                ...s,
                needsFollowUp: false,
                isCheckingFollowUp: false,
                checkCompleted: true,
                followUpStatus: null,
              }
            : s
        )
      );

      return {
        ...schedule,
        needsFollowUp: false,
        isCheckingFollowUp: false,
        checkCompleted: true,
        followUpStatus: null,
      };
    }
  };

  const checkAllSchedulesFollowUpStatus = async (
    schedules: CustomerSchedule[]
  ) => {
    console.log(`Checking follow-up status for ${schedules.length} schedules`);

    const initialSchedulesWithStatus = schedules.map((schedule) => ({
      ...schedule,
      isCheckingFollowUp: true,
      needsFollowUp: false,
      checkCompleted: false,
      followUpStatus: null,
    }));

    setSchedulesWithFollowUpStatus(initialSchedulesWithStatus);
    setSchedulesNeedingFollowUp([]);

    const completedSchedules = schedules.filter(
      (schedule) => schedule.status.toLowerCase() === "completed"
    );
    console.log(
      `Found ${completedSchedules.length} completed schedules to check`
    );

    if (completedSchedules.length === 0) {
      setSchedulesWithFollowUpStatus(
        schedules.map((schedule) => ({
          ...schedule,
          isCheckingFollowUp: false,
          needsFollowUp: false,
          checkCompleted: false,
          followUpStatus: null,
        }))
      );
      return;
    }

    const needFollowUp: CustomerSchedule[] = [];

    for (let i = 0; i < completedSchedules.length; i++) {
      const schedule = completedSchedules[i];
      console.log(
        `Checking schedule ${i + 1}/${completedSchedules.length}: ${
          schedule.id
        }`
      );

      try {
        setSchedulesWithFollowUpStatus((prev) =>
          prev.map((s) =>
            s.id === schedule.id
              ? { ...s, isCheckingFollowUp: true, checkCompleted: false }
              : s
          )
        );

        const result = await getNextScheduleAvailability(schedule.id).unwrap();
        console.log(`Result for schedule ${schedule.id}:`, result);

        const needsFollowUp =
          result.isSuccess && result.value === "Need to schedule for next step";
        const followUpStatus = result.isSuccess ? result.value : null;

        if (needsFollowUp) {
          console.log(`Schedule ${schedule.id} needs follow-up`);
          needFollowUp.push(schedule);
        }

        setSchedulesWithFollowUpStatus((prev) =>
          prev.map((s) =>
            s.id === schedule.id
              ? {
                  ...s,
                  needsFollowUp,
                  isCheckingFollowUp: false,
                  checkCompleted: true,
                  followUpStatus,
                }
              : s
          )
        );
      } catch (error) {
        console.error(
          `Failed to check follow-up status for schedule ${schedule.id}:`,
          error
        );

        setSchedulesWithFollowUpStatus((prev) =>
          prev.map((s) =>
            s.id === schedule.id
              ? {
                  ...s,
                  needsFollowUp: false,
                  isCheckingFollowUp: false,
                  checkCompleted: true,
                  followUpStatus: null,
                }
              : s
          )
        );
      }
    }

    console.log(`Found ${needFollowUp.length} schedules needing follow-up`);
    setSchedulesNeedingFollowUp(needFollowUp);

    if (needFollowUp.length > 0) {
      setScheduleNeedingFollowUp(needFollowUp[0]);
    } else {
      setScheduleNeedingFollowUp(null);
    }
  };

  // Event handlers
  const handleRefresh = () => {
    if (searchPerformed && (customerName || customerPhone)) {
      getCustomerSchedules({
        customerName: customerName || "",
        customerPhone: customerPhone || "",
      });
    } else {
      fetchClinicSchedules();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      searchSchedules();
    }
  };

  const handleDateRangeChange = async () => {
    if (!fromDate && !toDate) {
      toast.error(t("selectAtLeastOneDate"));
      return;
    }

    setCurrentPage(1);
    setSearchPerformed(false);

    const result = await fetchClinicSchedulesWithTab(activeTab);

    if (result?.data?.value?.items) {
      await checkAllSchedulesFollowUpStatus(result.data.value.items);
    }
  };

  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);

    setSearchPerformed(false);
    setCustomerName("");
    setCustomerPhone("");
    setFromDate(undefined);
    setToDate(undefined);
    setActiveTab(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    // If we're in search mode, don't include pagination parameters
    if (searchPerformed) {
      getCustomerSchedules({
        customerName,
        customerPhone,
      });
    }
  };

  const handleViewSchedule = (schedule: CustomerSchedule) => {
    setSelectedSchedule(schedule);
    setIsDetailsModalOpen(true);
  };

  const handleCheckout = (schedule: CustomerSchedule) => {
    setSelectedSchedule(schedule);
    setIsPaymentModalOpen(true);
  };

  const handleReschedule = (schedule: CustomerSchedule) => {
    setScheduleToReschedule(schedule);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSuccess = () => {
    if (searchPerformed) {
      delayedGetCustomerSchedules({
        customerName,
        customerPhone,
      });
    } else {
      fetchClinicSchedules();
    }
    // toast.success(t("rescheduleSuccess"));
  };

  const handleCheckIn = async (schedule: CustomerSchedule) => {
    const now = new Date();
    const [hours, minutes] = schedule.startTime.split(":").map(Number);
    const scheduledTime = new Date(now);
    scheduledTime.setHours(hours, minutes, 0, 0);

    const diffMs = scheduledTime.getTime() - now.getTime();
    const diffMinutes = Math.ceil(diffMs / (1000 * 60));

    if (diffMinutes > 5) {
      setEarlyCheckInSchedule(schedule);
      setMinutesEarly(diffMinutes);
      setIsEarlyCheckInModalOpen(true);
      return;
    }

    try {
      await updateScheduleStatus({
        scheduleId: schedule.id,
        status: "In Progress",
      }).unwrap();

      toast.success(t("checkedInSuccessfully"));

      if (searchPerformed) {
        delayedGetCustomerSchedules({
          customerName,
          customerPhone,
        });
      } else {
        fetchClinicSchedules();
      }
    } catch (error) {
      console.error("Failed to check in:", error);
      toast.error(t("failedToCheckIn"));
    }
  };

  const handleConfirmEarlyCheckIn = async () => {
    if (!earlyCheckInSchedule) return;

    try {
      await updateScheduleStatus({
        scheduleId: earlyCheckInSchedule.id,
        status: "In Progress",
      }).unwrap();

      toast.success(t("checkedInSuccessfully"));

      if (searchPerformed) {
        delayedGetCustomerSchedules({
          customerName,
          customerPhone,
        });
      } else {
        fetchClinicSchedules();
      }
    } catch (error) {
      console.error("Failed to check in:", error);
      toast.error(t("failedToCheckIn"));
    }
  };

  const handleScheduleFollowUp = (schedule: CustomerSchedule) => {
    setSelectedSchedule(schedule);
    setIsFollowUpModalOpen(true);
  };

  const handleNotificationClick = () => {
    if (schedulesNeedingFollowUp.length > 1) {
      setIsFollowUpSelectionModalOpen(true);
    } else if (scheduleNeedingFollowUp) {
      handleScheduleFollowUp(scheduleNeedingFollowUp);
    }
  };

  const handleViewNextAppointment = async (schedule: CustomerSchedule) => {
    try {
      // Call the API with isNextSchedule = true
      const result = await getScheduleById({
        id: schedule.id,
        isNextSchedule: true,
      }).unwrap();

      if (result.isSuccess && result.value) {
        const nextScheduleId = result.value.id;

        // Use the ID as searchTerm parameter
        const searchResult = await getCustomerSchedules({
          customerName: " ",
          customerPhone: " ",
          searchTerm: nextScheduleId,
        });

        if (
          searchResult.data?.value?.items &&
          searchResult.data.value.items.length > 0
        ) {
          // Set search performed to true to display the search results
          setSearchPerformed(true);
          // Cập nhật searchResults với kết quả tìm kiếm mới
          setSearchResults(searchResult.data.value.items);
          toast.success(t("nextAppointmentFound"));

          // Kiểm tra trạng thái follow-up cho lịch hẹn tiếp theo
          const nextSchedule = searchResult.data.value.items[0];
          if (nextSchedule) {
            // Kiểm tra trạng thái follow-up cho lịch hẹn tiếp theo
            const nextScheduleStatus = await getNextScheduleAvailability(
              nextSchedule.id
            ).unwrap();
            console.log(
              `Follow-up check result for next schedule ${nextSchedule.id}:`,
              nextScheduleStatus
            );

            // Cập nhật trạng thái follow-up cho lịch hẹn tiếp theo
            const needsFollowUp =
              nextScheduleStatus.isSuccess &&
              nextScheduleStatus.value === "Need to schedule for next step";
            const followUpStatus = nextScheduleStatus.isSuccess
              ? nextScheduleStatus.value
              : null;

            setSchedulesWithFollowUpStatus((prev) => [
              ...prev.filter((s) => s.id !== nextSchedule.id),
              {
                ...nextSchedule,
                needsFollowUp,
                isCheckingFollowUp: false,
                checkCompleted: true,
                followUpStatus,
              },
            ]);
          }

          // Highlight the row with the next schedule
          setTimeout(() => {
            const element = document.getElementById(
              `schedule-row-${nextScheduleId}`
            );
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
              element.classList.add("bg-blue-50", "dark:bg-blue-900/20");
              setTimeout(() => {
                element.classList.remove("bg-blue-50", "dark:bg-blue-900/20");
              }, 3000);
            }
          }, 500);
        } else {
          toast.warning(t("nextAppointmentNotFound"));
        }
      } else {
        toast.error(t("failedToFindNextAppointment"));
      }
    } catch (error) {
      console.error("Failed to get next appointment:", error);
      toast.error(t("errorFetchingNextAppointment"));
    }
  };

  // Sửa hàm clearSearch để xóa kết quả tìm kiếm
  const clearSearch = () => {
    setCustomerName("");
    setCustomerPhone("");
    setSearchPerformed(false);
    setErrorResponse(null);
    setSearchResults([]);
    setCurrentPage(1);
    fetchClinicSchedulesWithTab(activeTab);
  };

  // Sửa hàm handleSort để giữ nguyên searchTerm="" khi đang ở tab "all" và chưa chọn ngày
  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    if (searchPerformed) {
      // Nếu đang trong chế độ tìm kiếm, không cần thay đổi gì
    } else {
      // Sử dụng khoảng thời gian hiện tại, không tạo mới
      let currentSearchTerm = "";

      if (fromDate && toDate) {
        currentSearchTerm = `${formatDateForApi(
          fromDate
        )} to ${formatDateForApi(toDate)}`;
      } else if (activeTab !== "all") {
        // Nếu không có fromDate và toDate, nhưng đang ở tab khác "all"
        const today = new Date();

        if (activeTab === "upcoming") {
          const futureDate = addDays(today, 180);
          currentSearchTerm = `${formatDateForApi(today)} to ${formatDateForApi(
            futureDate
          )}`;
        } else if (activeTab === "past") {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          const sixMonthsAgo = new Date(today);
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

          currentSearchTerm = `${formatDateForApi(
            sixMonthsAgo
          )} to ${formatDateForApi(yesterday)}`;
        }
      }

      delayedGetClinicSchedules({
        pageIndex: currentPage,
        pageSize,
        searchTerm: currentSearchTerm,
        sortColumn: "bookingDate",
        sortOrder: newSortOrder,
      });
    }
  };

  // Effects
  useEffect(() => {
    if (searchPerformed) {
      // Only fetch customer schedules if search was performed
      getCustomerSchedules({
        customerName,
        customerPhone,
      });
    } else {
      // Only fetch clinic schedules if no search was performed
      fetchClinicSchedulesWithTab(activeTab);
    }
  }, [currentPage, activeTab, customerName, customerPhone, searchPerformed]);

  useEffect(() => {
    setActiveTab("all");
  }, []);

  const handleConfirmCancel = async () => {
    if (!scheduleToCancel) return;

    try {
      await cancelSchedule({
        customerScheduleId: scheduleToCancel.id,
      }).unwrap();
      toast.success(t("scheduleCancelledSuccessfully"));
      setIsCancelDialogOpen(false);

      if (searchPerformed) {
        delayedGetCustomerSchedules({
          customerName,
          customerPhone,
        });
      } else {
        fetchClinicSchedules();
      }
    } catch (error) {
      console.error("Failed to cancel schedule:", error);
      toast.error(t("failedToCancelSchedule"));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("customerSchedules")}</h1>

      {scheduleNeedingFollowUp && (
        <NextScheduleNotification
          customerName={scheduleNeedingFollowUp.customerName}
          schedulesCount={schedulesNeedingFollowUp.length}
          onScheduleFollowUp={handleNotificationClick}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>{t("allSchedules")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Filter and Search Section */}
          <div className="px-6 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col gap-4">
              {/* Top row with filter and date range */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="w-full md:w-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 dark:from-pink-600 dark:to-purple-600 dark:hover:from-pink-700 dark:hover:to-purple-700 text-white w-full md:w-auto shadow-sm"
                      >
                        <Filter className="h-4 w-4" />
                        <span className="font-medium">
                          {activeTab === "all"
                            ? t("all")
                            : activeTab === "upcoming"
                            ? t("upcoming")
                            : activeTab === "past"
                            ? t("past")
                            : t("all")}
                        </span>
                        <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                      <DropdownMenuItem
                        onClick={() => handleTabChange("all")}
                        className={
                          activeTab === "all"
                            ? "bg-gray-100 dark:bg-gray-800 font-medium"
                            : ""
                        }
                      >
                        {activeTab === "all" && (
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                        )}
                        {t("all")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleTabChange("upcoming")}
                        className={
                          activeTab === "upcoming"
                            ? "bg-gray-100 dark:bg-gray-800 font-medium"
                            : ""
                        }
                      >
                        {activeTab === "upcoming" && (
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                        )}
                        {t("upcoming")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleTabChange("past")}
                        className={
                          activeTab === "past"
                            ? "bg-gray-100 dark:bg-gray-800 font-medium"
                            : ""
                        }
                      >
                        {activeTab === "past" && (
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                        )}
                        {t("past")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-1 flex-col md:flex-row items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="from"
                        variant={"outline"}
                        className={cn(
                          "w-full md:w-[150px] justify-start text-left font-normal border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
                          !fromDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {fromDate ? (
                          format(fromDate, "MMM d, yyyy")
                        ) : (
                          <span>{t("fromDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <ArrowRight className="hidden md:block h-4 w-4 text-muted-foreground" />

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="to"
                        variant={"outline"}
                        className={cn(
                          "w-full md:w-[150px] justify-start text-left font-normal border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
                          !toDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {toDate ? (
                          format(toDate, "MMM d, yyyy")
                        ) : (
                          <span>{t("toDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                        disabled={(date) =>
                          fromDate ? date < fromDate : false
                        }
                      />
                    </PopoverContent>
                  </Popover>

                  <Button
                    onClick={handleDateRangeChange}
                    disabled={isLoadingClinic || (!fromDate && !toDate)}
                    className="w-full md:w-auto bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 dark:from-red-600 dark:to-red-800 dark:hover:from-red-700 dark:hover:to-red-900 text-white font-medium shadow-sm"
                  >
                    {isLoadingClinic ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t("apply")
                    )}
                  </Button>
                </div>
              </div>
              {/* Bottom row with customer search */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="customerName" className="text-sm font-medium">
                    {t("customerName")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="customerName"
                      placeholder={t("enterCustomerName")}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="customerPhone"
                    className="text-sm font-medium"
                  >
                    {t("customerPhone")}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="customerPhone"
                      placeholder={t("enterCustomerPhone")}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                    />
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    onClick={() => {
                      setCurrentPage(1);
                      searchSchedules();
                    }}
                    disabled={isLoadingCustomer || isCheckingNextSchedule}
                    className="gap-2 h-10 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 dark:from-pink-600 dark:to-purple-600 dark:hover:from-pink-700 dark:hover:to-purple-700 w-full md:w-auto px-6 font-medium"
                  >
                    {isLoadingCustomer || isCheckingNextSchedule ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {t("search")}
                  </Button>

                  {searchPerformed && (
                    <Button
                      onClick={clearSearch}
                      variant="outline"
                      className="h-10 border-gray-300 dark:border-gray-600"
                    >
                      {t("clear")}
                    </Button>
                  )}
                </div>
              </div>
              {/* Filter description */}
              <div className="text-sm text-muted-foreground">
                {searchPerformed ? (
                  hasServerError ? (
                    <p className="text-red-600 dark:text-red-400">
                      {t("searchError") || "Đã xảy ra lỗi khi tìm kiếm"}
                    </p>
                  ) : errorResponse ? (
                    <p className="text-amber-600 dark:text-amber-400">
                      {t("noSchedulesFound")} {customerName || customerPhone}
                    </p>
                  ) : searchResults.length > 0 ? (
                    <p className="text-purple-600 dark:text-purple-400">
                      {t("found")} {searchTotalCount} {t("scheduleFor")}
                    </p>
                  ) : (
                    <p className="text-amber-600 dark:text-amber-400">
                      {t("noSchedulesFound")} {customerName || customerPhone}
                    </p>
                  )
                ) : activeTab === "all" ? (
                  <p>
                    {t("showingAllAppointments")}{" "}
                    {fromDate && toDate
                      ? `${t("from")} ${format(fromDate, "MMM d, yyyy")} ${t(
                          "to"
                        )} ${format(toDate, "MMM d, yyyy")}`
                      : ""}
                  </p>
                ) : activeTab === "upcoming" ? (
                  <p>
                    {t("showingUpcomingAppointments")}{" "}
                    {fromDate && toDate
                      ? `${t("from")} ${format(fromDate, "MMM d, yyyy")} ${t(
                          "to"
                        )} ${format(toDate, "MMM d, yyyy")}`
                      : t("forTheNext180Days")}{" "}
                  </p>
                ) : (
                  <p>
                    {t("showingPastAppointments")}{" "}
                    {fromDate && toDate
                      ? `${t("from")} ${format(fromDate, "MMM d, yyyy")} ${t(
                          "to"
                        )} ${format(toDate, "MMM d, yyyy")}`
                      : t("fromTheLast180Days")}{" "}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="mt-0">
            {clinicErrorMessage ? (
              <Alert variant="destructive" className="mx-6 my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("error")}</AlertTitle>
                <AlertDescription>{clinicErrorMessage}</AlertDescription>
              </Alert>
            ) : isLoadingClinic || isLoadingCustomer ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500 dark:text-pink-400" />
              </div>
            ) : errorResponse && searchPerformed ? (
              <Alert variant="destructive" className="mx-6 my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{errorResponse.title}</AlertTitle>
                <AlertDescription>{errorResponse.detail}</AlertDescription>
              </Alert>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">
                        {t("customer")}
                      </TableHead>
                      <TableHead className="text-center">
                        {t("customerPhone")}
                      </TableHead>
                      <TableHead className="text-center">
                        {t("service")}
                      </TableHead>
                      <TableHead className="text-center">
                        {t("doctor")}
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={handleSort}
                          className="flex items-center justify-center"
                        >
                          {t("dateAndTime")}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        {t("status")}
                      </TableHead>
                      <TableHead className="text-center">
                        {t("actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchPerformed && hasServerError ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-red-600 dark:text-red-400"
                        >
                          {t("serverErrorMessage") ||
                            "Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau."}
                        </TableCell>
                      </TableRow>
                    ) : searchPerformed && errorResponse ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground dark:text-gray-400"
                        >
                          {t("noSchedulesFoundForCustomer")}{" "}
                          {customerName || customerPhone}
                        </TableCell>
                      </TableRow>
                    ) : searchPerformed &&
                      !hasServerError &&
                      searchResults.length > 0 ? (
                      searchResults.map((schedule: CustomerSchedule) => {
                        const scheduleWithStatus =
                          getScheduleWithStatus(schedule);
                        return (
                          <TableRow
                            key={schedule.id}
                            id={`schedule-row-${schedule.id}`}
                          >
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarFallback>
                                    {schedule.customerName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate max-w-[150px]">
                                  {schedule.customerName}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {schedule.customerPhoneNumber}
                            </TableCell>
                            <TableCell className="text-center max-w-[150px]">
                              <div className="truncate">
                                {schedule.serviceName}
                              </div>
                            </TableCell>
                            <TableCell className="text-center max-w-[150px]">
                              <div className="truncate">
                                {schedule.doctorName}
                              </div>
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                              <div className="font-bold">
                                {schedule.bookingDate}
                              </div>
                              <div className="flex items-center justify-center text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                {formatTimeRange(
                                  schedule.startTime,
                                  schedule.endTime
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {getStatusBadge(schedule.status)}
                            </TableCell>
                            <TableCell>
                              <div className="grid grid-cols-[1fr_auto_1fr] items-center min-w-[220px] gap-2">
                                <div className="flex justify-end gap-2 items-center">
                                  {schedule.status.toLowerCase() ===
                                    "completed" &&
                                    renderCompletedScheduleButton(
                                      schedule,
                                      scheduleWithStatus
                                    )}

                                  {schedule.status === "In Progress" && (
                                    <>
                                      {schedule.isFirstCheckIn ? (
                                        <Button
                                          variant="default"
                                          size="sm"
                                          className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white justify-center"
                                          onClick={() =>
                                            handleCheckout(schedule)
                                          }
                                        >
                                          <CreditCard className="h-4 w-4 mr-1" />
                                          {t("checkout")}
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="default"
                                          size="sm"
                                          className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white justify-center"
                                          onClick={() => {
                                            updateScheduleStatus({
                                              scheduleId: schedule.id,
                                              status: "Completed",
                                            })
                                              .unwrap()
                                              .then(() => {
                                                toast.success(
                                                  t(
                                                    "appointmentCompletedSuccessfully"
                                                  )
                                                );
                                                if (searchPerformed) {
                                                  delayedGetCustomerSchedules({
                                                    customerName,
                                                    customerPhone,
                                                  });
                                                } else {
                                                  fetchClinicSchedules();
                                                }
                                              })
                                              .catch((error) => {
                                                console.error(
                                                  "Failed to complete appointment:",
                                                  error
                                                );
                                                toast.error(
                                                  t(
                                                    "failedToCompleteAppointment"
                                                  )
                                                );
                                              });
                                          }}
                                        >
                                          <CheckCircle2 className="h-4 w-4 mr-1" />
                                          {t("complete")}
                                        </Button>
                                      )}
                                    </>
                                  )}

                                  {schedule.status === "Uncompleted" &&
                                    (() => {
                                      const bookingDate = new Date(
                                        schedule.bookingDate
                                      );
                                      const today = new Date();
                                      bookingDate.setHours(0, 0, 0, 0);
                                      today.setHours(0, 0, 0, 0);
                                      return bookingDate.getTime() ===
                                        today.getTime() ? (
                                        <Button
                                          variant="default"
                                          size="sm"
                                          className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white justify-center"
                                          onClick={() =>
                                            handleCheckout(schedule)
                                          }
                                        >
                                          <CreditCard className="h-4 w-4 mr-1" />
                                          {t("reCheckout")}
                                        </Button>
                                      ) : null;
                                    })()}

                                  {shouldShowCheckInButton(schedule) && (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white justify-center"
                                      onClick={() => handleCheckIn(schedule)}
                                      disabled={isUpdatingStatus}
                                    >
                                      {isUpdatingStatus ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        t("checkIn")
                                      )}
                                    </Button>
                                  )}
                                </div>

                                <div className="flex justify-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-[100px] justify-center"
                                    onClick={() => handleViewSchedule(schedule)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    {t("view")}
                                  </Button>
                                </div>

                                <div className="flex justify-start">
                                  {shouldShowDropdownMenu(
                                    scheduleWithStatus
                                  ) ? (
                                    <DropdownMenu
                                      open={openDropdownId === schedule.id}
                                      onOpenChange={(open) => {
                                        setOpenDropdownId(
                                          open ? schedule.id : null
                                        );
                                      }}
                                    >
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-[32px] w-[40px] flex-shrink-0"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        {schedule.status.toLowerCase() ===
                                          "completed" && (
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setOpenDropdownId(null);
                                              handleScheduleFollowUp(schedule);
                                            }}
                                          >
                                            {t("scheduleFollowUp")}
                                          </DropdownMenuItem>
                                        )}

                                        {schedule.status.toLowerCase() ===
                                          "pending" && (
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setOpenDropdownId(null);
                                              handleReschedule(schedule);
                                            }}
                                          >
                                            {t("reschedule")}
                                          </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        {schedule.status.toLowerCase() ===
                                          "pending" && (
                                          <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => {
                                              setOpenDropdownId(null);
                                              setScheduleToCancel(schedule);
                                              setIsCancelDialogOpen(true);
                                            }}
                                          >
                                            {t("cancel")}
                                          </DropdownMenuItem>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  ) : (
                                    <div className="w-[40px]"></div> // Empty div with width to maintain layout
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : clinicSchedules.length > 0 ? (
                      clinicSchedules.map((schedule) => {
                        const scheduleWithStatus =
                          getScheduleWithStatus(schedule);
                        return (
                          <TableRow
                            key={schedule.id}
                            id={`schedule-row-${schedule.id}`}
                          >
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarFallback>
                                    {schedule.customerName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate max-w-[150px]">
                                  {schedule.customerName}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {schedule.customerPhoneNumber}
                            </TableCell>
                            <TableCell className="text-center max-w-[150px]">
                              <div className="truncate">
                                {schedule.serviceName}
                              </div>
                            </TableCell>
                            <TableCell className="text-center max-w-[150px]">
                              <div className="truncate">
                                {schedule.doctorName}
                              </div>
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                              <div className="font-bold">
                                {schedule.bookingDate}
                              </div>
                              <div className="flex items-center justify-center text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                {formatTimeRange(
                                  schedule.startTime,
                                  schedule.endTime
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {getStatusBadge(schedule.status)}
                            </TableCell>
                            <TableCell>
                              <div className="grid grid-cols-[1fr_auto_1fr] items-center min-w-[220px] gap-2">
                                <div className="flex justify-end gap-2 items-center">
                                  {schedule.status.toLowerCase() ===
                                    "completed" &&
                                    renderCompletedScheduleButton(
                                      schedule,
                                      scheduleWithStatus
                                    )}

                                  {schedule.status === "In Progress" && (
                                    <>
                                      {schedule.isFirstCheckIn ? (
                                        <Button
                                          variant="default"
                                          size="sm"
                                          className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white justify-center"
                                          onClick={() =>
                                            handleCheckout(schedule)
                                          }
                                        >
                                          <CreditCard className="h-4 w-4 mr-1" />
                                          {t("checkout")}
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="default"
                                          size="sm"
                                          className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white justify-center"
                                          onClick={() => {
                                            updateScheduleStatus({
                                              scheduleId: schedule.id,
                                              status: "Completed",
                                            })
                                              .unwrap()
                                              .then(() => {
                                                toast.success(
                                                  t(
                                                    "appointmentCompletedSuccessfully"
                                                  )
                                                );
                                                fetchClinicSchedules();
                                              })
                                              .catch((error) => {
                                                console.error(
                                                  "Failed to complete appointment:",
                                                  error
                                                );
                                                toast.error(
                                                  t(
                                                    "failedToCompleteAppointment"
                                                  )
                                                );
                                              });
                                          }}
                                        >
                                          <CheckCircle2 className="h-4 w-4 mr-1" />
                                          {t("complete")}
                                        </Button>
                                      )}
                                    </>
                                  )}

                                  {schedule.status === "Uncompleted" &&
                                    (() => {
                                      const bookingDate = new Date(
                                        schedule.bookingDate
                                      );
                                      const today = new Date();
                                      bookingDate.setHours(0, 0, 0, 0);
                                      today.setHours(0, 0, 0, 0);
                                      return bookingDate.getTime() ===
                                        today.getTime() ? (
                                        <Button
                                          variant="default"
                                          size="sm"
                                          className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white justify-center"
                                          onClick={() =>
                                            handleCheckout(schedule)
                                          }
                                        >
                                          <CreditCard className="h-4 w-4 mr-1" />
                                          {t("reCheckout")}
                                        </Button>
                                      ) : null;
                                    })()}

                                  {shouldShowCheckInButton(schedule) && (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white justify-center"
                                      onClick={() => handleCheckIn(schedule)}
                                      disabled={isUpdatingStatus}
                                    >
                                      {isUpdatingStatus ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        t("checkIn")
                                      )}
                                    </Button>
                                  )}
                                </div>

                                <div className="flex justify-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-[100px] justify-center"
                                    onClick={() => handleViewSchedule(schedule)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    {t("view")}
                                  </Button>
                                </div>

                                <div className="flex justify-start">
                                  {shouldShowDropdownMenu(
                                    scheduleWithStatus
                                  ) ? (
                                    <DropdownMenu
                                      open={openDropdownId === schedule.id}
                                      onOpenChange={(open) => {
                                        setOpenDropdownId(
                                          open ? schedule.id : null
                                        );
                                      }}
                                    >
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-[32px] w-[40px] flex-shrink-0"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        {schedule.status.toLowerCase() ===
                                          "completed" && (
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setOpenDropdownId(null);
                                              handleScheduleFollowUp(schedule);
                                            }}
                                          >
                                            {t("scheduleFollowUp")}
                                          </DropdownMenuItem>
                                        )}

                                        {schedule.status.toLowerCase() ===
                                          "pending" && (
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setOpenDropdownId(null);
                                              handleReschedule(schedule);
                                            }}
                                          >
                                            {t("reschedule")}
                                          </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        {schedule.status.toLowerCase() ===
                                          "pending" && (
                                          <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => {
                                              setOpenDropdownId(null);
                                              setScheduleToCancel(schedule);
                                              setIsCancelDialogOpen(true);
                                            }}
                                          >
                                            {t("cancel")}
                                          </DropdownMenuItem>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  ) : (
                                    <div className="w-[40px]"></div> // Empty div with width to maintain layout
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground dark:text-gray-400"
                        >
                          {searchPerformed
                            ? t("noSchedulesFoundForCustomer")
                            : activeTab === "upcoming"
                            ? t("noUpcomingSchedulesFound")
                            : t("noPastSchedulesFound")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="py-4 border-t dark:border-gray-700">
                  <Pagination
                    pageIndex={currentPage}
                    pageSize={pageSize}
                    totalCount={searchPerformed ? searchTotalCount : totalCount}
                    hasNextPage={
                      searchPerformed
                        ? currentPage < searchTotalPages
                        : currentPage < totalPages
                    }
                    hasPreviousPage={currentPage > 1}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ScheduleDetailsModal
        schedule={selectedSchedule}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onCheckout={() => {
          setIsDetailsModalOpen(false);
          setIsPaymentModalOpen(true);
        }}
        disableCheckout={selectedSchedule?.status.toLowerCase() === "pending"}
      />

      <SchedulePaymentModal
        schedule={selectedSchedule}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => handleRefresh()}
      />

      <ScheduleFollowUpModal
        schedule={selectedSchedule}
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        onSuccess={() => {
          if (
            selectedSchedule &&
            scheduleNeedingFollowUp &&
            selectedSchedule.id === scheduleNeedingFollowUp.id
          ) {
            setScheduleNeedingFollowUp(null);
          }
          if (searchPerformed) {
            delayedGetCustomerSchedules({
              customerName,
              customerPhone,
            });
          } else {
            fetchClinicSchedules();
          }
        }}
      />

      <FollowUpSelectionModal
        isOpen={isFollowUpSelectionModalOpen}
        onClose={() => setIsFollowUpSelectionModalOpen(false)}
        schedules={schedulesNeedingFollowUp}
        onScheduleSelected={(schedule) => {
          setIsFollowUpSelectionModalOpen(false);
          handleScheduleFollowUp(schedule);
        }}
      />

      <EarlyCheckInModal
        isOpen={isEarlyCheckInModalOpen}
        onClose={() => setIsEarlyCheckInModalOpen(false)}
        onConfirm={handleConfirmEarlyCheckIn}
        minutesEarly={minutesEarly}
        scheduledTime={earlyCheckInSchedule?.startTime || ""}
      />

      <ScheduleChangeForCustomerModal
        schedule={scheduleToReschedule}
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setOpenDropdownId(null);
        }}
        onSuccess={() => {
          handleRescheduleSuccess();
          setOpenDropdownId(null);
        }}
      />
      <ConfirmationDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        title={t("cancel")}
        message={
          scheduleToCancel
            ? `${t("onlyPendingAppointmentsCanBeCancelled")}. ${t(
                "appointmentFor"
              )} ${scheduleToCancel.customerName}?`
            : t("onlyPendingAppointmentsCanBeCancelled")
        }
        confirmButtonText={t("cancel")}
        cancelButtonText={t("goBack")}
        isLoading={isCancellingSchedule}
        type="warning"
      />
    </div>
  );
}
