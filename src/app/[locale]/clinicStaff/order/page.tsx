"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, ChevronDown, MoreHorizontal, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetOrdersQuery } from "@/features/order/api" // Adjust the import path as needed
import { useDebounce } from "@/hooks/use-debounce" // Assuming you have this hook
import Pagination from "@/components/common/Pagination/Pagination" // Adjust the import path as needed
import type { OrderItem } from "@/features/order/types"
import { formatCurrency } from "@/utils"
import { OrderDetailDialog } from "@/components/clinicStaff/order/order-detail-dialog"
import { useTranslations } from "next-intl"

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
    case "pending":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
    case "cancelled":
    case "canceled":
      return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function OrderPage() {
  const t = useTranslations("clinicStaffOrder")

  // State for pagination, search, and sorting
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortOrder, setSortOrder] = useState("")

  // State for order detail dialog
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Fetch orders using RTK Query
  const { data, isLoading, error } = useGetOrdersQuery({
    pageIndex,
    pageSize,
    searchTerm: debouncedSearchTerm,
    sortColumn,
    sortOrder,
  })

  // Extract orders and pagination info from the response
  const orders = data?.value?.items || []
  const totalCount = data?.value?.totalCount || 0
  const hasNextPage = data?.value?.hasNextPage || false
  const hasPreviousPage = data?.value?.hasPreviousPage || false

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPageIndex(1) // Reset to first page when search changes
  }

  // Handle view order details
  const handleViewOrderDetails = (order: OrderItem) => {
    setSelectedOrder(order)
    setIsDetailDialogOpen(true)
  }

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
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            {t("filter")}
            <ChevronDown size={16} />
          </Button>
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
                    <TableHead>{t("orderId")}</TableHead>
                    <TableHead>{t("customerName")}</TableHead>
                    <TableHead>{t("service")}</TableHead>
                    <TableHead>{t("date")}</TableHead>
                    <TableHead>{t("finalAmount")}</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {t("noOrdersFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order: OrderItem) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.serviceName}</TableCell>
                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                        <TableCell>{formatCurrency(order.finalAmount)} đ</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewOrderDetails(order)}>
                              View
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>{t("printInvoice")}</DropdownMenuItem>
                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
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
      <OrderDetailDialog order={selectedOrder} open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen} />
    </div>
  )
}
