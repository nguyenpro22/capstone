"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { OrderItem } from "@/features/order/types"
import { formatCurrency } from "@/utils"
import { Calendar, Mail, Phone, Tag, User, Video } from "lucide-react"
import { DirectPrintSolution } from "./direct-print-solution"
import { useTranslations } from "next-intl"

interface OrderDetailDialogProps {
  order: OrderItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
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

// Format date function
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function OrderDetailDialog({ order, open, onOpenChange }: OrderDetailDialogProps) {
  const t = useTranslations("clinicStaffOrder")

  if (!order) return null

  const discountPercentage = order.totalAmount > 0 ? (order.discount / order.totalAmount) * 100 : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("orderDetails")}</DialogTitle>
          <DialogDescription>
            {t("orderId")}: <span className="font-medium text-foreground">{order.id}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Đặt badge ở vị trí không che nút đóng */}
        <div className="mt-2 mb-4">{getStatusBadge(order.status)}</div>

        <div className="grid gap-6 py-4">
          {/* Order Summary Section */}
          <div className="bg-muted/40 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">{t("orderInformation")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("orderDate")}</p>
                  <p className="font-medium">{formatDate(order.orderDate)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Tag className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("service")}</p>
                  <p className="font-medium">{order.serviceName || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{t("customerInformation")}</h3>
            <div className="grid gap-4 border rounded-lg p-4">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("customerName")}</p>
                  <p className="font-medium">{order.customerName || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("email")}</p>
                  <p className="font-medium break-all">{order.customerEmail || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("phone")}</p>
                  <p className="font-medium">{order.customerPhone || "N/A"}</p>
                </div>
              </div>

              {order.isFromLivestream && (
                <div className="flex items-start gap-2">
                  <Video className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("livestream")}</p>
                    <p className="font-medium">{order.livestreamName || t("noName")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{t("paymentInformation")}</h3>
            <div className="border rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("totalServiceAmount")}</span>
                  <span className="font-medium">{formatCurrency(order.totalAmount)} đ</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("discount")}</span>
                  <div className="text-right">
                    <span className="font-medium">{formatCurrency(order.discount)} đ</span>
                    {discountPercentage > 0 && (
                      <span className="text-sm text-muted-foreground ml-2">({discountPercentage.toFixed(1)}%)</span>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-medium">{t("finalAmount")}</span>
                  <span className="font-bold text-lg">{formatCurrency(order.finalAmount)} đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
          <DirectPrintSolution order={order} onPrint={() => console.log("Đã mở cửa sổ in")} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
