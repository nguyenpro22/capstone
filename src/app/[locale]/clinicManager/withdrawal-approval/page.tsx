"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  TableHead,
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
import { useGetWalletTransactionsForClinicQuery } from "@/features/wallet-transaction/api";
import { useUpdateWithdrawalStatusForClinicMutation } from "@/features/wallet-transaction/api";
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

export default function WithdrawalApprovalPage() {
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

  // Fetch transactions data
  const {
    data: transactionsData,
    isLoading,
    refetch,
  } = useGetWalletTransactionsForClinicQuery({
    pageIndex,
    pageSize,
    searchTerm: debouncedSearchTerm,
    sortColumn,
    sortOrder,
  });

  // Add the mutation for updating withdrawal status
  const [updateWithdrawalStatus, { isLoading: isUpdatingStatus }] =
    useUpdateWithdrawalStatusForClinicMutation();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    setPageIndex(1);
  }, [debouncedSearchTerm]);

  // Get transactions from API data
  const transactions = transactionsData?.value?.items || [];
  const totalCount = transactionsData?.value?.totalCount || 0;
  const hasNextPage = transactionsData?.value?.hasNextPage || false;
  const hasPreviousPage = transactionsData?.value?.hasPreviousPage || false;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Get transaction type badge
  const getTransactionTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "withdrawal":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 px-3 py-1 flex items-center justify-center"
          >
            Withdrawal
          </Badge>
        );
      case "deposit":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 px-3 py-1 flex items-center justify-center"
          >
            Deposit
          </Badge>
        );
      case "payment":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 px-3 py-1 flex items-center justify-center"
          >
            Payment
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="px-3 py-1 flex items-center justify-center"
          >
            {type}
          </Badge>
        );
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 px-3 py-1 flex items-center justify-center">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 px-3 py-1 flex items-center justify-center">
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-rose-500 hover:bg-rose-600 px-3 py-1 flex items-center justify-center">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-500 hover:bg-slate-600 px-3 py-1 flex items-center justify-center">
            {status}
          </Badge>
        );
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

  // Handle view transaction details
  const handleViewDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
    // Reset rejection state when opening modal
    setRejectionReason("");
    setShowRejectionInput(false);
  };

  // Handle approve withdrawal
  const handleApprove = async () => {
    if (!selectedTransaction) return;

    try {
      // Show loading state
      toast.info("Processing approval...", { autoClose: 2000 });

      const response = await updateWithdrawalStatus({
        withdrawalId: selectedTransaction.id,
        isApproved: true,
      });

      // Log the full response to understand its structure
      console.log("Approval response:", response);

      // Always consider it a success if we reach here without throwing an exception
      toast.success("Withdrawal request approved successfully");
      setIsDetailsModalOpen(false);
      refetch(); // Refresh data after approval
    } catch (error: any) {
      console.error("Failed to approve withdrawal:", error);

      // Extract error message from the error response with fallbacks
      const errorDetail =
        error.data?.detail || error.data?.message || error.message;
      toast.error(`Failed to approve withdrawal: ${errorDetail}`);
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
      toast.info("Processing rejection...", { autoClose: 2000 });

      const response = await updateWithdrawalStatus({
        withdrawalId: selectedTransaction.id,
        isApproved: false,
        rejectionReason,
      });

      // Log the full response to understand its structure
      console.log("Rejection response:", response);

      // Always consider it a success if we reach here without throwing an exception
      toast.success("Withdrawal request rejected successfully");
      setIsDetailsModalOpen(false);
      refetch(); // Refresh data after rejection
    } catch (error: any) {
      console.error("Failed to reject withdrawal:", error);

      // Extract error message from the error response with fallbacks
      const errorDetail =
        error.data?.detail || error.data?.message || error.message;
      toast.error(`Failed to reject withdrawal: ${errorDetail}`);
    }
  };

  // Handle quick approve (directly from table)
  const handleQuickApprove = async (transaction: any) => {
    try {
      const response = await updateWithdrawalStatus({
        withdrawalId: transaction.id,
        isApproved: true,
      });

      // Log the full response to understand its structure
      console.log("Approval response:", response);

      // Always consider it a success if we reach here without throwing an exception
      toast.success("Withdrawal request approved successfully");
      refetch(); // Refresh data after approval
    } catch (error: any) {
      console.error("Failed to approve withdrawal:", error);

      // Extract error message from the error response with fallbacks
      const errorDetail =
        error.data?.detail || error.data?.message || error.message;
      toast.error(`Failed to approve withdrawal: ${errorDetail}`);
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
    alert("Export functionality would be implemented here");
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Wallet Transactions
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
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">
            Transaction History
          </CardTitle>
          <CardDescription>
            View and manage all clinic wallet transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger
                value="all"
                onClick={() => setTransactionType("all")}
              >
                All Transactions
              </TabsTrigger>
              <TabsTrigger
                value="withdrawal"
                onClick={() => setTransactionType("withdrawal")}
              >
                Withdrawals
              </TabsTrigger>
              <TabsTrigger
                value="deposit"
                onClick={() => setTransactionType("deposit")}
              >
                Deposits
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                onClick={() => setTransactionType("payment")}
              >
                Payments
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
                          "Date Range"
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
                      Clear Filters
                    </Button>
                  )}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by clinic name or description..."
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
                      <TableHead className="w-[180px] text-center">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("transactionDate")}
                          className="flex items-center justify-center gap-1 font-semibold mx-auto"
                        >
                          Date
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("clinicName")}
                          className="flex items-center justify-center gap-1 font-semibold mx-auto"
                        >
                          Clinic
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("amount")}
                          className="flex items-center justify-center gap-1 font-semibold mx-auto"
                        >
                          Amount
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">Type</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Description</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Loading transactions...
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
                          <TableCell className="text-center">
                            <div className="max-h-[2.5rem] line-clamp-2 overflow-hidden text-ellipsis">
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
                          <TableCell className="text-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="max-h-[2.5rem] line-clamp-2 overflow-hidden text-ellipsis mx-auto max-w-[200px]">
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
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-2">
                              {transaction.status.toLowerCase() === "pending" &&
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
                                      Reject
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
                                      Approve
                                    </Button>
                                  </>
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
                              No transactions found
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {searchTerm
                                ? "Try adjusting your search or filters"
                                : "Transactions will appear here when they are created"}
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
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                Details for {selectedTransaction.transactionType.toLowerCase()}{" "}
                transaction
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
                      Transaction ID: {selectedTransaction.id.substring(0, 8)}
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
                    Amount
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
                    Date & Time
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
                  Clinic
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
                  Description
                </p>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{selectedTransaction.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Created By
                </p>
                <p className="text-sm">
                  {selectedTransaction.isMakeBySystem ? "System" : "User"}
                </p>
              </div>

              {showRejectionInput && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Rejection Reason
                  </p>
                  <Textarea
                    placeholder="Please provide a reason for rejection"
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
                Close
              </Button>

              {/* Show approval options only if status is pending and type is withdrawal */}
              {selectedTransaction.status.toLowerCase() === "pending" &&
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
                            Rejecting...
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            Confirm Rejection
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={() => setShowRejectionInput(true)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
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
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </>
                      )}
                    </Button>
                  </div>
                )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
