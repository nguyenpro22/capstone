import { useTranslations } from "next-intl";
import { startOfWeek, endOfWeek, format as dateFnsFormat } from "date-fns";

export const useDateTimeFormat = () => {
  const t = useTranslations("doctor.datetime");

  const getWeekday = (date: Date, short: boolean = false) => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const type = short ? "short" : "long";
    return t(`weekdays.${type}.${days[date.getDay()]}`);
  };

  const getMonth = (date: Date, short: boolean = false) => {
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    const type = short ? "short" : "long";
    return t(`months.${type}.${months[date.getMonth()]}`);
  };

  const formatDate = (date: Date) => {
    return t("formats.date", {
      weekday: getWeekday(date),
      day: date.getDate(),
      month: getMonth(date),
      year: date.getFullYear(),
    });
  };

  const formatMonthYear = (date: Date) => {
    return t("formats.monthYear", {
      month: getMonth(date),
      year: date.getFullYear(),
    });
  };

  const formatWeek = (date: Date) => {
    const start = new Date(date);
    start.setDate(
      date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
    );

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    if (start.getMonth() === end.getMonth()) {
      return t("formats.week", {
        startDay: start.getDate(),
        endDay: end.getDate(),
        month: getMonth(end),
        year: end.getFullYear(),
      });
    }

    return t("formats.weekDifferentMonths", {
      startDay: start.getDate(),
      startMonth: getMonth(start, true),
      endDay: end.getDate(),
      endMonth: getMonth(end, true),
      year: end.getFullYear(),
    });
  };

  const formatWeekRange = (currentDate: Date) => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });

    if (start.getMonth() === end.getMonth()) {
      return t("timeFormats.weekWithMonth", {
        startDay: start.getDate(),
        endDay: end.getDate(),
        month: getMonth(end),
        year: end.getFullYear(),
      });
    }

    return t("timeFormats.weekWithDifferentMonths", {
      startDay: start.getDate(),
      startMonth: getMonth(start, true),
      endDay: end.getDate(),
      endMonth: getMonth(end, true),
      year: end.getFullYear(),
    });
  };

  const formatTime = (timeString: string, use24h: boolean = false) => {
    if (!timeString) return "";

    const parts = timeString.split(":");
    if (parts.length >= 2) {
      const hour = parseInt(parts[0], 10);
      const minute = parts[1];

      if (use24h) {
        return t("timeFormats.time24h", {
          hour: hour.toString().padStart(2, "0"),
          minute,
        });
      }

      const hour12 = hour % 12 || 12;
      const ampm = hour >= 12 ? "PM" : "AM";

      return t("timeFormats.time12h", {
        hour: hour12,
        minute,
        ampm,
      });
    }

    return timeString;
  };

  return {
    getWeekday,
    getMonth,
    formatDate,
    formatMonthYear,
    formatWeek,
    formatWeekRange,
    formatTime,
  };
};
