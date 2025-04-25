"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Eye, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatCurrency,
  getFeedbackStars,
  getStatusBadge,
} from "@/utils/orderHelpers";
import { createFeedbackFormData } from "@/hooks/useOrderBookingData";
import type { OrderItem } from "@/features/order/types";
import {
  useCreateFeedbacksMutation,
  useGetScheduleDetailQuery,
} from "@/features/order/api";
import { OrderDetailModal } from "./order-detail-modal";
import { CreateFeedbackModal } from "./create-feedback-modal";
import { ViewFeedbackModal } from "./view-feedback-modal";

interface BookingHistoryTableProps {
  orders: OrderItem[];
  loading: boolean;
  columnVisibility: {
    // id: boolean;
    customerName: boolean;
    serviceName: boolean;
    orderDate: boolean;
    finalAmount: boolean;
    // feedback: boolean;
    status: boolean;
    details: boolean;
  };
}

export function BookingHistoryTable({
  orders,
  loading,
  columnVisibility,
}: BookingHistoryTableProps) {
  const t = useTranslations("orderMessages.bookingHistory");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateFeedbackModalOpen, setIsCreateFeedbackModalOpen] =
    useState(false);
  const [isViewFeedbackModalOpen, setIsViewFeedbackModalOpen] = useState(false);
  const locale = useLocale();
  const { data: orderDetail, isLoading: orderDetailLoading } =
    useGetScheduleDetailQuery(selectedOrderId || "", {
      skip: !selectedOrderId,
    });

  const [createFeedback, { isLoading: isSubmittingFeedback }] =
    useCreateFeedbacksMutation();

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
  };

  const handleCreateFeedback = () => {
    setIsDetailModalOpen(false);
    setIsCreateFeedbackModalOpen(true);
  };

  const handleViewFeedback = () => {
    setIsDetailModalOpen(false);
    setIsViewFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async (payload: any) => {
    try {
      const formData = createFeedbackFormData(payload);
      await createFeedback(formData).unwrap();
      toast.success(t("feedback.successMessage"));
      setIsCreateFeedbackModalOpen(false);
    } catch (error) {
      toast.error(t("feedback.errors.submitFailed"));
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.05,
      },
    }),
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="w-full overflow-auto p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto p-6">
      <div className="rounded-xl border border-purple-100 dark:border-indigo-800/30 overflow-hidden bg-white dark:bg-indigo-950/50 shadow-sm">
        <Table>
          <TableHeader className="bg-purple-50/80 dark:bg-indigo-900/30">
            <TableRow>
              {/* {columnVisibility.id && (
                <TableHead className="font-medium">
                  {t("table.columns.id")}
                </TableHead>
              )} */}
              {columnVisibility.customerName && (
                <TableHead className="font-medium">
                  {t("table.columns.customer")}
                </TableHead>
              )}
              {columnVisibility.serviceName && (
                <TableHead className="font-medium">
                  {t("table.columns.service")}
                </TableHead>
              )}
              {columnVisibility.orderDate && (
                <TableHead className="font-medium">
                  {t("table.columns.date")}
                </TableHead>
              )}
              {columnVisibility.finalAmount && (
                <TableHead className="font-medium">
                  {t("table.columns.amount")}
                </TableHead>
              )}
              {/* {columnVisibility.feedback && (
                <TableHead className="font-medium">
                  {t("table.columns.feedback")}
                </TableHead>
              )} */}
              {columnVisibility.status && (
                <TableHead className="font-medium">
                  {t("table.columns.status")}
                </TableHead>
              )}
              {columnVisibility.details && (
                <TableHead className="font-medium text-right">
                  {t("table.columns.actions")}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    Object.values(columnVisibility).filter(Boolean).length
                  }
                  className="text-center py-10 text-gray-500 dark:text-indigo-300/70"
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="rounded-full bg-purple-100 dark:bg-indigo-900/30 p-3 mb-3">
                      <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-gray-500 dark:text-indigo-300/70 mb-1">
                      {t("table.noOrders")}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-indigo-300/50 max-w-md text-center">
                      {t("table.noOrdersDescription")}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={tableRowVariants}
                  className="border-b border-purple-100 dark:border-indigo-800/30 hover:bg-purple-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  {/* {columnVisibility.id && (
                    <TableCell className="font-medium">
                      <span className="font-mono text-xs bg-purple-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                        {order.id.substring(0, 8)}...
                      </span>
                    </TableCell>
                  )} */}
                  {columnVisibility.customerName && (
                    <TableCell>{order.customerName}</TableCell>
                  )}
                  {columnVisibility.serviceName && (
                    <TableCell>{order.serviceName}</TableCell>
                  )}
                  {columnVisibility.orderDate && (
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                  )}
                  {columnVisibility.finalAmount && (
                    <TableCell className="font-medium">
                      {formatCurrency(order.finalAmount)}
                    </TableCell>
                  )}

                  {columnVisibility.status && (
                    <TableCell>
                      {getStatusBadge(order.status, locale)}
                    </TableCell>
                  )}
                  {columnVisibility.details && (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(order.id)}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-indigo-900/30"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {t("table.actions.viewDetails")}
                      </Button>
                    </TableCell>
                  )}
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {orderDetail && (
        <OrderDetailModal
          order={orderDetail.value}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onCreateFeedback={handleCreateFeedback}
          onViewFeedback={handleViewFeedback}
        />
      )}

      {orderDetail && (
        <CreateFeedbackModal
          order={orderDetail.value}
          isOpen={isCreateFeedbackModalOpen}
          onClose={() => setIsCreateFeedbackModalOpen(false)}
          onSubmit={handleSubmitFeedback}
          isSubmitting={isSubmittingFeedback}
        />
      )}

      {orderDetail && (
        <ViewFeedbackModal
          order={orderDetail.value}
          isOpen={isViewFeedbackModalOpen}
          onClose={() => setIsViewFeedbackModalOpen(false)}
        />
      )}
    </div>
  );
}
