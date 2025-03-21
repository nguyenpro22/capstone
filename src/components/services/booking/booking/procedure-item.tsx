"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Procedure, ProcedurePriceType } from "../types/booking";

interface ProcedureItemProps {
  procedure: Procedure;
  isSelected: boolean;
  selectedPriceTypeId: string;
  onProcedureToggle: (procedure: Procedure, checked: boolean) => void;
  onPriceTypeChange: (procedureId: string, priceTypeId: string) => void;
}

export function ProcedureItem({
  procedure,
  isSelected,
  selectedPriceTypeId,
  onProcedureToggle,
  onPriceTypeChange,
}: ProcedureItemProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 flex items-start gap-3">
          <Checkbox
            id={`procedure-${procedure.id}`}
            checked={isSelected}
            onCheckedChange={(checked) =>
              onProcedureToggle(procedure, checked === true)
            }
          />
          <div className="flex-1">
            <Label
              htmlFor={`procedure-${procedure.id}`}
              className="font-medium cursor-pointer"
            >
              {procedure.name}
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              {procedure.description}
            </p>

            {procedure.coverImage && procedure.coverImage.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {procedure.coverImage.slice(0, 2).map((imgUrl, index) => (
                  <div
                    key={index}
                    className="relative h-24 rounded-md overflow-hidden"
                  >
                    <img
                      src={
                        imgUrl ||
                        "/placeholder.svg?height=96&width=160" ||
                        "/placeholder.svg"
                      }
                      alt={`${procedure.name} - Hình ảnh ${index + 1}`}
                      className="object-cover h-full w-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isSelected && (
          <div className="bg-muted/30 p-4 border-t">
            <h4 className="text-sm font-medium mb-2">Chọn loại dịch vụ:</h4>
            <RadioGroup
              value={selectedPriceTypeId}
              onValueChange={(value) => onPriceTypeChange(procedure.id, value)}
              className="space-y-2"
            >
              {procedure.procedurePriceTypes.map((priceType) => (
                <PriceTypeOption key={priceType.id} priceType={priceType} />
              ))}
            </RadioGroup>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PriceTypeOptionProps {
  priceType: ProcedurePriceType;
}

function PriceTypeOption({ priceType }: PriceTypeOptionProps) {
  return (
    <div className="flex items-center justify-between space-x-2 rounded-md border p-2">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={priceType.id} id={`price-${priceType.id}`} />
        <Label htmlFor={`price-${priceType.id}`} className="cursor-pointer">
          {priceType.name}
        </Label>
      </div>
      <div className="font-medium text-primary">
        {priceType.price.toLocaleString("vi-VN")}đ
      </div>
    </div>
  );
}
