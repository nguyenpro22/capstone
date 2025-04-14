"use client";

import type React from "react";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Package,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Receipt,
  User,
  X,
  PlusCircle,
  Phone,
  Mail,
  Video,
  Percent,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { OrderItem } from "@/features/order/types";

interface OrderDetailDialogProps {
  order: OrderItem;
  children: React.ReactNode;
}

export function OrderDetailDialog({ order, children }: OrderDetailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Hoàn thành
            </div>
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              Chờ xử lý
            </div>
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              Đang xử lý
            </div>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0">
            {status}
          </Badge>
        );
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "Pending":
        return <AlertCircle className="h-6 w-6 text-amber-500" />;
      case "In Progress":
        return <Clock3 className="h-6 w-6 text-blue-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-xl max-h-[90vh]">
        <div className="relative">
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/10 hover:bg-black/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4 text-white" />
              <span className="sr-only">Đóng</span>
            </Button>
          </div>

          <div className="bg-gradient-to-r from-primary to-purple-600 h-28 flex items-center p-6">
            <div className="w-full relative z-10">
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                <Receipt className="h-5 w-5" />
                Chi tiết đơn hàng
              </DialogTitle>
              <div className="flex justify-between items-center">
                <p className="text-white text-opacity-90 text-sm">
                  Mã đơn hàng: {order.id.substring(0, 8)}...
                </p>
                {getStatusBadge(order.status)}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="font-semibold text-xl mb-2">{order.serviceName}</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="font-medium">
                    {order.status === "Completed"
                      ? "Đơn hàng đã hoàn thành"
                      : order.status === "In Progress"
                      ? "Đơn hàng đang được xử lý"
                      : "Đơn hàng đang chờ xử lý"}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {getStatusProgress(order.status)}%
                </span>
              </div>
              <Progress
                value={getStatusProgress(order.status)}
                className="h-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-primary/10 dark:bg-primary/5 rounded-full p-2 mr-3 flex-shrink-0">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày đặt</p>
                <p className="font-medium">
                  {format(parseISO(order.orderDate), "EEEE, dd/MM/yyyy", {
                    locale: vi,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary/10 dark:bg-primary/5 rounded-full p-2 mr-3 flex-shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary/10 dark:bg-primary/5 rounded-full p-2 mr-3 flex-shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">{order.customerPhone}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary/10 dark:bg-primary/5 rounded-full p-2 mr-3 flex-shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{order.customerEmail}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary/10 dark:bg-primary/5 rounded-full p-2 mr-3 flex-shrink-0">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Dịch vụ</p>
                <p className="font-medium">{order.serviceName}</p>
              </div>
            </div>

            {order.isFromLivestream && (
              <div className="flex items-start">
                <div className="bg-primary/10 dark:bg-primary/5 rounded-full p-2 mr-3 flex-shrink-0">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Livestream</p>
                  <p className="font-medium">{order.livestreamName}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h4 className="font-medium mb-3">Chi tiết thanh toán</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Tổng tiền:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center">
                  <Percent className="h-4 w-4 mr-1" /> Giảm giá:
                </span>
                <span className="text-red-500">
                  -{formatCurrency(order.discount)}
                </span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="font-medium">Thành tiền:</span>
                <span className="font-semibold text-lg text-primary">
                  {formatCurrency(order.finalAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Đóng
            </Button>

            <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Đặt lại dịch vụ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
