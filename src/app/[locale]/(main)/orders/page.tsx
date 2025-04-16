"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { vi } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarIcon,
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
  Filter,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { useGetBookingsQuery, useGetOrdersQuery } from "@/features/booking/api";
import type { Booking } from "@/features/booking/types";
import { BookingDetailDialog } from "@/components/services/user/booking-detail-dialog";
import { OrderDetailDialog } from "@/components/services/user/order-detail-dialog";
import { OrderItem } from "@/features/order/types";

export default function UserOrdersPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery({
    pageIndex: currentPage,
    pageSize: 10,
    searchTerm,
    sortColumn: "orderDate",
    sortOrder: "desc",
  });

  const { data: bookingsData, isLoading: bookingsLoading } =
    useGetBookingsQuery({
      pageIndex: currentPage,
      pageSize: 100,
      searchTerm,
      sortColumn: "date",
      sortOrder: "desc",
    });

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
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
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter bookings based on search term, status, and date
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.serviceName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    if (selectedDate) {
      return (
        matchesSearch &&
        matchesStatus &&
        booking.date &&
        isSameDay(parseISO(booking.date), selectedDate)
      );
    }

    return matchesSearch && matchesStatus;
  });

  // Generate calendar days with booking counts
  const generateCalendarDays = () => {
    if (!selectedDate) return [];

    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return days.map((day) => {
      const bookingsOnDay = bookings.filter(
        (booking) => booking.date && isSameDay(parseISO(booking.date), day)
      );

      return {
        date: day,
        bookings: bookingsOnDay,
        count: bookingsOnDay.length,
      };
    });
  };

  const calendarDays = generateCalendarDays();

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
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400"></span>
              Hoàn thành
            </div>
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/40">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400"></span>
              Chờ xử lý
            </div>
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400"></span>
              Đang xử lý
            </div>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0 dark:bg-gray-800 dark:text-gray-300">
            {status}
          </Badge>
        );
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
        );
      case "Pending":
        return (
          <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
        );
      case "In Progress":
        return <Clock3 className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
      default:
        return (
          <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        );
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 dark:bg-green-400";
      case "Pending":
        return "bg-amber-500 dark:bg-amber-400";
      case "In Progress":
        return "bg-blue-500 dark:bg-blue-400";
      default:
        return "bg-gray-500 dark:bg-gray-400";
    }
  };

  const loading = ordersLoading || bookingsLoading;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const renderBookingCard = (booking: Booking) => (
    <BookingDetailDialog booking={booking} key={booking.id}>
      <motion.div
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="h-full"
        onClick={() => setSelectedBookingId(booking.id)}
      >
        <Card className="overflow-hidden cursor-pointer h-full transition-all duration-300 hover:shadow-md border border-gray-100 dark:border-indigo-900/20 shadow-sm dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60">
          <div className={`h-1.5 ${getStatusColor(booking.status)}`}></div>
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base font-medium">
                  {booking.serviceName}
                </CardTitle>
                <CardDescription className="dark:text-indigo-300/80">
                  Bước {booking.stepIndex}: {booking.name}
                </CardDescription>
              </div>
              {getStatusIcon(booking.status)}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-3">
            {booking.date && (
              <div className="flex items-center text-sm dark:text-indigo-200">
                <CalendarIcon className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                <span>
                  {format(parseISO(booking.date), "EEE, dd/MM/yyyy", {
                    locale: vi,
                  })}
                </span>
              </div>
            )}

            {booking.start && booking.end && (
              <div className="flex items-center text-sm dark:text-indigo-200">
                <Clock className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                <span>
                  {formatTime(booking.start)} - {formatTime(booking.end)}
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-gray-100 dark:border-indigo-900/20">
            {getStatusBadge(booking.status)}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Xem chi tiết</span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </BookingDetailDialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-purple-900/90 dark:to-indigo-900/80 py-12">
      <div className="container px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 dark:bg-purple-500/30 text-purple-700 dark:text-purple-200 text-sm font-medium mb-2">
              Quản lý đơn hàng
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Lịch sử đơn hàng & Lịch hẹn
            </h1>
            <p className="text-gray-600 dark:text-indigo-200/80 max-w-2xl mx-auto">
              Xem lại tất cả các đơn hàng và lịch hẹn của bạn tại đây. Bạn có
              thể theo dõi trạng thái và xem chi tiết mỗi đơn hàng.
            </p>
          </div>

          {/* Main Content */}
          <Card className="border-0 shadow-lg overflow-hidden dark:bg-indigo-950/50 dark:backdrop-blur-sm dark:border dark:border-indigo-800/20">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <CardHeader className="pb-0 pt-6 px-6">
                <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-purple-100/50 dark:bg-indigo-900/50 rounded-xl">
                  <TabsTrigger
                    value="orders"
                    className="text-base py-2.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-800/80 data-[state=active]:shadow-sm transition-all"
                  >
                    <Package className="mr-2 h-5 w-5" />
                    Đơn hàng
                  </TabsTrigger>
                  <TabsTrigger
                    value="bookings"
                    className="text-base py-2.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-800/80 data-[state=active]:shadow-sm transition-all"
                  >
                    <CalendarClock className="mr-2 h-5 w-5" />
                    Lịch hẹn
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <div className="px-6 pt-6">
                {/* Search and filter controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-indigo-300"
                      size={18}
                    />
                    <Input
                      placeholder="Tìm kiếm theo tên dịch vụ..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-10 border-gray-200 dark:border-indigo-800/30 rounded-lg bg-white dark:bg-indigo-950/60 dark:placeholder:text-indigo-300/70 dark:text-indigo-200"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[180px] bg-white dark:bg-indigo-950/60 dark:border-indigo-800/30 dark:text-indigo-200">
                        <div className="flex items-center">
                          <Filter className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-400" />
                          <SelectValue placeholder="Trạng thái" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="dark:bg-indigo-950 dark:border-indigo-800/30">
                        <SelectItem
                          value="all"
                          className="dark:text-indigo-200 dark:focus:bg-indigo-900/60"
                        >
                          Tất cả trạng thái
                        </SelectItem>
                        <SelectItem
                          value="Completed"
                          className="dark:text-indigo-200 dark:focus:bg-indigo-900/60"
                        >
                          Hoàn thành
                        </SelectItem>
                        <SelectItem
                          value="In Progress"
                          className="dark:text-indigo-200 dark:focus:bg-indigo-900/60"
                        >
                          Đang xử lý
                        </SelectItem>
                        <SelectItem
                          value="Pending"
                          className="dark:text-indigo-200 dark:focus:bg-indigo-900/60"
                        >
                          Chờ xử lý
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <TabsContent
                  value="orders"
                  className="mt-0 pt-0 focus:outline-none"
                >
                  <motion.div
                    key="orders-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="p-0">
                      {loading ? (
                        <div className="flex justify-center items-center h-64">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 dark:border-purple-400"></div>
                        </div>
                      ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-16">
                          <Package className="h-16 w-16 mx-auto text-purple-300 dark:text-purple-500/50 mb-4" />
                          <h3 className="text-xl font-semibold text-gray-700 dark:text-indigo-200 mb-2">
                            Không tìm thấy đơn hàng nào
                          </h3>
                          <p className="text-gray-500 dark:text-indigo-300/70 max-w-md mx-auto">
                            Bạn chưa có đơn hàng nào hoặc không có đơn hàng nào
                            phù hợp với bộ lọc hiện tại.
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-purple-50/80 dark:bg-indigo-900/30 border-b-0">
                                <TableHead className="font-semibold text-gray-600 dark:text-indigo-200">
                                  Mã đơn hàng
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600 dark:text-indigo-200">
                                  Dịch vụ
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600 dark:text-indigo-200">
                                  Ngày đặt
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600 dark:text-indigo-200">
                                  Tổng tiền
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600 dark:text-indigo-200">
                                  Trạng thái
                                </TableHead>
                                <TableHead className="font-semibold text-gray-600 dark:text-indigo-200 text-right">
                                  Chi tiết
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredOrders.map((order, index) => (
                                <TableRow
                                  key={order.id}
                                  className={`
                                    hover:bg-purple-50/50 dark:hover:bg-indigo-900/40
                                    ${
                                      index % 2 === 0
                                        ? "bg-white dark:bg-indigo-950/30"
                                        : "bg-purple-50/30 dark:bg-indigo-950/50"
                                    }
                                    transition-colors
                                  `}
                                >
                                  <TableCell className="font-medium dark:text-indigo-200">
                                    <div className="flex items-center">
                                      <span
                                        className={`w-2 h-8 rounded-l-full mr-3 ${getStatusColor(
                                          order.status
                                        )}`}
                                      ></span>
                                      {order.id.substring(0, 8)}...
                                    </div>
                                  </TableCell>
                                  <TableCell className="dark:text-indigo-200">
                                    <div className="font-medium">
                                      {order.serviceName}
                                    </div>
                                  </TableCell>
                                  <TableCell className="dark:text-indigo-200">
                                    <div className="flex items-center">
                                      <CalendarIcon className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
                                      {format(
                                        parseISO(order.orderDate),
                                        "dd/MM/yyyy",
                                        { locale: vi }
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="font-semibold text-purple-600 dark:text-purple-300">
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
                                        size="icon"
                                        className="rounded-full h-8 w-8 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20"
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
                      )}

                      {/* Pagination */}
                      {filteredOrders.length > 0 && (
                        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-indigo-800/30">
                          <div className="text-sm text-gray-500 dark:text-indigo-300/70">
                            Hiển thị {filteredOrders.length} trên tổng số{" "}
                            {orders.length} đơn hàng
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                              }
                              disabled={currentPage === 1}
                              className="h-8 w-8 rounded-full border-purple-200 dark:border-indigo-800/30 dark:bg-indigo-950/60 dark:text-indigo-200 dark:hover:bg-indigo-900/60"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium dark:text-indigo-200">
                              {currentPage} / {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(prev + 1, totalPages)
                                )
                              }
                              disabled={currentPage === totalPages}
                              className="h-8 w-8 rounded-full border-purple-200 dark:border-indigo-800/30 dark:bg-indigo-950/60 dark:text-indigo-200 dark:hover:bg-indigo-900/60"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </motion.div>
                </TabsContent>

                <TabsContent
                  value="bookings"
                  className="mt-0 pt-0 focus:outline-none"
                >
                  <motion.div
                    key="bookings-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="p-6">
                      {loading ? (
                        <div className="flex justify-center items-center h-64">
                          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-purple-500 dark:border-purple-400"></div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Calendar date picker */}
                          <div className="flex justify-center">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-[260px] justify-start text-left font-normal bg-white dark:bg-indigo-950/60 dark:border-indigo-800/30 dark:text-indigo-200 hover:bg-purple-50 dark:hover:bg-indigo-900/60"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
                                  {selectedDate ? (
                                    format(selectedDate, "MMMM yyyy", {
                                      locale: vi,
                                    })
                                  ) : (
                                    <span>Chọn tháng</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0 dark:bg-indigo-950 dark:border-indigo-800/30"
                                align="center"
                              >
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  initialFocus
                                  className="dark:bg-indigo-950"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          {/* Calendar View */}
                          <div className="bg-white dark:bg-indigo-950/60 rounded-lg p-4 shadow-sm border border-purple-100 dark:border-indigo-800/30">
                            <div className="text-center mb-4">
                              <h3 className="font-semibold text-lg text-gray-800 dark:text-indigo-200">
                                {selectedDate &&
                                  format(selectedDate, "MMMM yyyy", {
                                    locale: vi,
                                  })}
                              </h3>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(
                                (day) => (
                                  <div
                                    key={day}
                                    className="text-center font-medium text-gray-600 dark:text-indigo-300 text-sm py-2"
                                  >
                                    {day}
                                  </div>
                                )
                              )}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                              {selectedDate &&
                                calendarDays.map((day, index) => {
                                  // Add empty cells for proper alignment
                                  const firstDayOfMonth =
                                    startOfMonth(selectedDate);
                                  const startingDayOfWeek =
                                    firstDayOfMonth.getDay();

                                  if (index === 0) {
                                    const emptyDays = Array.from(
                                      { length: startingDayOfWeek },
                                      (_, i) => (
                                        <div
                                          key={`empty-${i}`}
                                          className="h-24 p-1"
                                        ></div>
                                      )
                                    );

                                    return [
                                      ...emptyDays,
                                      <div
                                        key={day.date.toISOString()}
                                        className={`h-24 p-1 ${
                                          isSameDay(day.date, new Date())
                                            ? "bg-purple-500/20 dark:bg-purple-500/10 rounded-lg"
                                            : ""
                                        }`}
                                      >
                                        <div className="h-full border border-purple-100 dark:border-indigo-800/30 rounded-lg p-2 hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer transition-all">
                                          <div className="flex justify-between items-start">
                                            <div
                                              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                                                isSameDay(day.date, new Date())
                                                  ? "bg-purple-600 text-white dark:bg-purple-500"
                                                  : "text-gray-700 dark:text-indigo-200"
                                              }`}
                                            >
                                              {format(day.date, "d")}
                                            </div>
                                            {day.count > 0 && (
                                              <Badge className="bg-purple-600 dark:bg-purple-500 text-white">
                                                {day.count}
                                              </Badge>
                                            )}
                                          </div>

                                          <div className="mt-2 space-y-1">
                                            {day.bookings
                                              .slice(0, 2)
                                              .map((booking) => (
                                                <BookingDetailDialog
                                                  booking={booking}
                                                  key={booking.id}
                                                >
                                                  <div
                                                    className={`text-xs p-1 rounded truncate ${getStatusColor(
                                                      booking.status
                                                    )} text-white`}
                                                    onClick={() =>
                                                      setSelectedBookingId(
                                                        booking.id
                                                      )
                                                    }
                                                  >
                                                    {booking.start &&
                                                      formatTime(
                                                        booking.start
                                                      )}{" "}
                                                    {booking.serviceName.substring(
                                                      0,
                                                      10
                                                    )}
                                                    ...
                                                  </div>
                                                </BookingDetailDialog>
                                              ))}

                                            {day.count > 2 && (
                                              <div className="text-xs text-gray-500 dark:text-indigo-300/70 text-center">
                                                +{day.count - 2} lịch hẹn khác
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>,
                                    ];
                                  }

                                  return (
                                    <div
                                      key={day.date.toISOString()}
                                      className={`h-24 p-1 ${
                                        isSameDay(day.date, new Date())
                                          ? "bg-purple-500/20 dark:bg-purple-500/10 rounded-lg"
                                          : ""
                                      }`}
                                    >
                                      <div className="h-full border border-purple-100 dark:border-indigo-800/30 rounded-lg p-2 hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer transition-all">
                                        <div className="flex justify-between items-start">
                                          <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                                              isSameDay(day.date, new Date())
                                                ? "bg-purple-600 text-white dark:bg-purple-500"
                                                : "text-gray-700 dark:text-indigo-200"
                                            }`}
                                          >
                                            {format(day.date, "d")}
                                          </div>
                                          {day.count > 0 && (
                                            <Badge className="bg-purple-600 dark:bg-purple-500 text-white">
                                              {day.count}
                                            </Badge>
                                          )}
                                        </div>

                                        <div className="mt-2 space-y-1">
                                          {day.bookings
                                            .slice(0, 2)
                                            .map((booking) => (
                                              <BookingDetailDialog
                                                booking={booking}
                                                key={booking.id}
                                              >
                                                <div
                                                  className={`text-xs p-1 rounded truncate ${getStatusColor(
                                                    booking.status
                                                  )} text-white`}
                                                  onClick={() =>
                                                    setSelectedBookingId(
                                                      booking.id
                                                    )
                                                  }
                                                >
                                                  {booking.start &&
                                                    formatTime(
                                                      booking.start
                                                    )}{" "}
                                                  {booking.serviceName.substring(
                                                    0,
                                                    10
                                                  )}
                                                  ...
                                                </div>
                                              </BookingDetailDialog>
                                            ))}

                                          {day.count > 2 && (
                                            <div className="text-xs text-gray-500 dark:text-indigo-300/70 text-center">
                                              +{day.count - 2} lịch hẹn khác
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>

                          {/* Bookings for selected day */}
                          {filteredBookings.length > 0 ? (
                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg text-gray-800 dark:text-indigo-200">
                                Lịch hẹn ngày{" "}
                                {selectedDate &&
                                  format(selectedDate, "dd/MM/yyyy", {
                                    locale: vi,
                                  })}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredBookings.map((booking) =>
                                  renderBookingCard(booking)
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-purple-50 dark:bg-indigo-900/30 rounded-lg">
                              <CalendarClock className="h-12 w-12 mx-auto text-purple-300 dark:text-purple-500/50 mb-3" />
                              <h3 className="text-lg font-semibold text-gray-700 dark:text-indigo-200 mb-1">
                                Không có lịch hẹn
                              </h3>
                              <p className="text-gray-500 dark:text-indigo-300/70 max-w-md mx-auto">
                                Không có lịch hẹn nào vào ngày{" "}
                                {selectedDate &&
                                  format(selectedDate, "dd/MM/yyyy", {
                                    locale: vi,
                                  })}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
