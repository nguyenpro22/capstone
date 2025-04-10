"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  useLazyGetCustomerSchedulesQuery,
  useLazyGetClinicSchedulesQuery,
  useUpdateScheduleStatusMutation,
  useLazyGetNextScheduleAvailabilityQuery,
} from "@/features/customer-schedule/api"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "react-toastify"
import type { CustomerSchedule } from "@/features/customer-schedule/types"
import ScheduleDetailsModal from "@/components/clinicStaff/customer-schedule/schedule-details-modal"
import SchedulePaymentModal from "@/components/clinicStaff/customer-schedule/schedule-payment-modal"
import { useDelayedRefetch } from "@/hooks/use-delayed-refetch"
import ScheduleFollowUpModal from "@/components/clinicStaff/customer-schedule/schedule-follow-up-modal"
import NextScheduleNotification from "@/components/clinicStaff/customer-schedule/next-schedule-notification"
import Pagination from "@/components/common/Pagination/Pagination"

// Import the follow-up selection modal
import FollowUpSelectionModal from "@/components/clinicStaff/customer-schedule/follow-up-selection-modal"

// Define error response type
interface ErrorResponse {
  type: string
  title: string
  status: number
  detail: string
  errors: any | null
}

// Define the schedule status with follow-up info
interface ScheduleWithFollowUpStatus extends CustomerSchedule {
  needsFollowUp?: boolean
  isCheckingFollowUp?: boolean
  checkCompleted?: boolean // New flag to track if check has been completed
}

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return (
        <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">Completed</Badge>
      )
    case "pending":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700">Pending</Badge>
      )
    case "in progress":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">In Progress</Badge>
      )
    case "uncompleted":
      return <Badge className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">Uncompleted</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

// Function to get the default date range based on the current date
const getDefaultDateRange = () => {
  const today = new Date()
  const futureDate = addDays(today, 90)
  return {
    from: today,
    to: futureDate,
  }
}

// Get filter label based on filter value
const getFilterLabel = (filter: string) => {
  switch (filter) {
    case "all":
      return "All"
    case "upcoming":
      return "Upcoming"
    case "past":
      return "Past"
    default:
      return "All"
  }
}

