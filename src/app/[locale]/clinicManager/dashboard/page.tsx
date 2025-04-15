"use client"
import React, { useState, useRef, useEffect } from "react"
import {
  AlertCircle,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Users,
  ShoppingCart,
  ClipboardCheck,
  DollarSign,
} from "lucide-react"
import { useGetDashboardByDateTimeQuery } from "@/features/dashboard/api"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"

// Define TypeScript interfaces
interface DateTimeInformation {
  totalCountOrderCustomer: number
  totalCountScheduleCustomer: number
  totalCountCustomerSchedule: number
  totalCountCustomerSchedulePending: number
  totalCountCustomerScheduleInProgress: number
  totalCountCustomerScheduleCompleted: number
  totalSumRevenue: number
  totalCountOrderPending: number
  totalSumRevenueNormal: number
  totalSumRevenueLiveStream: number
}

interface DateTimeInformationWithRange {
  information: DateTimeInformation
  startDate: string
  endDate: string
}

interface DashboardResponse {
  value?: {
    datetimeInformation?: DateTimeInformation
    datetimeInformationList?: DateTimeInformationWithRange[]
  }
  isSuccess: boolean
  isFailure: boolean
  error: {
    code: string
    message: string
  }
}

interface PercentChanges {
  orderCustomers: number
  scheduleCustomers: number
  customerSchedules: number
}

// Date formatting helper functions
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const formatApiDate = (dateStr: string): string => {
  return dateStr
}

const formatDisplayDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${months[date.getMonth()]} ${date.getDate()}`
}

// Define PieChart props interface
interface PieChartProps {
  pendingCount: number
  inProgressCount: number
  completedCount: number
  canceledCount: number
  totalCount: number
}

// PieChart component
const PieChart: React.FC<PieChartProps> = ({
  pendingCount,
  inProgressCount,
  completedCount,
  canceledCount,
  totalCount,
}) => {
  const canvasRef = useRef(null)

  React.useEffect(() => {
    if (!canvasRef.current || totalCount === 0) return

    const canvas: HTMLCanvasElement = canvasRef.current
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Define colors
    const colors = {
      pending: "#f59e0b", // amber-500
      inProgress: "#3b82f6", // blue-500
      completed: "#10b981", // emerald-500
      canceled: "#ef4444", // red-500
    }

    // Calculate angles
    let startAngle = 0
    const drawSegment = (value: number, color: string): number | void => {
      if (value === 0) return

      const segmentAngle = (value / totalCount) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle)
      ctx.closePath()

      ctx.fillStyle = color
      ctx.fill()

      // Add a white border
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.stroke()

      startAngle += segmentAngle
    }

    // Draw segments
    drawSegment(pendingCount, colors.pending)
    drawSegment(inProgressCount, colors.inProgress)
    drawSegment(completedCount, colors.completed)
    drawSegment(canceledCount, colors.canceled)

    // Draw center circle (optional, for donut chart)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()

    // Add text in the center
    ctx.fillStyle = "#1e293b" // slate-800
    ctx.font = "bold 20px Inter, system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${totalCount}`, centerX, centerY - 10)
    ctx.font = "14px Inter, system-ui, sans-serif"
    ctx.fillText("Total", centerX, centerY + 15)
  }, [pendingCount, inProgressCount, completedCount, canceledCount, totalCount])

  return <canvas ref={canvasRef} width={300} height={300} className="w-full h-full" />
}

// Define CustomerMetricsChart props interface
interface CustomerMetricsChartProps {
  orderCustomers: number
  scheduleCustomers: number
  customerSchedules: number
  timeLabel: string
  percentChanges: PercentChanges | null
}

