"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  AlertCircle,
  CalendarClock,
  Package,
  Eye,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { motion } from "framer-motion";
import { BookingDetailDialog } from "@/components/services/user/booking-detail-dialog";
import { OrderDetailDialog } from "@/components/services/user/order-detail-dialog";
import {
  useGetBookingsQuery,
  useGetOrdersQuery,
  useGetBookingByIdQuery,
} from "@/features/booking/api";
import { skipToken } from "@reduxjs/toolkit/query";
import type { Booking, Order } from "@/features/booking/types";

export default function UserOrdersPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery({
    pageIndex: currentPage - 1, // API typically uses 0-based indexing
    pageSize: 10, // Use a fixed page size instead of totalPages
    searchTerm,
    sortColumn: "orderDate",
    sortOrder: "desc",
  });
  const { data: bookingsData, isLoading: bookingsLoading } =
    useGetBookingsQuery({
      pageIndex: currentPage - 1, // API typically uses 0-based indexing
      pageSize: 10, // Use a fixed page size instead of totalPages
      searchTerm,
      sortColumn: "date",
      sortOrder: "desc",
    });
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const { data: bookingDetail } = useGetBookingByIdQuery(
    selectedBookingId ?? skipToken
  );

  // Fetch data
  useEffect(() => {
    if (ordersData?.value?.items) {
      setOrders(ordersData.value.items);
      setTotalPages(
        Math.ceil(ordersData.value.totalCount / ordersData.value.pageSize)
      );
    }

    if (bookingsData?.value?.items) {
      setBookings(bookingsData.value.items);
      if (activeTab === "bookings") {
        setTotalPages(
          Math.ceil(bookingsData.value.totalCount / bookingsData.value.pageSize)
        );
      }
    }
  }, [ordersData, bookingsData, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
    if (activeTab === "orders" && ordersData?.value) {
      setTotalPages(
        Math.ceil(ordersData.value.totalCount / ordersData.value.pageSize)
      );
    } else if (activeTab === "bookings" && bookingsData?.value) {
      setTotalPages(
        Math.ceil(bookingsData.value.totalCount / bookingsData.value.pageSize)
      );
    }
  }, [activeTab, ordersData, bookingsData]);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.serviceName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.serviceName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format time
  const formatTime = (time: string | null) => {
    if (!time) return "N/A";
    return time.substring(0, 5);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 border-0 text-white">
              Hoàn thành
            </Badge>
          </div>
        );
      case "Pending":
        return (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 border-0 text-white">
              Chờ xử lý
            </Badge>
          </div>
        );
      case "In Progress":
        return (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 border-0 text-white">
              Đang xử lý
            </Badge>
          </div>
        );
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "Pending":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "In Progress":
        return <Clock3 className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "Pending":
        return "bg-gradient-to-r from-yellow-400 to-amber-500";
      case "In Progress":
        return "bg-gradient-to-r from-blue-500 to-indigo-500";
      default:
        return "bg-gray-500";
    }
  };

  const loading = ordersLoading || bookingsLoading;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-2">
              Lịch sử đơn hàng
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Xem lại tất cả các đơn hàng và lịch hẹn của bạn tại đây. Bạn có
              thể theo dõi trạng thái và xem chi tiết mỗi đơn hàng.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  <TabsTrigger
                    value="orders"
                    className="text-base py-3 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md transition-all"
                  >
                    <Package className="mr-2 h-5 w-5" />
                    Đơn hàng
                  </TabsTrigger>
                  <TabsTrigger
                    value="bookings"
                    className="text-base py-3 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md transition-all"
                  >
                    <CalendarClock className="mr-2 h-5 w-5" />
                    Lịch hẹn
                  </TabsTrigger>
                </TabsList>

                {/* Search and filter controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      placeholder="Tìm kiếm theo tên dịch vụ..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-10 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Remove AnimatePresence wrapper to fix rendering issues */}
              <TabsContent value="orders" className="mt-0">
                <motion.div
                  key="orders-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-0">
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : filteredOrders.length === 0 ? (
                      <div className="text-center py-16">
                        <Package className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Không tìm thấy đơn hàng nào
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          Bạn chưa có đơn hàng nào hoặc không có đơn hàng nào
                          phù hợp với bộ lọc hiện tại.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b-0">
                                <TableHead className="font-semibold text-gray-600 dark:text-gray-300">
                                  Mã đơn hàng
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600 dark:text-gray-300">
                                  Dịch vụ
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600 dark:text-gray-300">
                                  Ngày đặt
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600 dark:text-gray-300">
                                  Tổng tiền
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600 dark:text-gray-300">
                                  Trạng thái
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600 dark:text-gray-300 text-right">
                                  Chi tiết
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredOrders.map((order, index) => (
                                <TableRow
                                  key={order.id}
                                  className={`
                                    hover:bg-gray-50 dark:hover:bg-gray-800/50 
                                    ${
                                      index % 2 === 0
                                        ? "bg-white dark:bg-gray-800"
                                        : "bg-gray-50/50 dark:bg-gray-800/30"
                                    }
                                    transition-colors
                                  `}
                                >
                                  <TableCell className="font-medium">
                                    <div className="flex items-center">
                                      <span
                                        className={`w-2 h-8 rounded-l-full mr-3 ${getStatusColor(
                                          order.status
                                        )}`}
                                      ></span>
                                      {order.id.substring(0, 8)}...
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="font-medium">
                                      {order.serviceName}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                      {format(
                                        parseISO(order.orderDate),
                                        "dd/MM/yyyy",
                                        { locale: vi }
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="font-semibold text-primary">
                                      {formatCurrency(order.finalAmount)}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {getStatusBadge(order.status)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <OrderDetailDialog order={order}>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-full h-8 w-8 p-0"
                                      >
                                        <Eye className="h-4 w-4" />
                                        <span className="sr-only">
                                          Xem chi tiết
                                        </span>
                                      </Button>
                                    </OrderDetailDialog>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-sm text-gray-500">
                            Hiển thị {filteredOrders.length} trên tổng số{" "}
                            {orders.length} đơn hàng
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                              }
                              disabled={currentPage === 1}
                              className="h-8 w-8 p-0 rounded-full"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium">
                              {currentPage} / {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(prev + 1, totalPages)
                                )
                              }
                              disabled={currentPage === totalPages}
                              className="h-8 w-8 p-0 rounded-full"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </motion.div>
              </TabsContent>

              <TabsContent value="bookings" className="mt-0">
                <motion.div
                  key="bookings-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-6">
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : filteredBookings.length === 0 ? (
                      <div className="text-center py-16">
                        <CalendarClock className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Không tìm thấy lịch hẹn nào
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          Bạn chưa có lịch hẹn nào hoặc không có lịch hẹn nào
                          phù hợp với bộ lọc hiện tại.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBookings.map((booking) => (
                          <BookingDetailDialog
                            booking={booking}
                            key={booking.id}
                          >
                            <motion.div
                              whileHover={{
                                y: -5,
                                transition: { duration: 0.2 },
                              }}
                              className="group"
                              onClick={() => setSelectedBookingId(booking.id)}
                            >
                              <Card className="overflow-hidden cursor-pointer h-full transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700 shadow-md">
                                <div
                                  className={`h-2 ${getStatusColor(
                                    booking.status
                                  )}`}
                                ></div>
                                <CardContent className="p-6 h-full flex flex-col">
                                  <div className="flex justify-between items-start mb-4">
                                    <div>
                                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                        {booking.serviceName}
                                      </h3>
                                      <p className="text-sm text-gray-500 flex items-center mt-1">
                                        <span className="inline-flex items-center justify-center rounded-full w-5 h-5 bg-gray-200 dark:bg-gray-700 text-xs font-bold mr-1.5">
                                          {booking.stepIndex}
                                        </span>
                                        Bước {booking.stepIndex}: {booking.name}
                                      </p>
                                    </div>
                                    {getStatusIcon(booking.status)}
                                  </div>

                                  <div className="space-y-3 flex-grow">
                                    {booking.date && (
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                          {format(
                                            parseISO(booking.date),
                                            "EEEE, dd/MM/yyyy",
                                            { locale: vi }
                                          )}
                                        </span>
                                      </div>
                                    )}

                                    {booking.start && booking.end && (
                                      <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                          {formatTime(booking.start)} -{" "}
                                          {formatTime(booking.end)}
                                        </span>
                                      </div>
                                    )}

                                    {booking.dateCompleted && (
                                      <div className="flex items-center text-green-600">
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        <span className="text-sm">
                                          Hoàn thành:{" "}
                                          {format(
                                            parseISO(booking.dateCompleted),
                                            "dd/MM/yyyy",
                                            { locale: vi }
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                      {getStatusBadge(booking.status)}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Eye className="h-4 w-4" />
                                        <span className="sr-only">
                                          Xem chi tiết
                                        </span>
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </BookingDetailDialog>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
