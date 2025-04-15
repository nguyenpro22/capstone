"use client";
import { Card, CardContent } from "@/components/ui/card";
import type { Procedure } from "../types/booking";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ProcedureItemProps {
  procedure: Procedure;
  selectedPriceTypeId?: string;
  onPriceTypeChange: (procedureId: string, priceTypeId: string) => void;
}

export function ProcedureItem({
  procedure,
  selectedPriceTypeId = "",
  onPriceTypeChange,
}: ProcedureItemProps) {
  const t = useTranslations("bookingFlow");

  return (
    <Card className="overflow-hidden border-purple-100 dark:border-purple-800/20">
      <CardContent className="p-0">
        <div className="p-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">
            {procedure.name}
          </h3>
          <p
            className="text-sm text-gray-500 dark:text-gray-400 mt-1"
            dangerouslySetInnerHTML={{ __html: procedure.description }}
          ></p>
        </div>

        <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 border-t border-purple-100 dark:border-purple-800/20">
          <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
            {t("selectServiceType")}
          </h4>
          <div className="space-y-2">
            {procedure.procedurePriceTypes.map((priceType) => {
              const radioId = `price-${procedure.id}-${priceType.id}`;
              const isSelected = selectedPriceTypeId === priceType.id;

              return (
                <div
                  key={priceType.id}
                  className={cn(
                    "flex items-center justify-between space-x-2 rounded-md border p-2 cursor-pointer hover:bg-purple-50/80 dark:hover:bg-purple-900/20",
                    isSelected
                      ? "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  )}
                  onClick={() => onPriceTypeChange(procedure.id, priceType.id)}
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={radioId}
                      name={`procedure-${procedure.id}`}
                      checked={isSelected}
                      onChange={() =>
                        onPriceTypeChange(procedure.id, priceType.id)
                      }
                      className="h-4 w-4 cursor-pointer text-purple-600 dark:text-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400"
                    />
                    <label
                      htmlFor={radioId}
                      className="cursor-pointer text-sm text-gray-800 dark:text-gray-200"
                    >
                      {priceType.name}
                    </label>
                  </div>
                  <div className="font-medium text-purple-700 dark:text-purple-300">
                    {priceType.price.toLocaleString("vi-VN")}đ
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
