"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  Search,
  Filter,
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
import { motion, AnimatePresence } from "framer-motion";
import { OrderDetailDialog } from "@/components/services/user/order-detail-dialog";
import { BookingDetailDialog } from "@/components/services/user/booking-detail-dialog";

// Types
interface Order {
  id: string;
  customerName: string;
  serviceName: string;
  finalAmount: number;
  orderDate: string;
  status: string;
}

interface Booking {
  id: string;
  customerName: string;
  start: string | null;
  end: string | null;
  serviceName: string;
  procedureId: string;
  stepIndex: string;
  name: string;
  duration: number;
  dateCompleted: string | null;
  status: string;
  date: string | null;
}

interface ApiResponse<T> {
  value: {
    items: T[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export default function UserOrdersPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real app, you would fetch from your API
        // For now, we'll use mock data
        const response: ApiResponse<Order> = {
          value: {
            items: [
              {
                id: "6cd74bf6-fc92-418b-815b-f7874230ef68",
                customerName: "Dung Cao",
                serviceName: "Service 123",
                finalAmount: 16000,
                orderDate: "2025-04-04",
                status: "Pending",
              },
              {
                id: "19534957-380e-4dbf-9aa4-b4b7f16ae0c6",
                customerName: "Dung Cao",
                serviceName: "Service 123",
                finalAmount: 16000,
                orderDate: "2025-04-04",
                status: "Completed",
              },
              {
                id: "876f672e-c085-4ce1-898f-cf3d12012faa",
                customerName: "Dung Cao",
                serviceName: "Service 123",
                finalAmount: 16000,
                orderDate: "2025-04-03",
                status: "Completed",
              },
              {
                id: "1ae88fda-cae5-4ee7-b2d4-0b29c4f89698",
                customerName: "Dung Cao",
                serviceName: "Nâng Mũi Cấu Trúc S-Line Premium",
                finalAmount: 440000,
                orderDate: "2025-04-01",
                status: "Pending",
              },
              {
                id: "59849e96-265a-498d-b6d5-253c210a0d5d",
                customerName: "Dung Cao",
                serviceName: "Nâng Mũi Cấu Trúc S-Line Premium",
                finalAmount: 440000,
                orderDate: "2025-04-01",
                status: "Pending",
              },
              {
                id: "d9ea21fd-741b-46f9-b625-3543d19483c8",
                customerName: "Dung Cao",
                serviceName: "Nâng Mũi Cấu Trúc S-Line Premium",
                finalAmount: 440000,
                orderDate: "2025-04-01",
                status: "Pending",
              },
              {
                id: "849085de-3df1-41bf-aa77-abbbd2afdbdf",
                customerName: "Dung Cao",
                serviceName: "Nâng Mũi Cấu Trúc S-Line Premium",
                finalAmount: 440000,
                orderDate: "2025-04-01",
                status: "Pending",
              },
              {
                id: "3a8ebaac-c411-4980-a5ee-bfa306328a54",
                customerName: "Dung Cao",
                serviceName: "Nâng Mũi Cấu Trúc S-Line Premium",
                finalAmount: 440000,
                orderDate: "2025-04-01",
                status: "Pending",
              },
              {
                id: "3ce6d151-89c1-498b-85ae-6e69f891441e",
                customerName: "Dung Cao",
                serviceName: "Nâng Mũi Cấu Trúc S-Line Premium",
                finalAmount: 440000,
                orderDate: "2025-04-01",
                status: "Pending",
              },
              {
                id: "5ceec7cd-9e61-4474-8d81-eda650ff9545",
                customerName: "Dung Cao",
                serviceName: "Nâng Mũi Cấu Trúc S-Line Premium",
                finalAmount: 440000,
                orderDate: "2025-04-01",
                status: "Pending",
              },
            ],
            pageIndex: 1,
            pageSize: 10,
            totalCount: 25,
            hasNextPage: true,
            hasPreviousPage: false,
          },
          isSuccess: true,
          isFailure: false,
          error: {
            code: "",
            message: "",
          },
        };

        setOrders(response.value.items);
        setTotalPages(
          Math.ceil(response.value.totalCount / response.value.pageSize)
        );
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchBookings = async () => {
      try {
        // In a real app, you would fetch from your API
        // For now, we'll use mock data
        const response: ApiResponse<Booking> = {
          value: {
            items: [
              {
                id: "58d6e760-ceb6-4da0-a80f-4322aa60df54",
                customerName: "Dung Cao",
                start: "08:00:00",
                end: "08:47:00",
                serviceName: "Service 123",
                procedureId: "e2f34233-d688-4960-b7ec-b2ea2479f7af",
                stepIndex: "1",
                name: "fsafafa",
                duration: 0,
                dateCompleted: "2025-04-07",
                status: "Completed",
                date: "2025-04-07",
              },
              {
                id: "a94c6f97-85e9-47c1-e1d0-08dd72daddfa",
                customerName: "Dung Cao",
                start: "07:00:00",
                end: "07:35:00",
                serviceName: "Service 123",
                procedureId: "88c59692-4097-4e3b-a8ce-0899416d76a1",
                stepIndex: "2",
                name: "fafaf",
                duration: 0,
                dateCompleted: null,
                status: "In Progress",
                date: "2025-05-10",
              },
              {
                id: "64281ea5-7eae-4920-e1d1-08dd72daddfa",
                customerName: "Dung Cao",
                start: null,
                end: null,
                serviceName: "Service 123",
                procedureId: "6575488a-8e18-4946-8182-81d16564f766",
                stepIndex: "3",
                name: "cơ bản",
                duration: 0,
                dateCompleted: null,
                status: "Pending",
                date: null,
              },
              {
                id: "2e525f4a-3eef-4093-e1d2-08dd72daddfa",
                customerName: "Dung Cao",
                start: null,
                end: null,
                serviceName: "Service 123",
                procedureId: "02fa1a8e-efa6-4375-a8da-c3447d12e2e0",
                stepIndex: "4",
                name: "dasdas",
                duration: 0,
                dateCompleted: null,
                status: "Pending",
                date: null,
              },
              {
                id: "9c4bd8b5-3c02-447b-e1d3-08dd72daddfa",
                customerName: "Dung Cao",
                start: null,
                end: null,
                serviceName: "Service 123",
                procedureId: "23ec0c4d-7004-4b9f-b9cf-cf28c7a75bd5",
                stepIndex: "5",
                name: "Name Price 1",
                duration: 0,
                dateCompleted: null,
                status: "Pending",
                date: null,
              },
              {
                id: "4db22aad-3178-4586-a39e-ebd340c5d3ba",
                customerName: "Dung Cao",
                start: "08:00:00",
                end: "08:35:00",
                serviceName: "Service 123",
                procedureId: "e2f34233-d688-4960-b7ec-b2ea2479f7af",
                stepIndex: "1",
                name: "fsafafa",
                duration: 0,
                dateCompleted: "2025-04-08",
                status: "Completed",
                date: "2025-04-08",
              },
              {
                id: "15514448-5b27-406c-91ed-3b0fc1793473",
                customerName: "Dung Cao",
                start: "08:00:00",
                end: "08:35:00",
                serviceName: "Service 123",
                procedureId: "e2f34233-d688-4960-b7ec-b2ea2479f7af",
                stepIndex: "1",
                name: "fsafafa",
                duration: 0,
                dateCompleted: "2025-04-05",
                status: "Pending",
                date: "2025-04-04",
              },
            ],
            pageIndex: 1,
            pageSize: 10,
            totalCount: 7,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          isSuccess: true,
          isFailure: false,
          error: {
            code: "",
            message: "",
          },
        };

        setBookings(response.value.items);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    fetchBookings();
  }, [currentPage]);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.serviceName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.serviceName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
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
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary"
                    />
                  </div>
                  <div className="w-full md:w-64">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary">
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4 text-gray-400" />
                          <SelectValue placeholder="Lọc theo trạng thái" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="Pending">Chờ xử lý</SelectItem>
                        <SelectItem value="In Progress">Đang xử lý</SelectItem>
                        <SelectItem value="Completed">Hoàn thành</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <TabsContent value="orders" className="mt-0">
                  <motion.div
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
                                  setCurrentPage((prev) =>
                                    Math.max(prev - 1, 1)
                                  )
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
                            <motion.div
                              key={booking.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{
                                y: -5,
                                transition: { duration: 0.2 },
                              }}
                              className="group"
                            >
                              <BookingDetailDialog booking={booking}>
                                <Card className="overflow-hidden cursor-pointer h-full transition-all duration-300 hover:shadow-lg border-0 shadow-md">
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
                                          <span className="inline-block w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 text-xs flex items-center justify-center font-bold mr-1.5">
                                            {booking.stepIndex}
                                          </span>
                                          Bước {booking.stepIndex}:{" "}
                                          {booking.name}
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
                              </BookingDetailDialog>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
