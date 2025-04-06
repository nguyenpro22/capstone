"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CreditCard,
  Package,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Receipt,
  User,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface Order {
  id: string;
  customerName: string;
  serviceName: string;
  finalAmount: number;
  orderDate: string;
  status: string;
}

interface OrderDetailDialogProps {
  order: Order;
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

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 border-0 text-white">
              Hoàn thành
            </Badge>
          </div>
        );
      case "Pending":
        return (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 border-0 text-white">
              Chờ xử lý
            </Badge>
          </div>
        );
      case "In Progress":
        return (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 border-0 text-white">
              Đang xử lý
            </Badge>
          </div>
        );
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "Pending":
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      case "In Progress":
        return <Clock3 className="h-6 w-6 text-blue-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div
          className={`h-2 ${
            order.status === "Completed"
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : order.status === "In Progress"
              ? "bg-gradient-to-r from-blue-500 to-indigo-500"
              : "bg-gradient-to-r from-yellow-400 to-amber-500"
          }`}
        ></div>
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            Chi tiết đơn hàng
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-semibold text-xl">{order.serviceName}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Mã đơn hàng: {order.id}
              </p>
            </div>
            {getStatusBadge(order.status)}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center mb-4">
              {getStatusIcon(order.status)}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Trạng thái đơn hàng</p>
              <p className="font-medium">
                {order.status === "Completed"
                  ? "Đơn hàng đã hoàn thành"
                  : order.status === "In Progress"
                  ? "Đơn hàng đang được xử lý"
                  : "Đơn hàng đang chờ xử lý"}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center">
              <div className="bg-primary/10 rounded-full p-2 mr-4">
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

            <div className="flex items-center">
              <div className="bg-primary/10 rounded-full p-2 mr-4">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-primary/10 rounded-full p-2 mr-4">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Dịch vụ</p>
                <p className="font-medium">{order.serviceName}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-primary/10 rounded-full p-2 mr-4">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng tiền</p>
                <p className="font-semibold text-lg text-primary">
                  {formatCurrency(order.finalAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
              onClick={() => setIsOpen(false)}
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
