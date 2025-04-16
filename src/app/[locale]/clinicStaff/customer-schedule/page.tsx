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
  Plus,
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

// Import the follow-up selection modal
import FollowUpSelectionModal from "@/components/clinicStaff/customer-schedule/follow-up-selection-modal";

// Add the import for EarlyCheckInModal at the top with the other imports
import EarlyCheckInModal from "@/components/clinicStaff/customer-schedule/early-check-in-modal";

// Import the ScheduleChangeForCustomerModal component
import ScheduleChangeForCustomerModal from "@/components/clinicStaff/customer-schedule/schedule-change-for-customer";

// Define error response type
interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors: any | null;
}

// Define the schedule status with follow-up info
interface ScheduleWithFollowUpStatus extends CustomerSchedule {
  needsFollowUp?: boolean;
  isCheckingFollowUp?: boolean;
  checkCompleted?: boolean; // New flag to track if check has been completed
  followUpStatus?: string | null; // New property to store the actual response value
}

// Function to get the default date range based on the current date
const getDefaultDateRange = () => {
  const today = new Date();
  const futureDate = addDays(today, 90);
  return {
    from: today,
    to: futureDate,
  };
};

export default function SchedulesPage() {
  const t = useTranslations("customerSchedule");

  // Customer search states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(
    null
  );

  // Date range states
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  // Modal states
  const [selectedSchedule, setSelectedSchedule] =
    useState<CustomerSchedule | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  // Add a new state for the follow-up selection modal
  const [isFollowUpSelectionModalOpen, setIsFollowUpSelectionModalOpen] =
    useState(false);
  const [schedulesNeedingFollowUp, setSchedulesNeedingFollowUp] = useState<
    CustomerSchedule[]
  >([]);

  const [scheduleNeedingFollowUp, setScheduleNeedingFollowUp] =
    useState<CustomerSchedule | null>(null);

  // State to store schedules with follow-up status
  const [schedulesWithFollowUpStatus, setSchedulesWithFollowUpStatus] =
    useState<ScheduleWithFollowUpStatus[]>([]);

  // Add these new state variables inside the SchedulesPage component, after the other state declarations
  const [isEarlyCheckInModalOpen, setIsEarlyCheckInModalOpen] = useState(false);
  const [earlyCheckInSchedule, setEarlyCheckInSchedule] =
    useState<CustomerSchedule | null>(null);
  const [minutesEarly, setMinutesEarly] = useState(0);

  // Add state for reschedule modal
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [scheduleToReschedule, setScheduleToReschedule] =
    useState<CustomerSchedule | null>(null);

  // Add a new state to track open dropdown menus
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Using RTK Query hooks
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

  const [getNextScheduleAvailability, { isLoading: isCheckingNextSchedule }] =
    useLazyGetNextScheduleAvailabilityQuery();

  // Create delayed refetch functions
  const delayedGetCustomerSchedules = useDelayedRefetch(getCustomerSchedules);
  const delayedGetClinicSchedules = useDelayedRefetch(getClinicSchedules);

  // Format date for API
  const formatDateForApi = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  // Update the handleRefresh function to include pagination parameters
  const handleRefresh = () => {
    if (searchPerformed && customerName && customerPhone) {
      // If we're in search mode, use the current search parameters
      getCustomerSchedules({
        customerName,
        customerPhone,
        pageIndex: currentPage,
        pageSize,
      });
    } else if (searchPerformed && (customerName || customerPhone)) {
      // If only one search parameter is provided
      getCustomerSchedules({
        customerName: customerName || "",
        customerPhone: customerPhone || "",
        pageIndex: currentPage,
        pageSize,
      });
    } else {
      // If not in search mode, refresh the clinic schedules
      fetchClinicSchedules();
    }
  };

  // Get status badge
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
      case "uncompleted":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
            {t("uncompleted")}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Check follow-up status for a single schedule
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
      // Mark as checking
      setSchedulesWithFollowUpStatus((prev) =>
        prev.map((s) =>
          s.id === schedule.id
            ? { ...s, isCheckingFollowUp: true, checkCompleted: false }
            : s
        )
      );

      // Call the API to check if a follow-up is needed
      const result = await getNextScheduleAvailability(schedule.id).unwrap();
      console.log(`Follow-up check result for ${schedule.id}:`, result);

      // Update the schedule with follow-up status
      const needsFollowUp =
        result.isSuccess && result.value === "Need to schedule for next step";

      // Store the actual response value
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

  // Update the checkAllSchedulesFollowUpStatus function to ensure it checks all completed schedules
  const checkAllSchedulesFollowUpStatus = async (
    schedules: CustomerSchedule[]
  ) => {
    console.log(`Checking follow-up status for ${schedules.length} schedules`);

    // Initialize all schedules with isCheckingFollowUp: true
    const initialSchedulesWithStatus = schedules.map((schedule) => ({
      ...schedule,
      isCheckingFollowUp: true,
      needsFollowUp: false,
      checkCompleted: false,
      followUpStatus: null,
    }));

    setSchedulesWithFollowUpStatus(initialSchedulesWithStatus);

    // Reset the schedules needing follow-up
    setSchedulesNeedingFollowUp([]);

    // Check each completed schedule
    const completedSchedules = schedules.filter(
      (schedule) => schedule.status.toLowerCase() === "completed"
    );
    console.log(
      `Found ${completedSchedules.length} completed schedules to check`
    );

    if (completedSchedules.length === 0) {
      // If no completed schedules, just update the state with initial values
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

    // Collect all schedules that need follow-up
    const needFollowUp: CustomerSchedule[] = [];

    // Process each completed schedule sequentially
    for (let i = 0; i < completedSchedules.length; i++) {
      const schedule = completedSchedules[i];
      console.log(
        `Checking schedule ${i + 1}/${completedSchedules.length}: ${
          schedule.id
        }`
      );

      try {
        // Mark as checking
        setSchedulesWithFollowUpStatus((prev) =>
          prev.map((s) =>
            s.id === schedule.id
              ? { ...s, isCheckingFollowUp: true, checkCompleted: false }
              : s
          )
        );

        // Call the API to check if a follow-up is needed
        const result = await getNextScheduleAvailability(schedule.id).unwrap();
        console.log(`Result for schedule ${schedule.id}:`, result);

        // Update the schedule with follow-up status - check for exact match with "Need to schedule for next step"
        const needsFollowUp =
          result.isSuccess && result.value === "Need to schedule for next step";

        // Store the actual response value
        const followUpStatus = result.isSuccess ? result.value : null;

        if (needsFollowUp) {
          console.log(`Schedule ${schedule.id} needs follow-up`);
          needFollowUp.push(schedule);
        }

        // Update the status in the state
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

        // Update the status in the state to indicate error
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

    // Update the state with all schedules needing follow-up
    setSchedulesNeedingFollowUp(needFollowUp);

    // Set the first one for the notification if there's at least one
    if (needFollowUp.length > 0) {
      setScheduleNeedingFollowUp(needFollowUp[0]);
    } else {
      setScheduleNeedingFollowUp(null);
    }
  };

  // Update the searchSchedules function to include pagination parameters
  const searchSchedules = async () => {
    if (!customerName && !customerPhone) {
      setErrorResponse({
        type: "400",
        title: t("badRequest"),
        status: 400,
        detail: t("pleaseEnterNameOrPhone"),
        errors: null,
      });
      return;
    }

    setErrorResponse(null);

    try {
      // Call the RTK Query hook for customer search with pagination
      const result = await getCustomerSchedules({
        customerName,
        customerPhone,
        pageIndex: currentPage,
        pageSize,
      });

      if ("error" in result) {
        // Handle the error response
        const errorData = result.error as any;
        if (errorData?.data) {
          setErrorResponse(errorData.data as ErrorResponse);
        } else {
          setErrorResponse({
            type: "500",
            title: t("serverError"),
            status: 500,
            detail: t("unexpectedError"),
            errors: null,
          });
        }
      } else if (result.data) {
        // Check follow-up status for all schedules
        const schedules = result.data.value?.items || [];
        if (Array.isArray(schedules)) {
          await checkAllSchedulesFollowUpStatus(schedules);
        }
      }

      setSearchPerformed(true);
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
      setErrorResponse({
        type: "500",
        title: t("serverError"),
        status: 500,
        detail: t("unexpectedError"),
        errors: null,
      });
    }
  };

  // Handle Enter key press for customer search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Reset to first page when performing a new search
      setCurrentPage(1);
      searchSchedules();
    }
  };

  // Create search term for date range
  const createDateRangeSearchTerm = (from?: Date, to?: Date) => {
    if (!from && !to) {
      const defaultRange = getDefaultDateRange();
      from = defaultRange.from;
      to = defaultRange.to;
    } else if (from && !to) {
      to = addDays(from, 30); // Default to 30 days after from date
    } else if (!from && to) {
      from = addDays(to, -30); // Default to 30 days before to date
    }

    return `${formatDateForApi(from)} to ${formatDateForApi(to)}`;
  };

  // Fetch clinic schedules
  const fetchClinicSchedules = async () => {
    // If no custom date range is selected, use the default range based on active tab
    let searchTerm;
    const sortOrder = activeTab === "past" ? "desc" : "asc";

    if (!fromDate && !toDate) {
      const today = new Date();

      if (activeTab === "upcoming") {
        // For upcoming: from today to 3 months in the future
        const futureDate = addDays(today, 90);
        searchTerm = `${formatDateForApi(today)} to ${formatDateForApi(
          futureDate
        )}`;
      } else if (activeTab === "past") {
        // For past: from 3 months ago to yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        searchTerm = `${formatDateForApi(threeMonthsAgo)} to ${formatDateForApi(
          yesterday
        )}`;
      } else {
        // For all: from 3 months ago to 3 months in the future
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const threeMonthsAhead = new Date(today);
        threeMonthsAhead.setMonth(threeMonthsAhead.getMonth() + 3);

        searchTerm = `${formatDateForApi(threeMonthsAgo)} to ${formatDateForApi(
          threeMonthsAhead
        )}`;
      }
    } else {
      searchTerm = createDateRangeSearchTerm(fromDate, toDate);
    }

    try {
      // Always use the same API call with updated pagination parameters
      const result = await delayedGetClinicSchedules({
        pageIndex: currentPage,
        pageSize,
        searchTerm,
        sortColumn: "bookingDate",
        sortOrder,
      });

      // Check if we have valid data and check follow-up status for completed schedules
      if (result.data?.value?.items) {
        await checkAllSchedulesFollowUpStatus(result.data.value.items);
      }

      return result;
    } catch (error) {
      console.error("Failed to fetch clinic schedules:", error);
      return { data: null, error };
    }
  };

  // Handle date range change
  const handleDateRangeChange = async () => {
    // Validate that at least one date is selected
    if (!fromDate && !toDate) {
      toast.error(t("selectAtLeastOneDate"));
      return;
    }

    setCurrentPage(1); // Reset to first page when filters change
    setSearchPerformed(false); // Reset search state when applying date filters

    const result = await fetchClinicSchedulesWithTab(activeTab);

    // Check follow-up status for completed schedules
    if (result?.data?.value?.items) {
      await checkAllSchedulesFollowUpStatus(result.data.value.items);
    }
  };

  // Replace the handleTabChange function with this updated version
  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);

    // Reset search state when changing tabs
    setSearchPerformed(false);
    setCustomerName("");
    setCustomerPhone("");

    // Reset custom date range when changing tabs
    setFromDate(undefined);
    setToDate(undefined);

    // First update the active tab state
    setActiveTab(value);

    // Reset to first page when tab changes - but don't trigger a fetch here
    setCurrentPage(1);

    // We don't need to call fetchClinicSchedulesWithTab here anymore
    // The useEffect with [currentPage, activeTab] dependencies will handle it
  };

  // Add this new function that accepts the tab value as a parameter
  const fetchClinicSchedulesWithTab = async (tabValue: string) => {
    // If no custom date range is selected, use the default range based on active tab
    let searchTerm;
    const sortOrder = tabValue === "past" ? "desc" : "asc";

    if (!fromDate && !toDate) {
      const today = new Date();

      if (tabValue === "upcoming") {
        // For upcoming: from today to 3 months in the future
        const futureDate = addDays(today, 90);
        searchTerm = `${formatDateForApi(today)} to ${formatDateForApi(
          futureDate
        )}`;
      } else if (tabValue === "past") {
        // For past: from 3 months ago to yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        searchTerm = `${formatDateForApi(threeMonthsAgo)} to ${formatDateForApi(
          yesterday
        )}`;
      } else {
        // For all: from 3 months ago to 3 months in the future
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const threeMonthsAhead = new Date(today);
        threeMonthsAhead.setMonth(threeMonthsAhead.getMonth() + 3);

        searchTerm = `${formatDateForApi(threeMonthsAgo)} to ${formatDateForApi(
          threeMonthsAhead
        )}`;
      }
    } else {
      searchTerm = createDateRangeSearchTerm(fromDate, toDate);
    }

    try {
      // Always use the same API call with updated pagination parameters
      const result = await delayedGetClinicSchedules({
        pageIndex: currentPage,
        pageSize,
        searchTerm,
        sortColumn: "bookingDate",
        sortOrder,
      });

      // Check if we have valid data and check follow-up status for completed schedules
      if (result.data?.value?.items) {
        await checkAllSchedulesFollowUpStatus(result.data.value.items);
      }

      return result;
    } catch (error) {
      console.error("Failed to fetch clinic schedules:", error);
      return { data: null, error };
    }
  };

  // Update the handlePageChange function to refetch data with the new page
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    // If we're in search mode, refetch with the new page
    if (searchPerformed) {
      getCustomerSchedules({
        customerName,
        customerPhone,
        pageIndex: newPage,
        pageSize,
      });
    }
    // For clinic schedules, the useEffect will handle the refetch
  };

  // Handle view schedule details
  const handleViewSchedule = (schedule: CustomerSchedule) => {
    setSelectedSchedule(schedule);
    setIsDetailsModalOpen(true);
  };

  // Handle checkout/payment
  const handleCheckout = (schedule: CustomerSchedule) => {
    setSelectedSchedule(schedule);
    setIsPaymentModalOpen(true);
  };

  // Add handler for reschedule
  const handleReschedule = (schedule: CustomerSchedule) => {
    setScheduleToReschedule(schedule);
    setIsRescheduleModalOpen(true);
  };

  // Handle reschedule success
  const handleRescheduleSuccess = () => {
    // Refresh the data based on current view
    if (searchPerformed) {
      delayedGetCustomerSchedules({
        customerName,
        customerPhone,
        pageIndex: currentPage,
        pageSize,
      });
    } else {
      fetchClinicSchedules();
    }
    toast.success(t("rescheduleSuccess"));
  };

  // Update the handleCheckIn function to include pagination parameters
  const handleCheckIn = async (schedule: CustomerSchedule) => {
    // Check if the check-in is early by comparing current time with scheduled time
    const now = new Date();
    const [hours, minutes] = schedule.startTime.split(":").map(Number);
    const scheduledTime = new Date(now);
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Calculate minutes early (if negative, the appointment is in the future)
    const diffMs = scheduledTime.getTime() - now.getTime();
    const diffMinutes = Math.ceil(diffMs / (1000 * 60));

    // If more than 5 minutes early, show the early check-in modal
    if (diffMinutes > 5) {
      setEarlyCheckInSchedule(schedule);
      setMinutesEarly(diffMinutes);
      setIsEarlyCheckInModalOpen(true);
      return;
    }

    // Otherwise proceed with normal check-in
    try {
      await updateScheduleStatus({
        scheduleId: schedule.id,
        status: "In Progress",
      }).unwrap();

      toast.success(t("checkedInSuccessfully"));

      // Refresh the data based on current view
      if (searchPerformed) {
        // If we're in search mode, refresh the search results
        delayedGetCustomerSchedules({
          customerName,
          customerPhone,
          pageIndex: currentPage,
          pageSize,
        });
      } else {
        // Otherwise refresh clinic schedules
        fetchClinicSchedules();
      }
    } catch (error) {
      console.error("Failed to check in:", error);
      toast.error(t("failedToCheckIn"));
    }
  };

  // Update the handleConfirmEarlyCheckIn function to include pagination parameters
  const handleConfirmEarlyCheckIn = async () => {
    if (!earlyCheckInSchedule) return;

    try {
      await updateScheduleStatus({
        scheduleId: earlyCheckInSchedule.id,
        status: "In Progress",
      }).unwrap();

      toast.success(t("checkedInSuccessfully"));

      // Refresh the data based on current view
      if (searchPerformed) {
        // If we're in search mode, refresh the search results
        delayedGetCustomerSchedules({
          customerName,
          customerPhone,
          pageIndex: currentPage,
          pageSize,
        });
      } else {
        // Otherwise refresh clinic schedules
        fetchClinicSchedules();
      }
    } catch (error) {
      console.error("Failed to check in:", error);
      toast.error(t("failedToCheckIn"));
    }
  };

  // Update the shouldShowCheckInButton function to always return true for pending appointments
  // This allows the check-in button to appear regardless of date, and the early check-in logic
  // will handle the warning if needed
  const shouldShowCheckInButton = (schedule: CustomerSchedule) => {
    if (schedule.status.toLowerCase() !== "pending") {
      return false;
    }

    // Parse the booking date (assuming format is YYYY-MM-DD)
    const bookingDate = new Date(schedule.bookingDate);
    const today = new Date();

    // Reset time part for accurate date comparison
    bookingDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Only show check-in button if today is exactly the appointment date
    return bookingDate.getTime() === today.getTime();
  };

  const handleScheduleFollowUp = (schedule: CustomerSchedule) => {
    setSelectedSchedule(schedule);
    setIsFollowUpModalOpen(true);
  };

  // Update the notification click handler to open the selection modal if multiple schedules need follow-up
  const handleNotificationClick = () => {
    if (schedulesNeedingFollowUp.length > 1) {
      setIsFollowUpSelectionModalOpen(true);
    } else if (scheduleNeedingFollowUp) {
      handleScheduleFollowUp(scheduleNeedingFollowUp);
    }
  };

  // Handle view next appointment
  const handleViewNextAppointment = (schedule: CustomerSchedule) => {
    // This would typically navigate to or show the next appointment
    toast.info(`${t("viewingNextAppointment")} ${schedule.customerName}`);
    // You could implement this based on your application's requirements
  };

  // Update the useEffect to refetch data when currentPage or activeTab changes
  useEffect(() => {
    if (searchPerformed) {
      // If we're in search mode, refetch with the current page
      getCustomerSchedules({
        customerName,
        customerPhone,
        pageIndex: currentPage,
        pageSize,
      });
    } else {
      // For normal clinic schedules, apply pagination
      fetchClinicSchedulesWithTab(activeTab);
    }
  }, [currentPage, activeTab]); // Add activeTab as a dependency

  // Initial fetch when component mounts
  useEffect(() => {
    // Set default tab to "all"
    setActiveTab("all");

    // Initial fetch will be handled by the other useEffect that depends on activeTab
  }, []);

  // Update the extract data from responses section to handle server-side pagination
  // Extract data from responses
  const scheduleItems = scheduleResponse?.value?.items || [];
  const searchTotalCount = scheduleResponse?.value?.totalCount || 0;
  const searchTotalPages = Math.ceil(searchTotalCount / pageSize);

  const clinicSchedules = clinicSchedulesResponse?.value?.items || [];
  const totalCount = clinicSchedulesResponse?.value?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Format error message for clinic schedules
  const clinicErrorMessage = clinicError
    ? "error" in clinicError
      ? (clinicError.error as string)
      : t("error")
    : null;

  // Format time range
  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  // Get schedule with follow-up status by ID
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

  // Add a function to clear search
  const clearSearch = () => {
    setCustomerName("");
    setCustomerPhone("");
    setSearchPerformed(false);
    setErrorResponse(null);
    // Reset to first page
    setCurrentPage(1);
    // Refresh the clinic schedules
    fetchClinicSchedulesWithTab(activeTab);
  };

  // Debug function to log schedule data
  const logScheduleData = (schedule: CustomerSchedule) => {
    console.log(`Schedule ID: ${schedule.id}`);
    console.log(`Status: ${schedule.status}`);
    console.log(`isFirstCheckIn: ${schedule.isFirstCheckIn}`);
  };

  // Function to render the appropriate action button for completed schedules
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

    // If check is completed, handle based on the response value
    if (scheduleWithStatus.checkCompleted) {
      // Handle different response values
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
        // Don't show any button
        return null;
      }
    }

    // Only show Checkout button if check is NOT completed yet and it's the first check-in
    // This ensures we don't show Checkout when followUpStatus is "Next Customer Schedule Not Found !"
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

    // Default fallback - don't show any button if we don't have a specific action
    return null;
  };

  // Function to check if dropdown menu should be shown
  const shouldShowDropdownMenu = (
    scheduleWithStatus: ScheduleWithFollowUpStatus
  ) => {
    // Hide dropdown menu if the status is "Already scheduled for next step"
    return !(
      scheduleWithStatus.checkCompleted &&
      scheduleWithStatus.followUpStatus === "Already scheduled for next step"
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("customerSchedules")}</h1>

      {/* Show notification if any schedules need a follow-up */}
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
            <Button className="gap-2 w-full md:w-auto">
              <Plus size={16} />
              {t("newSchedule")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Combined Filter and Search Section */}
          <div className="px-6 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col gap-4">
              {/* Top row with filter and date range */}
              {/* Enhance the filter and date range section for better visual appeal */}
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
                      setCurrentPage(1); // Reset to first page when performing a new search
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

              {/* Error message for customer search */}
              {errorResponse && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{errorResponse.title}</AlertTitle>
                  <AlertDescription>{errorResponse.detail}</AlertDescription>
                </Alert>
              )}

              {/* Filter description */}
              <div className="text-sm text-muted-foreground">
                {searchPerformed ? (
                  scheduleItems.length > 0 ? (
                    <p className="text-purple-600 dark:text-purple-400">
                      {t("found")} {searchTotalCount} {t("scheduleFor")}{" "}
                      {customerName || customerPhone}
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
                      : t("forTheNext90Days")}
                  </p>
                ) : (
                  <p>
                    {t("showingPastAppointments")}{" "}
                    {fromDate && toDate
                      ? `${t("from")} ${format(fromDate, "MMM d, yyyy")} ${t(
                          "to"
                        )} ${format(toDate, "MMM d, yyyy")}`
                      : t("fromTheLast90Days")}
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
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">
                        {t("customer")}
                      </TableHead>
                      <TableHead className="text-center">
                        {t("service")}
                      </TableHead>
                      <TableHead className="text-center">
                        {t("doctor")}
                      </TableHead>
                      <TableHead className="text-center">{t("date")}</TableHead>
                      <TableHead className="text-center">{t("time")}</TableHead>
                      <TableHead className="text-center">
                        {t("status")}
                      </TableHead>
                      <TableHead className="text-center">
                        {t("actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Show search results if search was performed and has results */}
                    {searchPerformed && scheduleItems.length > 0 ? (
                      scheduleItems.map((schedule: CustomerSchedule) => {
                        const scheduleWithStatus =
                          getScheduleWithStatus(schedule);
                        return (
                          <TableRow key={schedule.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
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
                            <TableCell className="max-w-[150px]">
                              <div className="truncate">
                                {schedule.serviceName}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[150px]">
                              <div className="truncate">
                                {schedule.doctorName}
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {schedule.bookingDate}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {formatTimeRange(
                                schedule.startTime,
                                schedule.endTime
                              )}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(schedule.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewSchedule(schedule)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  {t("view")}
                                </Button>

                                {schedule.status === "In Progress" && (
                                  <>
                                    {schedule.isFirstCheckIn ? (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white"
                                        onClick={() => handleCheckout(schedule)}
                                      >
                                        <CreditCard className="h-4 w-4 mr-1" />
                                        {t("checkout")}
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
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
                                              // Refresh the schedules
                                              if (searchPerformed) {
                                                delayedGetCustomerSchedules({
                                                  customerName,
                                                  customerPhone,
                                                  pageIndex: currentPage,
                                                  pageSize,
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
                                                t("failedToCompleteAppointment")
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
                                    // Parse the booking date (assuming format is YYYY-MM-DD)
                                    const bookingDate = new Date(
                                      schedule.bookingDate
                                    );
                                    const today = new Date();

                                    // Reset time part for accurate date comparison
                                    bookingDate.setHours(0, 0, 0, 0);
                                    today.setHours(0, 0, 0, 0);

                                    // Only show checkout buttons if today is exactly the appointment date
                                    return bookingDate.getTime() ===
                                      today.getTime() ? (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white"
                                        onClick={() => handleCheckout(schedule)}
                                      >
                                        <CreditCard className="h-4 w-4 mr-1" />
                                        {t("reCheckout")}
                                      </Button>
                                    ) : null;
                                  })()}

                                {/* Update the check-in button click handler in both places where it appears */}
                                {shouldShowCheckInButton(schedule) && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
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

                                {schedule.status.toLowerCase() ===
                                  "completed" &&
                                  renderCompletedScheduleButton(
                                    schedule,
                                    scheduleWithStatus
                                  )}

                                {shouldShowDropdownMenu(scheduleWithStatus) && (
                                  <DropdownMenu
                                    open={openDropdownId === schedule.id}
                                    onOpenChange={(open) => {
                                      setOpenDropdownId(
                                        open ? schedule.id : null
                                      );
                                    }}
                                  >
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
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
                                      <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => {
                                          setOpenDropdownId(null);
                                          // Your cancel logic here
                                        }}
                                      >
                                        {t("cancel")}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : clinicSchedules.length > 0 ? (
                      clinicSchedules.map((schedule) => {
                        const scheduleWithStatus =
                          getScheduleWithStatus(schedule);
                        // Debug log to check schedule data
                        // logScheduleData(schedule);
                        return (
                          <TableRow key={schedule.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
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
                            <TableCell className="max-w-[150px]">
                              <div className="truncate">
                                {schedule.serviceName}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[150px]">
                              <div className="truncate">
                                {schedule.doctorName}
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {schedule.bookingDate}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {formatTimeRange(
                                schedule.startTime,
                                schedule.endTime
                              )}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(schedule.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewSchedule(schedule)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  {t("view")}
                                </Button>

                                {schedule.status === "In Progress" && (
                                  <>
                                    {schedule.isFirstCheckIn ? (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white"
                                        onClick={() => handleCheckout(schedule)}
                                      >
                                        <CreditCard className="h-4 w-4 mr-1" />
                                        {t("checkout")}
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
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
                                              // Refresh the schedules
                                              fetchClinicSchedules();
                                            })
                                            .catch((error) => {
                                              console.error(
                                                "Failed to complete appointment:",
                                                error
                                              );
                                              toast.error(
                                                t("failedToCompleteAppointment")
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
                                    // Parse the booking date (assuming format is YYYY-MM-DD)
                                    const bookingDate = new Date(
                                      schedule.bookingDate
                                    );
                                    const today = new Date();

                                    // Reset time part for accurate date comparison
                                    bookingDate.setHours(0, 0, 0, 0);
                                    today.setHours(0, 0, 0, 0);

                                    // Only show checkout buttons if today is exactly the appointment date
                                    return bookingDate.getTime() ===
                                      today.getTime() ? (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white"
                                        onClick={() => handleCheckout(schedule)}
                                      >
                                        <CreditCard className="h-4 w-4 mr-1" />
                                        {t("reCheckout")}
                                      </Button>
                                    ) : null;
                                  })()}

                                {/* Update the check-in button click handler in both places where it appears */}
                                {shouldShowCheckInButton(schedule) && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
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

                                {schedule.status.toLowerCase() ===
                                  "completed" &&
                                  renderCompletedScheduleButton(
                                    schedule,
                                    scheduleWithStatus
                                  )}

                                {shouldShowDropdownMenu(scheduleWithStatus) && (
                                  <DropdownMenu
                                    open={openDropdownId === schedule.id}
                                    onOpenChange={(open) => {
                                      setOpenDropdownId(
                                        open ? schedule.id : null
                                      );
                                    }}
                                  >
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
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
                                      <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => {
                                          setOpenDropdownId(null);
                                          // Your cancel logic here
                                        }}
                                      >
                                        {t("cancel")}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
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

                {/* Pagination - Show for both search results and clinic schedules */}
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

      {/* Schedule Details Modal */}
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

      {/* Payment Modal */}
      <SchedulePaymentModal
        schedule={selectedSchedule}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => handleRefresh()}
      />

      {/* Follow-up Modal */}
      <ScheduleFollowUpModal
        schedule={selectedSchedule}
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        onSuccess={() => {
          // Clear the notification after successful scheduling
          if (
            selectedSchedule &&
            scheduleNeedingFollowUp &&
            selectedSchedule.id === scheduleNeedingFollowUp.id
          ) {
            setScheduleNeedingFollowUp(null);
          }

          // Refresh the schedules
          if (searchPerformed) {
            delayedGetCustomerSchedules({
              customerName,
              customerPhone,
              pageIndex: currentPage,
              pageSize,
            });
          } else {
            fetchClinicSchedules();
          }
        }}
      />

      {/* Add the follow-up selection modal */}
      <FollowUpSelectionModal
        isOpen={isFollowUpSelectionModalOpen}
        onClose={() => setIsFollowUpSelectionModalOpen(false)}
        schedules={schedulesNeedingFollowUp}
        onScheduleSelected={(schedule) => {
          setIsFollowUpSelectionModalOpen(false);
          handleScheduleFollowUp(schedule);
        }}
      />

      {/* Add the EarlyCheckInModal component */}
      <EarlyCheckInModal
        isOpen={isEarlyCheckInModalOpen}
        onClose={() => setIsEarlyCheckInModalOpen(false)}
        onConfirm={handleConfirmEarlyCheckIn}
        minutesEarly={minutesEarly}
        scheduledTime={earlyCheckInSchedule?.startTime || ""}
      />

      {/* Add the Reschedule Modal */}
      <ScheduleChangeForCustomerModal
        schedule={scheduleToReschedule}
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setOpenDropdownId(null); // Reset dropdown state when modal closes
        }}
        onSuccess={() => {
          handleRescheduleSuccess();
          setOpenDropdownId(null); // Reset dropdown state on success
        }}
      />
    </div>
  );
}
