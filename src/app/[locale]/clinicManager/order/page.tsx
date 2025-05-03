"use client";
import { useState, useEffect } from "react";
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
  Filter,
  ChevronDown,
  MoreHorizontal,
  Loader2,
  ArrowUp,
  ArrowDown,
  Phone,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetOrdersForClinicAdminQuery } from "@/features/order/api"; // Adjust the import path as needed
import { useDebounce } from "@/hooks/use-debounce"; // Assuming you have this hook
import Pagination from "@/components/common/Pagination/Pagination"; // Your existing pagination component
import type { OrderItem } from "@/features/order/types";
import { formatCurrency } from "@/utils";
import { OrderDetailDialog } from "@/components/clinicStaff/order/order-detail-dialog";
import { useTranslations } from "next-intl";
// Add a new import for the Checkbox component
import { Checkbox } from "@/components/ui/checkbox";

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

// SortableTableHead component for column sorting
interface SortableTableHeadProps {
  column: string;
  currentSortColumn: string;
  currentSortOrder: string;
  onSort: (column: string) => void;
  children: React.ReactNode;
  className?: string;
}

function SortableTableHead({
  column,
  currentSortColumn,
  currentSortOrder,
  onSort,
  children,
  className = "",
}: SortableTableHeadProps) {
  const isActive = currentSortColumn === column;

  return (
    <TableHead
      className={`cursor-pointer hover:bg-muted/50 transition-colors ${className}`}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center justify-center gap-1">
        {children}
        {isActive && (
          <span className="ml-1">
            {currentSortOrder === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </span>
        )}
      </div>
    </TableHead>
  );
}

// Add this new interface after the SortableTableHead component
interface ColumnVisibility {
  id: boolean;
  customerName: boolean;
  customerPhone: boolean;
  serviceName: boolean;
  orderDate: boolean;
  finalAmount: boolean;
  status: boolean;
  actions: boolean;
}

export default function OrderPage() {
  const t = useTranslations("clinicStaffOrder");

  // State for pagination, search, and sorting
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  // Add a state to track if we should show pagination
  const [showPagination, setShowPagination] = useState(false);

  // State for order detail dialog
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Add this state for column visibility after the other state declarations in the OrderPage component
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: true,
    customerName: true,
    customerPhone: true,
    serviceName: true,
    orderDate: true,
    finalAmount: true,
    status: true,
    actions: true,
  });

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch orders using RTK Query
  const { data, isLoading, error } = useGetOrdersForClinicAdminQuery({
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

  // Determine if pagination should be shown based on total count
  useEffect(() => {
    if (totalCount > 0) {
      setShowPagination(true);
    }
  }, [totalCount]);

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

  // Handle column sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort column and default to ascending order
      setSortColumn(column);
      setSortOrder("asc");
    }
    // Reset to first page when sorting changes
    setPageIndex(1);
  };

  // Handle view order details
  const handleViewOrderDetails = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPageIndex(1); // Reset to first page when page size changes
  };

  // Modified page change handler to prevent pagination from disappearing
  const handlePageChange = (newPage: number) => {
    // If we're going to the last page, make sure we don't lose pagination
    if (newPage === Math.ceil(totalCount / pageSize)) {
      // We're going to the last page
      setPageIndex(newPage);
    } else {
      setPageIndex(newPage);
    }
  };

  // Reset all filters and sorting
  const resetFilters = () => {
    setSearchTerm("");
    setSortColumn("");
    setSortOrder("");
    setPageIndex(1);
    setColumnVisibility({
      id: true,
      customerName: true,
      customerPhone: true,
      serviceName: true,
      orderDate: true,
      finalAmount: true,
      status: true,
      actions: true,
    });
  };

  // Active filters display
  const hasActiveFilters = searchTerm || sortColumn;

  // Add this function to toggle column visibility
  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("pageTitle")}</h1>

      <div className="flex flex-col gap-4">
        {/* Replace the existing filter button with this dropdown that includes column selection */}
        <div className="flex flex-wrap gap-4 items-center">
          <Input
            className="w-64"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                {t("filter")}
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <div className="p-2">
                <h4 className="mb-2 font-medium">
                  {t("columns") || "Columns"}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="column-id"
                      checked={columnVisibility.id}
                      onCheckedChange={() => toggleColumnVisibility("id")}
                    />
                    <label
                      htmlFor="column-id"
                      className="text-sm cursor-pointer"
                    >
                      {t("orderId")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="column-customerName"
                      checked={columnVisibility.customerName}
                      onCheckedChange={() =>
                        toggleColumnVisibility("customerName")
                      }
                    />
                    <label
                      htmlFor="column-customerName"
                      className="text-sm cursor-pointer"
                    >
                      {t("customerName")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="column-customerPhone"
                      checked={columnVisibility.customerPhone}
                      onCheckedChange={() =>
                        toggleColumnVisibility("customerPhone")
                      }
                    />
                    <label
                      htmlFor="column-customerPhone"
                      className="text-sm cursor-pointer"
                    >
                      {t("customerPhone")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="column-serviceName"
                      checked={columnVisibility.serviceName}
                      onCheckedChange={() =>
                        toggleColumnVisibility("serviceName")
                      }
                    />
                    <label
                      htmlFor="column-serviceName"
                      className="text-sm cursor-pointer"
                    >
                      {t("service")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="column-orderDate"
                      checked={columnVisibility.orderDate}
                      onCheckedChange={() =>
                        toggleColumnVisibility("orderDate")
                      }
                    />
                    <label
                      htmlFor="column-orderDate"
                      className="text-sm cursor-pointer"
                    >
                      {t("orderDate")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="column-finalAmount"
                      checked={columnVisibility.finalAmount}
                      onCheckedChange={() =>
                        toggleColumnVisibility("finalAmount")
                      }
                    />
                    <label
                      htmlFor="column-finalAmount"
                      className="text-sm cursor-pointer"
                    >
                      {t("finalAmount")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="column-status"
                      checked={columnVisibility.status}
                      onCheckedChange={() => toggleColumnVisibility("status")}
                    />
                    <label
                      htmlFor="column-status"
                      className="text-sm cursor-pointer"
                    >
                      {t("status")}
                    </label>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetFilters}>
                {t("resetFilters")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={resetFilters} size="sm">
              {t("resetFilters")}
            </Button>
          )}
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="outline" className="px-2 py-1">
                {t("searchPlaceholder")}: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-2 hover:bg-muted rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {sortColumn && (
              <Badge variant="outline" className="px-2 py-1">
                {t("sort")}: {sortColumn} (
                {sortOrder === "asc" ? t("ascending") : t("descending")})
                <button
                  onClick={() => {
                    setSortColumn("");
                    setSortOrder("");
                  }}
                  className="ml-2 hover:bg-muted rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
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
              <div className="overflow-x-auto">
                <Table>
                  {/* Modify the TableHeader section to respect column visibility */}
                  <TableHeader>
                    <TableRow>
                      {columnVisibility.id && (
                        <SortableTableHead
                          column="id"
                          currentSortColumn={sortColumn}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                          className="text-center"
                        >
                          {t("orderId")}
                        </SortableTableHead>
                      )}
                      {columnVisibility.customerName && (
                        <SortableTableHead
                          column="customerName"
                          currentSortColumn={sortColumn}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                          className="text-center"
                        >
                          {t("customerName")}
                        </SortableTableHead>
                      )}
                      {columnVisibility.customerPhone && (
                        <SortableTableHead
                          column="customerPhone"
                          currentSortColumn={sortColumn}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                          className="text-center"
                        >
                          <div className="flex items-center justify-center gap-1">
                            <Phone className="h-4 w-4" />
                            {t("customerPhone")}
                          </div>
                        </SortableTableHead>
                      )}
                      {columnVisibility.serviceName && (
                        <SortableTableHead
                          column="serviceName"
                          currentSortColumn={sortColumn}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                          className="text-center"
                        >
                          {t("service")}
                        </SortableTableHead>
                      )}
                      {columnVisibility.orderDate && (
                        <SortableTableHead
                          column="orderDate"
                          currentSortColumn={sortColumn}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                          className="text-center"
                        >
                          {t("orderDate")}
                        </SortableTableHead>
                      )}
                      {columnVisibility.finalAmount && (
                        <SortableTableHead
                          column="finalAmount"
                          currentSortColumn={sortColumn}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                          className="text-center"
                        >
                          {t("finalAmount")}
                        </SortableTableHead>
                      )}
                      {columnVisibility.status && (
                        <SortableTableHead
                          column="status"
                          currentSortColumn={sortColumn}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                          className="text-center"
                        >
                          {t("status")}
                        </SortableTableHead>
                      )}
                      {columnVisibility.actions && (
                        <TableHead className="text-center">
                          {t("actions") || "Actions"}
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  {/* Modify the TableBody to respect column visibility */}
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={
                            Object.values(columnVisibility).filter(Boolean)
                              .length
                          }
                          className="text-center py-8 text-muted-foreground"
                        >
                          {t("noOrdersFound")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order: OrderItem) => (
                        <TableRow key={order.id}>
                          {columnVisibility.id && (
                            <TableCell className="font-medium text-center">
                              <div
                                className="max-w-[100px] truncate mx-auto"
                                title={order.id}
                              >
                                {order.id}
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.customerName && (
                            <TableCell className="text-center">
                              {order.customerName}
                            </TableCell>
                          )}
                          {columnVisibility.customerPhone && (
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center">
                                <a
                                  href={`tel:${order.customerPhone}`}
                                  className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  {order.customerPhone}
                                </a>
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.serviceName && (
                            <TableCell className="text-center">
                              {order.serviceName}
                            </TableCell>
                          )}
                          {columnVisibility.orderDate && (
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
              </div>

              {/* Pagination and page size selector - IMPORTANT CHANGE HERE */}
              {/* Use showPagination instead of orders.length > 0 */}
              {(showPagination || orders.length > 0) && (
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {t("rowsPerPage")}:
                    </span>
                    <select
                      className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                      value={pageSize}
                      onChange={(e) =>
                        handlePageSizeChange(Number(e.target.value))
                      }
                    >
                      <option value={6}>6</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-muted-foreground ml-4">
                      {t.rich("showingResults", {
                        start:
                          orders.length > 0
                            ? (pageIndex - 1) * pageSize + 1
                            : 0,
                        end: Math.min(pageIndex * pageSize, totalCount),
                        total: totalCount,
                      })}
                    </span>
                  </div>

                  {/* Use our custom handlePageChange instead of setPageIndex directly */}
                  <Pagination
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalCount={totalCount}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    onPageChange={handlePageChange}
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
