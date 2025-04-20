// hooks/useOrderBookingData.ts
import { useState, useEffect } from "react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { useGetBookingsQuery, useGetOrdersQuery } from "@/features/booking/api";
import type { Booking } from "@/features/booking/types";
import type { CreateFeedbackPayload, OrderItem } from "@/features/order/types";

export function useOrderBookingData(t: any) {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [calendarBookings, setCalendarBookings] = useState<Booking[]>([]);

  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    customerName: true,
    serviceName: true,
    orderDate: true,
    finalAmount: true,
    feedback: true,
    status: true,
    details: true,
  });

  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery({
    pageIndex: currentPage,
    pageSize,
    searchTerm,
    sortColumn: "orderDate",
    sortOrder: "desc",
  });

  const { data: bookingsData, isLoading: bookingsLoading } =
    useGetBookingsQuery({
      pageIndex: currentPage,
      pageSize,
      searchTerm,
      sortColumn: "date",
      sortOrder: "desc",
    });

  const { data: calendarData, isLoading: calendarLoading } =
    useGetBookingsQuery({
      pageIndex: 1,
      pageSize: 1000,
      searchTerm: "",
      sortColumn: "date",
      sortOrder: "asc",
    });

  useEffect(() => {
    if (ordersData?.value?.items) {
      setOrders(ordersData.value.items);
      if (activeTab === "orders") {
        setTotalPages(
          Math.ceil(ordersData.value.totalCount / ordersData.value.pageSize)
        );
      }
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
    if (calendarData?.value?.items) {
      setCalendarBookings(calendarData.value.items);
    }
  }, [calendarData]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.serviceName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const [selectedDayBookings, setSelectedDayBookings] = useState<Booking[]>([]);
  const [selectedDayFormatted, setSelectedDayFormatted] = useState("");
  const [isBookingsDialogOpen, setIsBookingsDialogOpen] = useState(false);

  const handleDayClick = (day: { date: Date; bookings: Booking[] }) => {
    setSelectedDayBookings(day.bookings);
    setSelectedDayFormatted(format(day.date, "dd/MM/yyyy"));
    setIsBookingsDialogOpen(true);
  };

  return {
    activeTab,
    setActiveTab,
    orders,
    bookings,
    calendarBookings,
    filteredOrders,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    statusFilter,
    setStatusFilter,
    columnVisibility,
    setColumnVisibility,
    loading: ordersLoading || bookingsLoading || calendarLoading,
    selectedDayBookings,
    selectedDayFormatted,
    isBookingsDialogOpen,
    setIsBookingsDialogOpen,
    handleDayClick,
  };
}
export const createFeedbackFormData = (
  payload: CreateFeedbackPayload
): FormData => {
  const formData = new FormData();

  // Add basic fields
  formData.append("orderId", payload.orderId);
  formData.append("content", payload.content);
  formData.append("rating", payload.rating.toString());

  // Add scheduleFeedbacks as JSON string
  formData.append(
    "scheduleFeedbacks",
    JSON.stringify(payload.scheduleFeedbacks)
  );

  // Add images (if any)
  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return formData;
};
