"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  Clock,
  Eye,
  X,
  Filter,
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { Booking } from "@/features/booking/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDetailDialog } from "./booking-detail-dialog";

interface BookingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  date: string;
  getStatusBadge: (status: string) => JSX.Element;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusColor: (status: string) => string;
  formatTime: (time: string | null) => string;
}

export function BookingsDialog({
  isOpen,
  onClose,
  bookings,
  date,
  getStatusBadge,
  getStatusIcon,
  getStatusColor,
  formatTime,
}: BookingsDialogProps) {
  const t = useTranslations("orderMessages");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(bookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("time");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Update filtered bookings when props or filters change
  useEffect(() => {
    let result = [...bookings];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (booking) =>
          booking.serviceName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((booking) => booking.status === statusFilter);
    }

    // Apply tab filter
    if (activeTab !== "all") {
      // Morning: before 12:00, Afternoon: after 12:00
      result = result.filter((booking) => {
        if (!booking.start) return true;
        const hour = Number.parseInt(booking.start.split(":")[0]);
        return activeTab === "morning" ? hour < 12 : hour >= 12;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "time") {
        const timeA = a.start || "00:00";
        const timeB = b.start || "00:00";
        return sortOrder === "asc"
          ? timeA.localeCompare(timeB)
          : timeB.localeCompare(timeA);
      } else if (sortBy === "service") {
        return sortOrder === "asc"
          ? a.serviceName.localeCompare(b.serviceName)
          : b.serviceName.localeCompare(a.serviceName);
      } else {
        // status
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
    });

    setFilteredBookings(result);
  }, [bookings, searchTerm, statusFilter, sortBy, sortOrder, activeTab]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
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
              <span className="sr-only">{t("viewDetails")}</span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </BookingDetailDialog>
  );

  // Get status icon for filter dropdown
  const getStatusFilterIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
        );
      case "Pending":
        return (
          <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-2" />
        );
      case "In Progress":
        return (
          <Clock3 className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
        );
      default:
        return <Filter className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className=" [&>button]:hidden sm:max-w-[900px] p-0 overflow-hidden border-0 shadow-xl max-h-[90vh] dark:bg-gray-900 rounded-xl">
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
                onClick={onClose}
              >
                <X className="h-4 w-4 text-white" />
                <span className="sr-only">{t("close")}</span>
              </Button>
            </DialogClose>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
                <CalendarIcon className="h-6 w-6" />
                {t("bookingsForDate", { date })}
              </DialogTitle>
              <DialogDescription className="text-white/80">
                {bookings.length > 0
                  ? t("bookingsCount", { count: bookings.length })
                  : t("noBookingsForDate")}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <div className="p-0 dark:bg-gray-900">
          {/* Filter and search bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={18}
                />
                <Input
                  placeholder="Tìm kiếm lịch hẹn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      {getStatusFilterIcon(statusFilter)}
                      <SelectValue placeholder="Trạng thái" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="all" className="dark:text-gray-300">
                      <div className="flex items-center">Tất cả trạng thái</div>
                    </SelectItem>
                    <SelectItem
                      value="Completed"
                      className="dark:text-gray-300"
                    >
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                        Hoàn thành
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="In Progress"
                      className="dark:text-gray-300"
                    >
                      <div className="flex items-center">
                        <Clock3 className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
                        Đang xử lý
                      </div>
                    </SelectItem>
                    <SelectItem value="Pending" className="dark:text-gray-300">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-2" />
                        Chờ xử lý
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sắp xếp theo" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="time" className="dark:text-gray-300">
                      Thời gian
                    </SelectItem>
                    <SelectItem value="service" className="dark:text-gray-300">
                      Tên dịch vụ
                    </SelectItem>
                    <SelectItem value="status" className="dark:text-gray-300">
                      Trạng thái
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSortOrder}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <ArrowDownUp
                    className={`h-4 w-4 ${
                      sortOrder === "desc" ? "rotate-180" : ""
                    } transition-transform`}
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs for morning/afternoon */}
          <div className="px-4 pt-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 h-10">
                <TabsTrigger value="all" className="text-sm">
                  Tất cả
                </TabsTrigger>
                <TabsTrigger value="morning" className="text-sm">
                  Buổi sáng
                </TabsTrigger>
                <TabsTrigger value="afternoon" className="text-sm">
                  Buổi chiều
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="p-6 max-h-[calc(90vh-220px)] overflow-y-auto">
            {filteredBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBookings.map((booking) => renderBookingCard(booking))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <CalendarIcon className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {searchTerm || statusFilter !== "all" || activeTab !== "all"
                    ? "Không tìm thấy lịch hẹn nào phù hợp"
                    : t("noBookingsTitle")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all" || activeTab !== "all"
                    ? "Thử thay đổi bộ lọc để xem nhiều kết quả hơn"
                    : t("noBookingsDescription")}
                </p>
                {(searchTerm ||
                  statusFilter !== "all" ||
                  activeTab !== "all") && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setActiveTab("all");
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            )}
          </div>

          {filteredBookings.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
              Hiển thị {filteredBookings.length} trên tổng số {bookings.length}{" "}
              lịch hẹn
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
