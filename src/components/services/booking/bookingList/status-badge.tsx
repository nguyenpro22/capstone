import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/features/booking/types";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case "Pending":
      return (
        <Badge
          variant="outline"
          className={`bg-yellow-50 text-yellow-700 border-yellow-200 font-medium px-2.5 py-0.5 ${className}`}
        >
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          Đang xử lý
        </Badge>
      );
    case "Success":
      return (
        <Badge
          variant="outline"
          className={`bg-green-50 text-green-700 border-green-200 font-medium px-2.5 py-0.5 ${className}`}
        >
          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
          Hoàn thành
        </Badge>
      );
    case "Canceled":
      return (
        <Badge
          variant="outline"
          className={`bg-red-50 text-red-700 border-red-200 font-medium px-2.5 py-0.5 ${className}`}
        >
          <XCircle className="h-3.5 w-3.5 mr-1.5" />
          Đã hủy
        </Badge>
      );
    default:
      return null;
  }
}
