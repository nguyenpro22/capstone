"use client";

import type React from "react";
import { useState } from "react";
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
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { OrderItem } from "@/features/order/types";
import { useGetOrderDetailByIdQuery } from "@/features/order/api";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const t = useTranslations("OrderDetail"); // Initialize translations

  const {
    data: orderDetailResponse,
    error,
    isError,
  } = useGetOrderDetailByIdQuery(order.id, {
    skip: !order,
  });

  // Get the service bookings array from the response
  const serviceBookings = orderDetailResponse?.value || [];

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-0 shadow-xl max-h-[90vh] dark:bg-gray-900 rounded-xl">
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

          <div className="bg-gradient-to-r from-primary to-purple-600 dark:from-primary/80 dark:to-purple-700 h-32 flex items-center p-6">
            <div className="w-full relative z-10">
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2 mb-3">
                <Receipt className="h-5 w-5" />
                {t("orderDetails")}
              </DialogTitle>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-white text-opacity-90 text-sm">
                    {t("orderId")}:{" "}
                    <span className="font-medium">
                      {order.id.substring(0, 8)}...
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 rounded-full h-1.5 w-1.5"></div>
                    <p className="text-white text-opacity-90 text-sm">
                      {serviceBookings.length} {t("services")}
                    </p>
                  </div>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <div className="p-6 dark:bg-gray-900 dark:text-gray-100">
            {/* Progress bar */}
            <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{t("orderStatus")}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {getStatusProgress(order.status)}%
                </span>
              </div>
              <Progress
                value={getStatusProgress(order.status)}
                className="h-2"
              />
            </div>

            {/* Customer info */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{t("customerInfo")}</h3>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 mx-4"></div>
              </div>

              {serviceBookings.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 dark:bg-primary/5 rounded-full p-2 mr-3 flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("phoneNumber")}
                      </p>
                      <p className="font-medium">
                        {serviceBookings[0].customerPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-primary/10 dark:bg-primary/5 rounded-full p-2 mr-3 flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("email")}
                      </p>
                      <p className="font-medium">
                        {serviceBookings[0].customerEmail}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Booked services */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{t("bookedServices")}</h3>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 mx-4"></div>
              </div>

              <div className="space-y-3">
                {serviceBookings.map((service) => (
                  <div
                    key={service.id}
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-200 ease-in-out"
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() => toggleServiceExpansion(service.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-2 flex-shrink-0">
                            <Tag className="h-4 w-4 text-primary" />
                          </div>
                          <h4 className="font-medium line-clamp-1">
                            {service.serviceName}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary dark:text-primary-foreground">
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
                      <div className="px-4 pb-4 pt-1 border-t border-gray-200 dark:border-gray-700">
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
                ))}
              </div>
            </div>

            {/* Payment details */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{t("paymentDetails")}</h3>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 mx-4"></div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
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

                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t("total")}:</span>
                    <span className="font-semibold text-lg text-primary dark:text-primary-foreground">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {t("close")}
              </Button>

              <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 dark:from-primary/80 dark:to-purple-700 dark:hover:from-primary/70 dark:hover:to-purple-800 text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                {t("reorderService")}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
