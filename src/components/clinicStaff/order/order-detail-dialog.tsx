"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { OrderItem } from "@/features/order/types";
import { formatCurrency } from "@/utils";
import {
  Calendar,
  Mail,
  Phone,
  Tag,
  User,
  Video,
  CreditCard,
  Wallet,
} from "lucide-react";
import { DirectPrintSolution } from "./direct-print-solution";
import { useTranslations } from "next-intl";

interface OrderDetailDialogProps {
  order: OrderItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusBadge = (status: string, t: any) => {
  switch (status?.toLowerCase()) {
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

// Format date function
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function OrderDetailDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailDialogProps) {
  const t = useTranslations("clinicStaffOrder");

  if (!order) return null;

  const discountPercentage =
    order.totalAmount > 0 ? (order.discount / order.totalAmount) * 100 : 0;
  const remainingAmount = order.finalAmount - (order.depositAmount || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden rounded-xl">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
          <DialogHeader className="p-4 pb-0">
            <div className="flex justify-between items-center mb-2">
              <DialogTitle className="text-xl font-bold">
                {t("orderDetails")}
              </DialogTitle>
              {getStatusBadge(order.status, t)}
            </div>
            <div className="flex items-center gap-2 pb-4">
              <span className="text-muted-foreground">{t("orderId")}:</span>
              <span className="font-medium text-foreground">{order.id}</span>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 max-h-[calc(90vh-140px)]">
          <div className="grid gap-6">
            {/* Order Summary Section */}
            <div className="bg-muted/40 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">
                {t("orderInformation")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("orderDate")}
                    </p>
                    <p className="font-medium">{formatDate(order.orderDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Tag className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("service")}
                    </p>
                    <p className="font-medium">
                      {order.serviceName || t("notAvailable")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {t("customerInformation")}
              </h3>
              <div className="grid gap-4 border rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("customerName")}
                    </p>
                    <p className="font-medium">
                      {order.customerName || t("notAvailable")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("email")}
                    </p>
                    <p className="font-medium break-all">
                      {order.customerEmail || t("notAvailable")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("phone")}
                    </p>
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="font-medium text-blue-500 hover:underline"
                    >
                      {order.customerPhone || t("notAvailable")}
                    </a>
                  </div>
                </div>

                {order.isFromLivestream && (
                  <div className="flex items-start gap-2">
                    <Video className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("livestream")}
                      </p>
                      <p className="font-medium">
                        {order.livestreamName || t("noName")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {t("paymentInformation")}
              </h3>
              <div className="border rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t("totalServiceAmount")}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(order.totalAmount)} đ
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t("discount")}
                    </span>
                    <div className="text-right">
                      <span className="font-medium">
                        {formatCurrency(order.discount)} đ
                      </span>
                      {discountPercentage > 0 && (
                        <span className="text-sm text-muted-foreground ml-2">
                          ({discountPercentage.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <Separator className="my-1" />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {t("depositAmount")}
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(order.depositAmount || 0)} đ
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {t("remainingAmount")}
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(remainingAmount)} đ
                    </span>
                  </div>

                  <Separator className="my-1" />

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-medium">{t("finalAmount")}</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(order.finalAmount)} đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom spacing for fixed footer */}
          <div className="h-4"></div>
        </div>

        {/* Fixed Footer */}
        <div className="sticky bottom-0 z-10 bg-background border-t shadow-sm">
          <DialogFooter className="p-4 flex justify-end items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("close")}
            </Button>
            <DirectPrintSolution
              order={order}
              onPrint={() => console.log("Đã mở cửa sổ in")}
            />
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
