"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  X,
  PlusCircle,
  Phone,
  Mail,
  Tag,
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  Percent,
  ArrowDown,
  Clock,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock3,
} from "lucide-react";
import { useGetOrderDetailByIdQuery } from "@/features/order/api";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { OrderItem } from "@/features/order/types";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

// Define the ServiceBooking type from the API
export type ServiceBooking = {
  id: string;
  serviceName: string;
  procedurePriceType: string;
  price: number;
  duration: number; // in minutes
  customerEmail: string;
  customerPhone: string;
};

interface OrderDetailDialogProps {
  order: OrderItem;
  children: React.ReactNode;
}

export function OrderDetailDialog({ order, children }: OrderDetailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("orderDetail");

  const {
    data: orderDetailResponse,
    error,
    isError,
    isLoading,
  } = useGetOrderDetailByIdQuery(order.id, {
    skip: !isOpen || !order,
  });

  // Get the service bookings array from the response
  const serviceBookings = orderDetailResponse?.value || [];

  // Reset expanded service when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setExpandedService(null);
    }
  }, [isOpen]);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours} ${t("hour")} ${
        mins > 0 ? `${mins} ${t("minute")}` : ""
      }`;
    }
    return `${mins} ${t("minute")}`;
  };

  // Calculate total amount
  const totalAmount = serviceBookings.reduce(
    (sum, service) => sum + service.price,
    0
  );

  // Get status progress
  const getStatusProgress = (status: string) => {
    switch (status) {
      case "Completed":
        return 100;
      case "In Progress":
        return 50;
      case "Pending":
        return 25;
      default:
        return 0;
    }
  };

  // Toggle service expansion
  const toggleServiceExpansion = (serviceId: string) => {
    if (expandedService === serviceId) {
      setExpandedService(null);
    } else {
      setExpandedService(serviceId);
    }
  };

  // Copy order ID to clipboard
  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 border-0">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              {t("completed")}
            </div>
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/40 border-0">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              {t("pending")}
            </div>
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 border-0">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              {t("inProgress")}
            </div>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-0">
            {status}
          </Badge>
        );
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
        );
      case "Pending":
        return (
          <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
        );
      case "In Progress":
        return <Clock3 className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
      default:
        return (
          <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-0 shadow-xl max-h-[90vh] dark:bg-gray-900 rounded-xl">
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4 text-white" />
              <span className="sr-only">{t("close")}</span>
            </Button>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 h-44 flex items-center p-6">
            <div className="w-full relative z-10">
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
                <Receipt className="h-6 w-6" />
                {t("orderDetails")}
              </DialogTitle>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-opacity-90 text-sm">
                      {t("orderId")}:
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium bg-white/20 px-2 py-0.5 rounded-md text-white">
                        {order.id.substring(0, 10)}...
                      </span>
                      <button
                        onClick={copyOrderId}
                        className="text-white/70 hover:text-white transition-colors"
                        aria-label={t("copyOrderId")}
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center flex-wrap gap-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-white/80" />
                      <p className="text-white text-opacity-90 text-sm">
                        {format(parseISO(order.orderDate), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </p>
                    </div>
                    <div className="bg-white/20 h-4 w-px hidden sm:block"></div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-4 w-4 text-white/80" />
                      <p className="text-white text-opacity-90 text-sm">
                        {serviceBookings.length} {t("services")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  {getStatusBadge(order.status)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-[calc(90vh-11rem)]">
          <div className="p-6 dark:bg-gray-900 dark:text-gray-100">
            {isLoading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                  ))}
                </div>
                <Skeleton className="h-16 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-20 rounded-xl" />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Order summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:shadow-md">
                    <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t("totalAmount")}
                    </p>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:shadow-md">
                    <Percent className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t("discount")}
                    </p>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(order.discount)}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:shadow-md">
                    <ArrowDown className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t("deposit")}
                    </p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(order.depositAmount)}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:shadow-md">
                    <Receipt className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t("finalAmount")}
                    </p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(order.finalAmount)}
                    </p>
                  </div>
                </div>

                {/* Customer info */}
                <div>
                  <div className="flex items-center mb-3">
                    <h3 className="font-semibold text-lg">
                      {t("customerInfo")}
                    </h3>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 ml-4"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                      <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full p-2.5 mr-3 flex-shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 w-full">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t("phoneNumber")}
                        </p>
                        <p className="font-medium truncate">
                          {order.customerPhone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                      <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full p-2.5 mr-3 flex-shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 w-full">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t("email")}
                        </p>
                        <p className="font-medium truncate">
                          {order.customerEmail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Livestream info */}
                {order.isFromLivestream && (
                  <div>
                    <div className="flex items-center mb-3">
                      <h3 className="font-semibold text-lg">
                        {t("livestreamInfo")}
                      </h3>
                      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 ml-4"></div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 flex items-center shadow-sm hover:shadow-md transition-all">
                      <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full p-2.5 mr-3 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-video"
                        >
                          <path d="m22 8-6 4 6 4V8Z" />
                          <rect
                            width="14"
                            height="12"
                            x="2"
                            y="6"
                            rx="2"
                            ry="2"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t("livestreamName")}
                        </p>
                        <p className="font-medium">
                          {order.livestreamName || t("livestream")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Booked services */}
                <div>
                  <div className="flex items-center mb-3">
                    <h3 className="font-semibold text-lg">
                      {t("bookedServices")}
                    </h3>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 ml-4"></div>
                  </div>

                  <div className="space-y-3">
                    {serviceBookings.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                        <AlertCircle className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                          {t("noServices")}
                        </p>
                      </div>
                    ) : (
                      serviceBookings.map((service) => (
                        <div
                          key={service.id}
                          className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden transition-all duration-200 ease-in-out border border-gray-100 dark:border-gray-700/30 shadow-sm hover:shadow-md"
                        >
                          <div
                            className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                            onClick={() => toggleServiceExpansion(service.id)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full p-2 flex-shrink-0">
                                  <Tag className="h-4 w-4" />
                                </div>
                                <h4 className="font-medium line-clamp-1">
                                  {service.serviceName}
                                </h4>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-sm">
                                    {formatDuration(service.duration)}
                                  </span>
                                </div>
                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                  {formatCurrency(service.price)}
                                </span>
                                {expandedService === service.id ? (
                                  <ChevronUp className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                            </div>
                          </div>

                          {expandedService === service.id && (
                            <div className="px-4 pb-4 pt-1 border-t border-gray-200 dark:border-gray-700/50 bg-gray-100 dark:bg-gray-800">
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    {t("priceType")}:
                                  </span>
                                  <span className="font-medium">
                                    {service.procedurePriceType}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    {t("duration")}:
                                  </span>
                                  <span className="font-medium">
                                    {formatDuration(service.duration)}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    ID:
                                  </span>
                                  <span className="font-medium text-xs text-gray-500">
                                    {service.id.substring(0, 8)}...
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Payment details */}
                <div>
                  <div className="flex items-center mb-3">
                    <h3 className="font-semibold text-lg">
                      {t("paymentDetails")}
                    </h3>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 ml-4"></div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/30 shadow-sm">
                    <div className="space-y-2">
                      {serviceBookings.map((service) => (
                        <div
                          key={service.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600 dark:text-gray-400 line-clamp-1 max-w-[70%]">
                            {service.serviceName}
                          </span>
                          <span>{formatCurrency(service.price)}</span>
                        </div>
                      ))}

                      <Separator className="my-3" />

                      <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                        <span>{t("subtotal")}:</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                      </div>

                      <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                        <span>{t("discount")}:</span>
                        <span>- {formatCurrency(order.discount)}</span>
                      </div>

                      <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                        <span>{t("deposit")}:</span>
                        <span>{formatCurrency(order.depositAmount)}</span>
                      </div>

                      <Separator className="my-3" />

                      <div className="flex justify-between items-center">
                        <span className="font-medium">{t("total")}:</span>
                        <span className="font-semibold text-lg text-purple-600 dark:text-purple-400">
                          {formatCurrency(order.finalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                {/* <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-700 dark:to-indigo-700 dark:hover:from-purple-800 dark:hover:to-indigo-800 text-white">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {t("reorderService")}
                  </Button>
                </div> */}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
