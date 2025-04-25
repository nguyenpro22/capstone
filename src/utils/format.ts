// Format price in Vietnamese currency
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

// Format price range in Vietnamese currency
export function formatPriceRange(minPrice: number, maxPrice: number): string {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}

// Calculate discounted price
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercent: number
): number {
  return originalPrice * (1 - discountPercent / 100);
}

// Get service category icon
export function getCategoryIcon(categoryName?: string): string {
  if (!categoryName) return "🧖";

  const name = categoryName.toLowerCase();
  if (name.includes("facial")) return "✨";
  if (name.includes("massage")) return "💆";
  if (name.includes("hair")) return "💇";
  if (name.includes("nail")) return "💅";
  return "🧖";
}
export const translateWeekday = (date: Date, locale: string = "vi"): string => {
  if (locale === "en") {
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return weekdays[date.getDay()];
  }

  // Tiếng Việt
  const weekdays = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  return weekdays[date.getDay()];
};

export const translateMonth = (date: Date, locale: string = "vi"): string => {
  if (locale === "en") {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[date.getMonth()];
  }

  // Tiếng Việt
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  return months[date.getMonth()];
};

export const formatDate = (date: Date, locale: string = "vi"): string => {
  const weekday = translateWeekday(date, locale);
  const month = translateMonth(date, locale);
  const day = date.getDate();
  const year = date.getFullYear();

  if (locale === "en") {
    return `${weekday}, ${month} ${day}, ${year}`;
  }

  return `${weekday}, ${day} ${month} ${year}`;
};

// Hàm format ngắn gọn cho calendar
export const formatShortWeekday = (
  date: Date,
  locale: string = "vi"
): string => {
  if (locale === "en") {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekdays[date.getDay()];
  }

  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return weekdays[date.getDay()];
};

export const formatShortMonth = (date: Date, locale: string = "vi"): string => {
  if (locale === "en") {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[date.getMonth()];
  }

  const months = [
    "Th1",
    "Th2",
    "Th3",
    "Th4",
    "Th5",
    "Th6",
    "Th7",
    "Th8",
    "Th9",
    "Th10",
    "Th11",
    "Th12",
  ];
  return months[date.getMonth()];
};
export const formatMonthYear = (date: Date, locale: string = "vi"): string => {
  const month = translateMonth(date, locale);
  const year = date.getFullYear();

  if (locale === "en") {
    return `${month} ${year}`;
  }

  // Tiếng Việt
  return `${month} năm ${year}`;
};
export const formatWeek = (date: Date, locale: string = "vi"): string => {
  // Lấy ngày đầu và cuối tuần (tuần bắt đầu từ thứ 2)
  const start = new Date(date);
  start.setDate(
    date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
  );

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  // Kiểm tra nếu start và end cùng tháng
  if (start.getMonth() === end.getMonth()) {
    if (locale === "en") {
      return `${start.getDate()} - ${end.getDate()} ${translateMonth(
        end
      )} ${end.getFullYear()}`;
    }
    return `${start.getDate()} - ${end.getDate()} ${translateMonth(
      end
    )} ${end.getFullYear()}`;
  } else {
    if (locale === "en") {
      return `${start.getDate()} ${formatShortMonth(
        start
      )} - ${end.getDate()} ${formatShortMonth(end)} ${end.getFullYear()}`;
    }
    return `${start.getDate()} ${formatShortMonth(
      start
    )} - ${end.getDate()} ${formatShortMonth(end)} ${end.getFullYear()}`;
  }
};
