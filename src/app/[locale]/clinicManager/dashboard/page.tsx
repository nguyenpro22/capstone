"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Building2,
  DollarSign,
  Clock,
  Search,
  Calendar,
  Bell,
  ChevronDown,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  AlertCircle,
  XCircle,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  TrendingUp,
  Layers,
  Briefcase,
  Settings,
} from "lucide-react";

// Dummy data for the chart
const revenueData = [
  { month: "Jan", revenue: 35000, lastYear: 28000 },
  { month: "Feb", revenue: 42000, lastYear: 32000 },
  { month: "Mar", revenue: 38000, lastYear: 30000 },
  { month: "Apr", revenue: 45000, lastYear: 34000 },
  { month: "May", revenue: 55000, lastYear: 38000 },
  { month: "Jun", revenue: 60000, lastYear: 42000 },
  { month: "Jul", revenue: 58000, lastYear: 45000 },
  { month: "Aug", revenue: 65000, lastYear: 48000 },
  { month: "Sep", revenue: 70000, lastYear: 52000 },
  { month: "Oct", revenue: 75000, lastYear: 56000 },
  { month: "Nov", revenue: 80000, lastYear: 60000 },
  { month: "Dec", revenue: 89000, lastYear: 65000 },
];

// Dummy data for the approval history
const approvalHistory = [
  {
    id: 1,
    clinicName: "Beauty Clinic Spa",
    logo: "https://placehold.co/40x40.png",
    location: "6096 Marigalline Landing, New York",
    dateTime: "12.09.2023 - 12:53 PM",
    piece: 423,
    amount: 34295,
    status: "accepted",
  },
  {
    id: 2,
    clinicName: "Wellness Center",
    logo: "https://placehold.co/40x40.png",
    location: "2234 Health Avenue, Los Angeles",
    dateTime: "11.09.2023 - 10:30 AM",
    piece: 215,
    amount: 18750,
    status: "pending",
  },
  {
    id: 3,
    clinicName: "Dermatology Plus",
    logo: "https://placehold.co/40x40.png",
    location: "8901 Skin Care Blvd, Chicago",
    dateTime: "10.09.2023 - 03:15 PM",
    piece: 178,
    amount: 12480,
    status: "rejected",
  },
  {
    id: 4,
    clinicName: "Dental Excellence",
    logo: "https://placehold.co/40x40.png",
    location: "4567 Smile Street, Miami",
    dateTime: "09.09.2023 - 09:45 AM",
    piece: 312,
    amount: 27650,
    status: "accepted",
  },
  {
    id: 5,
    clinicName: "Vision Care Center",
    logo: "https://placehold.co/40x40.png",
    location: "7890 Clear View Road, Seattle",
    dateTime: "08.09.2023 - 02:20 PM",
    piece: 156,
    amount: 14320,
    status: "pending",
  },
];

// Dummy data for recent activities
const recentActivities = [
  {
    id: 1,
    action: "New clinic registered",
    user: "Wellness Spa Center",
    time: "2 hours ago",
    icon: Building2,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    action: "Payment received",
    user: "Beauty Clinic Spa",
    time: "4 hours ago",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 3,
    action: "New user registered",
    user: "John Smith",
    time: "6 hours ago",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 4,
    action: "Approval request",
    user: "Dental Excellence",
    time: "8 hours ago",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-600",
  },
];

