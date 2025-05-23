// utils/orderHelpers.ts
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock3, AlertCircle, Star } from "lucide-react";

export const getStatusBadge = (status: string, locale: string) => {
  const base = "flex items-center gap-1.5";
  switch (status) {
    case "Completed":
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          <span className={base}>
            <span className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400"></span>
            {translateOrderStatus(status, locale)}
          </span>
        </Badge>
      );
    case "Pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          <span className={base}>
            <span className="h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400"></span>
            {translateOrderStatus(status, locale)}
          </span>
        </Badge>
      );
    case "In Progress":
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          <span className={base}>
            <span className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400"></span>
            {translateOrderStatus(status, locale)}
          </span>
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
          {translateOrderStatus(status, locale)}
        </Badge>
      );
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return (
        <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
      );
    case "Pending":
      return (
        <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
      );
    case "In Progress":
      return <Clock3 className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
    default:
      return (
        <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      );
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-500 dark:bg-green-400";
    case "Pending":
      return "bg-amber-500 dark:bg-amber-400";
    case "In Progress":
      return "bg-blue-500 dark:bg-blue-400";
    default:
      return "bg-gray-500 dark:bg-gray-400";
  }
};

export const getFeedbackStars = (rating: number | null) => {
  if (!rating) return null;
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
      <span className="ml-1.5 text-sm text-gray-600 dark:text-gray-300">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatTime = (time: string | null) => {
  if (!time) return "N/A";
  return time.substring(0, 5);
};
export const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("vi-VN");
};
export const translateOrderStatus = (
  status: string,
  locale: string = "vi"
): string => {
  if (locale === "en") {
    // Trả về text tiếng Anh gốc đã được format
    switch (status) {
      case "PENDING":
        return "Pending";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      case "UNCOMPLETED":
        return "Uncompleted";
      case "CANCELED":
        return "Canceled";
      case "Waiting Approval":
        return "Waiting Approval";
      default:
        return status;
    }
  }

  // Trả về text tiếng Việt
  switch (status) {
    case "Pending":
    case "PENDING":
      return "Đang chờ";
    case "In Progress":
    case "IN_PROGRESS":
      return "Đang thực hiện";
    case "Completed":
    case "COMPLETED":
      return "Hoàn thành";
    case "Uncompleted":
    case "UNCOMPLETED":
      return "Chưa hoàn thành";
    case "Canceled":
    case "CANCELED":
      return "Đã hủy";
    case "Waiting Approval":
      return "Chờ phê duyệt";
    default:
      return status;
  }
};
