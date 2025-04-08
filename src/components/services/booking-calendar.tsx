"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi, es, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CalendarPickerProps {
  selected: Date;
  onSelect: (date: Date | undefined) => void;
  className?: string;
  disabled?: (date: Date) => boolean;
}

export function CalendarPicker({
  selected,
  onSelect,
  className,
  disabled,
}: CalendarPickerProps) {
  const t = useTranslations("serviceDetail");
  const locale = useLocale();
  const [month, setMonth] = useState<Date>(selected || new Date());
  const [open, setOpen] = useState(false);

  // Map locale to date-fns locale
  const getDateLocale = () => {
    switch (locale) {
      case "vi":
        return vi;
      case "es":
        return es;
      default:
        return enUS;
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dateLocale = getDateLocale();

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-auto py-3",
              !selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? (
              format(selected, "EEEE, d MMMM yyyy", { locale: dateLocale })
            ) : (
              <span>{t("selectAppointmentDate")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="rounded-md border shadow-sm overflow-hidden bg-white dark:bg-gray-950">
            <div className="p-3 border-b flex items-center justify-between bg-gray-50 dark:bg-gray-900">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const prevMonth = new Date(month);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setMonth(prevMonth);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium">
                {format(month, "MMMM yyyy", { locale: dateLocale })}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const nextMonth = new Date(month);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setMonth(nextMonth);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(date) => {
                onSelect(date);
                setOpen(false);
              }}
              disabled={disabled || ((date) => date < today)}
              initialFocus
              month={month}
              onMonthChange={setMonth}
              className="p-3"
              locale={dateLocale}
              classNames={{
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                  "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                head_cell:
                  "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                caption: "hidden",
              }}
            />
          </div>
        </PopoverContent>
      </Popover>

      {selected && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {format(selected, "EEEE, d MMMM yyyy", { locale: dateLocale })}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelect(undefined)}
            className="h-8 px-2 text-xs"
          >
            {t("clear")}
          </Button>
        </div>
      )}
    </div>
  );
}
