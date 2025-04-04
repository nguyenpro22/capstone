"use client";

import { useEffect, useState, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { BookingData, Procedure } from "../../types/booking";
import { ProcedureItem } from "../procedure-item";
import { PriceSummary } from "../price-summary";
import { BookingService } from "../../utils/booking-service";

interface SelectServiceStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
}

export function SelectServiceStep({
  bookingData,
  updateBookingData,
}: SelectServiceStepProps) {
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
      } catch (error) {
        console.error("Error fetching procedures:", error);
        setProcedures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProcedures();
  }, [service.id]);

  // Select lowest price options when default is chosen
  useEffect(() => {
    if (isDefault && procedures.length > 0) {
      // Create a selection with the lowest price option for each procedure
      const lowestPriceSelections = procedures.map((procedure) => {
        // Find the price type with the lowest price
        const lowestPriceType = procedure.procedurePriceTypes.reduce(
          (lowest, current) =>
            current.price < lowest.price ? current : lowest,
          procedure.procedurePriceTypes[0]
        );

        return {
          procedure,
          priceTypeId: lowestPriceType.id,
        };
      });

      setSelectedProcedures(lowestPriceSelections);
      updateBookingData({ selectedProcedures: lowestPriceSelections });
    }
  }, [isDefault, procedures, updateBookingData]);

  // Check if a procedure is selected
  const isProcedureSelected = useCallback(
    (procedureId: string) => {
      return selectedProcedures.some(
        (item) => item.procedure.id === procedureId
      );
    },
    [selectedProcedures]
  );

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

  // Handle procedure selection
  const handleProcedureToggle = useCallback(
    (procedure: Procedure, checked: boolean) => {
      if (checked) {
        // Select the default (first) price type when selecting a procedure
        const defaultPriceTypeId = procedure.procedurePriceTypes[0]?.id || "";
        setSelectedProcedures((prev) => [
          ...prev,
          { procedure, priceTypeId: defaultPriceTypeId },
        ]);
      } else {
        setSelectedProcedures((prev) =>
          prev.filter((item) => item.procedure.id !== procedure.id)
        );
      }
    },
    []
  );

  // Handle price type selection
  const handlePriceTypeChange = useCallback(
    (procedureId: string, priceTypeId: string) => {
      setSelectedProcedures((prev) =>
        prev.map((item) =>
          item.procedure.id === procedureId ? { ...item, priceTypeId } : item
        )
      );
    },
    []
  );

  // Handle default option toggle
  const handleDefaultToggle = (checked: boolean) => {
    setIsDefault(checked);
    updateBookingData({ isDefault: checked });
  };

  // Update parent component when selections change
  useEffect(() => {
    if (
      !isDefault &&
      (selectedProcedures.length > 0 ||
        bookingData.selectedProcedures.length > 0)
    ) {
      // Only update if there's an actual change
      if (
        JSON.stringify(selectedProcedures) !==
        JSON.stringify(bookingData.selectedProcedures)
      ) {
        updateBookingData({ selectedProcedures });
      }
    }
  }, [
    selectedProcedures,
    bookingData.selectedProcedures,
    updateBookingData,
    isDefault,
  ]);

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
          Vui lòng chọn các dịch vụ bạn muốn thực hiện
        </p>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use-default"
            checked={isDefault}
            onCheckedChange={(checked) => handleDefaultToggle(checked === true)}
          />
          <Label htmlFor="use-default" className="text-sm cursor-pointer">
            Sử dụng gói dịch vụ mặc định (tự động chọn các dịch vụ với giá tốt
            nhất)
          </Label>
        </div>

        {!isDefault && (
          <div className="space-y-4">
            {procedures && procedures.length > 0 ? (
              procedures.map((procedure) => (
                <ProcedureItem
                  key={procedure.id}
                  procedure={procedure}
                  isSelected={isProcedureSelected(procedure.id)}
                  selectedPriceTypeId={getSelectedPriceTypeId(procedure.id)}
                  onProcedureToggle={handleProcedureToggle}
                  onPriceTypeChange={handlePriceTypeChange}
                />
              ))
            ) : (
              <p className="text-muted-foreground">
                Không có thông tin quy trình chi tiết.
              </p>
            )}
          </div>
        )}
      </div>

      <Separator />

      <div className="bg-primary/5 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Tổng chi phí dự kiến</h3>
        {isDefault ? (
          <div className="text-center p-4">
            <p>Bạn đã chọn sử dụng gói dịch vụ mặc định với giá tốt nhất.</p>
            <div className="mt-4">
              <PriceSummary selectedProcedures={selectedProcedures} />
            </div>
          </div>
        ) : (
          <PriceSummary selectedProcedures={selectedProcedures} />
        )}
      </div>
    </div>
  );
}