export default function SchedulesPage() {
  // Customer search states
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null)

  // Date range states
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  // Modal states
  const [selectedSchedule, setSelectedSchedule] = useState<CustomerSchedule | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false)

  // Add a new state for the follow-up selection modal
  const [isFollowUpSelectionModalOpen, setIsFollowUpSelectionModalOpen] = useState(false)
  const [schedulesNeedingFollowUp, setSchedulesNeedingFollowUp] = useState<CustomerSchedule[]>([])

  const [scheduleNeedingFollowUp, setScheduleNeedingFollowUp] = useState<CustomerSchedule | null>(null)

  // State to store schedules with follow-up status
  const [schedulesWithFollowUpStatus, setSchedulesWithFollowUpStatus] = useState<ScheduleWithFollowUpStatus[]>([])

  // Using RTK Query hooks
  const [getCustomerSchedules, { data: scheduleResponse, isLoading: isLoadingCustomer, error: customerError }] =
    useLazyGetCustomerSchedulesQuery()
  const [getClinicSchedules, { data: clinicSchedulesResponse, isLoading: isLoadingClinic, error: clinicError }] =
    useLazyGetClinicSchedulesQuery()

  const [updateScheduleStatus, { isLoading: isUpdatingStatus }] = useUpdateScheduleStatusMutation()

  const [getNextScheduleAvailability, { isLoading: isCheckingNextSchedule }] = useLazyGetNextScheduleAvailabilityQuery()

  // Create delayed refetch functions
  const delayedGetCustomerSchedules = useDelayedRefetch(getCustomerSchedules)
  const delayedGetClinicSchedules = useDelayedRefetch(getClinicSchedules)

  // Format date for API
  const formatDateForApi = (date: Date | undefined) => {
    if (!date) return ""
    return format(date, "yyyy-MM-dd")
  }

  // Check follow-up status for a single schedule
  const checkFollowUpStatus = async (schedule: CustomerSchedule) => {
    if (schedule.status.toLowerCase() !== "completed") {
      return { ...schedule, needsFollowUp: false, isCheckingFollowUp: false, checkCompleted: false }
    }

    try {
      // Mark as checking
      setSchedulesWithFollowUpStatus((prev) =>
        prev.map((s) => (s.id === schedule.id ? { ...s, isCheckingFollowUp: true, checkCompleted: false } : s)),
      )

      // Call the API to check if a follow-up is needed
      const result = await getNextScheduleAvailability(schedule.id).unwrap()
      console.log(`Follow-up check result for ${schedule.id}:`, result)

      // Update the schedule with follow-up status
      const needsFollowUp = result.isSuccess && result.value === "Need to schedule for next step"

      setSchedulesWithFollowUpStatus((prev) =>
        prev.map((s) =>
          s.id === schedule.id ? { ...s, needsFollowUp, isCheckingFollowUp: false, checkCompleted: true } : s,
        ),
      )

      return { ...schedule, needsFollowUp, isCheckingFollowUp: false, checkCompleted: true }
    } catch (error) {
      console.error(`Failed to check follow-up status for schedule ${schedule.id}:`, error)

      setSchedulesWithFollowUpStatus((prev) =>
        prev.map((s) =>
          s.id === schedule.id ? { ...s, needsFollowUp: false, isCheckingFollowUp: false, checkCompleted: true } : s,
        ),
      )

      return { ...schedule, needsFollowUp: false, isCheckingFollowUp: false, checkCompleted: true }
    }
  }

  // Update the checkAllSchedulesFollowUpStatus function to ensure it checks all completed schedules
  const checkAllSchedulesFollowUpStatus = async (schedules: CustomerSchedule[]) => {
    console.log(`Checking follow-up status for ${schedules.length} schedules`)

    // Initialize all schedules with isCheckingFollowUp: true
    const initialSchedulesWithStatus = schedules.map((schedule) => ({
      ...schedule,
      isCheckingFollowUp: true,
      needsFollowUp: false,
      checkCompleted: false,
    }))

    setSchedulesWithFollowUpStatus(initialSchedulesWithStatus)

    // Reset the schedules needing follow-up
    setSchedulesNeedingFollowUp([])

    // Check each completed schedule
    const completedSchedules = schedules.filter((schedule) => schedule.status.toLowerCase() === "completed")
    console.log(`Found ${completedSchedules.length} completed schedules to check`)

    if (completedSchedules.length === 0) {
      // If no completed schedules, just update the state with initial values
      setSchedulesWithFollowUpStatus(
        schedules.map((schedule) => ({
          ...schedule,
          isCheckingFollowUp: false,
          needsFollowUp: false,
          checkCompleted: false,
        })),
      )
      return
    }

    // Collect all schedules that need follow-up
    const needFollowUp: CustomerSchedule[] = []

    // Process each completed schedule sequentially
    for (let i = 0; i < completedSchedules.length; i++) {
      const schedule = completedSchedules[i]
      console.log(`Checking schedule ${i + 1}/${completedSchedules.length}: ${schedule.id}`)

      try {
        // Mark as checking
        setSchedulesWithFollowUpStatus((prev) =>
          prev.map((s) => (s.id === schedule.id ? { ...s, isCheckingFollowUp: true, checkCompleted: false } : s)),
        )

        // Call the API to check if a follow-up is needed
        const result = await getNextScheduleAvailability(schedule.id).unwrap()
        console.log(`Result for schedule ${schedule.id}:`, result)

        // Update the schedule with follow-up status - check for exact match with "Need to schedule for next step"
        const needsFollowUp = result.isSuccess && result.value === "Need to schedule for next step"

        if (needsFollowUp) {
          console.log(`Schedule ${schedule.id} needs follow-up`)
          needFollowUp.push(schedule)
        }

        // Update the status in the state
        setSchedulesWithFollowUpStatus((prev) =>
          prev.map((s) =>
            s.id === schedule.id ? { ...s, needsFollowUp, isCheckingFollowUp: false, checkCompleted: true } : s,
          ),
        )
      } catch (error) {
        console.error(`Failed to check follow-up status for schedule ${schedule.id}:`, error)

        // Update the status in the state to indicate error
        setSchedulesWithFollowUpStatus((prev) =>
          prev.map((s) =>
            s.id === schedule.id ? { ...s, needsFollowUp: false, isCheckingFollowUp: false, checkCompleted: true } : s,
          ),
        )
      }
    }

    console.log(`Found ${needFollowUp.length} schedules needing follow-up`)

    // Update the state with all schedules needing follow-up
    setSchedulesNeedingFollowUp(needFollowUp)

    // Set the first one for the notification if there's at least one
    if (needFollowUp.length > 0) {
      setScheduleNeedingFollowUp(needFollowUp[0])
    } else {
      setScheduleNeedingFollowUp(null)
    }
  }

  // Search for customer schedules
  const searchSchedules = async () => {
    if (!customerName && !customerPhone) {
      setErrorResponse({
        type: "400",
        title: "Bad Request",
        status: 400,
        detail: "Please enter either customer name or phone number",
        errors: null,
      })
      return
    }

    setErrorResponse(null)

    try {
      // Call the RTK Query hook with delayed refetch
      const result = await getCustomerSchedules({ customerName, customerPhone })

      if ("error" in result) {
        // Handle the error response
        const errorData = result.error as any
        if (errorData?.data) {
          setErrorResponse(errorData.data as ErrorResponse)
        } else {
          setErrorResponse({
            type: "500",
            title: "Server Error",
            status: 500,
            detail: "An unexpected error occurred",
            errors: null,
          })
        }
      } else if (result.data) {
        // Check follow-up status for all schedules
        const schedules = result.data.value || []
        if (Array.isArray(schedules)) {
          await checkAllSchedulesFollowUpStatus(schedules)
        }
      }

      setSearchPerformed(true)

      // Reset pagination to first page when searching
      setCurrentPage(1)
    } catch (err) {
      console.error("Failed to fetch schedules:", err)
      setErrorResponse({
        type: "500",
        title: "Server Error",
        status: 500,
        detail: "An unexpected error occurred",
        errors: null,
      })
    }
  }

  // Handle Enter key press for customer search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchSchedules()
    }
  }

  // Create search term for date range
  const createDateRangeSearchTerm = (from?: Date, to?: Date) => {
    if (!from && !to) {
      const defaultRange = getDefaultDateRange()
      from = defaultRange.from
      to = defaultRange.to
    } else if (from && !to) {
      to = addDays(from, 30) // Default to 30 days after from date
    } else if (!from && to) {
      from = addDays(to, -30) // Default to 30 days before to date
    }

    return `${formatDateForApi(from)} to ${formatDateForApi(to)}`
  }

  // Fetch clinic schedules
  const fetchClinicSchedules = async () => {
    // If no custom date range is selected, use the default range based on active tab
    let searchTerm
    const sortOrder = activeTab === "past" ? "desc" : "asc"

    if (!fromDate && !toDate) {
      const defaultRange = getDefaultDateRange()
      searchTerm = `${formatDateForApi(defaultRange.from)} to ${formatDateForApi(defaultRange.to)}`
    } else {
      searchTerm = createDateRangeSearchTerm(fromDate, toDate)
    }

    try {
      const result = await delayedGetClinicSchedules({
        pageIndex: currentPage,
        pageSize,
        searchTerm,
        sortColumn: "bookingDate",
        sortOrder,
      })

      // Check if we have valid data and check follow-up status for completed schedules
      if (result.data?.value?.items) {
        await checkAllSchedulesFollowUpStatus(result.data.value.items)
      }

      return result
    } catch (error) {
      console.error("Failed to fetch clinic schedules:", error)
      return { data: null, error }
    }
  }

  // Handle date range change
  const handleDateRangeChange = async () => {
    // Validate that at least one date is selected
    if (!fromDate && !toDate) {
      toast.error("Please select at least one date (From date or To date)")
      return
    }

    setCurrentPage(1) // Reset to first page when filters change
    setSearchPerformed(false) // Reset search state when applying date filters

    const result = await fetchClinicSchedules()

    // Check follow-up status for completed schedules
    if (result?.data?.value?.items) {
      await checkAllSchedulesFollowUpStatus(result.data.value.items)
    }
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    // First update the active tab state
    setActiveTab(value)
    setCurrentPage(1) // Reset to first page when tab changes

    // Reset search state when changing tabs
    setSearchPerformed(false)

    // Reset custom date range when changing tabs
    setFromDate(undefined)
    setToDate(undefined)

    // Fetch with the correct parameters for the selected tab
    // We need to use the value parameter directly instead of relying on the state
    // which might not be updated yet
    setTimeout(async () => {
      const today = new Date()
      let searchTerm = ""
      let sortOrder = "asc"

      if (value === "upcoming") {
        // For upcoming: from today to 3 months in the future
        const futureDate = addDays(today, 90)
        searchTerm = `${formatDateForApi(today)} to ${formatDateForApi(futureDate)}`
        sortOrder = "asc" // Earliest dates first
      } else if (value === "past") {
        // For past: from 3 months ago to yesterday
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        const threeMonthsAgo = new Date(today)
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

        searchTerm = `${formatDateForApi(threeMonthsAgo)} to ${formatDateForApi(yesterday)}`
        sortOrder = "desc" // Most recent dates first
      } else if (value === "all") {
        // For all: from 3 months ago to 3 months in the future
        const threeMonthsAgo = new Date(today)
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

        const threeMonthsAhead = new Date(today)
        threeMonthsAhead.setMonth(threeMonthsAhead.getMonth() + 3)

        searchTerm = `${formatDateForApi(threeMonthsAgo)} to ${formatDateForApi(threeMonthsAhead)}`
        sortOrder = "asc" // Earliest dates first
      }

      // Call API with the correct parameters using delayed refetch
      const result = await delayedGetClinicSchedules({
        pageIndex: 1,
        pageSize,
        searchTerm,
        sortColumn: "bookingDate",
        sortOrder,
      })

      // Check follow-up status for completed schedules
      if (result && result.data?.value?.items) {
        await checkAllSchedulesFollowUpStatus(result.data.value.items)
      }
    }, 0)
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  // Handle view schedule details
  const handleViewSchedule = (schedule: CustomerSchedule) => {
    setSelectedSchedule(schedule)
    setIsDetailsModalOpen(true)
  }

  // Handle checkout/payment
  const handleCheckout = (schedule: CustomerSchedule) => {
    setSelectedSchedule(schedule)
    setIsPaymentModalOpen(true)
  }

  // Handle check-in
  const handleCheckIn = async (scheduleId: string) => {
    try {
      await updateScheduleStatus({
        scheduleId: scheduleId,
        status: "In Progress",
      }).unwrap()

      toast.success("The customer has been checked in successfully.")

      // Refresh the clinic schedules list with delay
      fetchClinicSchedules()

      // If a customer search has been performed, refresh those results too with delay
      if (searchPerformed && (customerName || customerPhone)) {
        delayedGetCustomerSchedules({ customerName, customerPhone })
      }
    } catch (error) {
      console.error("Failed to check in:", error)
      toast.error("There was an error checking in the customer. Please try again.")
    }
  }

  const handleScheduleFollowUp = (schedule: CustomerSchedule) => {
    setSelectedSchedule(schedule)
    setIsFollowUpModalOpen(true)
  }

  // Update the notification click handler to open the selection modal if multiple schedules need follow-up
  const handleNotificationClick = () => {
    if (schedulesNeedingFollowUp.length > 1) {
      setIsFollowUpSelectionModalOpen(true)
    } else if (scheduleNeedingFollowUp) {
      handleScheduleFollowUp(scheduleNeedingFollowUp)
    }
  }

  // Handle view next appointment
  const handleViewNextAppointment = (schedule: CustomerSchedule) => {
    // This would typically navigate to or show the next appointment
    toast.info(`Viewing next appointment for ${schedule.customerName}`)
    // You could implement this based on your application's requirements
  }

  // Effect to fetch schedules when component mounts or when dependencies change
  useEffect(() => {
    fetchClinicSchedules()
  }, [currentPage])

  // Initial fetch when component mounts
  useEffect(() => {
    // Set default tab to "all"
    setActiveTab("all")

    // Initial fetch when component mounts - use the correct parameters for "all"
    const today = new Date()
    const threeMonthsAgo = new Date(today)
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    const threeMonthsAhead = new Date(today)
    threeMonthsAhead.setMonth(threeMonthsAhead.getMonth() + 3)

    const searchTerm = `${formatDateForApi(threeMonthsAgo)} to ${formatDateForApi(threeMonthsAhead)}`

    delayedGetClinicSchedules({
      pageIndex: 1,
      pageSize,
      searchTerm,
      sortColumn: "bookingDate",
      sortOrder: "asc",
    }).then((result) => {
      // Check follow-up status for completed schedules
      if (result && result.data?.value?.items) {
        checkAllSchedulesFollowUpStatus(result.data.value.items)
      }
    })
  }, [])

  // Extract data from responses
  const schedulesData = scheduleResponse?.value || []
  const scheduleItems = Array.isArray(schedulesData) ? schedulesData : []
  const clinicSchedules = clinicSchedulesResponse?.value?.items || []
  const totalCount = clinicSchedulesResponse?.value?.totalCount || 0
  const totalPages = Math.ceil(totalCount / pageSize)

  // Format error message for clinic schedules
  const clinicErrorMessage = clinicError
    ? "error" in clinicError
      ? (clinicError.error as string)
      : "Failed to load schedules"
    : null

  // Format time range
  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`
  }

  // Get schedule with follow-up status by ID
  const getScheduleWithStatus = (schedule: CustomerSchedule): ScheduleWithFollowUpStatus => {
    const scheduleWithStatus = schedulesWithFollowUpStatus.find((s) => s.id === schedule.id)
    if (scheduleWithStatus) {
      return scheduleWithStatus
    }
    return { ...schedule, needsFollowUp: false, isCheckingFollowUp: false, checkCompleted: false }
  }

  // Add a function to clear search
  const clearSearch = () => {
    setCustomerName("")
    setCustomerPhone("")
    setSearchPerformed(false)
    setErrorResponse(null)
    // Refresh the clinic schedules
    fetchClinicSchedules()
  }

  // Debug function to log schedule data
  const logScheduleData = (schedule: CustomerSchedule) => {
    console.log(`Schedule ID: ${schedule.id}`)
    console.log(`Status: ${schedule.status}`)
    console.log(`isFirstCheckIn: ${schedule.isFirstCheckIn}`)
  }

  // Function to render the appropriate action button for completed schedules
  const renderCompletedScheduleButton = (
    schedule: CustomerSchedule,
    scheduleWithStatus: ScheduleWithFollowUpStatus,
  ) => {
    if (scheduleWithStatus.isCheckingFollowUp) {
      return (
        <Button variant="default" size="sm" className="bg-gray-400 dark:bg-gray-600 text-white" disabled>
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
          Checking...
        </Button>
      )
    } else if (scheduleWithStatus.needsFollowUp) {
      return (
        <Button
          variant="default"
          size="sm"
          className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
          onClick={() => handleScheduleFollowUp(schedule)}
        >
          <Calendar className="h-4 w-4 mr-1" />
          Follow-up
        </Button>
      )
    } else if (scheduleWithStatus.checkCompleted) {
      // If check is completed and doesn't need follow-up, show View Next regardless of isFirstCheckIn
      return (
        <Button
          variant="default"
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
          onClick={() => handleViewNextAppointment(schedule)}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          View Next
        </Button>
      )
    } else if (schedule.isFirstCheckIn) {
      // Only show Checkout if check hasn't been completed yet and it's the first check-in
      return (
        <Button
          variant="default"
          size="sm"
          className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white"
          onClick={() => handleCheckout(schedule)}
        >
          <CreditCard className="h-4 w-4 mr-1" />
          Checkout
        </Button>
      )
    } else {
      // Default fallback
      return (
        <Button
          variant="default"
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
          onClick={() => handleViewNextAppointment(schedule)}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          View Next
        </Button>
      )
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customer Schedules</h1>

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
            <CardTitle>All Schedules</CardTitle>
            <Button className="gap-2 w-full md:w-auto">
              <Plus size={16} />
              New Schedule
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
                        <span className="font-medium">{getFilterLabel(activeTab)}</span>
                        <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                      <DropdownMenuItem
                        onClick={() => handleTabChange("all")}
                        className={activeTab === "all" ? "bg-gray-100 dark:bg-gray-800 font-medium" : ""}
                      >
                        {activeTab === "all" && <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />}
                        All
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleTabChange("upcoming")}
                        className={activeTab === "upcoming" ? "bg-gray-100 dark:bg-gray-800 font-medium" : ""}
                      >
                        {activeTab === "upcoming" && <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />}
                        Upcoming
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleTabChange("past")}
                        className={activeTab === "past" ? "bg-gray-100 dark:bg-gray-800 font-medium" : ""}
                      >
                        {activeTab === "past" && <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />}
                        Past
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
                          !fromDate && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "MMM d, yyyy") : <span>From date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
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
                          !toDate && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "MMM d, yyyy") : <span>To date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                        disabled={(date) => (fromDate ? date < fromDate : false)}
                      />
                    </PopoverContent>
                  </Popover>

                  <Button
                    onClick={handleDateRangeChange}
                    disabled={isLoadingClinic || (!fromDate && !toDate)}
                    className="w-full md:w-auto bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 dark:from-red-600 dark:to-red-800 dark:hover:from-red-700 dark:hover:to-red-900 text-white font-medium shadow-sm"
                  >
                    {isLoadingClinic ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                  </Button>
                </div>
              </div>

              {/* Bottom row with customer search */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="customerName" className="text-sm font-medium">
                    Customer Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="customerName"
                      placeholder="Enter customer name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="customerPhone" className="text-sm font-medium">
                    Customer Phone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="customerPhone"
                      placeholder="Enter customer phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                    />
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    onClick={searchSchedules}
                    disabled={isLoadingCustomer || isCheckingNextSchedule}
                    className="gap-2 h-10 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 dark:from-pink-600 dark:to-purple-600 dark:hover:from-pink-700 dark:hover:to-purple-700 w-full md:w-auto px-6 font-medium"
                  >
                    {isLoadingCustomer || isCheckingNextSchedule ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Search
                  </Button>

                  {searchPerformed && (
                    <Button
                      onClick={clearSearch}
                      variant="outline"
                      className="h-10 border-gray-300 dark:border-gray-600"
                    >
                      Clear
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
                      Found {scheduleItems.length} schedule(s) for {customerName || customerPhone}
                    </p>
                  ) : (
                    <p className="text-amber-600 dark:text-amber-400">
                      No schedules found for {customerName || customerPhone}
                    </p>
                  )
                ) : activeTab === "all" ? (
                  <p>
                    Showing all appointments{" "}
                    {fromDate && toDate
                      ? `from ${format(fromDate, "MMM d, yyyy")} to ${format(toDate, "MMM d, yyyy")}`
                      : ""}
                  </p>
                ) : activeTab === "upcoming" ? (
                  <p>
                    Showing upcoming appointments{" "}
                    {fromDate && toDate
                      ? `from ${format(fromDate, "MMM d, yyyy")} to ${format(toDate, "MMM d, yyyy")}`
                      : "for the next 90 days"}
                  </p>
                ) : (
                  <p>
                    Showing past appointments{" "}
                    {fromDate && toDate
                      ? `from ${format(fromDate, "MMM d, yyyy")} to ${format(toDate, "MMM d, yyyy")}`
                      : "from the last 90 days"}
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
                <AlertTitle>Error</AlertTitle>
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
                      <TableHead className="text-center">Customer</TableHead>
                      <TableHead className="text-center">Service</TableHead>
                      <TableHead className="text-center">Doctor</TableHead>
                      <TableHead className="text-center">Date</TableHead>
                      <TableHead className="text-center">Time</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Show search results if search was performed and has results */}
                    {searchPerformed && scheduleItems.length > 0 ? (
                      scheduleItems.map((schedule: CustomerSchedule) => {
                        const scheduleWithStatus = getScheduleWithStatus(schedule)
                        return (
                          <TableRow key={schedule.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarFallback>{schedule.customerName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="truncate max-w-[150px]">{schedule.customerName}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[150px]">
                              <div className="truncate">{schedule.serviceName}</div>
                            </TableCell>
                            <TableCell className="max-w-[150px]">
                              <div className="truncate">{schedule.doctorName}</div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">{schedule.bookingDate}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              {formatTimeRange(schedule.startTime, schedule.endTime)}
                            </TableCell>
                            <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleViewSchedule(schedule)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>

                                {(schedule.status === "In Progress" || schedule.status === "Uncompleted") &&
                                  (() => {
                                    // Parse the booking date (assuming format is YYYY-MM-DD)
                                    const bookingDate = new Date(schedule.bookingDate)
                                    const today = new Date()

                                    // Reset time part for accurate date comparison
                                    bookingDate.setHours(0, 0, 0, 0)
                                    today.setHours(0, 0, 0, 0)

                                    // Only show checkout buttons if today is exactly the appointment date
                                    return bookingDate.getTime() === today.getTime() ? (
                                      <>
                                        {schedule.isFirstCheckIn ? (
                                          <Button
                                            variant="default"
                                            size="sm"
                                            className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white"
                                            onClick={() => handleCheckout(schedule)}
                                          >
                                            <CreditCard className="h-4 w-4 mr-1" />
                                            {schedule.status === "Uncompleted" ? "Re-Checkout" : "Checkout"}
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
                                                  toast.success("Appointment marked as completed successfully.")
                                                  // Refresh the schedules
                                                  fetchClinicSchedules()
                                                  if (searchPerformed && (customerName || customerPhone)) {
                                                    delayedGetCustomerSchedules({ customerName, customerPhone })
                                                  }
                                                })
                                                .catch((error) => {
                                                  console.error("Failed to complete appointment:", error)
                                                  toast.error(
                                                    "Failed to mark appointment as completed. Please try again.",
                                                  )
                                                })
                                            }}
                                          >
                                            <CheckCircle2 className="h-4 w-4 mr-1" />
                                            Complete
                                          </Button>
                                        )}
                                      </>
                                    ) : null
                                  })()}

                                {schedule.status.toLowerCase() === "pending" &&
                                  (() => {
                                    // Parse the booking date (assuming format is YYYY-MM-DD)
                                    const bookingDate = new Date(schedule.bookingDate)
                                    const today = new Date()

                                    // Reset time part for accurate date comparison
                                    bookingDate.setHours(0, 0, 0, 0)
                                    today.setHours(0, 0, 0, 0)

                                    // Only show check-in button if today is exactly the appointment date
                                    return bookingDate.getTime() === today.getTime() ? (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                                        onClick={() => handleCheckIn(schedule.id)}
                                        disabled={isUpdatingStatus}
                                      >
                                        {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check-in"}
                                      </Button>
                                    ) : null
                                  })()}

                                {schedule.status.toLowerCase() === "completed" &&
                                  renderCompletedScheduleButton(schedule, scheduleWithStatus)}

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleScheduleFollowUp(schedule)}>
                                      Schedule Follow-up
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : clinicSchedules.length > 0 ? (
                      clinicSchedules.map((schedule) => {
                        const scheduleWithStatus = getScheduleWithStatus(schedule)
                        // Debug log to check schedule data
                        // logScheduleData(schedule);
                        return (
                          <TableRow key={schedule.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarFallback>{schedule.customerName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="truncate max-w-[150px]">{schedule.customerName}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[150px]">
                              <div className="truncate">{schedule.serviceName}</div>
                            </TableCell>
                            <TableCell className="max-w-[150px]">
                              <div className="truncate">{schedule.doctorName}</div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">{schedule.bookingDate}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              {formatTimeRange(schedule.startTime, schedule.endTime)}
                            </TableCell>
                            <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleViewSchedule(schedule)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>

                                {(schedule.status === "In Progress" || schedule.status === "Uncompleted") &&
                                  (() => {
                                    // Parse the booking date (assuming format is YYYY-MM-DD)
                                    const bookingDate = new Date(schedule.bookingDate)
                                    const today = new Date()

                                    // Reset time part for accurate date comparison
                                    bookingDate.setHours(0, 0, 0, 0)
                                    today.setHours(0, 0, 0, 0)

                                    // Only show checkout buttons if today is exactly the appointment date
                                    return bookingDate.getTime() === today.getTime() ? (
                                      <>
                                        {schedule.isFirstCheckIn ? (
                                          <Button
                                            variant="default"
                                            size="sm"
                                            className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white"
                                            onClick={() => handleCheckout(schedule)}
                                          >
                                            <CreditCard className="h-4 w-4 mr-1" />
                                            {schedule.status === "Uncompleted" ? "Re-Checkout" : "Checkout"}
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
                                                  toast.success("Appointment marked as completed successfully.")
                                                  // Refresh the schedules
                                                  fetchClinicSchedules()
                                                })
                                                .catch((error) => {
                                                  console.error("Failed to complete appointment:", error)
                                                  toast.error(
                                                    "Failed to mark appointment as completed. Please try again.",
                                                  )
                                                })
                                            }}
                                          >
                                            <CheckCircle2 className="h-4 w-4 mr-1" />
                                            Complete
                                          </Button>
                                        )}
                                      </>
                                    ) : null
                                  })()}

                                {schedule.status.toLowerCase() === "pending" &&
                                  (() => {
                                    // Parse the booking date (assuming format is YYYY-MM-DD)
                                    const bookingDate = new Date(schedule.bookingDate)
                                    const today = new Date()

                                    // Reset time part for accurate date comparison
                                    bookingDate.setHours(0, 0, 0, 0)
                                    today.setHours(0, 0, 0, 0)

                                    // Only show check-in button if today is exactly the appointment date
                                    return bookingDate.getTime() === today.getTime() ? (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                                        onClick={() => handleCheckIn(schedule.id)}
                                        disabled={isUpdatingStatus}
                                      >
                                        {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check-in"}
                                      </Button>
                                    ) : null
                                  })()}

                                {schedule.status.toLowerCase() === "completed" &&
                                  renderCompletedScheduleButton(schedule, scheduleWithStatus)}

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleScheduleFollowUp(schedule)}>
                                      Schedule Follow-up
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground dark:text-gray-400">
                          {searchPerformed
                            ? "No schedules found for this customer. Please check the name and phone number."
                            : activeTab === "upcoming"
                              ? "No upcoming schedules found. Try adjusting your date range."
                              : "No past schedules found. Try adjusting your date range."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {!searchPerformed && totalPages > 1 && (
                  <div className="py-4 border-t dark:border-gray-700">
                    <Pagination
                      pageIndex={currentPage}
                      pageSize={pageSize}
                      totalCount={totalCount}
                      hasNextPage={currentPage < totalPages}
                      hasPreviousPage={currentPage > 1}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
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
          setIsDetailsModalOpen(false)
          setIsPaymentModalOpen(true)
        }}
      />

      {/* Payment Modal */}
      <SchedulePaymentModal
        schedule={selectedSchedule}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      {/* Follow-up Modal */}
      <ScheduleFollowUpModal
        schedule={selectedSchedule}
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        onSuccess={() => {
          // Clear the notification after successful scheduling
          if (selectedSchedule && scheduleNeedingFollowUp && selectedSchedule.id === scheduleNeedingFollowUp.id) {
            setScheduleNeedingFollowUp(null)
          }

          // Refresh the schedules
          fetchClinicSchedules()
          if (searchPerformed && (customerName || customerPhone)) {
            delayedGetCustomerSchedules({ customerName, customerPhone })
          }
        }}
      />

      {/* Add the follow-up selection modal */}
      <FollowUpSelectionModal
        isOpen={isFollowUpSelectionModalOpen}
        onClose={() => setIsFollowUpSelectionModalOpen(false)}
        schedules={schedulesNeedingFollowUp}
        onScheduleSelected={(schedule) => {
          setIsFollowUpSelectionModalOpen(false)
          handleScheduleFollowUp(schedule)
        }}
      />
    </div>
  )
}
