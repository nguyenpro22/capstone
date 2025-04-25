"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Tag,
  CreditCard,
  Tv,
  Receipt,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatTime,
  getStatusIcon,
  translateOrderStatus,
} from "@/utils/orderHelpers";
import type { ScheduleDetail } from "@/features/order/types";

interface OrderDetailModalProps {
  order: ScheduleDetail;
  isOpen: boolean;
  onClose: () => void;
  onCreateFeedback: () => void;
  onViewFeedback: () => void;
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onCreateFeedback,
  onViewFeedback,
}: OrderDetailModalProps) {
  const t = useTranslations("orderMessages.bookingHistory");
  const [activeSection, setActiveSection] = useState<string>("all");
  const locale = useLocale();
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const showCreateFeedbackButton = order.isFinished && !order.feedbackContent;
  const showViewFeedbackButton = order.feedbackContent !== null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] bg-white dark:bg-indigo-950 border-purple-100 dark:border-indigo-800/30 p-0 overflow-hidden">
        <div className="sticky top-0 z-10 bg-white dark:bg-indigo-950 border-b border-purple-100 dark:border-indigo-800/30 px-6 py-4">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {t("orderDetail.title")}
              </DialogTitle>
              <Badge
                className="ml-2 px-3 py-1.5 text-sm font-medium"
                variant={
                  order.status === "Completed"
                    ? "success"
                    : order.status === "Pending"
                    ? "warning"
                    : order.status === "Uncompleted"
                    ? "destructive"
                    : "default"
                }
              >
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(order.status)}
                  <span>{translateOrderStatus(order.status, locale)}</span>
                </div>
              </Badge>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-500 dark:text-indigo-300/70 font-medium">
                {t("orderDetail.orderId")}:
              </span>
              <code className="text-xs bg-purple-50 dark:bg-indigo-900/30 px-2 py-1 rounded font-mono">
                {order.id}
              </code>
            </div>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto px-6 py-4 max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            <Accordion
              type="single"
              collapsible
              defaultValue="customer"
              className="w-full"
            >
              <AccordionItem value="customer" className="border-b-0">
                <AccordionTrigger className="py-4 px-4 bg-purple-50 dark:bg-indigo-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-indigo-900/30 transition-colors">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <User className="h-5 w-5" />
                    <span className="font-semibold">
                      {t("orderDetail.customerInfo")}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-50 dark:hover:bg-indigo-900/10 transition-colors">
                      <User className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span className="text-sm text-gray-500 dark:text-indigo-300/70 whitespace-nowrap">
                        {t("orderDetail.customerName")}:
                      </span>
                      <span className="font-medium truncate">
                        {order.customerName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-50 dark:hover:bg-indigo-900/10 transition-colors">
                      <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span className="text-sm text-gray-500 dark:text-indigo-300/70 whitespace-nowrap">
                        {t("orderDetail.phone")}:
                      </span>
                      <span className="font-medium truncate">
                        {order.customerPhone}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-50 dark:hover:bg-indigo-900/10 transition-colors">
                      <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span className="text-sm text-gray-500 dark:text-indigo-300/70 whitespace-nowrap">
                        {t("orderDetail.email")}:
                      </span>
                      <span className="font-medium truncate">
                        {order.customerEmail}
                      </span>
                    </div>

                    {order.isFromLivestream && (
                      <div className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-50 dark:hover:bg-indigo-900/10 transition-colors">
                        <Tv className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span className="text-sm text-gray-500 dark:text-indigo-300/70 whitespace-nowrap">
                          {t("orderDetail.livestream")}:
                        </span>
                        <span className="font-medium truncate">
                          {order.livestreamName ||
                            t("orderDetail.notSpecified")}
                        </span>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="service" className="border-b-0 mt-3">
                <AccordionTrigger className="py-4 px-4 bg-purple-50 dark:bg-indigo-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-indigo-900/30 transition-colors">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Tag className="h-5 w-5" />
                    <span className="font-semibold">
                      {t("orderDetail.serviceInfo")}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-1">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-50 dark:hover:bg-indigo-900/10 transition-colors">
                      <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm text-gray-500 dark:text-indigo-300/70">
                        {t("orderDetail.serviceName")}:
                      </span>
                      <span className="font-medium">{order.serviceName}</span>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm flex items-center gap-2 text-purple-700 dark:text-purple-300">
                        <Calendar className="h-4 w-4" />
                        {t("orderDetail.schedules")}
                      </h4>

                      {order.customerSchedules.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-indigo-300/70 italic">
                          {t("orderDetail.noSchedules")}
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {order.customerSchedules.map((schedule, index) => (
                            <div
                              key={schedule.id}
                              className="bg-purple-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-purple-100 dark:border-indigo-800/30"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-purple-700 dark:text-purple-300">
                                  {t("orderDetail.schedules")} {index + 1}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="border-purple-200 dark:border-indigo-800/30"
                                >
                                  {schedule.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                                  <span className="text-sm text-gray-500 dark:text-indigo-300/70 whitespace-nowrap">
                                    {t("orderDetail.doctor")}:
                                  </span>
                                  <span className="font-medium truncate">
                                    {schedule.doctorName}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                                  <span className="text-sm text-gray-500 dark:text-indigo-300/70 whitespace-nowrap">
                                    {t("orderDetail.procedure")}:
                                  </span>
                                  <span className="font-medium truncate">
                                    {schedule.procedureName}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                                  <span className="text-sm text-gray-500 dark:text-indigo-300/70 whitespace-nowrap">
                                    {t("orderDetail.date")}:
                                  </span>
                                  <span className="font-medium">
                                    {formatDate(schedule.date)}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                                  <span className="text-sm text-gray-500 dark:text-indigo-300/70 whitespace-nowrap">
                                    {t("orderDetail.time")}:
                                  </span>
                                  <span className="font-medium">
                                    {formatTime(schedule.startTime)} -{" "}
                                    {formatTime(schedule.endTime)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment" className="border-b-0 mt-3">
                <AccordionTrigger className="py-4 px-4 bg-purple-50 dark:bg-indigo-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-indigo-900/30 transition-colors">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-semibold">
                      {t("orderDetail.paymentInfo")}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-50 dark:hover:bg-indigo-900/10 transition-colors">
                      <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm text-gray-500 dark:text-indigo-300/70">
                        {t("orderDetail.totalAmount")}:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-50 dark:hover:bg-indigo-900/10 transition-colors">
                      <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm text-gray-500 dark:text-indigo-300/70">
                        {t("orderDetail.discount")}:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(order.discount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-50 dark:hover:bg-indigo-900/10 transition-colors">
                      <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm text-gray-500 dark:text-indigo-300/70">
                        {t("orderDetail.depositAmount")}:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(order.depositAmount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-md bg-purple-50 dark:bg-indigo-900/20">
                      <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm text-gray-500 dark:text-indigo-300/70">
                        {t("orderDetail.finalAmount")}:
                      </span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">
                        {formatCurrency(order.finalAmount)}
                      </span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 bg-white dark:bg-indigo-950 border-t border-purple-100 dark:border-indigo-800/30 px-6 py-4">
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-purple-200 dark:border-indigo-800/30"
            >
              {t("common.close")}
            </Button>

            {showCreateFeedbackButton && (
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={onCreateFeedback}
              >
                {t("feedback.createFeedback")}
              </Button>
            )}

            {showViewFeedbackButton && (
              <Button
                variant="outline"
                className="border-purple-200 dark:border-indigo-800/30 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-indigo-900/20"
                onClick={onViewFeedback}
              >
                {t("feedback.viewFeedback")}
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
