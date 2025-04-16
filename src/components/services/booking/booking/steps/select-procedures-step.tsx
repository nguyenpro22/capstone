"use client";

import { useEffect, useState, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import type { BookingData, Procedure } from "../../types/booking";
import { ProcedureItem } from "../procedure-item";
import { PriceSummary } from "../price-summary";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BookingService } from "../../utils/booking-service";
import { useTranslations } from "next-intl"; // Import useTranslations

interface SelectProceduresStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
}

export function SelectProceduresStep({
  bookingData,
  updateBookingData,
}: SelectProceduresStepProps) {
  const [selectedProcedures, setSelectedProcedures] = useState<
    { procedure: Procedure; priceTypeId: string }[]
  >(bookingData.selectedProcedures || []);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDefault, setIsDefault] = useState<boolean>(
    bookingData.isDefault || false
  );
  const t = useTranslations("bookingFlow");

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

        // Automatically select the first price type for each procedure if no selection exists
        if (proceduresData.length > 0 && selectedProcedures.length === 0) {
          const initialSelections = proceduresData.map((procedure) => ({
            procedure,
            priceTypeId: procedure.procedurePriceTypes[0]?.id || "",
          }));
          setSelectedProcedures(initialSelections);
        }
      } catch (error) {
        console.error("Error fetching procedures:", error);
        setProcedures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProcedures();
  }, [service, selectedProcedures.length]);

  // Handle price type change
  const handlePriceTypeChange = useCallback(
    (procedureId: string, priceTypeId: string) => {
      const procedure = procedures.find((p) => p.id === procedureId);
      if (!procedure) {
        console.error("Procedure not found:", procedureId);
        return;
      }

      // Update selected price type for the procedure
      setSelectedProcedures((prev) => {
        const updated = prev.map((item) =>
          item.procedure.id === procedureId ? { ...item, priceTypeId } : item
        );
        return updated;
      });
    },
    [procedures]
  );

  // Handle default option toggle
  const handleDefaultToggle = (checked: boolean) => {
    setIsDefault(checked);
    updateBookingData({ isDefault: checked });

    if (checked) {
      const defaultSelections = procedures.map((procedure) => {
        const sortedPriceTypes = [...procedure.procedurePriceTypes].sort(
          (a, b) => a.price - b.price
        );
        const cheapest = sortedPriceTypes[0];
        return {
          procedure,
          priceTypeId: cheapest?.id || "",
        };
      });
      setSelectedProcedures(defaultSelections);
    }
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
        <div className="h-8 w-8 border-4 border-purple-500 dark:border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">
          {t("loadingServices")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          {t("selectService")}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {t("pleaseSelectServices")}
        </p>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use-default"
            checked={isDefault}
            onCheckedChange={(checked) => handleDefaultToggle(checked === true)}
            className="border-purple-300 dark:border-purple-700 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 dark:data-[state=checked]:bg-purple-500 dark:data-[state=checked]:border-purple-500"
          />
          <Label
            htmlFor="use-default"
            className="text-sm font-medium cursor-pointer text-gray-800 dark:text-gray-200"
          >
            {t("useDefaultPackage")}
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

      <Separator className="bg-purple-100 dark:bg-purple-800/30" />

      <div className="bg-purple-50/70 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-100 dark:border-purple-800/20">
        <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
          {t("estimatedTotalCost")}
        </h3>
        {isDefault ? (
          <div className="text-center p-4">
            <p className="text-gray-600 dark:text-gray-400">
              {t("youSelectedDefaultPackageBestPrice")}
            </p>
            <p className="font-medium mt-2 text-purple-700 dark:text-purple-300">
              {t("total")}: {service.discountMinPrice.toLocaleString("vi-VN")}đ
            </p>
          </div>
        ) : (
          <PriceSummary selectedProcedures={selectedProcedures} />
        )}
      </div>
    </div>
  );
}
