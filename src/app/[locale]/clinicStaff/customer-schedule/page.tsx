"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Define error response type
interface ErrorResponse {
  type: string
  title: string
  status: number
  detail: string
  errors: any | null
}

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
    case "pending":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
    case "in progress":
      return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>
    case "uncompleted":
      return <Badge className="bg-red-500 hover:bg-red-600">Uncompleted</Badge>
    default:
      return <Badge>{status}</Badge>
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
  const [activeTab, setActiveTab] = useState("upcoming")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  // Modal states
  const [selectedSchedule, setSelectedSchedule] = useState<CustomerSchedule | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Using RTK Query hooks
  const [getCustomerSchedules, { data: scheduleResponse, isLoading: isLoadingCustomer, error: customerError }] =
    useLazyGetCustomerSchedulesQuery()
  const [getClinicSchedules, { data: clinicSchedulesResponse, isLoading: isLoadingClinic, error: clinicError }] =
    useLazyGetClinicSchedulesQuery()

  const [updateScheduleStatus, { isLoading: isUpdatingStatus }] = useUpdateScheduleStatusMutation()

  // Create delayed refetch functions
  const delayedGetCustomerSchedules = useDelayedRefetch(getCustomerSchedules)
  const delayedGetClinicSchedules = useDelayedRefetch(getClinicSchedules)

  // Format date for API
  const formatDateForApi = (date: Date | undefined) => {
    if (!date) return ""
    return format(date, "yyyy-MM-dd")
  }

  // Get default date range based on active tab
  const getDefaultDateRange = () => {
    const today = new Date()

    if (activeTab === "upcoming") {
      // For upcoming: from today to 3 months in the future
      return {
        from: today,
        to: addDays(today, 90),
      }
    } else if (activeTab === "past") {
      // For past: from 3 months ago to yesterday
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      const threeMonthsAgo = new Date(today)
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

      return {
        from: threeMonthsAgo,
        to: yesterday,
      }
    }

    // Default fallback
    return {
      from: today,
      to: addDays(today, 30),
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
      }

      setSearchPerformed(true)
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
  const fetchClinicSchedules = () => {
    // If no custom date range is selected, use the default range based on active tab
    let searchTerm
    const sortOrder = activeTab === "past" ? "desc" : "asc"

    if (!fromDate && !toDate) {
      const defaultRange = getDefaultDateRange()
      searchTerm = `${formatDateForApi(defaultRange.from)} to ${formatDateForApi(defaultRange.to)}`
    } else {
      searchTerm = createDateRangeSearchTerm(fromDate, toDate)
    }

    delayedGetClinicSchedules({
      pageIndex: currentPage,
      pageSize,
      searchTerm,
      sortColumn: "bookingDate",
      sortOrder,
    })
  }

  // Handle date range change
  const handleDateRangeChange = () => {
    setCurrentPage(1) // Reset to first page when filters change
    fetchClinicSchedules()
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    // First update the active tab state
    setActiveTab(value)
    setCurrentPage(1) // Reset to first page when tab changes

    // Reset custom date range when changing tabs
    setFromDate(undefined)
    setToDate(undefined)

    // Fetch with the correct parameters for the selected tab
    // We need to use the value parameter directly instead of relying on the state
    // which might not be updated yet
    setTimeout(() => {
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
      }

      // Call API with the correct parameters using delayed refetch
      delayedGetClinicSchedules({
        pageIndex: 1,
        pageSize,
        searchTerm,
        sortColumn: "bookingDate",
        sortOrder,
      })
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

  // Effect to fetch schedules when component mounts or when dependencies change
  useEffect(() => {
    fetchClinicSchedules()
  }, [currentPage])

  // Initial fetch when component mounts
  useEffect(() => {
    fetchClinicSchedules()
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customer Schedules</h1>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 border-b">
          <CardTitle className="text-lg text-pink-700">Search Customer Schedule</CardTitle>
          <CardDescription>Enter customer details to find their schedules</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-1.5">
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
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
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
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {errorResponse && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{errorResponse.title}</AlertTitle>
              <AlertDescription>{errorResponse.detail}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-3 flex justify-end">
          <Button
            onClick={searchSchedules}
            disabled={isLoadingCustomer}
            className="gap-2 w-36 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            {isLoadingCustomer ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </Button>
        </CardFooter>
      </Card>

      {searchPerformed && !errorResponse && (
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="text-lg text-blue-700">Search Results</CardTitle>
            <CardDescription>
              {scheduleItems.length > 0
                ? `Found ${scheduleItems.length} schedule(s) for ${customerName || customerPhone}`
                : `No schedules found for ${customerName || customerPhone}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {scheduleItems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleItems.map((schedule: CustomerSchedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{schedule.customerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{schedule.customerName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{schedule.serviceName}</TableCell>
                      <TableCell>{schedule.doctorName}</TableCell>
                      <TableCell>{schedule.bookingDate}</TableCell>
                      <TableCell>{formatTimeRange(schedule.startTime, schedule.endTime)}</TableCell>
                      <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewSchedule(schedule)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>

                          {(schedule.status === "In Progress" || schedule.status === "Uncompleted") && (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-pink-500 hover:bg-pink-600 text-white"
                              onClick={() => handleCheckout(schedule)}
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              {schedule.status === "Uncompleted" ? "Re-Checkout" : "Checkout"}
                            </Button>
                          )}

                          {schedule.status.toLowerCase() === "pending" && (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleCheckIn(schedule.id)}
                              disabled={isUpdatingStatus}
                            >
                              {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check-in"}
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                              <DropdownMenuItem>Reschedule</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                No schedules found for this customer. Please check the name and phone number.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Schedules</CardTitle>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="flex gap-2 items-center">
                <div className="grid gap-2">
                  <Label htmlFor="from" className="text-sm">
                    From Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="from"
                        variant={"outline"}
                        className={cn(
                          "w-[180px] justify-start text-left font-normal",
                          !fromDate && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <ArrowRight className="mt-8 h-4 w-4 text-muted-foreground" />

                <div className="grid gap-2">
                  <Label htmlFor="to" className="text-sm">
                    To Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="to"
                        variant={"outline"}
                        className={cn(
                          "w-[180px] justify-start text-left font-normal",
                          !toDate && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
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
                </div>

                <Button onClick={handleDateRangeChange} className="mt-8" disabled={isLoadingClinic}>
                  {isLoadingClinic ? <Loader2 className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4 mr-2" />}
                  Apply
                </Button>
              </div>
            </div>

            <Button className="gap-2 w-full md:w-auto">
              <Plus size={16} />
              New Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="upcoming" onValueChange={handleTabChange}>
            <TabsList className="px-6 pt-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-0">
              {clinicErrorMessage ? (
                <Alert variant="destructive" className="mx-6 my-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{clinicErrorMessage}</AlertDescription>
                </Alert>
              ) : isLoadingClinic ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clinicSchedules.length > 0 ? (
                        clinicSchedules.map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{schedule.customerName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{schedule.customerName}</span>
                              </div>
                            </TableCell>
                            <TableCell>{schedule.serviceName}</TableCell>
                            <TableCell>{schedule.doctorName}</TableCell>
                            <TableCell>{schedule.bookingDate}</TableCell>
                            <TableCell>{formatTimeRange(schedule.startTime, schedule.endTime)}</TableCell>
                            <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" onClick={() => handleViewSchedule(schedule)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No schedules found. Try adjusting your date range.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center py-4 border-t">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1 || isLoadingClinic}
                        >
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            // Show first page, last page, current page, and pages around current
                            let pageToShow: number
                            if (totalPages <= 5) {
                              pageToShow = i + 1
                            } else if (currentPage <= 3) {
                              pageToShow = i + 1
                            } else if (currentPage >= totalPages - 2) {
                              pageToShow = totalPages - 4 + i
                            } else {
                              pageToShow = currentPage - 2 + i
                            }

                            return (
                              <Button
                                key={pageToShow}
                                variant={currentPage === pageToShow ? "default" : "outline"}
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => handlePageChange(pageToShow)}
                                disabled={isLoadingClinic}
                              >
                                {pageToShow}
                              </Button>
                            )
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages || isLoadingClinic}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
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
    </div>
  )
}

