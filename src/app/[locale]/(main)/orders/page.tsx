"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";

import type { BookingStatus } from "@/features/booking/types";
import { useGetBookingsQuery } from "@/features/booking/api";
import { BookingCard } from "@/components/services/booking/bookingList/booking-card";
import { Pagination } from "@/components/services/user/pagination";

export default function UserBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus | "All">("All");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Use RTK Query hook with the current filters
  const { data, isLoading, refetch } = useGetBookingsQuery({
    pageIndex: pageIndex,
    pageSize: pageSize,
  });

  // Extract data from the query response
  const bookings = data?.value?.items || [];
  const totalCount = data?.value?.totalCount || 0;
  const hasNextPage = data?.value?.hasNextPage || false;
  const hasPreviousPage = data?.value?.hasPreviousPage || false;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleTabChange = (value: string) => {
    setActiveTab(value as BookingStatus | "All");
    setPageIndex(1); // Reset to first page when changing tabs
  };

  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  const handleStatusChange = () => {
    refetch();
  };

  // Count bookings by status
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const successCount = bookings.filter((b) => b.status === "Success").length;
  const canceledCount = bookings.filter((b) => b.status === "Canceled").length;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Lịch hẹn của tôi
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các dịch vụ bạn đã đặt lịch
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="h-9 px-4"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
          <Button
            size="sm"
            onClick={() => (window.location.href = "/booking/new")}
            className="h-9 px-4 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Đặt lịch mới
          </Button>
        </div>
      </div>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden">
        <Tabs
          defaultValue="All"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="bg-muted/30 border-b border-gray-200 dark:border-gray-800 px-4 py-2">
            <TabsList className="grid grid-cols-4 h-10">
              <TabsTrigger
                value="All"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Tất cả
                <span className="ml-2 bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                  {totalCount}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="Pending"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Đang xử lý
                <span className="ml-2 bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5 text-xs">
                  {pendingCount}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="Success"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Hoàn thành
                <span className="ml-2 bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs">
                  {successCount}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="Canceled"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Đã hủy
                <span className="ml-2 bg-red-100 text-red-800 rounded-full px-2 py-0.5 text-xs">
                  {canceledCount}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="p-4 pt-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-lg">Đang tải dữ liệu...</span>
              </div>
            ) : bookings.length > 0 ? (
              <>
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>

                <div className="mt-8">
                  <Pagination
                    currentPage={pageIndex}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-muted/10 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-medium mb-2">
                  Không tìm thấy lịch hẹn nào
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {activeTab === "All"
                    ? "Bạn chưa có lịch hẹn nào. Hãy đặt lịch ngay để trải nghiệm dịch vụ của chúng tôi!"
                    : `Bạn không có lịch hẹn nào ở trạng thái ${
                        activeTab === "Pending"
                          ? "đang xử lý"
                          : activeTab === "Success"
                          ? "hoàn thành"
                          : "đã hủy"
                      }`}
                </p>
                {activeTab === "All" && (
                  <Button
                    className="mt-6"
                    onClick={() => (window.location.href = "/booking/new")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Đặt lịch ngay
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
