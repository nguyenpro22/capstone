"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Download, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  // Mock data - would be fetched from API in real implementation
  const order = {
    id: params.id,
    packageName: "Premium Facial Treatment Package",
    clinic: "Beauty Clinic Saigon",
    clinicAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    clinicPhone: "0123456789",
    date: "15/05/2023",
    price: 1800000,
    status: "completed",
    paymentMethod: "Chuyển khoản ngân hàng",
    paymentDate: "15/05/2023 14:30",
    sessions: 5,
    completedSessions: 3,
    nextAppointment: "25/08/2023 15:00",
    notes: "Vui lòng đến trước 15 phút để làm thủ tục.",
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Hoàn thành
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Đang xử lý
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Chờ xác nhận
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="sticky top-0 z-10 bg-rose-50/80 dark:bg-gray-900/80 backdrop-blur-sm pt-4 pb-2">
        <div className="container flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Chi tiết đơn hàng</h1>
        </div>
      </div>

      <div className="container pb-6">
        <Card className="mt-4 border-primary/10 dark:bg-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                <p className="font-medium">{order.id}</p>
              </div>
              {getStatusBadge(order.status)}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4 border-primary/10 dark:bg-gray-800/50">
          <CardContent className="p-4">
            <h2 className="font-semibold">Thông tin gói dịch vụ</h2>
            <div className="mt-3">
              <p className="font-medium">{order.packageName}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {order.clinic}
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{order.clinicAddress}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{order.clinicPhone}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm">Tổng số buổi</p>
                <p className="font-medium">{order.sessions} buổi</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Đã hoàn thành</p>
                <p className="font-medium">{order.completedSessions} buổi</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Còn lại</p>
                <p className="font-medium">
                  {order.sessions - order.completedSessions} buổi
                </p>
              </div>
            </div>
            {order.nextAppointment && (
              <>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Lịch hẹn tiếp theo</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">
                        {order.nextAppointment}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    asChild
                  >
                    <Link href="/packages/management">Quản lý lịch</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="mt-4 border-primary/10 dark:bg-gray-800/50">
          <CardContent className="p-4">
            <h2 className="font-semibold">Thông tin thanh toán</h2>
            <div className="space-y-3 mt-3">
              <div className="flex items-center justify-between">
                <p className="text-sm">Phương thức thanh toán</p>
                <p className="text-sm">{order.paymentMethod}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Ngày thanh toán</p>
                <p className="text-sm">{order.paymentDate}</p>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <p className="font-medium">Tổng thanh toán</p>
                <p className="font-bold text-primary">
                  {formatPrice(order.price)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" className="flex-1 rounded-full" asChild>
            <Link href={`/chat?clinic=${encodeURIComponent(order.clinic)}`}>
              Chat với thẩm mỹ viện
            </Link>
          </Button>
          <GradientButton className="flex-1">
            <Link href={`/review/create?orderId=${order.id}`}>
              Đánh giá dịch vụ
            </Link>
          </GradientButton>
        </div>

        <Card className="mt-4 bg-primary/5 border-primary/20 dark:bg-primary/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Tải hóa đơn điện tử</p>
                <p className="text-sm text-muted-foreground">
                  Bạn có thể tải hóa đơn điện tử cho đơn hàng này
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
