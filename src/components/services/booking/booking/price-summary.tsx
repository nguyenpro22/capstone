import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Procedure } from "../types/booking";
import { calculateTotalPrice } from "../utils/booking-utils";

interface PriceSummaryProps {
  selectedProcedures: {
    procedure: Procedure;
    priceTypeId: string;
  }[];
  showVAT?: boolean;
}

export function PriceSummary({
  selectedProcedures,
  showVAT = false,
}: PriceSummaryProps) {
  const subtotal = calculateTotalPrice(selectedProcedures);
  const vat = Math.round(subtotal * 0.1);
  const total = subtotal + (showVAT ? vat : 0);

  return (
    <div className="space-y-2">
      {selectedProcedures.map((item) => {
        const priceType = item.procedure.procedurePriceTypes.find(
          (pt) => pt.id === item.priceTypeId
        );
        return (
          <div
            key={`${item.procedure.id}-${item.priceTypeId}`}
            className="flex justify-between"
          >
            <div>
              <span>{item.procedure.name}</span>
              {priceType && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {priceType.name}
                </Badge>
              )}
            </div>
            <div>{(priceType?.price || 0).toLocaleString("vi-VN")}đ</div>
          </div>
        );
      })}

      <Separator className="my-2" />

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
