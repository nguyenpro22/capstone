"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Info,
  Check,
  CreditCard,
  Landmark,
  QrCode,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { showSuccess } from "@/utils";

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer");
  const [copied, setCopied] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  // Mock data - would be fetched from API in real implementation
  const packageData = {
    id: params.id,
    name: "Premium Facial Treatment Package",
    clinic: "Beauty Clinic Saigon",
    price: 2500000,
    discountPrice: 1800000,
  };

  const bankDetails = {
    bankName: "Vietcombank",
    accountNumber: "1234567890",
    accountName: "BEAUTY CLINIC SAIGON",
    amount: packageData.discountPrice,
    content: `BEAUTY${params.id}`,
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showSuccess("Đã sao chép vào bộ nhớ tạm");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompletePayment = () => {
    setIsPaymentComplete(true);
    setTimeout(() => {
      router.push("/orders");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm pt-4 pb-2 border-b border-primary/10">
        <div className="container flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Thanh toán</h1>
        </div>
      </div>

      <div className="container pb-20">
        <Card className="mt-4 border-primary/10 dark:bg-gray-800/50 overflow-hidden shadow-sm">
          <CardContent className="p-0">
            <div className="p-4 flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage
                  src="/placeholder.svg?height=48&width=48"
                  alt="Clinic Logo"
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  BC
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">{packageData.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {packageData.clinic}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">
                  {formatPrice(packageData.discountPrice)}
                </p>
                <p className="text-xs line-through text-muted-foreground">
                  {formatPrice(packageData.price)}
                </p>
              </div>
            </div>
            <div className="bg-primary/5 px-4 py-2 text-sm text-primary flex items-center justify-between">
              <span>
                Tiết kiệm{" "}
                {formatPrice(packageData.price - packageData.discountPrice)}
              </span>
              <span>Giảm 28%</span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3 ml-1">
            Phương thức thanh toán
          </h2>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-3"
          >
            <Card
              className={`overflow-hidden border-primary/10 dark:bg-gray-800/50 transition-all ${
                paymentMethod === "bank-transfer"
                  ? "ring-2 ring-primary/20"
                  : ""
              }`}
            >
              <CardContent className="p-0">
                <div className="flex items-center space-x-2 p-4">
                  <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                  <Label
                    htmlFor="bank-transfer"
                    className="flex flex-1 items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Landmark className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Chuyển khoản ngân hàng</p>
                        <p className="text-xs text-muted-foreground">
                          Chuyển khoản qua tài khoản ngân hàng
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`overflow-hidden border-primary/10 dark:bg-gray-800/50 transition-all ${
                paymentMethod === "qr-code" ? "ring-2 ring-primary/20" : ""
              }`}
            >
              <CardContent className="p-0">
                <div className="flex items-center space-x-2 p-4">
                  <RadioGroupItem value="qr-code" id="qr-code" />
                  <Label
                    htmlFor="qr-code"
                    className="flex flex-1 items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <QrCode className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Quét mã QR</p>
                        <p className="text-xs text-muted-foreground">
                          Quét mã QR bằng ứng dụng ngân hàng
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`overflow-hidden border-primary/10 dark:bg-gray-800/50 transition-all ${
                paymentMethod === "credit-card" ? "ring-2 ring-primary/20" : ""
              }`}
            >
              <CardContent className="p-0">
                <div className="flex items-center space-x-2 p-4">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label
                    htmlFor="credit-card"
                    className="flex flex-1 items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Thẻ tín dụng/ghi nợ</p>
                        <p className="text-xs text-muted-foreground">
                          Thanh toán bằng thẻ Visa, Mastercard, JCB
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        </div>

        {paymentMethod === "bank-transfer" && (
          <Card className="mt-6 border-primary/10 dark:bg-gray-800/50 overflow-hidden shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Ngân hàng</p>
                <p className="text-sm">{bankDetails.bankName}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Số tài khoản</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm">{bankDetails.accountNumber}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-primary/10 rounded-full"
                    onClick={() => copyToClipboard(bankDetails.accountNumber)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Tên tài khoản</p>
                <p className="text-sm">{bankDetails.accountName}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Số tiền</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-bold">
                    {formatPrice(bankDetails.amount)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-primary/10 rounded-full"
                    onClick={() =>
                      copyToClipboard(bankDetails.amount.toString())
                    }
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Nội dung chuyển khoản</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm">{bankDetails.content}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-primary/10 rounded-full"
                    onClick={() => copyToClipboard(bankDetails.content)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm">
                  Vui lòng chuyển khoản đúng số tiền và nội dung để hệ thống có
                  thể xác nhận thanh toán của bạn. Sau khi chuyển khoản, nhấn
                  nút &quot;Xác nhận đã thanh toán&quot; bên dưới.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentMethod === "qr-code" && (
          <Card className="mt-6 border-primary/10 dark:bg-gray-800/50 overflow-hidden shadow-sm">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <p className="text-sm text-center mb-2">
                Quét mã QR bằng ứng dụng ngân hàng để thanh toán
              </p>
              <p className="text-lg font-bold text-primary text-center mb-4">
                {formatPrice(packageData.discountPrice)}
              </p>
              <div className="bg-primary/10 p-4 rounded-lg flex items-start gap-3 w-full">
                <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm">
                  Sau khi quét mã và thanh toán thành công, hệ thống sẽ tự động
                  cập nhật trạng thái đơn hàng của bạn. Nếu không được cập nhật,
                  vui lòng nhấn nút &quot;Xác nhận đã thanh toán&quot; bên dưới.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentMethod === "credit-card" && (
          <Card className="mt-6 border-primary/10 dark:bg-gray-800/50 overflow-hidden shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Số thẻ</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  className="border-primary/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Ngày hết hạn</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    className="border-primary/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">Mã bảo mật (CVV)</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    className="border-primary/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-name">Tên chủ thẻ</Label>
                <Input
                  id="card-name"
                  placeholder="NGUYEN VAN A"
                  className="border-primary/10"
                />
              </div>
              <div className="bg-primary/10 p-4 rounded-lg flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm">
                  Thông tin thẻ của bạn được bảo mật và mã hóa theo tiêu chuẩn
                  PCI DSS. Chúng tôi không lưu trữ thông tin thẻ của bạn.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="fixed bottom-0 left-0 right-0 border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4">
          <GradientButton
            className="w-full"
            size="lg"
            onClick={handleCompletePayment}
          >
            Xác nhận đã thanh toán
          </GradientButton>
        </div>

        <Dialog open={isPaymentComplete}>
          <DialogContent className="text-center border-primary/10 dark:bg-gray-800 rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                Thanh toán thành công!
              </DialogTitle>
              <DialogDescription className="text-center">
                Cảm ơn bạn đã đặt mua gói dịch vụ. Chúng tôi sẽ xác nhận và liên
                hệ với bạn sớm nhất.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center my-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                <Check className="h-10 w-10 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Đang chuyển hướng đến trang lịch sử đơn hàng...
            </p>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
