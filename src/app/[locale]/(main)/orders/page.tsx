"use client";

// Cleaned-up base structure. Suggest splitting this into modular components below.

import React, { useState, useEffect } from "react";
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
import { useTranslations } from "next-intl";

import { useGetBookingsQuery, useGetOrdersQuery } from "@/features/booking/api";
import type { Booking } from "@/features/booking/types";
import type { OrderItem } from "@/features/order/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOrderBookingData } from "@/hooks/useOrderBookingData";
import { SearchAndFilterPanel } from "@/components/services/user/SearchAndFilterPanel";
// import { OrderTable } from "@/components/services/user/order-table";
import { PaginationControl } from "@/components/services/user/PaginationControl";
import { BookingCalendar } from "@/components/services/user/BookingCalendar";
import { BookingDetailDialog } from "@/components/services/user/booking-detail-dialog";
import { BookingsDialog } from "@/components/services/user/booking-dialog";
import {
  formatCurrency,
  formatTime,
  getFeedbackStars,
  getStatusBadge,
  getStatusColor,
  getStatusIcon,
} from "@/utils/orderHelpers";

export default function UserOrdersPage() {
  const t = useTranslations("orderMessages");
  const {
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
    loading,
    selectedDayBookings,
    selectedDayFormatted,
    isBookingsDialogOpen,
    setIsBookingsDialogOpen,
    handleDayClick,
  } = useOrderBookingData(t);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-purple-900/90 dark:to-indigo-900/80 py-12">
      <div className="container px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="text-center space-y-3">
            <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 dark:bg-purple-500/30 text-purple-700 dark:text-purple-200 text-sm font-medium mb-2">
              {t("title")}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {t("subtitle")}
            </h1>
            <p className="text-gray-600 dark:text-indigo-200/80 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </header>

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
                    className="text-base py-2.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-800/80"
                  >
                    {t("tabs.orders")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="bookings"
                    className="text-base py-2.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-800/80"
                  >
                    {t("tabs.bookings")}
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <div className="px-6 pt-6">
                <SearchAndFilterPanel
                  t={t}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  columnVisibility={columnVisibility}
                  setColumnVisibility={setColumnVisibility}
                  activeTab={activeTab}
                />
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
                    {/* <OrderTable
                    columns={columnVisibility}
                    /> */}
                    <PaginationControl
                      t={t}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      pageSize={pageSize}
                      setPageSize={setPageSize}
                      totalPages={totalPages}
                      filteredLength={filteredOrders.length}
                      totalCount={orders.length}
                    />
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
                    <BookingCalendar
                      t={t}
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                      calendarBookings={calendarBookings}
                      handleDayClick={handleDayClick}
                      loading={loading}
                    />
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </Card>
        </div>
      </div>

      <Dialog
        open={isBookingsDialogOpen}
        onOpenChange={setIsBookingsDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px] dark:bg-indigo-950 dark:border-indigo-800/30">
          <DialogHeader>
            <DialogTitle>Lịch hẹn ngày {selectedDayFormatted}</DialogTitle>
            <DialogDescription>
              Danh sách các lịch hẹn trong ngày {selectedDayFormatted}.
            </DialogDescription>
          </DialogHeader>
          <div className="divide-y divide-gray-200 dark:divide-indigo-800/30">
            {selectedDayBookings.length > 0 ? (
              selectedDayBookings.map((booking) => (
                <div key={booking.id} className="py-4">
                  <BookingDetailDialog booking={booking} />
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-indigo-300/70">
                  Không có lịch hẹn nào trong ngày này.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <BookingsDialog
        isOpen={isBookingsDialogOpen}
        onClose={() => setIsBookingsDialogOpen(false)}
        bookings={selectedDayBookings}
        date={selectedDayFormatted}
        getStatusBadge={getStatusBadge}
        getStatusIcon={getStatusIcon}
        getStatusColor={getStatusColor}
        formatTime={formatTime}
      />
    </div>
  );
}
