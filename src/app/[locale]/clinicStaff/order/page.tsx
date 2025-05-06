"use client";
import { useState, useMemo } from "react";
import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
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
  ChevronDown,
  MoreHorizontal,
  Loader2,
  Columns,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useGetOrdersQuery } from "@/features/order/api"; // Adjust the import path as needed
import { useDebounce } from "@/hooks/use-debounce"; // Assuming you have this hook
import Pagination from "@/components/common/Pagination/Pagination"; // Adjust the import path as needed
import type { OrderItem } from "@/features/order/types";
import { formatCurrency } from "@/utils";
import { OrderDetailDialog } from "@/components/clinicStaff/order/order-detail-dialog";
import { useTranslations } from "next-intl";

const getStatusBadge = (status: string, t: any) => {
  switch (status.toLowerCase()) {
    case "completed":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          {t("statusCompleted")}
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          {t("statusPending")}
        </Badge>
      );
    case "cancelled":
    case "canceled":
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          {t("statusCancelled")}
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function OrderPage() {
  const t = useTranslations("clinicStaffOrder");

  // State for pagination, search, and sorting
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // State for order detail dialog
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Define column keys as a type for type safety
  type ColumnKey =
    | "customerName"
    | "service"
    | "date"
    | "finalAmount"
    | "status"
    | "bookingType"
    | "actions";

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<
    Record<ColumnKey, boolean>
  >({
    customerName: true,
    service: true,
    date: true,
    finalAmount: true,
    status: true,
    bookingType: true,
    actions: true,
  });

  // Define available columns
  const availableColumns = useMemo(
    () => [
      { id: "customerName" as ColumnKey, label: t("customerName") },
      { id: "service" as ColumnKey, label: t("service") },
      { id: "date" as ColumnKey, label: t("date") },
      { id: "finalAmount" as ColumnKey, label: t("finalAmount") },
      { id: "status" as ColumnKey, label: t("status") },
      {
        id: "bookingType" as ColumnKey,
        label: t("bookingType") || "Booking Type",
      },
      { id: "actions" as ColumnKey, label: t("actions") },
    ],
    [t]
  );

  // Toggle column visibility
  const toggleColumnVisibility = (columnId: ColumnKey) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  // Get visible columns
  const visibleColumns = useMemo(
    () => availableColumns.filter((column) => columnVisibility[column.id]),
    [availableColumns, columnVisibility]
  );

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch orders using RTK Query
  const { data, isLoading, error } = useGetOrdersQuery({
    pageIndex,
    pageSize,
    searchTerm: debouncedSearchTerm,
    sortColumn,
    sortOrder,
  });

  // Extract orders and pagination info from the response
  const orders = data?.value?.items || [];
  const totalCount = data?.value?.totalCount || 0;
  const hasNextPage = data?.value?.hasNextPage || false;
  const hasPreviousPage = data?.value?.hasPreviousPage || false;

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Format date as DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    // Format time as HH:MM
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return (
      <div className="flex flex-col">
        <div className="font-medium">{`${day}/${month}/${year}`}</div>
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <Clock className="h-3 w-3 text-muted-foreground" />
          {`${hours}:${minutes}`}
        </div>
      </div>
    );
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPageIndex(1); // Reset to first page when search changes
  };

  // Handle view order details
  const handleViewOrderDetails = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  // Reset column visibility to default
  const resetColumnVisibility = () => {
    setColumnVisibility({
      customerName: true,
      service: true,
      date: true,
      finalAmount: true,
      status: true,
      bookingType: true,
      actions: true,
    } as Record<ColumnKey, boolean>);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("pageTitle")}</h1>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input
            className="w-64"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {/* Column visibility dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Columns size={16} />
                {t("columnDisplay")}
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={resetColumnVisibility}>
                {t("resetFilters")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {availableColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={columnVisibility[column.id]}
                  onCheckedChange={() => toggleColumnVisibility(column.id)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("pageTitle")}</CardTitle>
          <CardDescription>{t("pageDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">{t("loading")}</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              {t("errorLoadingOrders")}. {t("errorTryAgain")}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {visibleColumns.map((column) => (
                      <TableHead key={column.id} className="text-center">
                        {column.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {t("noOrdersFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order: OrderItem) => (
                      <TableRow key={order.id}>
                        {columnVisibility.customerName && (
                          <TableCell className="text-center">
                            {order.customerName}
                          </TableCell>
                        )}
                        {columnVisibility.service && (
                          <TableCell className="text-center">
                            {order.serviceName}
                          </TableCell>
                        )}
                        {columnVisibility.date && (
                          <TableCell className="text-center">
                            {formatDate(order.orderDate)}
                          </TableCell>
                        )}
                        {columnVisibility.finalAmount && (
                          <TableCell className="text-center">
                            {formatCurrency(order.finalAmount)} đ
                          </TableCell>
                        )}
                        {columnVisibility.status && (
                          <TableCell className="text-center">
                            {getStatusBadge(order.status, t)}
                          </TableCell>
                        )}
                        {columnVisibility.bookingType && (
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                order.isFromLivestream ? "secondary" : "outline"
                              }
                            >
                              {order.isFromLivestream
                                ? t("livestreamBooking") || "Livestream"
                                : t("webBooking") || "Website"}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.actions && (
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewOrderDetails(order)}
                              >
                                {t("viewDetails")}
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    {t("printInvoice")}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    {t("updateStatus")}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    {t("cancelOrder")}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {orders.length > 0 && (
                <div className="mt-4">
                  <Pagination
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalCount={totalCount}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    onPageChange={setPageIndex}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  );
}
