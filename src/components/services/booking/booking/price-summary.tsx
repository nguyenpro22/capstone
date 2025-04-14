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
        <p className="text-gray-500 dark:text-gray-400">
          Chưa có dịch vụ nào được chọn
        </p>
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
            <div className="text-left mb-1 text-gray-800 dark:text-gray-200">
              {item.procedure.name}
            </div>
            <div className="flex justify-between items-center">
              {priceType && (
                <Badge
                  variant="outline"
                  className="ml-2 text-xs border-purple-200 dark:border-purple-800/30 text-purple-700 dark:text-purple-300"
                >
                  {priceType.name}
                </Badge>
              )}
              <div className="text-right text-purple-700 dark:text-purple-300">
                {(priceType?.price || 0).toLocaleString("vi-VN")}đ
              </div>
            </div>
          </div>
        );
      })}

      <Separator className="my-3 bg-purple-100 dark:bg-purple-800/30" />

      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Tạm tính</span>
        <span className="text-gray-800 dark:text-gray-200">
          {subtotal.toLocaleString("vi-VN")}đ
        </span>
      </div>

      {showVAT && (
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Thuế VAT (10%)
          </span>
          <span className="text-gray-800 dark:text-gray-200">
            {vat.toLocaleString("vi-VN")}đ
          </span>
        </div>
      )}

      <Separator className="my-2 bg-purple-100 dark:bg-purple-800/30" />

      <div className="flex justify-between font-bold text-lg">
        <span className="text-gray-800 dark:text-gray-200">Tổng cộng</span>
        <span className="text-purple-700 dark:text-purple-300">
          {total.toLocaleString("vi-VN")}đ
        </span>
      </div>
    </div>
  );
}
