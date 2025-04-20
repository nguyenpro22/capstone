// components/OrderTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderDetailDialog } from "@/components/services/user/order-detail-dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { OrderItem } from "@/features/order/types";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface Props {
  t: any;
  orders: OrderItem[];
  loading: boolean;
  columnVisibility: any;
  setCurrentPage: (n: number) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getFeedbackStars: (rating: number | null) => React.ReactNode;
  formatCurrency: (amount: number) => string;
  formatTime: (time: string | null) => string;
}

export const OrderTable: React.FC<Props> = ({
  t,
  orders,
  loading,
  columnVisibility,
  setCurrentPage,
  getStatusBadge,
  getStatusColor,
  getStatusIcon,
  getFeedbackStars,
  formatCurrency,
  formatTime,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 dark:border-purple-400"></div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-indigo-200 mb-2">
          {t("noOrders.title")}
        </h3>
        <p className="text-gray-500 dark:text-indigo-300/70 max-w-md mx-auto">
          {t("noOrders.description")}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-purple-50/80 dark:bg-indigo-900/30 border-b-0">
            {columnVisibility.id && (
              <TableHead className="text-gray-600 dark:text-indigo-200">
                {t("columns.id")}
              </TableHead>
            )}
            {columnVisibility.customerName && (
              <TableHead className="text-gray-600 dark:text-indigo-200">
                {t("columns.customerName")}
              </TableHead>
            )}
            {columnVisibility.serviceName && (
              <TableHead className="text-gray-600 dark:text-indigo-200">
                {t("columns.serviceName")}
              </TableHead>
            )}
            {columnVisibility.orderDate && (
              <TableHead className="text-gray-600 dark:text-indigo-200">
                {t("columns.orderDate")}
              </TableHead>
            )}
            {columnVisibility.finalAmount && (
              <TableHead className="text-gray-600 dark:text-indigo-200">
                {t("columns.finalAmount")}
              </TableHead>
            )}
            {columnVisibility.feedback && (
              <TableHead className="text-gray-600 dark:text-indigo-200">
                {t("columns.feedback")}
              </TableHead>
            )}
            {columnVisibility.status && (
              <TableHead className="text-gray-600 dark:text-indigo-200">
                {t("columns.status")}
              </TableHead>
            )}
            {columnVisibility.details && (
              <TableHead className="text-gray-600 dark:text-indigo-200 text-right">
                {t("columns.details")}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="hover:bg-purple-50/50 dark:hover:bg-indigo-900/40"
            >
              {columnVisibility.id && (
                <TableCell className="dark:text-indigo-200">
                  {order.id.substring(0, 8)}...
                </TableCell>
              )}
              {columnVisibility.customerName && (
                <TableCell className="dark:text-indigo-200">
                  {order.customerName}
                </TableCell>
              )}
              {columnVisibility.serviceName && (
                <TableCell className="dark:text-indigo-200">
                  {order.serviceName}
                </TableCell>
              )}
              {columnVisibility.orderDate && (
                <TableCell className="dark:text-indigo-200">
                  {format(parseISO(order.orderDate), "dd/MM/yyyy", {
                    locale: vi,
                  })}
                </TableCell>
              )}
              {columnVisibility.finalAmount && (
                <TableCell className="font-semibold text-purple-600 dark:text-purple-300">
                  {formatCurrency(order.finalAmount)}
                </TableCell>
              )}
              {columnVisibility.feedback && (
                <TableCell className="dark:text-indigo-200">
                  {/* {order.rating ? ( */}
                  {/* getFeedbackStars(order.rating) */}
                  {/* ) : ( */}
                  <span className="text-gray-500 italic">
                    {t("noFeedback")}
                  </span>
                  {/* )} */}
                </TableCell>
              )}
              {columnVisibility.status && (
                <TableCell>{getStatusBadge(order.status)}</TableCell>
              )}
              {columnVisibility.details && (
                <TableCell className="text-right">
                  <OrderDetailDialog order={order}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-8 w-8 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">{t("viewDetails")}</span>
                    </Button>
                  </OrderDetailDialog>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
