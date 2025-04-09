"use client";

import { useEffect, useState, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import type { BookingData, Procedure } from "../../types/booking";
import { ProcedureItem } from "../procedure-item";
import { PriceSummary } from "../price-summary";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BookingService } from "../../utils/booking-service";

interface SelectProceduresStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
}

export function SelectProceduresStep({
  bookingData,
  updateBookingData,
}: SelectProceduresStepProps) {
  const [selectedProcedures, setSelectedProcedures] = useState<
    {
      procedure: Procedure;
      priceTypeId: string;
    }[]
  >(bookingData.selectedProcedures || []);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDefault, setIsDefault] = useState<boolean>(
    bookingData.isDefault || false
  );

  const { service } = bookingData;

  // Fetch procedures on component mount
  useEffect(() => {
    const fetchProcedures = async () => {
      setLoading(true);
      try {
        const proceduresData = await BookingService.getProceduresByService(
          service
        );
        setProcedures(proceduresData);

        // Automatically select all procedures with their first price type
        if (proceduresData.length > 0) {
          const initialSelections = proceduresData.map((procedure) => ({
            procedure,
            priceTypeId: procedure.procedurePriceTypes[0]?.id || "",
          }));

          // Only set if we don't already have selections
          if (selectedProcedures.length === 0) {
            setSelectedProcedures(initialSelections);
          }
        }
      } catch (error) {
        console.error("Error fetching procedures:", error);
        setProcedures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProcedures();
  }, [service.id, selectedProcedures.length]);

  // Handle price type selection
  const handlePriceTypeChange = useCallback(
    (procedureId: string, priceTypeId: string) => {
      console.log("Changing price type:", procedureId, priceTypeId);

      // Tìm procedure tương ứng
      const procedure = procedures.find((p) => p.id === procedureId);

      if (!procedure) {
        console.error("Procedure not found:", procedureId);
        return;
      }

      // Kiểm tra xem procedure đã có trong selectedProcedures chưa
      const existingIndex = selectedProcedures.findIndex(
        (item) => item.procedure.id === procedureId
      );

      if (existingIndex >= 0) {
        // Nếu đã có, cập nhật priceTypeId
        setSelectedProcedures((prev) =>
          prev.map((item, index) =>
            index === existingIndex ? { ...item, priceTypeId } : item
          )
        );
      } else {
        // Nếu chưa có, thêm mới
        setSelectedProcedures((prev) => [...prev, { procedure, priceTypeId }]);
      }
    },
    [procedures, selectedProcedures]
  );

  // Handle default option toggle
  const handleDefaultToggle = (checked: boolean) => {
    setIsDefault(checked);
    updateBookingData({ isDefault: checked });
  };

  // Update parent component when selections change
  useEffect(() => {
    updateBookingData({ selectedProcedures });
  }, [selectedProcedures, updateBookingData]);

  // Get selected price type for a procedure
  const getSelectedPriceTypeId = useCallback(
    (procedureId: string) => {
      const selected = selectedProcedures.find(
        (item) => item.procedure.id === procedureId
      );
      return selected?.priceTypeId || "";
    },
    [selectedProcedures]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Đang tải danh sách dịch vụ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Chọn dịch vụ</h3>
        <p className="text-muted-foreground mb-4">
          Vui lòng chọn loại dịch vụ cho mỗi quy trình
        </p>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use-default"
            checked={isDefault}
            onCheckedChange={(checked) => handleDefaultToggle(checked === true)}
          />
          <Label
            htmlFor="use-default"
            className="text-sm font-medium cursor-pointer"
          >
            Sử dụng gói dịch vụ mặc định (tự động chọn các dịch vụ với giá tốt
            nhất)
          </Label>
        </div>

        {!isDefault && procedures.length > 0 && (
          <div className="space-y-4">
            {procedures.map((procedure) => (
              <ProcedureItem
                key={procedure.id}
                procedure={procedure}
                selectedPriceTypeId={getSelectedPriceTypeId(procedure.id)}
                onPriceTypeChange={handlePriceTypeChange}
              />
            ))}
          </div>
        )}
      </div>

      <Separator />

      <div className="bg-primary/5 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Tổng chi phí dự kiến</h3>
        {isDefault ? (
          <div className="text-center p-4">
            <p>Bạn đã chọn sử dụng gói dịch vụ mặc định.</p>
            <p className="font-medium mt-2">
              Giá: {service.discountMinPrice.toLocaleString("vi-VN")}đ -{" "}
              {service.discountMaxPrice.toLocaleString("vi-VN")}đ
            </p>
          </div>
        ) : (
          <PriceSummary selectedProcedures={selectedProcedures} />
        )}
      </div>
    </div>
  );
}
