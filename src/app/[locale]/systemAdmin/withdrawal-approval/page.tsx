"use client";

import { TableHead } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  ChevronDown,
  Download,
  Loader2,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  CreditCard,
  Clock,
  FileText,
  User,
  Check,
  X,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pagination from "@/components/common/Pagination/Pagination";
import { useGetWalletTransactionsQuery } from "@/features/wallet-transaction/api";
import { useUpdateWithdrawalStatusMutation } from "@/features/wallet-transaction/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import PaymentService from "@/hooks/usePaymentStatus";
import { getAccessToken, getRefreshToken } from "@/utils";
import { useRefreshTokenMutation } from "@/features/auth/api";
import { setAccessToken, setRefreshToken } from "@/utils";
import * as signalR from "@microsoft/signalr";
import { useTranslations } from "next-intl"; // Import useTranslations hook

export default function WithdrawalApprovalPage() {
  // Initialize translations
  const t = useTranslations("withdrawal");

  const router = useRouter();

  // State for pagination and filtering
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("createOnUtc");
  const [sortOrder, setSortOrder] = useState("desc");
  const [transactionType, setTransactionType] = useState("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionInput, setShowRejectionInput] = useState(false);

  // QR code and payment states
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed" | "price-changed"
  >("pending");
  const [showPaymentResult, setShowPaymentResult] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    amount: number | null;
    timestamp: string | null;
    message: string | null;
  }>({
    amount: null,
    timestamp: null,
    message: null,
  });

  // Fetch transactions data
  const {
    data: transactionsData,
    isLoading,
    refetch,
  } = useGetWalletTransactionsQuery({
    pageIndex,
    pageSize,
    searchTerm: debouncedSearchTerm,
    sortColumn,
    sortOrder,
    ...(dateRange.from &&
    dateRange.to &&
    format(dateRange.from, "yyyy-MM-dd") === format(dateRange.to, "yyyy-MM-dd")
      ? {
          startDate: format(dateRange.from, "yyyy-MM-dd"),
          endDate: format(dateRange.to, "yyyy-MM-dd"),
        }
      : {}),
  });

  // Add the mutation for updating withdrawal status
  const [updateWithdrawalStatus, { isLoading: isUpdatingStatus }] =
    useUpdateWithdrawalStatusMutation();

  // Add the refreshToken mutation hook
  const [refreshToken] = useRefreshTokenMutation();

  // Debounce search term and handle date range formatting
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if we need to format a date range search
      if (dateRange.from && dateRange.to) {
        const fromDate = format(dateRange.from, "yyyy-MM-dd");
        const toDate = format(dateRange.to, "yyyy-MM-dd");

        // If same date, use startDate and endDate params (handled in the API call)
        if (fromDate === toDate) {
          setDebouncedSearchTerm(searchTerm);
        } else {
          // Format as yyyy-MM-dd to yyyy-MM-dd
          const formattedDateRange = `${fromDate} to ${toDate}`;
          setDebouncedSearchTerm(formattedDateRange);
        }
      } else {
        setDebouncedSearchTerm(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dateRange]);

  // Reset to first page when search term changes
  useEffect(() => {
    setPageIndex(1);
  }, [debouncedSearchTerm]);

  // SignalR connection for payment status
  useEffect(() => {
    if (!transactionId) return;

    const setupConnection = async () => {
      try {
        await PaymentService.startConnection();
        await PaymentService.joinPaymentSession(transactionId);

        // Set up the payment status listener
        PaymentService.onPaymentStatusReceived(
          async (
            status: boolean,
            details?: {
              amount?: number;
              timestamp?: string;
              message?: string;
            }
          ) => {
            setPaymentStatus(status ? "success" : "failed");

            // Store payment details if available
            if (details) {
              setPaymentDetails({
                amount: details.amount || null,
                timestamp: details.timestamp || new Date().toISOString(),
                message: details.message || null,
              });
            }

            // If payment is successful
            if (status) {
              toast.success(t("paymentSuccessful"));
              // Close the QR dialog and show payment result
              setShowQR(false);
              setShowPaymentResult(true);

              // Refresh tokens
              const accessToken = getAccessToken() as string;
              const refreshTokenValue = getRefreshToken() as string;

              if (accessToken && refreshTokenValue) {
                try {
                  const result = await refreshToken({
                    accessToken,
                    refreshToken: refreshTokenValue,
                  }).unwrap();

                  if (result.isSuccess) {
                    // Save the new tokens
                    setAccessToken(result.value.accessToken);
                    setRefreshToken(result.value.refreshToken);
                    console.log("Tokens refreshed successfully after payment");
                  }
                } catch (error) {
                  console.error(
                    "Failed to refresh tokens after payment:",
                    error
                  );
                }
              }

              // Refresh the data after a delay
              setTimeout(() => {
                refetch();
              }, 2000);
            } else {
              toast.error(details?.message || t("paymentFailedTryAgain"));
              // Show payment result with failure details
              setShowQR(false);
              setShowPaymentResult(true);
            }
          }
        );
      } catch (error) {
        console.error("Failed to set up SignalR connection:", error);
        // toast.error(t("failedToConnectPayment"));
      }
    };

    setupConnection();

    // Clean up the connection when component unmounts
    return () => {
      if (transactionId) {
        PaymentService.leavePaymentSession(transactionId);
      }
    };
  }, [transactionId, refetch, refreshToken, t]);

  // Get transactions from API data
  const transactions = transactionsData?.value?.items || [];
  const totalCount = transactionsData?.value?.totalCount || 0;
  const hasNextPage = transactionsData?.value?.hasNextPage || false;
  const hasPreviousPage = transactionsData?.value?.hasPreviousPage || false;

  // Format currency
  const formatCurrency = (amount: number) => {
    const currency = "VND";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Update the getTransactionTypeBadge function to ensure consistent badge styling and width
  const getTransactionTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "withdrawal":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 min-w-[100px] justify-center"
          >
            {t("withdrawal")}
          </Badge>
        );
      case "deposit":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 min-w-[100px] justify-center"
          >
            {t("deposit")}
          </Badge>
        );
      case "payment":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 min-w-[100px] justify-center"
          >
            {t("payment")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="min-w-[100px] justify-center">
            {type}
          </Badge>
        );
    }
  };

  // Update the getStatusBadge function to ensure consistent badge styling and width
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 min-w-[120px] justify-center">
            {t("completed")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 min-w-[120px] justify-center">
            {t("pending")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 min-w-[120px] justify-center">
            {t("rejected")}
          </Badge>
        );
      case "waiting for payment":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 min-w-[120px] justify-center">
            {t("waitingForPayment")}
          </Badge>
        );
      case "waiting approval":
        return (
          <Badge className="bg-pink-500 hover:bg-pink-600 min-w-[120px] justify-center">
            {t("waitingApproval")}
          </Badge>
        );
      default:
        return <Badge className="min-w-[120px] justify-center">{status}</Badge>;
    }
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // Handle approve withdrawal
  const handleApprove = async () => {
    if (!selectedTransaction) return;

    try {
      // Show loading state
      toast.info(t("processingApproval"), { autoClose: 2000 });

      const response = await updateWithdrawalStatus({
        withdrawalId: selectedTransaction.id,
        isApproved: true,
      }).unwrap();

      console.log("Approval response:", response);

      // Check if we have a QR URL in the response
      if (
        response &&
        response.isSuccess &&
        response.value &&
        response.value.qrUrl
      ) {
        // Set QR URL and transaction ID
        setQrUrl(response.value.qrUrl);
        setTransactionId(response.value.transactionId);
        setPaymentStatus("pending");

        // Update the transaction status in the UI to "waiting for payment"
        const updatedTransaction = {
          ...selectedTransaction,
          status: "waiting for payment",
        };
        setSelectedTransaction(updatedTransaction);

        // Close details modal and show QR code
        setIsDetailsModalOpen(false);
        setShowQR(true);

        toast.success(t("withdrawalApprovedCompletePayment"));

        // Refresh the data to show the updated status
        refetch();
      } else {
        // No QR URL, just show success message
        toast.success(t("withdrawalRequestApproved"));
        setIsDetailsModalOpen(false);
        refetch(); // Refresh data after approval
      }
    } catch (error: any) {
      console.error("Failed to approve withdrawal:", error);

      // Extract error message from the error response with fallbacks
      const errorDetail =
        error.data?.detail || error.data?.message || error.message;
      toast.error(`${t("failedToApproveWithdrawal")}: ${errorDetail}`);
    }
  };

  // Handle reject withdrawal
  const handleReject = async () => {
    if (!selectedTransaction) return;

    if (!rejectionReason) {
      setShowRejectionInput(true);
      return;
    }

    try {
      // Show loading state
      toast.info(t("processingRejection"), { autoClose: 2000 });

      const response = await updateWithdrawalStatus({
        withdrawalId: selectedTransaction.id,
        isApproved: false,
        rejectionReason,
      }).unwrap();

      console.log("Rejection response:", response);

      // Always consider it a success if we reach here without throwing an exception
      toast.success(t("withdrawalRequestRejected"));
      setIsDetailsModalOpen(false);
      refetch(); // Refresh data after rejection
    } catch (error: any) {
      console.error("Failed to reject withdrawal:", error);

      // Extract error message from the error response with fallbacks
      const errorDetail =
        error.data?.detail || error.data?.message || error.message;
      toast.error(`${t("failedToRejectWithdrawal")}: ${errorDetail}`);
    }
  };

  // Handle quick approve (directly from table)
  const handleQuickApprove = async (transaction: any) => {
    try {
      // Show loading state
      toast.info(t("processingApproval"), { autoClose: 2000 });

      const response = await updateWithdrawalStatus({
        withdrawalId: transaction.id,
        isApproved: true,
      }).unwrap();

      console.log("Quick approval response:", response);

      // Check if we have a QR URL in the response
      if (
        response &&
        response.isSuccess &&
        response.value &&
        response.value.qrUrl
      ) {
        // Set selected transaction, QR URL and transaction ID
        const updatedTransaction = {
          ...transaction,
          status: "waiting for payment",
        };
        setSelectedTransaction(updatedTransaction);
        setQrUrl(response.value.qrUrl);
        setTransactionId(response.value.transactionId);
        setPaymentStatus("pending");

        // Show QR code
        setShowQR(true);

        toast.success(t("withdrawalApprovedCompletePayment"));

        // Refresh the data to show the updated status
        refetch();
      } else {
        // No QR URL, just show success message
        toast.success(t("withdrawalRequestApproved"));
        refetch(); // Refresh data after approval
      }
    } catch (error: any) {
      console.error("Failed to approve withdrawal:", error);

      // Extract error message from the error response with fallbacks
      const errorDetail =
        error.data?.detail || error.data?.message || error.message;
      toast.error(`${t("failedToApproveWithdrawal")}: ${errorDetail}`);
    }
  };

  // Handle quick reject (opens modal for reason)
  const handleQuickReject = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
    setShowRejectionInput(true);
  };

  // Handle refresh data
  const handleRefresh = () => {
    refetch();
  };

  // Handle export data
  const handleExport = () => {
    // Implementation for exporting data
    alert(t("exportFunctionalityMessage"));
  };

  // Clear all filters
  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setTransactionType("all");
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSortColumn("createOnUtc");
    setSortOrder("desc");
  };

  // Filter transactions by date range and type
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by transaction type
    if (
      transactionType !== "all" &&
      transaction.transactionType.toLowerCase() !==
        transactionType.toLowerCase()
    ) {
      return false;
    }

    // Filter by date range
    if (dateRange.from || dateRange.to) {
      const transactionDate = new Date(transaction.transactionDate);
      if (dateRange.from && transactionDate < dateRange.from) return false;
      if (dateRange.to) {
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999);
        if (transactionDate > endDate) return false;
      }
    }

    return true;
  });

  // Add this function to extract the transaction ID from the QR URL
  const extractTransactionIdFromQrUrl = (qrUrl: string): string | null => {
    try {
      // Parse the URL to get the query parameters
      const url = new URL(qrUrl);
      const description = url.searchParams.get("des");

      if (description && description.includes("Beautifywithdrawal")) {
        // Extract the transaction ID (last 36 characters after 'Beautifywithdrawal')
        const transactionId = description.substring(
          description.indexOf("Beautifywithdrawal") +
            "Beautifywithdrawal".length
        );
        return transactionId;
      }
      return null;
    } catch (error) {
      console.error("Failed to extract transaction ID from QR URL:", error);
      return null;
    }
  };

  // Update the handleViewQRCode function to extract the transaction ID from the QR URL
  const handleViewQRCode = (transaction: any) => {
    setSelectedTransaction(transaction);

    // Check if the transaction has a newestQrUrl property
    if (transaction.newestQrUrl) {
      // We already have the QR URL from the transaction data
      setQrUrl(transaction.newestQrUrl);

      // Extract the transaction ID from the QR URL
      const extractedTransactionId = extractTransactionIdFromQrUrl(
        transaction.newestQrUrl
      );

      // Use the extracted transaction ID if available, otherwise fall back to the transaction ID
      const sessionTransactionId = extractedTransactionId || transaction.id;
      setTransactionId(sessionTransactionId);

      setPaymentStatus("pending");
      setShowQR(true);

      // Set up the payment session with the extracted transaction ID
      // First establish the connection, then join the session
      PaymentService.startConnection()
        .then(() => {
          // Add a small delay to ensure the connection is fully established
          return new Promise((resolve) => setTimeout(resolve, 1000));
        })
        .then(() => {
          // Check if the connection is actually connected before joining
          if (
            PaymentService.getConnectionState() ===
            signalR.HubConnectionState.Connected
          ) {
            return PaymentService.joinPaymentSession(sessionTransactionId);
          } else {
            throw new Error("Connection not established yet");
          }
        })
        .catch((error) => {
          console.error("Failed to set up payment session:", error);
          toast.error(t("failedToConnectPaymentTryAgain"));
        });
    } else {
      toast.error(t("qrCodeNotAvailable"));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("walletTransactions")}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            {t("refresh")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            {t("export")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">
            {t("transactionHistory")}
          </CardTitle>
          <CardDescription>{t("viewAndManageTransactions")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger
                value="all"
                onClick={() => setTransactionType("all")}
              >
                {t("allTransactions")}
              </TabsTrigger>
              <TabsTrigger
                value="withdrawal"
                onClick={() => setTransactionType("withdrawal")}
              >
                {t("withdrawals")}
              </TabsTrigger>
              <TabsTrigger
                value="deposit"
                onClick={() => setTransactionType("deposit")}
              >
                {t("deposits")}
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                onClick={() => setTransactionType("payment")}
              >
                {t("payments")}
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-2 items-center">
                  {/* Date Range Filter */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9">
                        <Calendar className="h-4 w-4 mr-2" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          t("dateRange")
                        )}
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={{
                          from: dateRange.from,
                          to: dateRange.to,
                        }}
                        onSelect={(range) => {
                          if (range) {
                            setDateRange({ from: range.from, to: range.to });
                          } else {
                            setDateRange({ from: undefined, to: undefined });
                          }
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Clear Filters Button */}
                  {(dateRange.from ||
                    transactionType !== "all" ||
                    searchTerm) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-9"
                    >
                      {t("clearFilters")}
                    </Button>
                  )}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t("searchPlaceholder")}
                    className="pl-8 w-full md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Transactions Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px] text-center">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("transactionDate")}
                          className="flex items-center justify-center gap-1 font-semibold w-full"
                        >
                          {t("date")}
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-[220px]">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("clinicName")}
                          className="flex items-center gap-1 font-semibold"
                        >
                          {t("clinic")}
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-[120px] text-center">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("amount")}
                          className="flex items-center justify-center gap-1 font-semibold w-full"
                        >
                          {t("amount")}
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-[120px] text-center">
                        {t("type")}
                      </TableHead>
                      <TableHead className="w-[150px] text-center">
                        {t("status")}
                      </TableHead>
                      <TableHead>{t("description")}</TableHead>
                      <TableHead className="w-[150px] text-right">
                        {t("actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            {t("loadingTransactions")}
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium text-center">
                            <div className="flex flex-col items-center">
                              <span>
                                {format(
                                  new Date(transaction.transactionDate),
                                  "dd/MM/yyyy"
                                )}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(
                                  new Date(transaction.transactionDate),
                                  "HH:mm"
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="line-clamp-2 overflow-hidden">
                              {transaction.clinicName}
                            </div>
                          </TableCell>
                          <TableCell
                            className={`font-semibold text-center ${
                              transaction.transactionType.toLowerCase() ===
                              "withdrawal"
                                ? "text-red-600 dark:text-red-400"
                                : "text-green-600 dark:text-green-400"
                            }`}
                          >
                            {transaction.transactionType.toLowerCase() ===
                            "withdrawal"
                              ? "- "
                              : "+ "}
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              {getTransactionTypeBadge(
                                transaction.transactionType
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              {getStatusBadge(transaction.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="max-w-[200px] line-clamp-2 overflow-hidden">
                                    {transaction.description}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">
                                    {transaction.description}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {transaction.status.toLowerCase() ===
                                "waiting approval" &&
                                transaction.transactionType.toLowerCase() ===
                                  "withdrawal" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() =>
                                        handleQuickReject(transaction)
                                      }
                                      disabled={isUpdatingStatus}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      {t("reject")}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-500 hover:text-green-700 hover:bg-green-50"
                                      onClick={() =>
                                        handleQuickApprove(transaction)
                                      }
                                      disabled={isUpdatingStatus}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      {t("approve")}
                                    </Button>
                                  </>
                                )}
                              {transaction.status.toLowerCase() ===
                                "waiting for payment" &&
                                transaction.transactionType.toLowerCase() ===
                                  "withdrawal" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() =>
                                      handleViewQRCode(transaction)
                                    }
                                  >
                                    <CreditCard className="h-4 w-4 mr-1" />
                                    {t("viewQR")}
                                  </Button>
                                )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <CreditCard className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-lg font-medium">
                              {t("noTransactionsFound")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {searchTerm
                                ? t("adjustSearchOrFilters")
                                : t("transactionsWillAppearHere")}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredTransactions.length > 0 && (
                <Pagination
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  totalCount={totalCount}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  onPageChange={setPageIndex}
                />
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Dialog
          open={isDetailsModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsDetailsModalOpen(false);
              setShowRejectionInput(false);
              setRejectionReason("");
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t("transactionDetails")}</DialogTitle>
              <DialogDescription>
                {t("detailsFor")}{" "}
                {selectedTransaction.transactionType.toLowerCase()}{" "}
                {t("transaction")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                    <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {getTransactionTypeBadge(
                        selectedTransaction.transactionType
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("transactionID")}:{" "}
                      {selectedTransaction.id.substring(0, 8)}
                      ...
                    </p>
                  </div>
                </div>
                <div>{getStatusBadge(selectedTransaction.status)}</div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("amount")}
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      selectedTransaction.transactionType.toLowerCase() ===
                      "withdrawal"
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {selectedTransaction.transactionType.toLowerCase() ===
                    "withdrawal"
                      ? "- "
                      : "+ "}
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("dateAndTime")}
                  </p>
                  <div className="flex flex-col">
                    <p className="font-medium">
                      {format(
                        new Date(selectedTransaction.transactionDate),
                        "dd/MM/yyyy"
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(
                        new Date(selectedTransaction.transactionDate),
                        "HH:mm:ss"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("clinic")}
                </p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {selectedTransaction.clinicName}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  ID: {selectedTransaction.clinicId}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("description")}
                </p>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm line-clamp-2 overflow-hidden">
                      {selectedTransaction.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("createdBy")}
                </p>
                <p className="text-sm">
                  {selectedTransaction.isMakeBySystem ? t("system") : t("user")}
                </p>
              </div>

              {showRejectionInput && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("rejectionReason")}
                  </p>
                  <Textarea
                    placeholder={t("provideRejectionReason")}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                {t("close")}
              </Button>

              {/* Show approval options only if status is pending and type is withdrawal */}
              {selectedTransaction.status.toLowerCase() ===
                "waiting approval" &&
                selectedTransaction.transactionType.toLowerCase() ===
                  "withdrawal" && (
                  <div className="flex gap-2">
                    {showRejectionInput ? (
                      <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={isUpdatingStatus || !rejectionReason}
                      >
                        {isUpdatingStatus ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("rejecting")}
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            {t("confirmRejection")}
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={() => setShowRejectionInput(true)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        {t("reject")}
                      </Button>
                    )}

                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleApprove}
                      disabled={isUpdatingStatus}
                    >
                      {isUpdatingStatus ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("approving")}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {t("approve")}
                        </>
                      )}
                    </Button>
                  </div>
                )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* QR Code Dialog */}
      <Dialog
        open={showQR}
        onOpenChange={(open) => {
          if (!open) {
            // When closing the dialog, safely leave the payment session
            if (transactionId) {
              try {
                // Wrap in try-catch to prevent errors from bubbling up
                PaymentService.leavePaymentSession(transactionId).catch(
                  (error) => {
                    console.error("Error leaving payment session:", error);
                    // Don't throw the error further
                  }
                );
              } catch (error) {
                console.error("Error in payment session cleanup:", error);
              }
            }
            setShowQR(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-center font-serif dark:text-gray-100">
              {t("paymentQRCode")}
            </DialogTitle>
            <DialogDescription className="text-center dark:text-gray-300">
              {t("scanQRToCompleteWithdrawal")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center p-6">
            {qrUrl ? (
              <div className="relative w-64 h-64 mb-4">
                <Image
                  src={qrUrl || "/placeholder.svg"}
                  alt={t("paymentQRCode")}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="w-64 h-64 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600">
                <p className="text-gray-500 dark:text-gray-300 text-center px-4">
                  {t("loadingQRCode")}
                </p>
              </div>
            )}
            <div className="text-center space-y-2">
              <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {selectedTransaction &&
                  formatCurrency(selectedTransaction.amount)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("scanWithBankingApp")}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-4">
                <Clock className="h-4 w-4" />
                <span>{t("qrCodeExpires")}</span>
              </div>
              {/* Payment Status Indicator */}
              <div className="mt-4">
                {paymentStatus === "pending" && (
                  <div className="flex items-center justify-center gap-2 text-amber-500 dark:text-amber-400">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{t("waitingForPayment")}</span>
                  </div>
                )}
                {paymentStatus === "success" && (
                  <div className="flex items-center justify-center gap-2 text-green-500 dark:text-green-400">
                    <Check className="h-4 w-4" />
                    <span>{t("paymentSuccessful")}</span>
                  </div>
                )}
                {paymentStatus === "failed" && (
                  <div className="flex items-center justify-center gap-2 text-red-500 dark:text-red-400">
                    <X className="h-4 w-4" />
                    <span>{t("paymentFailed")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Result Dialog */}
      <Dialog
        open={showPaymentResult}
        onOpenChange={(open) => {
          if (!open) {
            setShowPaymentResult(false);
            // Reset payment status if dialog is closed
            setPaymentStatus("pending");
          }
        }}
      >
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-center font-serif dark:text-gray-100">
              {paymentStatus === "success"
                ? t("paymentSuccessful")
                : t("paymentFailed")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center p-6">
            {paymentStatus === "success" ? (
              <Card className="w-full bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400 mb-4" />
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
                      {t("paymentSuccessful")}
                    </h3>
                    <p className="text-green-600 dark:text-green-300 mb-4">
                      {t("withdrawalPaymentProcessed", {
                        amount: paymentDetails.amount
                          ? formatCurrency(paymentDetails.amount)
                          : selectedTransaction &&
                            formatCurrency(selectedTransaction.amount),
                      })}
                    </p>
                    {paymentDetails.timestamp && (
                      <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                        {t("transactionTime")}:{" "}
                        {new Date(paymentDetails.timestamp).toLocaleString()}
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                      <Button
                        onClick={() => setShowPaymentResult(false)}
                        variant="outline"
                        className="flex-1 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/30"
                      >
                        {t("close")}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowPaymentResult(false);
                          refetch();
                        }}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-500 dark:hover:to-emerald-500"
                      >
                        {t("viewTransactions")}{" "}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 dark:text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
                      {t("paymentFailed")}
                    </h3>
                    <p className="text-red-600 dark:text-red-300 mb-4">
                      {paymentDetails.message || t("paymentProcessingIssue")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                      <Button
                        onClick={() => setShowPaymentResult(false)}
                        variant="outline"
                        className="flex-1 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                      >
                        {t("close")}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowPaymentResult(false);
                          setShowQR(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 dark:from-pink-600 dark:to-purple-600 dark:hover:from-pink-500 dark:hover:to-purple-500"
                      >
                        {t("tryAgain")} <RefreshCw className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
