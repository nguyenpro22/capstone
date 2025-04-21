"use client";

import { useState } from "react";
import { format, addDays, isBefore } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

interface DateRangePickerProps {
  onDateRangeChange: (dateRange: string) => void;
  className?: string;
  maxRangeInDays?: number;
}

export function DateRangePicker({
  onDateRangeChange,
  className,
  maxRangeInDays,
}: DateRangePickerProps) {
  const t = useTranslations("registerSchedule");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isOpen, setIsOpen] = useState(false);

  // Cập nhật DateRangePicker để không áp dụng giới hạn ngày nếu maxRangeInDays là undefined
  const handleDateSelect = (date: Date | undefined) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(undefined);
    } else {
      // Ensure end date is not before start date
      if (date && startDate && isBefore(date, startDate)) {
        toast.error(t("endDateBeforeStart"), {
          position: "bottom-right",
          autoClose: 3000,
        });
        return;
      }

      // Chỉ áp dụng giới hạn ngày nếu maxRangeInDays được cung cấp
      if (
        maxRangeInDays &&
        date &&
        startDate &&
        isBefore(addDays(startDate, maxRangeInDays), date)
      ) {
        const newEndDate = addDays(startDate, maxRangeInDays);
        setEndDate(newEndDate);

        toast.info(t("dateRangeLimited", { days: maxRangeInDays }), {
          position: "bottom-right",
          autoClose: 3000,
        });

        // Format and pass the date range to parent component
        const formattedStartDate = format(startDate, "yyyy-MM-dd");
        const formattedEndDate = format(newEndDate, "yyyy-MM-dd");
        onDateRangeChange(`${formattedStartDate} to ${formattedEndDate}`);
        setIsOpen(false);
        return;
      }

      setEndDate(date);

      // Format and pass the date range to parent component
      if (startDate && date) {
        const formattedStartDate = format(startDate, "yyyy-MM-dd");
        const formattedEndDate = format(date, "yyyy-MM-dd");
        onDateRangeChange(`${formattedStartDate} to ${formattedEndDate}`);
        setIsOpen(false);
      }
    }
  };

  const formatDisplayDate = () => {
    if (startDate && endDate) {
      return `${format(startDate, "dd/MM/yyyy")} - ${format(
        endDate,
        "dd/MM/yyyy"
      )}`;
    }
    if (startDate) {
      return `${format(startDate, "dd/MM/yyyy")} - ${t("selectEndDate")}`;
    }
    return t("selectDateRange");
  };

  // Cải thiện UI của DateRangePicker và loại bỏ thông tin về giới hạn ngày
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900",
            !startDate && "text-slate-500 dark:text-slate-400",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
          {formatDisplayDate()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <h3 className="font-medium text-sm text-slate-700 dark:text-slate-300">
            {t("selectDateRange")}
          </h3>
        </div>
        <Calendar
          mode="range"
          selected={{
            from: startDate,
            to: endDate,
          }}
          onSelect={(range) => {
            handleDateSelect(range?.from);
            handleDateSelect(range?.to);
          }}
          initialFocus
          numberOfMonths={2}
        />
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {startDate && endDate
                ? `${format(startDate, "yyyy-MM-dd")} to ${format(
                    endDate,
                    "yyyy-MM-dd"
                  )}`
                : t("selectBothDates")}
            </div>
            <Button
              size="sm"
              disabled={!startDate || !endDate}
              onClick={() => {
                if (startDate && endDate) {
                  const formattedStartDate = format(startDate, "yyyy-MM-dd");
                  const formattedEndDate = format(endDate, "yyyy-MM-dd");
                  onDateRangeChange(
                    `${formattedStartDate} to ${formattedEndDate}`
                  );
                  setIsOpen(false);
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {t("apply")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
