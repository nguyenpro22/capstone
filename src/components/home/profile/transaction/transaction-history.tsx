"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  SearchIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  AlertCircleIcon,
  RefreshCwIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { useGetCustomerTransactionsQuery } from "@/features/customer-wallet/api";
import type { WalletTransaction } from "@/features/customer-wallet/types";
import { useTranslations } from "next-intl";

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const t = useTranslations("userProfileMessages");
  const statusConfig = {
    Completed: {
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/30",
      icon: <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />,
      text: t("transaction.status.completed"),
    },
    Pending: {
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/30",
      icon: <ClockIcon className="h-3.5 w-3.5 mr-1" />,
      text: t("transaction.status.pending"),
    },
    Failed: {
      color:
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/30",
      icon: <XCircleIcon className="h-3.5 w-3.5 mr-1" />,
      text: t("transaction.status.failed"),
    },
    Cancelled: {
      color:
        "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700/30",
      icon: <AlertCircleIcon className="h-3.5 w-3.5 mr-1" />,
      text: t("transaction.status.cancelled"),
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;

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

// Transaction type icon component
const TransactionTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
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

// Date range picker component
const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}) => {
  const t = useTranslations("userProfileMessages");
  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate
              ? format(startDate, "dd/MM/yyyy")
              : t("transactionHistory.fromDate")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={onStartDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate
              ? format(endDate, "dd/MM/yyyy")
              : t("transactionHistory.toDate")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={onEndDateChange}
            initialFocus
            disabled={(date) => (startDate ? date < startDate : false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Empty state component
const EmptyState = () => {
  const t = useTranslations("userProfileMessages");
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <RefreshCwIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
        {t("transactionHistory.emptyTitle")}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        {t("transactionHistory.emptyDesc")}
      </p>
    </div>
  );
};

// Main transaction history component
export default function TransactionHistory() {
  const t = useTranslations("userProfileMessages");
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState("all");

  // Format dates for API
  const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd") : "";
  const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : "";

  // Query transactions with filters
  const { data, isLoading, isFetching, refetch } =
    useGetCustomerTransactionsQuery({
      searchTerm,
      transactionType: transactionType || undefined,
      status: status
        ? (status.toLowerCase() as
            | "complete"
            | "pending"
            | "failed"
            | undefined)
        : undefined,
      startDate: formattedStartDate || undefined,
      endDate: formattedEndDate || undefined,
      pageIndex: currentPage,
      pageSize,
    });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    transactionType,
    status,
    formattedStartDate,
    formattedEndDate,
  ]);

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);

    if (value === "all") {
      setTransactionType("");
    } else if (value === "deposit") {
      setTransactionType("Deposit");
    } else if (value === "withdrawal") {
      setTransactionType("Withdrawal");
    } else if (value === "transfer") {
      setTransactionType("Transfer");
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setTransactionType("");
    setStatus("");
    setStartDate(undefined);
    setEndDate(undefined);
    setActiveTab("all");
  };

  // Calculate total pages
  const totalPages = data?.value?.totalCount
    ? Math.ceil(data.value.totalCount / pageSize)
    : 0;

  // Get transactions from response
  const transactions = data?.value?.items || [];

  return (
    <Card className="h-full border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl dark:shadow-purple-900/20 rounded-xl overflow-hidden flex flex-col">
      <CardHeader className="pb-2 px-6">
        <CardTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400">
          {t("transactionHistory.title")}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {t("transactionHistory.description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 py-4 flex-1 overflow-y-auto">
        <div className="space-y-6">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">
                {t("transactionHistory.tabs.all")}
              </TabsTrigger>
              <TabsTrigger value="deposit">
                {t("transactionHistory.tabs.deposit")}
              </TabsTrigger>
              <TabsTrigger value="withdrawal">
                {t("transactionHistory.tabs.withdrawal")}
              </TabsTrigger>
              <TabsTrigger value="transfer">
                {t("transactionHistory.tabs.transfer")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder={t("transactionHistory.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={status}
                onValueChange={(value) => {
                  // If "all" is selected, set to undefined, otherwise use the value
                  setStatus(value === "all" ? undefined : value);
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue
                    placeholder={t("transactionHistory.statusPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("transactionHistory.status.all")}
                  </SelectItem>
                  <SelectItem value="Completed">
                    {t("transaction.status.completed")}
                  </SelectItem>
                  <SelectItem value="Pending">
                    {t("transaction.status.pending")}
                  </SelectItem>
                  <SelectItem value="Failed">
                    {t("transaction.status.failed")}
                  </SelectItem>
                  <SelectItem value="Cancelled">
                    {t("transaction.status.cancelled")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="h-9"
                >
                  {t("transactionHistory.reset")}
                </Button>
                <Button
                  size="sm"
                  onClick={() => refetch()}
                  className="h-9 bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isLoading || isFetching}
                >
                  {(isLoading || isFetching) && (
                    <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("transactionHistory.apply")}
                </Button>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                {activeTab === "all"
                  ? t("transactionHistory.list.all")
                  : activeTab === "deposit"
                  ? t("transactionHistory.list.deposit")
                  : activeTab === "withdrawal"
                  ? t("transactionHistory.list.withdrawal")
                  : t("transactionHistory.list.transfer")}
              </h3>
              {data?.value?.totalCount !== undefined && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t("transactionHistory.total", {
                    count: data.value.totalCount,
                  })}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCwIcon className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
              </div>
            ) : transactions.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700/50">
                  <div className="col-span-5">
                    {t("transactionHistory.table.info")}
                  </div>
                  <div className="col-span-2">
                    {t("transactionHistory.table.amount")}
                  </div>
                  <div className="col-span-3">
                    {t("transactionHistory.table.time")}
                  </div>
                  <div className="col-span-2 text-right">
                    {t("transactionHistory.table.status")}
                  </div>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {transactions.map((transaction: WalletTransaction) => (
                    <div
                      key={transaction.id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
                    >
                      <div className="md:grid md:grid-cols-12 md:gap-4 md:items-center flex flex-col gap-3">
                        {/* Transaction Info */}
                        <div className="md:col-span-5 flex items-center gap-3 w-full">
                          <TransactionTypeIcon
                            type={transaction.transactionType}
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                              {transaction.transactionType === "Deposit"
                                ? t("transaction.deposit")
                                : transaction.transactionType === "Withdrawal"
                                ? t("transaction.withdrawal")
                                : transaction.transactionType === "Transfer" &&
                                  transaction.clinicName
                                ? t("transaction.paymentTo", {
                                    clinic: transaction.clinicName,
                                  })
                                : t("transaction.transfer")}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {t("transaction.code")}:{" "}
                              {transaction.id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="md:col-span-2 flex md:block items-center justify-between w-full md:w-auto">
                          <span className="md:hidden text-sm text-gray-500 dark:text-gray-400">
                            {t("transaction.amount")}
                          </span>
                          <p
                            className={cn(
                              "font-semibold",
                              transaction.transactionType === "Deposit"
                                ? "text-green-600 dark:text-green-400"
                                : "text-blue-600 dark:text-blue-400"
                            )}
                          >
                            {transaction.transactionType === "Deposit"
                              ? "+"
                              : "-"}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                              minimumFractionDigits: 0,
                            }).format(transaction.amount)}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="md:col-span-3 flex md:block items-center justify-between w-full md:w-auto">
                          <span className="md:hidden text-sm text-gray-500 dark:text-gray-400">
                            {t("transaction.time")}
                          </span>
                          <div>
                            <p className="text-gray-800 dark:text-gray-200">
                              {format(
                                new Date(transaction.transactionDate),
                                "dd/MM/yyyy"
                              )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {format(
                                new Date(transaction.transactionDate),
                                "HH:mm:ss"
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="md:col-span-2 md:text-right flex md:block items-center justify-between w-full md:w-auto">
                          <span className="md:hidden text-sm text-gray-500 dark:text-gray-400">
                            {t("transaction.status.label")}
                          </span>
                          <StatusBadge status={transaction.status} />
                        </div>
                      </div>

                      {/* Description (if available) */}
                      {transaction.description && (
                        <div className="mt-3 ml-12 text-sm text-gray-600 dark:text-gray-400">
                          <p>{transaction.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Trang {currentPage} / {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1 || isLoading}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages || isLoading}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
