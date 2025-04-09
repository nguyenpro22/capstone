import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Procedure } from "../types/booking";
import { calculateTotalPrice } from "../utils/booking-utils";
import { cn } from "@/lib/utils";

interface PriceSummaryProps {
  selectedProcedures: {
    procedure: Procedure;
    priceTypeId: string;
  }[];
  showVAT?: boolean;
  className?: string;
}

export function PriceSummary({
  selectedProcedures,
  showVAT = false,
  className,
}: PriceSummaryProps) {
  const subtotal = calculateTotalPrice(selectedProcedures);
  const vat = Math.round(subtotal * 0.1);
  const total = subtotal + (showVAT ? vat : 0);

  if (selectedProcedures.length === 0) {
    return (
      <div className={cn("text-center py-2", className)}>
        <p className="text-muted-foreground">Chưa có dịch vụ nào được chọn</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {selectedProcedures.map((item) => {
        const priceType = item.procedure.procedurePriceTypes.find(
          (pt) => pt.id === item.priceTypeId
        );
        return (
          <div
            key={`${item.procedure.id}-${item.priceTypeId}`}
            className="mb-3"
          >
            <div className="text-left mb-1">{item.procedure.name}</div>
            <div className="flex justify-between items-center">
              {priceType && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {priceType.name}
                </Badge>
              )}
              <div className="text-right">
                {(priceType?.price || 0).toLocaleString("vi-VN")}đ
              </div>
            </div>
          </div>
        );
      })}

      <Separator className="my-3" />

      <div className="flex justify-between">
        <span>Tạm tính</span>
        <span>{subtotal.toLocaleString("vi-VN")}đ</span>
      </div>

      {showVAT && (
        <div className="flex justify-between">
          <span>Thuế VAT (10%)</span>
          <span>{vat.toLocaleString("vi-VN")}đ</span>
        </div>
      )}

      <Separator className="my-2" />

      <div className="flex justify-between font-bold text-lg">
        <span>Tổng cộng</span>
        <span className="text-primary">{total.toLocaleString("vi-VN")}đ</span>
      </div>
    </div>
  );
}
