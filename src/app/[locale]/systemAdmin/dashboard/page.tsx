"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Calendar,
  ArrowUpRight,
  Users,
  Building,
  Briefcase,
  CircleDollarSign,
  CreditCard,
  PiggyBank,
  ShoppingBag,
  X,
} from "lucide-react";
import {
  format,
  parseISO,
  isValid,
  subMonths,
  isAfter,
  isBefore,
  subDays,
} from "date-fns";
import { vi as viLocale, enUS } from "date-fns/locale";
import { useGetDashboardAdminByDateTimeQuery } from "@/features/dashboard/api";
import type {
  AdminDashboardDateTimeResponse,
  AdminDashboardInformation,
} from "@/features/dashboard/types";

// DatePicker component imports
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

// Import language components
import { useTranslations, useLocale } from "next-intl";

// Format currency function
const formatCurrency = (value: number, locale: string): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

// StatCard component
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend = 0,
  formatter = (val: any) => val.toString(),
  comparedText,
}: {
  title: string;
  value: number;
  icon: any;
  trend?: number;
  formatter?: (val: any) => string;
  comparedText: string;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {title}
        </div>
        <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <div className="text-2xl font-bold mb-1 dark:text-white">
        {formatter(value)}
      </div>
      {trend !== 0 && (
        <div
          className={`flex items-center text-sm ${
            trend > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          <ArrowUpRight
            className={`w-4 h-4 mr-1 ${
              trend < 0 ? "transform rotate-180" : ""
            }`}
          />
          <span>
            {Math.abs(trend)}% {comparedText}
          </span>
        </div>
      )}
    </div>
  );
};

// Date Range Picker Component
const DateRangePicker = ({
  dateRange,
  setDateRange,
  onRangeChange,
  t,
  locale,
}: {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  onRangeChange: (range: DateRange | undefined) => void;
  t: any;
  locale: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Limit date range to 6 months in the past
  const sixMonthsAgo = subMonths(new Date(), 6);
  const today = new Date();

  const handleRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      onRangeChange(range);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                {format(dateRange.to, "dd/MM/yyyy")}
              </>
            ) : (
              format(dateRange.from, "dd/MM/yyyy")
            )
          ) : (
            <span>{t("timeSection.selectRange")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleRangeChange}
          numberOfMonths={2}
          disabled={(date) =>
            isBefore(date, sixMonthsAgo) || isAfter(date, today)
          }
          locale={locale === "vi" ? viLocale : enUS}
        />
        <div className="p-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {t("timeSection.limitMessage")}
            </div>
            {dateRange?.from && dateRange?.to && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRangeChange(undefined)}
                className="h-7 px-2 text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                {t("timeSection.clear")}
              </Button>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                const today = new Date();
                const lastWeek = subDays(today, 7);
                handleRangeChange({
                  from: lastWeek,
                  to: today,
                });
              }}
            >
              {t("timeSection.last7Days")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                const today = new Date();
                const lastMonth = subMonths(today, 1);
                handleRangeChange({
                  from: lastMonth,
                  to: today,
                });
              }}
            >
              {t("timeSection.last30Days")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                const today = new Date();
                const last3Months = subMonths(today, 3);
                handleRangeChange({
                  from: last3Months,
                  to: today,
                });
              }}
            >
              {t("timeSection.last3Months")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Dashboard component
export default function AdminDashboard() {
  const t = useTranslations("dashboard.systemAdmin");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params if available
  const initTimeframe =
    (searchParams?.get("timeframe") as "week" | "month") || "week";

  const [timeframe, setTimeframe] = useState<"week" | "month">(initTimeframe);
  const [prevTimeframe, setPrevTimeframe] = useState<"week" | "month">(
    initTimeframe
  );

  // Date Range state
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const fromParam = searchParams?.get("from");
    const toParam = searchParams?.get("to");

    if (fromParam && toParam) {
      return {
        from: parseISO(fromParam),
        to: parseISO(toParam),
      };
    }

    // Default to last month
    return {
      from: subMonths(new Date(), 1),
      to: new Date(),
    };
  });

  const [startDate, setStartDate] = useState<string>(
    dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : ""
  );
  const [endDate, setEndDate] = useState<string>(
    dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : ""
  );

  const [dashboardData, setDashboardData] =
    useState<AdminDashboardDateTimeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // For tracking previous period data to calculate trends
  const [prevPeriodData, setPrevPeriodData] =
    useState<AdminDashboardInformation | null>(null);

  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setStartDate(format(range.from, "yyyy-MM-dd"));
      setEndDate(format(range.to, "yyyy-MM-dd"));
    }
  };

  // Format date string for display
  const formatDateRange = (start: string, end: string): string => {
    const startDate = parseISO(start);
    const endDate = parseISO(end);

    if (!isValid(startDate) || !isValid(endDate)) {
      return "Invalid date range";
    }

    if (timeframe === "week") {
      return `${format(startDate, "dd/MM")} - ${format(endDate, "dd/MM/yyyy")}`;
    } else {
      return format(startDate, "MMMM yyyy", {
        locale: locale === "vi" ? viLocale : enUS,
      });
    }
  };

  // Prepare chart data - handle periods with no values better
  const prepareChartData = () => {
    if (
      !dashboardData?.systemInformationList ||
      dashboardData.systemInformationList.length === 0
    ) {
      return [];
    }

    // Sort the data by date (oldest to newest)
    const sortedData = [...dashboardData.systemInformationList].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return sortedData.map((item) => ({
      name: formatDateRange(item.startDate, item.endDate),
      totalRevenue: item.information.totalSumRevenue,
      systemRevenue: item.information.totalSystemSumRevenue,
      clinicRevenue: item.information.totalSumClinicRevenue,
      bronzeSubscriptions: item.information.totalCountBronzeSubscription,
      silverSubscriptions: item.information.totalCountSilverSubscription,
      goldSubscriptions: item.information.totalCountGoldSubscription,
      totalBrandings: item.information.totalCountBranding,
      totalBranches: item.information.totalCountBranches,
      startDate: item.startDate,
      endDate: item.endDate,
    }));
  };

  // Calculate date ranges based on timeframe - dynamically detect date ranges with data
  const calculateDateRanges = () => {
    const today = new Date();
    let start, end;

    if (timeframe === "week") {
      // Default to last 4 weeks if no data is found
      const currentDayOfWeek = today.getDay() || 7; // Sunday is 0, adjust to 7
      const daysFromMonday = currentDayOfWeek - 1;
      start = new Date(today);
      start.setDate(today.getDate() - daysFromMonday - 28); // 4 weeks ago

      end = new Date(today);
      end.setDate(today.getDate() - daysFromMonday + 6); // Sunday of this week
    } else {
      // Default to last 6 months if no data is found
      start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    // Limit to 6 months in the past
    const sixMonthsAgo = subMonths(today, 6);
    if (start < sixMonthsAgo) {
      start = sixMonthsAgo;
    }

    // If we have existing data from API, adjust the range to include periods with data
    if (
      dashboardData?.systemInformationList &&
      dashboardData.systemInformationList.length > 0
    ) {
      // Find periods with non-zero data
      const periodsWithData = dashboardData.systemInformationList.filter(
        (item) => {
          const info = item.information;
          return (
            info.totalSumRevenue > 0 ||
            info.totalCountBranding > 0 ||
            info.totalCountBranches > 0 ||
            info.totalCountService > 0 ||
            info.totalCountDoctor > 0
          );
        }
      );

      if (periodsWithData.length > 0) {
        // Find earliest and latest dates with data
        let earliestDate = new Date(periodsWithData[0].startDate);
        let latestDate = new Date(periodsWithData[0].endDate);

        periodsWithData.forEach((period) => {
          const periodStart = new Date(period.startDate);
          const periodEnd = new Date(period.endDate);

          if (periodStart < earliestDate) earliestDate = periodStart;
          if (periodEnd > latestDate) latestDate = periodEnd;
        });

        // Adjust range to include some context (2 weeks/2 months before and after data)
        if (timeframe === "week") {
          start = new Date(earliestDate);
          start.setDate(start.getDate() - 14); // 2 weeks before

          end = new Date(latestDate);
          end.setDate(end.getDate() + 14); // 2 weeks after
        } else {
          start = new Date(earliestDate);
          start.setMonth(start.getMonth() - 2); // 2 months before

          end = new Date(latestDate);
          end.setMonth(end.getMonth() + 2); // 2 months after
        }

        // Limit to 6 months in the past
        if (start < sixMonthsAgo) {
          start = sixMonthsAgo;
        }

        // Limit to today
        if (end > today) {
          end = today;
        }
      }
    }

    return {
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
    };
  };

  // Update date range when timeframe changes or when new data is received
  useEffect(() => {
    // Only calculate new date ranges if we don't have dates yet or timeframe changed
    if (!startDate || !endDate || prevTimeframe !== timeframe) {
      const { startDate: newStart, endDate: newEnd } = calculateDateRanges();
      setStartDate(newStart);
      setEndDate(newEnd);
      setPrevTimeframe(timeframe);
    }
  }, [timeframe, dashboardData]);

  // API query params
  const queryParams = {
    startDate: startDate,
    endDate: endDate,
    isDisplayWeek: timeframe === "week",
  };

  // Use RTK Query hook to fetch dashboard data
  const {
    data: apiData,
    error: apiError,
    isLoading: isApiLoading,
  } = useGetDashboardAdminByDateTimeQuery(queryParams, {
    skip: !startDate || !endDate,
  });

  // Transform API response to match expected structure
  useEffect(() => {
    if (apiData && apiData.isSuccess) {
      // Map the API response structure to our dashboard data structure
      setDashboardData({
        systemInformation: apiData.value.systemInformation, // This might be null
        systemInformationList:
          apiData.value.systemInformationList.map((item) => ({
            information: item.information,
            startDate: item.startDate,
            endDate: item.endDate,
          })) || [],
      });
      setLoading(false);
      setError(null);
    } else if (apiError) {
      setError(t("error.defaultMessage"));
      setLoading(false);
    }
  }, [apiData, apiError]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("timeframe", timeframe);
    if (startDate) params.set("from", startDate);
    if (endDate) params.set("to", endDate);

    const url = `${window.location.pathname}?${params.toString()}`;
    router.push(url);
  }, [timeframe, startDate, endDate, router]);

  // Calculate trend percentages for metrics
  const calculateTrend = (current: number, previous: number): number => {
    if (!previous) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Get current and previous period data
  const getCurrentPeriodData = () => {
    if (
      !dashboardData?.systemInformationList ||
      dashboardData.systemInformationList.length === 0
    ) {
      return null;
    }

    // Filter out periods with all zeros
    const periodsWithData = dashboardData.systemInformationList.filter(
      (item) => {
        const info = item.information;
        return (
          info.totalSumRevenue > 0 ||
          info.totalCountBranding > 0 ||
          info.totalCountBranches > 0
        );
      }
    );

    // Sort periods by date (most recent first)
    const sortedPeriods = [...periodsWithData].sort((a, b) => {
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    });

    // If we found periods with data, use the most recent one
    if (sortedPeriods.length > 0) {
      return sortedPeriods[0].information;
    }

    // Fallback to the most recent period even if it's all zeros
    return dashboardData.systemInformationList[0].information;
  };

  const currentPeriodData = getCurrentPeriodData();

  // Find previous period with non-zero data for trend calculation
  useEffect(() => {
    if (
      dashboardData?.systemInformationList &&
      dashboardData.systemInformationList.length > 1
    ) {
      // Filter out periods with all zeros
      const periodsWithData = dashboardData.systemInformationList.filter(
        (item) => {
          const info = item.information;
          return (
            info.totalSumRevenue > 0 ||
            info.totalCountBranding > 0 ||
            info.totalCountBranches > 0
          );
        }
      );

      // Sort periods by date (most recent first)
      const sortedPeriods = [...periodsWithData].sort((a, b) => {
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      });

      // If we have at least 2 periods with data, use the second one as previous
      if (sortedPeriods.length > 1) {
        setPrevPeriodData(sortedPeriods[1].information);
      } else if (sortedPeriods.length === 1) {
        // If we only have one period with data, use the most recent period with all zeros as previous
        const zeroDataPeriods = dashboardData.systemInformationList.filter(
          (item) => {
            const info = item.information;
            return (
              info.totalSumRevenue === 0 &&
              info.totalCountBranding === 0 &&
              info.totalCountBranches === 0
            );
          }
        );

        if (zeroDataPeriods.length > 0) {
          // Sort by date
          const sortedZeroPeriods = [...zeroDataPeriods].sort((a, b) => {
            return (
              new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
            );
          });

          setPrevPeriodData(sortedZeroPeriods[0].information);
        } else {
          // Fallback to second period in list
          setPrevPeriodData(dashboardData.systemInformationList[1].information);
        }
      } else {
        // If no periods with data, use second period in list
        setPrevPeriodData(dashboardData.systemInformationList[1].information);
      }
    }
  }, [dashboardData]);

  // Calculate trends for key metrics
  const trends = {
    totalRevenue: calculateTrend(
      currentPeriodData?.totalSumRevenue || 0,
      prevPeriodData?.totalSumRevenue || 0
    ),
    systemRevenue: calculateTrend(
      currentPeriodData?.totalSystemSumRevenue || 0,
      prevPeriodData?.totalSystemSumRevenue || 0
    ),
    clinicRevenue: calculateTrend(
      currentPeriodData?.totalSumClinicRevenue || 0,
      prevPeriodData?.totalSumClinicRevenue || 0
    ),
    doctors: calculateTrend(
      currentPeriodData?.totalCountDoctor || 0,
      prevPeriodData?.totalCountDoctor || 0
    ),
  };

  const chartData = prepareChartData();

  if (loading || isApiLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || (apiData && apiData.isFailure)) {
    const errorMessage = apiData?.isFailure
      ? apiData.error?.message || t("error.defaultMessage")
      : error || t("error.defaultMessage");

    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-lg">
          <h3 className="font-bold text-lg mb-2">{t("error.title")}</h3>
          <p>{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-gray-100">
            {t("title")}
          </h1>
          <div className="flex items-center gap-3"></div>
        </div>

        {/* Time period selector with date range picker */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-500" />
              <h2 className="text-lg font-medium dark:text-gray-100">
                {t("timeSection.time")}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <DateRangePicker
                dateRange={dateRange}
                setDateRange={setDateRange}
                onRangeChange={handleDateRangeChange}
                t={t}
                locale={locale}
              />

              <div className="flex space-x-2">
                <button
                  onClick={() => setTimeframe("week")}
                  className={`px-4 py-2 rounded-md ${
                    timeframe === "week"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {t("timeSection.week")}
                </button>
                <button
                  onClick={() => setTimeframe("month")}
                  className={`px-4 py-2 rounded-md ${
                    timeframe === "month"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {t("timeSection.month")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data availability notification - dynamic content based on data */}
        {dashboardData?.systemInformationList &&
          dashboardData.systemInformationList.every(
            (item) =>
              item.information.totalSumRevenue === 0 &&
              item.information.totalCountBranding === 0 &&
              item.information.totalCountBranches === 0
          ) && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    {t("notifications.noData")}
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Show notification only when we have some data but not in all periods */}
        {dashboardData?.systemInformationList &&
          dashboardData.systemInformationList.some(
            (item) =>
              item.information.totalSumRevenue > 0 ||
              item.information.totalCountBranding > 0
          ) &&
          dashboardData.systemInformationList.some(
            (item) =>
              item.information.totalSumRevenue === 0 &&
              item.information.totalCountBranding === 0
          ) && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    {t("notifications.partialData")}
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={t("stats.totalRevenue")}
            value={currentPeriodData?.totalSumRevenue || 0}
            icon={CircleDollarSign}
            formatter={(val) => formatCurrency(val, locale)}
            trend={trends.totalRevenue}
            comparedText={t("stats.comparedToPrevious")}
          />
          <StatCard
            title={t("stats.systemRevenue")}
            value={currentPeriodData?.totalSystemSumRevenue || 0}
            icon={PiggyBank}
            formatter={(val) => formatCurrency(val, locale)}
            trend={trends.systemRevenue}
            comparedText={t("stats.comparedToPrevious")}
          />
          <StatCard
            title={t("stats.clinicRevenue")}
            value={currentPeriodData?.totalSumClinicRevenue || 0}
            icon={ShoppingBag}
            formatter={(val) => formatCurrency(val, locale)}
            trend={trends.clinicRevenue}
            comparedText={t("stats.comparedToPrevious")}
          />
          <StatCard
            title={t("stats.totalDoctors")}
            value={currentPeriodData?.totalCountDoctor || 0}
            icon={Users}
            trend={trends.doctors}
            comparedText={t("stats.comparedToPrevious")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={t("stats.brands")}
            value={currentPeriodData?.totalCountBranding || 0}
            icon={Building}
            comparedText={t("stats.comparedToPrevious")}
          />
          <StatCard
            title={t("stats.branches")}
            value={currentPeriodData?.totalCountBranches || 0}
            icon={Building}
            comparedText={t("stats.comparedToPrevious")}
          />
          <StatCard
            title={t("stats.services")}
            value={currentPeriodData?.totalCountService || 0}
            icon={Briefcase}
            comparedText={t("stats.comparedToPrevious")}
          />
          <StatCard
            title={t("stats.pendingBrands")}
            value={currentPeriodData?.totalCountBrandPending || 0}
            icon={Building}
            comparedText={t("stats.comparedToPrevious")}
          />
        </div>

        {/* Subscriptions stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            title={t("stats.bronzePackage")}
            value={currentPeriodData?.totalCountBronzeSubscription || 0}
            icon={CreditCard}
            formatter={(val) =>
              `${val} (${formatCurrency(
                currentPeriodData?.totalSumBronzeSubscriptionRevenue || 0,
                locale
              )})`
            }
            comparedText={t("stats.comparedToPrevious")}
          />
          <StatCard
            title={t("stats.silverPackage")}
            value={currentPeriodData?.totalCountSilverSubscription || 0}
            icon={CreditCard}
            formatter={(val) =>
              `${val} (${formatCurrency(
                currentPeriodData?.totalSumSilverSubscriptionRevenue || 0,
                locale
              )})`
            }
            comparedText={t("stats.comparedToPrevious")}
          />
          <StatCard
            title={t("stats.goldPackage")}
            value={currentPeriodData?.totalCountGoldSubscription || 0}
            icon={CreditCard}
            formatter={(val) =>
              `${val} (${formatCurrency(
                currentPeriodData?.totalSumGoldSubscriptionRevenue || 0,
                locale
              )})`
            }
            comparedText={t("stats.comparedToPrevious")}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 dark:text-gray-100">
              {t("charts.revenueChart")}
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => {
                      return value / 1000000 + "M";
                    }}
                  />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value, locale)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalRevenue"
                    name={t("charts.totalRevenue")}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="systemRevenue"
                    name={t("charts.systemRevenue")}
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clinicRevenue"
                    name={t("charts.clinicRevenue")}
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subscriptions Chart */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 dark:text-gray-100">
              {t("charts.subscriptionChart")}
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="bronzeSubscriptions"
                    name={t("charts.bronzePackage")}
                    fill="#cd7f32"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="silverSubscriptions"
                    name={t("charts.silverPackage")}
                    fill="#c0c0c0"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="goldSubscriptions"
                    name={t("charts.goldPackage")}
                    fill="#ffd700"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Clinic and Branch Growth Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-medium mb-4 dark:text-gray-100">
            {t("charts.growthChart")}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalBrandings"
                  name={t("charts.totalBrands")}
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalBranches"
                  name={t("charts.totalBranches")}
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
