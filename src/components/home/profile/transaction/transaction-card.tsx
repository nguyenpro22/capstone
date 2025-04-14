import { format } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  AlertCircleIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { WalletTransaction } from "@/features/customer-wallet/types";

interface TransactionCardProps {
  transaction: WalletTransaction;
  compact?: boolean;
}

export function TransactionCard({
  transaction,
  compact = false,
}: TransactionCardProps) {
  // Get transaction icon based on type
  const getTransactionIcon = () => {
    switch (transaction.transactionType) {
      case "Deposit":
        return (
          <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
            <ArrowDownIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        );
      case "Withdrawal":
        return (
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <ArrowUpIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        );
      case "Transfer":
        return (
          <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <ArrowRightIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800/50">
            <ArrowRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
        );
    }
  };

  // Get transaction title based on type
  const getTransactionTitle = () => {
    switch (transaction.transactionType) {
      case "Deposit":
        return "Nạp tiền vào ví";
      case "Withdrawal":
        return "Rút tiền từ ví";
      case "Transfer":
        return transaction.clinicName
          ? `Thanh toán cho ${transaction.clinicName}`
          : "Chuyển khoản";
      default:
        return "Giao dịch";
    }
  };

  // Get status badge
  const getStatusBadge = () => {
    const statusConfig = {
      Completed: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/30",
        icon: <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />,
        text: "Hoàn thành",
      },
      Pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/30",
        icon: <ClockIcon className="h-3.5 w-3.5 mr-1" />,
        text: "Đang xử lý",
      },
      Failed: {
        color:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/30",
        icon: <XCircleIcon className="h-3.5 w-3.5 mr-1" />,
        text: "Thất bại",
      },
      Cancelled: {
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700/30",
        icon: <AlertCircleIcon className="h-3.5 w-3.5 mr-1" />,
        text: "Đã hủy",
      },
    };

    const config =
      statusConfig[transaction.status as keyof typeof statusConfig] ||
      statusConfig.Pending;

    return (
      <Badge
        variant="outline"
        className={cn("flex items-center font-normal", config.color)}
      >
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  // Format amount with color based on transaction type
  const getFormattedAmount = () => {
    const isPositive = transaction.transactionType === "Deposit";
    const formattedAmount = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(transaction.amount);

    return (
      <span
        className={cn(
          "font-semibold",
          isPositive
            ? "text-green-600 dark:text-green-400"
            : "text-blue-600 dark:text-blue-400"
        )}
      >
        {isPositive ? "+" : "-"}
        {formattedAmount}
      </span>
    );
  };

  // Compact version for recent transactions
  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700/50 shadow-sm">
        <div className="flex items-center gap-3">
          {getTransactionIcon()}
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {getTransactionTitle()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(
                new Date(transaction.transactionDate),
                "dd/MM/yyyy HH:mm"
              )}
            </p>
          </div>
        </div>
        <div>
          <p className="text-right">{getFormattedAmount()}</p>
          <p className="text-xs text-right text-gray-500 dark:text-gray-400">
            {transaction.status === "Completed" ? "Hoàn thành" : "Đang xử lý"}
          </p>
        </div>
      </div>
    );
  }

  // Full version for transaction history
  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors">
      <div className="md:grid md:grid-cols-12 md:gap-4 md:items-center flex flex-col gap-3">
        {/* Transaction Info */}
        <div className="md:col-span-5 flex items-center gap-3 w-full">
          {getTransactionIcon()}
          <div className="min-w-0">
            <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
              {getTransactionTitle()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Mã GD: {transaction.id.substring(0, 8)}...
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="md:col-span-2 flex md:block items-center justify-between w-full md:w-auto">
          <span className="md:hidden text-sm text-gray-500 dark:text-gray-400">
            Số tiền:
          </span>
          {getFormattedAmount()}
        </div>

        {/* Date */}
        <div className="md:col-span-3 flex md:block items-center justify-between w-full md:w-auto">
          <span className="md:hidden text-sm text-gray-500 dark:text-gray-400">
            Thời gian:
          </span>
          <div>
            <p className="text-gray-800 dark:text-gray-200">
              {format(new Date(transaction.transactionDate), "dd/MM/yyyy")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(transaction.transactionDate), "HH:mm:ss")}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="md:col-span-2 md:text-right flex md:block items-center justify-between w-full md:w-auto">
          <span className="md:hidden text-sm text-gray-500 dark:text-gray-400">
            Trạng thái:
          </span>
          {getStatusBadge()}
        </div>
      </div>

      {/* Description (if available) */}
      {transaction.description && (
        <div className="mt-3 ml-12 text-sm text-gray-600 dark:text-gray-400">
          <p>{transaction.description}</p>
        </div>
      )}
    </div>
  );
}