// CustomerMetricsChart component
const CustomerMetricsChart: React.FC<CustomerMetricsChartProps> = ({
  orderCustomers,
  scheduleCustomers,
  customerSchedules,
  timeLabel,
  percentChanges,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <Users className="w-5 h-5 mr-2 text-indigo-500" />
        Customer Metrics ({timeLabel})
      </h3>

      <div className="space-y-8">
        {/* Order Customers */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
              <ShoppingCart className="w-4 h-4 mr-1.5 text-indigo-400" />
              Order Customers
            </span>
            <div className="flex items-center">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100 mr-2">{orderCustomers}</span>
              {percentChanges && (
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center ${
                    percentChanges.orderCustomers >= 0
                      ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30"
                      : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/30"
                  }`}
                >
                  {percentChanges.orderCustomers >= 0 ? (
                    <ArrowUp className="w-3 h-3 mr-0.5" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-0.5" />
                  )}
                  {Math.abs(percentChanges.orderCustomers).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-500 ease-in-out"
              style={{
                width: `${Math.min(100, (orderCustomers / Math.max(orderCustomers, scheduleCustomers, customerSchedules)) * 100)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Schedule Customers */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-violet-400" />
              Schedule Customers
            </span>
            <div className="flex items-center">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100 mr-2">{scheduleCustomers}</span>
              {percentChanges && (
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center ${
                    percentChanges.scheduleCustomers >= 0
                      ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30"
                      : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/30"
                  }`}
                >
                  {percentChanges.scheduleCustomers >= 0 ? (
                    <ArrowUp className="w-3 h-3 mr-0.5" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-0.5" />
                  )}
                  {Math.abs(percentChanges.scheduleCustomers).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 dark:bg-violet-400 rounded-full transition-all duration-500 ease-in-out"
              style={{
                width: `${Math.min(100, (scheduleCustomers / Math.max(orderCustomers, scheduleCustomers, customerSchedules)) * 100)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Customer Schedules */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
              <ClipboardCheck className="w-4 h-4 mr-1.5 text-teal-400" />
              Customer Schedules
            </span>
            <div className="flex items-center">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100 mr-2">{customerSchedules}</span>
              {percentChanges && (
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center ${
                    percentChanges.customerSchedules >= 0
                      ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30"
                      : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/30"
                  }`}
                >
                  {percentChanges.customerSchedules >= 0 ? (
                    <ArrowUp className="w-3 h-3 mr-0.5" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-0.5" />
                  )}
                  {Math.abs(percentChanges.customerSchedules).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 dark:bg-teal-400 rounded-full transition-all duration-500 ease-in-out"
              style={{
                width: `${Math.min(100, (customerSchedules / Math.max(orderCustomers, scheduleCustomers, customerSchedules)) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Calculate percentage change
const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-700 dark:text-gray-300">{entry.name}:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Custom Bar Chart component for date range data
const TimeSeriesBarChart: React.FC<{
  data: DateTimeInformationWithRange[]
  isWeekly: boolean
  fields: string[]
  title: string
  icon: React.ReactNode
}> = ({ data, isWeekly, fields, title, icon }) => {
  // Prepare data for the chart
  const chartData = data.map((item) => {
    // Format the label based on whether it's weekly or monthly
    const startDate = new Date(item.startDate)
    const endDate = new Date(item.endDate)

    let label = ""
    if (isWeekly) {
      label = `${formatDisplayDate(item.startDate)} - ${formatDisplayDate(item.endDate)}`
    } else {
      // For monthly view, just show the month name
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      label = monthNames[startDate.getMonth()]
    }

    return {
      name: label,
      OrderCustomers: item.information.totalCountOrderCustomer,
      ScheduleCustomers: item.information.totalCountScheduleCustomer,
      CustomerSchedules: item.information.totalCountCustomerSchedule,
      Pending: item.information.totalCountCustomerSchedulePending,
      InProgress: item.information.totalCountCustomerScheduleInProgress,
      Completed: item.information.totalCountCustomerScheduleCompleted,
      OrderPending: item.information.totalCountOrderPending,
      Revenue: item.information.totalSumRevenue,
      NormalRevenue: item.information.totalSumRevenueNormal,
      LiveStreamRevenue: item.information.totalSumRevenueLiveStream,
    }
  })

  // Define color schema for the bars
  const colorMap = {
    OrderCustomers: "#6366f1", // indigo-500
    ScheduleCustomers: "#8b5cf6", // violet-500
    CustomerSchedules: "#14b8a6", // teal-500
    Pending: "#f59e0b", // amber-500
    InProgress: "#3b82f6", // blue-500
    Completed: "#10b981", // emerald-500
    OrderPending: "#ef4444", // red-500
    Revenue: "#f97316", // orange-500
    NormalRevenue: "#06b6d4", // cyan-500
    LiveStreamRevenue: "#ec4899", // pink-500
  }

  const [visibleMetrics, setVisibleMetrics] = useState(fields)

  const toggleMetric = (metric: string) => {
    if (visibleMetrics.includes(metric)) {
      setVisibleMetrics(visibleMetrics.filter((m) => m !== metric))
    } else {
      setVisibleMetrics([...visibleMetrics, metric])
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        {icon}
        {title} ({isWeekly ? "Weekly" : "Monthly"})
      </h3>

      <div className="mb-5 flex flex-wrap gap-2">
        {fields.map((metric) => (
          <button
            key={metric}
            onClick={() => toggleMetric(metric)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
              visibleMetrics.includes(metric)
                ? "bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 shadow-sm"
                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {metric}
          </button>
        ))}
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 10 }} iconType="circle" iconSize={8} />
            {visibleMetrics.map((metric) => (
              <Bar
                key={metric}
                dataKey={metric}
                fill={colorMap[metric as keyof typeof colorMap]}
                name={metric}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Dashboard Component
const Dashboard: React.FC = () => {
  // View mode and date range states
  const [timeRange, setTimeRange] = useState<"week" | "month">("week")

  // Date range states
  const today = new Date()
  const [startDate, setStartDate] = useState(formatDate(today))
  const [endDate, setEndDate] = useState(formatDate(today))
  const [selectedDate, setSelectedDate] = useState(formatDate(today))

  // Calculate date ranges based on current settings
  const getDateRanges = () => {
    const now = new Date()
    const startDateValue = new Date(now)
    const endDateValue = new Date(now)

    if (timeRange === "week") {
      // Get last 4 weeks
      startDateValue.setDate(now.getDate() - (now.getDay() + 28)) // Go back 4 weeks + days to get to a Sunday
      endDateValue.setDate(now.getDate() + (6 - now.getDay())) // Go forward to the end of the current week (Saturday)
    } else if (timeRange === "month") {
      // Get last 6 months
      startDateValue.setMonth(now.getMonth() - 6)
      startDateValue.setDate(1) // First day of that month
      endDateValue.setMonth(now.getMonth() + 1)
      endDateValue.setDate(0) // Last day of current month
    }

    setStartDate(formatDate(startDateValue))
    setEndDate(formatDate(endDateValue))
  }

  // Call this when viewMode or timeRange changes
  useEffect(() => {
    getDateRanges()
  }, [timeRange])

  // Prepare API call parameters based on current view mode
  // Range view API call
  const {
    data: rangeData,
    error: rangeError,
    isLoading: rangeLoading,
  } = useGetDashboardByDateTimeQuery({
    date: undefined,
    startDate: startDate,
    endDate: endDate,
    isDisplayWeek: timeRange === "week",
  }) as {
    data?: DashboardResponse
    error?: any
    isLoading: boolean
  }

  // Daily view API call
  const {
    data: dailyData,
    error: dailyError,
    isLoading: dailyLoading,
  } = useGetDashboardByDateTimeQuery({
    date: selectedDate,
    startDate: undefined,
    endDate: undefined,
    isDisplayWeek: undefined,
  }) as {
    data?: DashboardResponse
    error?: any
    isLoading: boolean
  }

  // Also get yesterday's data for comparison (for daily view)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const formattedYesterday = formatDate(yesterday)

  const {
    data: yesterdayData,
    error: yesterdayError,
    isLoading: yesterdayLoading,
  } = useGetDashboardByDateTimeQuery({
    date: formattedYesterday,
    startDate: undefined,
    endDate: undefined,
    isDisplayWeek: undefined,
  }) as {
    data?: DashboardResponse
    error?: any
    isLoading: boolean
  }

  // Process API response data
  const todayInfo = dailyData?.value?.datetimeInformation
  const dateRangeList = rangeData?.value?.datetimeInformationList
  const yesterdayInfo = yesterdayData?.value?.datetimeInformation

  // Calculate percentage changes vs yesterday (for daily view)
  const percentChanges: PercentChanges | null =
    todayInfo && yesterdayInfo
      ? {
          orderCustomers: calculatePercentageChange(
            todayInfo.totalCountOrderCustomer,
            yesterdayInfo.totalCountOrderCustomer || 0,
          ),
          scheduleCustomers: calculatePercentageChange(
            todayInfo.totalCountScheduleCustomer,
            yesterdayInfo.totalCountScheduleCustomer || 0,
          ),
          customerSchedules: calculatePercentageChange(
            todayInfo.totalCountCustomerSchedule,
            yesterdayInfo.totalCountCustomerSchedule || 0,
          ),
        }
      : null

  // Handle date inputs
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: "start" | "end" | "single") => {
    const value = e.target.value
    if (type === "start") {
      setStartDate(value)
    } else if (type === "end") {
      setEndDate(value)
    } else {
      setSelectedDate(value)
    }
  }

  // Main render function
  if (rangeLoading || dailyLoading || yesterdayLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-gray-600 dark:text-gray-300 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (rangeError || dailyError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">An error occurred</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Failed to fetch dashboard data. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Range View Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-indigo-500" />
            Range View
          </h2>

          {/* Range View Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-all hover:shadow-lg">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6 items-start md:items-center">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setTimeRange("week")}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    timeRange === "week"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeRange("month")}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    timeRange === "month"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Monthly
                </button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-indigo-500 mr-2" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleDateChange(e, "start")}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                </div>
                <span className="mx-2 text-gray-500 dark:text-gray-400">to</span>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-indigo-500 mr-2" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleDateChange(e, "end")}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Range View Content */}
          <div className="grid grid-cols-1 gap-8">
            {dateRangeList && dateRangeList.length > 0 ? (
              <>
                <TimeSeriesBarChart
                  data={dateRangeList}
                  isWeekly={timeRange === "week"}
                  fields={["OrderCustomers", "OrderPending", "ScheduleCustomers"]}
                  title="Customer Orders"
                  icon={<ShoppingCart className="w-5 h-5 mr-2 text-indigo-500" />}
                />
                <TimeSeriesBarChart
                  data={dateRangeList}
                  isWeekly={timeRange === "week"}
                  fields={["CustomerSchedules", "Pending", "InProgress", "Completed"]}
                  title="Schedule Status"
                  icon={<Calendar className="w-5 h-5 mr-2 text-violet-500" />}
                />
                <TimeSeriesBarChart
                  data={dateRangeList}
                  isWeekly={timeRange === "week"}
                  fields={["Revenue", "NormalRevenue", "LiveStreamRevenue"]}
                  title="Revenue Performance"
                  icon={<DollarSign className="w-5 h-5 mr-2 text-emerald-500" />}
                />
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-8 flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No Range Data Available</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    No data is available for the selected time period. Try selecting a different date range.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Daily View Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-indigo-500" />
            Daily View
          </h2>

          {/* Daily View Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-all hover:shadow-lg">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-indigo-500 mr-2" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e, "single")}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Daily View Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {todayInfo ? (
              <>
                <CustomerMetricsChart
                  orderCustomers={todayInfo.totalCountOrderCustomer || 0}
                  scheduleCustomers={todayInfo.totalCountScheduleCustomer || 0}
                  customerSchedules={todayInfo.totalCountCustomerSchedule || 0}
                  timeLabel="Today"
                  percentChanges={percentChanges}
                />

                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <ClipboardCheck className="w-5 h-5 mr-2 text-indigo-500" />
                    Schedule Status Distribution
                  </h3>

                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="w-full md:w-1/2 flex justify-center">
                      <div className="relative w-64 h-64">
                        <PieChart
                          pendingCount={todayInfo.totalCountCustomerSchedulePending || 0}
                          inProgressCount={todayInfo.totalCountCustomerScheduleInProgress || 0}
                          completedCount={todayInfo.totalCountCustomerScheduleCompleted || 0}
                          canceledCount={Math.max(
                            0,
                            (todayInfo.totalCountCustomerSchedule || 0) -
                              ((todayInfo.totalCountCustomerSchedulePending || 0) +
                                (todayInfo.totalCountCustomerScheduleInProgress || 0) +
                                (todayInfo.totalCountCustomerScheduleCompleted || 0)),
                          )}
                          totalCount={todayInfo.totalCountCustomerSchedule || 0}
                        />
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 mt-8 md:mt-0">
                      <div className="space-y-5">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-amber-500 dark:bg-amber-400 rounded-full mr-3"></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pending</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-bold text-gray-900 dark:text-white mr-2">
                              {todayInfo.totalCountCustomerSchedulePending || 0}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              (
                              {todayInfo.totalCountCustomerSchedule
                                ? Math.round(
                                    (todayInfo.totalCountCustomerSchedulePending /
                                      todayInfo.totalCountCustomerSchedule) *
                                      100,
                                  )
                                : 0}
                              %)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full mr-3"></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">In Progress</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-bold text-gray-900 dark:text-white mr-2">
                              {todayInfo.totalCountCustomerScheduleInProgress || 0}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              (
                              {todayInfo.totalCountCustomerSchedule
                                ? Math.round(
                                    (todayInfo.totalCountCustomerScheduleInProgress /
                                      todayInfo.totalCountCustomerSchedule) *
                                      100,
                                  )
                                : 0}
                              %)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-emerald-500 dark:bg-emerald-400 rounded-full mr-3"></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completed</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-bold text-gray-900 dark:text-white mr-2">
                              {todayInfo.totalCountCustomerScheduleCompleted || 0}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              (
                              {todayInfo.totalCountCustomerSchedule
                                ? Math.round(
                                    (todayInfo.totalCountCustomerScheduleCompleted /
                                      todayInfo.totalCountCustomerSchedule) *
                                      100,
                                  )
                                : 0}
                              %)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-red-500 dark:bg-red-400 rounded-full mr-3"></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Canceled</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-bold text-gray-900 dark:text-white mr-2">
                              {Math.max(
                                0,
                                (todayInfo.totalCountCustomerSchedule || 0) -
                                  ((todayInfo.totalCountCustomerSchedulePending || 0) +
                                    (todayInfo.totalCountCustomerScheduleInProgress || 0) +
                                    (todayInfo.totalCountCustomerScheduleCompleted || 0)),
                              )}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              (
                              {todayInfo.totalCountCustomerSchedule
                                ? Math.round(
                                    (Math.max(
                                      0,
                                      (todayInfo.totalCountCustomerSchedule || 0) -
                                        ((todayInfo.totalCountCustomerSchedulePending || 0) +
                                          (todayInfo.totalCountCustomerScheduleInProgress || 0) +
                                          (todayInfo.totalCountCustomerScheduleCompleted || 0)),
                                    ) /
                                      todayInfo.totalCountCustomerSchedule) *
                                      100,
                                  )
                                : 0}
                              %)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-8 flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No Daily Data Available</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    No data is available for the selected date. Try selecting a different date.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
