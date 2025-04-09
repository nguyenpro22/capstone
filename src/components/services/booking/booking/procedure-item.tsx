"use client";
import { Card, CardContent } from "@/components/ui/card";
import type { Procedure, ProcedurePriceType } from "../types/booking";

interface ProcedureItemProps {
  procedure: Procedure;
  selectedPriceTypeId?: string; // Thêm lại prop này, đặt là optional
  onPriceTypeChange: (procedureId: string, priceTypeId: string) => void;
}

export function ProcedureItem({
  procedure,
  selectedPriceTypeId = "", // Giá trị mặc định là chuỗi rỗng
  onPriceTypeChange,
}: ProcedureItemProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <h3 className="font-medium">{procedure.name}</h3>
          <p
            className="text-sm text-muted-foreground mt-1"
            dangerouslySetInnerHTML={{ __html: procedure.description }}
          ></p>
        </div>

        <div className="bg-muted/30 p-4 border-t">
          <h4 className="text-sm font-medium mb-2">Chọn loại dịch vụ:</h4>
          <div className="space-y-2">
            {procedure.procedurePriceTypes.map((priceType) => {
              const radioId = `price-${procedure.id}-${priceType.id}`;
              const isSelected = selectedPriceTypeId === priceType.id; // Xác định isSelected

              return (
                <div
                  key={priceType.id}
                  className={`flex items-center justify-between space-x-2 rounded-md border p-2 cursor-pointer hover:bg-muted/50 ${
                    isSelected ? "bg-primary/10 border-primary" : ""
                  }`}
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
                      className="h-4 w-4 cursor-pointer"
                    />
                    <label htmlFor={radioId} className="cursor-pointer text-sm">
                      {priceType.name}
                    </label>
                  </div>
                  <div className="font-medium text-primary">
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
