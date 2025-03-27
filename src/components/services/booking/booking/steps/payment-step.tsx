"use client";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, CreditCard, Landmark, Wallet } from "lucide-react";
import { PriceSummary } from "../price-summary";
import { BookingData } from "../../types/booking";

interface PaymentStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
}

export function PaymentStep({
  bookingData,
  updateBookingData,
}: PaymentStepProps) {
  const { selectedProcedures, paymentMethod, isDefault, service } = bookingData;

  const handlePaymentMethodChange = (
    method: "cash" | "credit_card" | "bank_transfer"
  ) => {
    updateBookingData({ paymentMethod: method });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Phương thức thanh toán</h3>
        <p className="text-muted-foreground mb-4">
          Vui lòng chọn phương thức thanh toán
        </p>

        <RadioGroup
          value={paymentMethod || ""}
          onValueChange={(value) =>
            handlePaymentMethodChange(
              value as "cash" | "credit_card" | "bank_transfer"
            )
          }
          className="space-y-4"
        >
          <div className="flex">
            <RadioGroupItem
              value="cash"
              id="payment-cash"
              className="peer sr-only"
            />
            <Label
              htmlFor="payment-cash"
              className="flex flex-1 items-start cursor-pointer rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex w-full gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Thanh toán tại cơ sở</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Thanh toán trực tiếp tại cơ sở khi đến thực hiện dịch vụ
                  </div>
                </div>
              </div>
            </Label>
          </div>

          <div className="flex">
            <RadioGroupItem
              value="credit_card"
              id="payment-credit-card"
              className="peer sr-only"
            />
            <Label
              htmlFor="payment-credit-card"
              className="flex flex-1 items-start cursor-pointer rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex w-full gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Thẻ tín dụng/ghi nợ</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Thanh toán trực tuyến bằng thẻ tín dụng hoặc ghi nợ
                  </div>
                </div>
              </div>
            </Label>
          </div>

          <div className="flex">
            <RadioGroupItem
              value="bank_transfer"
              id="payment-bank-transfer"
              className="peer sr-only"
            />
            <Label
              htmlFor="payment-bank-transfer"
              className="flex flex-1 items-start cursor-pointer rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex w-full gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Landmark className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Chuyển khoản ngân hàng</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Chuyển khoản trực tiếp đến tài khoản ngân hàng của chúng tôi
                  </div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {paymentMethod === "credit_card" && (
          <Card className="mt-4">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="card-number" className="text-sm font-medium">
                  Số thẻ
                </label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  className="font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="expiry" className="text-sm font-medium">
                    Ngày hết hạn
                  </label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cvc" className="text-sm font-medium">
                    CVC
                  </label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="name-on-card" className="text-sm font-medium">
                  Tên trên thẻ
                </label>
                <Input id="name-on-card" placeholder="NGUYEN VAN A" />
              </div>
            </CardContent>
          </Card>
        )}

        {paymentMethod === "bank_transfer" && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Thông tin chuyển khoản</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngân hàng:</span>
                  <span className="font-medium">Vietcombank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số tài khoản:</span>
                  <span className="font-mono font-medium">1234567890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chủ tài khoản:</span>
                  <span className="font-medium">CÔNG TY TNHH THẨM MỸ ABC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Nội dung chuyển khoản:
                  </span>
                  <span className="font-mono font-medium">
                    {bookingData.customerInfo.name} - {bookingData.service.name}
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                <p>
                  Vui lòng chuyển khoản trước khi đến thực hiện dịch vụ và giữ
                  lại biên lai chuyển khoản để đối chiếu.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Tóm tắt thanh toán</h3>

        <Card>
          <CardContent className="p-4">
            {isDefault ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gói dịch vụ mặc định</span>
                  <span>{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Giá dịch vụ</span>
                  <span>
                    {service.discountMinPrice.toLocaleString("vi-VN")}đ -{" "}
                    {service.discountMaxPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {service.discountMinPrice.toLocaleString("vi-VN")}đ -{" "}
                    {service.discountMaxPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            ) : (
              <PriceSummary
                selectedProcedures={selectedProcedures}
                showVAT={true}
              />
            )}
          </CardContent>
        </Card>

        <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-md flex items-start gap-2">
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Đảm bảo hoàn tiền</p>
            <p className="text-sm mt-1">
              Nếu bạn không hài lòng với dịch vụ, chúng tôi cam kết hoàn tiền
              100% trong vòng 7 ngày.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