export default function Dashboard() {
  const t = useTranslations("dashboard"); // Sử dụng namespace "dashboard"
  const [chartType, setChartType] = useState("bar");
  const [timeRange, setTimeRange] = useState("year");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = approvalHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(approvalHistory.length / itemsPerPage);

  // Function to render the status badge
  const renderStatusBadge = (status: any) => {
    switch (status) {
      case "accepted":
        return (
          <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {t("accepted")}
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            {t("pending")}
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            {t("rejected")}
          </span>
        );
      default:
        return null;
    }
  };

  // Function to render the chart
  const renderChart = () => {
    // In a real application, you would use a chart library like Chart.js or Recharts
    // For this example, we'll create a simple visual representation
    const maxRevenue = Math.max(...revenueData.map((item) => item.revenue));

    return (
      <div className="mt-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{t("currentYear")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-sm text-gray-600">{t("previousYear")}</span>
          </div>
        </div>

        <div className="flex items-end space-x-2 h-64 overflow-x-auto pb-4">
          {revenueData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center flex-shrink-0"
              style={{ width: "60px" }}
            >
              <div
                className="relative w-12 mb-2"
                style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
              >
                <div
                  className="absolute bottom-0 w-full bg-purple-500 rounded-t-md"
                  style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                ></div>
                <div
                  className="absolute bottom-0 w-full bg-gray-300 rounded-t-md"
                  style={{
                    height: `${(item.lastYear / maxRevenue) * 100}%`,
                    width: "40%",
                    left: "30%",
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{item.month}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">
              {t("totalRevenue")}
            </h3>
            <p className="text-2xl font-bold mt-1">$712,345</p>
            <div className="flex items-center mt-2 text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>+12.5% {t("fromLastYear")}</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">
              {t("averageRevenue")}
            </h3>
            <p className="text-2xl font-bold mt-1">$59,362</p>
            <div className="flex items-center mt-2 text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>+8.2% {t("fromLastYear")}</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">
              {t("highestMonth")}
            </h3>
            <p className="text-2xl font-bold mt-1">Dec ($89,000)</p>
            <div className="flex items-center mt-2 text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>+15.3% {t("fromLastYear")}</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">
              {t("lowestMonth")}
            </h3>
            <p className="text-2xl font-bold mt-1">Jan ($35,000)</p>
            <div className="flex items-center mt-2 text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>+5.1% {t("fromLastYear")}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {t("dashboard")}
            </h1>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("search")}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>

              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src="https://placehold.co/32x32.png"
                    alt="User"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {t("totalUsers")}
                </p>
                <h2 className="text-3xl font-bold mt-2 text-gray-900">
                  40,689
                </h2>
                <div className="flex items-center mt-2 text-green-500">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">
                    +8.5% {t("fromYesterday")}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>

            {/* Mini Sparkline Chart */}
            <div className="mt-4 h-10">
              <div className="flex items-end space-x-1 h-full">
                {[40, 35, 50, 45, 60, 55, 65, 70, 85].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-100 rounded-sm"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {t("totalClinics")}
                </p>
                <h2 className="text-3xl font-bold mt-2 text-gray-900">
                  10,293
                </h2>
                <div className="flex items-center mt-2 text-green-500">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">
                    +1.3% {t("fromLastWeek")}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Building2 className="w-6 h-6 text-green-500" />
              </div>
            </div>

            {/* Mini Sparkline Chart */}
            <div className="mt-4 h-10">
              <div className="flex items-end space-x-1 h-full">
                {[50, 55, 45, 60, 65, 60, 70, 75, 80].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-green-100 rounded-sm"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {t("totalRevenue")}
                </p>
                <h2 className="text-3xl font-bold mt-2 text-gray-900">
                  $89,000
                </h2>
                <div className="flex items-center mt-2 text-red-500">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">
                    -4.3% {t("fromYesterday")}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-500" />
              </div>
            </div>

            {/* Mini Sparkline Chart */}
            <div className="mt-4 h-10">
              <div className="flex items-end space-x-1 h-full">
                {[80, 75, 85, 70, 65, 60, 55, 50, 45].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-red-100 rounded-sm"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {t("totalPending")}
                </p>
                <h2 className="text-3xl font-bold mt-2 text-gray-900">2,040</h2>
                <div className="flex items-center mt-2 text-green-500">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">
                    +1.8% {t("fromYesterday")}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>

            {/* Mini Sparkline Chart */}
            <div className="mt-4 h-10">
              <div className="flex items-end space-x-1 h-full">
                {[30, 40, 35, 45, 50, 55, 50, 60, 65].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-yellow-100 rounded-sm"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Revenue Chart - Takes up 2/3 of the width on large screens */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {t("revenueDetails")}
              </h2>

              <div className="flex flex-wrap items-center mt-4 sm:mt-0 gap-3">
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    className={`p-1.5 rounded-md text-xs font-medium ${
                      chartType === "bar"
                        ? "bg-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setChartType("bar")}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-1.5 rounded-md text-xs font-medium ${
                      chartType === "line"
                        ? "bg-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setChartType("line")}
                  >
                    <LineChart className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-1.5 rounded-md text-xs font-medium ${
                      chartType === "pie"
                        ? "bg-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setChartType("pie")}
                  >
                    <PieChart className="w-4 h-4" />
                  </button>
                </div>

                <select
                  className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="week">{t("lastWeek")}</option>
                  <option value="month">{t("lastMonth")}</option>
                  <option value="quarter">{t("lastQuarter")}</option>
                  <option value="year">{t("lastYear")}</option>
                </select>

                <button className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {renderChart()}
          </div>

          {/* Recent Activity - Takes up 1/3 of the width on large screens */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {t("recentActivity")}
              </h2>
              <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                {t("viewAll")}
              </button>
            </div>

            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className={`p-2 rounded-lg ${activity.color} mr-4 mt-1`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">{activity.user}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                {t("quickActions")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Users className="w-5 h-5 text-purple-600 mb-2" />
                  <span className="text-xs text-gray-700">
                    {t("manageUsers")}
                  </span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Building2 className="w-5 h-5 text-green-600 mb-2" />
                  <span className="text-xs text-gray-700">
                    {t("manageClinics")}
                  </span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Activity className="w-5 h-5 text-blue-600 mb-2" />
                  <span className="text-xs text-gray-700">
                    {t("viewReports")}
                  </span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Settings className="w-5 h-5 text-gray-600 mb-2" />
                  <span className="text-xs text-gray-700">{t("settings")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Approval History */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {t("approvalHistory")}
              </h2>

              <div className="flex items-center mt-4 sm:mt-0 space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("searchClinics")}
                    className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>

                <button className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center">
                  <Filter className="w-4 h-4 mr-1" />
                  <span className="text-sm">{t("filter")}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3 font-medium">{t("clinicName")}</th>
                  <th className="px-6 py-3 font-medium">{t("location")}</th>
                  <th className="px-6 py-3 font-medium">{t("dateTime")}</th>
                  <th className="px-6 py-3 font-medium">{t("piece")}</th>
                  <th className="px-6 py-3 font-medium">{t("amount")}</th>
                  <th className="px-6 py-3 font-medium">{t("status")}</th>
                  <th className="px-6 py-3 font-medium">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image
                            src={item.logo || "/placeholder.svg"}
                            alt={item.clinicName}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {item.clinicName}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: #{item.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.dateTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.piece}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${item.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 rounded-full hover:bg-gray-100 text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {t("showing")} {indexOfFirstItem + 1} {t("to")}{" "}
              {Math.min(indexOfLastItem, approvalHistory.length)} {t("of")}{" "}
              {approvalHistory.length} {t("entries")}
            </div>
            <div className="flex items-center space-x-2">
              <button
                className={`p-2 rounded-md border ${
                  currentPage === 1
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                {t("previous")}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`w-8 h-8 rounded-md ${
                      currentPage === page
                        ? "bg-purple-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className={`p-2 rounded-md border ${
                  currentPage === totalPages
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                {t("next")}
              </button>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">{t("userGrowth")}</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">+24.5%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {t("comparedToLastMonth")}
                </p>
              </div>
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">
                {t("clinicRegistrations")}
              </h3>
              <Layers className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">+12.3%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {t("comparedToLastMonth")}
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">{t("approvalRate")}</h3>
              <Briefcase className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">92.7%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {t("comparedToLastMonth")}
                </p>
              </div>
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
