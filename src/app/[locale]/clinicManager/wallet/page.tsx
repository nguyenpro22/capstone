"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  CreditCard,
  Download,
  Filter,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Clock,
  FileText,
  User,
  Globe,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import WithdrawalRequestModal from "@/components/clinicManager/wallet/withdrawal-request-modal";
import WalletBalanceChart from "@/components/clinicManager/wallet/wallet-balance-chart";
import WithdrawalDetailsModal from "@/components/clinicManager/wallet/withdrawal-details-modal";
import { useGetAllBranchesQuery } from "@/features/clinic/api";
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
import Pagination from "@/components/common/Pagination/Pagination";
import { useGetWalletTransactionsForClinicQuery } from "@/features/wallet-transaction/api";
import { useUpdateWithdrawalStatusForClinicMutation } from "@/features/wallet-transaction/api";
import { useTranslations, useLocale } from "next-intl";

// Format currency helper function
const formatCurrency = (amount: number, locale: string) => {
  // Format the number according to locale, but without currency symbol
  const formattedNumber = new Intl.NumberFormat(
    locale === "vi" ? "vi-VN" : "en-US",
    {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  ).format(amount);

  // For Vietnamese locale, add the đ symbol at the end with a space
  if (locale === "vi") {
    return `${formattedNumber} ₫`;
  }
  // For English locale, add the đ symbol at the end with a space
  else {
    return `${formattedNumber} ₫`;
  }
};

export default function WalletManagement() {
  return (
    <div className="container mx-auto py-6 space-y-12">
      {/* Clinic Wallet Section */}
      <ClinicWalletPage />
    </div>
  );
}

function ClinicWalletPage() {
  const t = useTranslations("wallet.clinicWallet");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clinicId = searchParams.get("clinicId") || ""; // Default to empty string

  // Fetch clinics data from API
  const {
    data: branchesData,
    isLoading: isLoadingBranches,
    refetch,
  } = useGetAllBranchesQuery();

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // State for pagination and filtering
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("createOnUtc");
  const [sortOrder, setSortOrder] = useState("desc");
  const [transactionType, setTransactionType] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionInput, setShowRejectionInput] = useState(false);

  // Fetch transactions data
  const {
    data: transactionsData,
    isLoading,
    refetch: refetchTransactions,
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

  // Get clinics from API data
  const clinics = branchesData?.value?.clinics || [];

  // Find main clinic
  const mainClinic = useMemo(
    () => clinics.find((clinic) => clinic.isMainClinic),
    [clinics]
  );

  // Get totals from API data
  const totals = branchesData?.value?.totals || {
    totalBalance: 0,
    totalPendingWithdrawals: 0,
    totalEarnings: 0,
  };

  // Get the selected clinic
  const selectedClinic = useMemo(() => {
    if (!clinicId && mainClinic) {
      // If no clinicId is provided and we have a main clinic, use that
      return mainClinic;
    }
    return (
      clinics.find((clinic) => clinic.id === clinicId) ||
      (clinics.length > 0 ? clinics[0] : null)
    );
  }, [clinicId, clinics, mainClinic]);

  // We'll use the actual API data instead of mock data
  const filteredWithdrawals = [];

  // Get transactions from API data
  const transactions = transactionsData?.value?.items || [];
  const totalCount = transactionsData?.value?.totalCount || 0;
  const hasNextPage = transactionsData?.value?.hasNextPage || false;
  const hasPreviousPage = transactionsData?.value?.hasPreviousPage || false;

  // Get transaction type badge
  const getTransactionTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "withdrawal":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 px-3 py-1 flex items-center justify-center"
          >
            {t("transactionTypes.withdrawal")}
          </Badge>
        );
      case "deposit":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 px-3 py-1 flex items-center justify-center"
          >
            {t("transactionTypes.deposit")}
          </Badge>
        );
      case "payment":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 px-3 py-1 flex items-center justify-center"
          >
            {t("transactionTypes.payment")}
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
            {t("status.completed")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 px-3 py-1 flex items-center justify-center">
            {t("status.pending")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-rose-500 hover:bg-rose-600 px-3 py-1 flex items-center justify-center">
            {t("status.rejected")}
          </Badge>
        );
      case "waitingforpayment":
      case "waiting for payment":
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600 px-3 py-1 flex items-center justify-center">
            {t("status.waitingForPayment")}
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

  // Handle clinic change
  const handleClinicChange = (value: string) => {
    router.push(`/clinicManager/wallet?clinicId=${value}`);
  };

  // Handle withdrawal request
  const handleWithdrawalRequest = () => {
    setIsWithdrawalModalOpen(true);
  };

  // Handle view withdrawal details
  const handleViewDetails = (withdrawal: any) => {
    setSelectedWithdrawal(withdrawal);
    setIsDetailsModalOpen(true);
  };

  // Handle refresh data
  const handleRefresh = () => {
    refetch();
  };

  // Handle successful withdrawal request
  const handleWithdrawalSuccess = () => {
    // Refetch data to update balances and withdrawal history
    refetch();
  };

  // Clear all filters
  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setStatusFilter("all");
    setSearchQuery("");
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
      toast.info(t("notifications.processingApproval"), { autoClose: 2000 });

      const response = await updateWithdrawalStatus({
        withdrawalId: selectedTransaction.id,
        isApproved: true,
      });

      // Log the full response to understand its structure
      console.log("Approval response:", response);

      // Always consider it a success if we reach here without throwing an exception
      toast.success(t("notifications.approvalSuccess"));
      setIsDetailsModalOpen(false);
      refetchTransactions(); // Refresh data after approval
    } catch (error: any) {
      console.error("Failed to approve withdrawal:", error);

      // Extract error message from the error response with fallbacks
      const errorDetail =
        error.data?.detail || error.data?.message || error.message;
      toast.error(t("notifications.approvalFailed", { error: errorDetail }));
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
      toast.info(t("notifications.processingRejection"), { autoClose: 2000 });

      const response = await updateWithdrawalStatus({
        withdrawalId: selectedTransaction.id,
        isApproved: false,
        rejectionReason,
      });

      // Log the full response to understand its structure
      console.log("Rejection response:", response);

      // Always consider it a success if we reach here without throwing an exception
      toast.success(t("notifications.rejectionSuccess"));
      setIsDetailsModalOpen(false);
      refetchTransactions(); // Refresh data after rejection
    } catch (error: any) {
      console.error("Failed to reject withdrawal:", error);

      // Extract error message from the error response with fallbacks
      const errorDetail =
        error.data?.detail || error.data?.message || error.message;
      toast.error(t("notifications.rejectionFailed", { error: errorDetail }));
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
      toast.success(t("notifications.approvalSuccess"));
      refetchTransactions(); // Refresh data after approval
    } catch (error: any) {
      console.error("Failed to approve withdrawal:", error);

      // Extract error message from the error response with fallbacks
      const errorDetail =
        error.data?.detail || error.data?.message || error.message;
      toast.error(t("notifications.approvalFailed", { error: errorDetail }));
    }
  };

  // Handle quick reject (opens modal for reason)
  const handleQuickReject = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
    setShowRejectionInput(true);
  };

  // Clear all transaction filters
  const clearTransactionFilters = () => {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoadingBranches}
          >
            {isLoadingBranches ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            {t("actions.refresh")}
          </Button>
        </div>
      </div>

      {/* Total Summary Card */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-100 dark:border-indigo-800/30 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-indigo-800 dark:text-indigo-300">
            {t("summary.title")}
          </CardTitle>
          <CardDescription>{t("summary.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingBranches ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("summary.totalBalance")}
                </h3>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(totals.totalBalance, locale)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("summary.totalBalanceDesc")}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("summary.totalPendingWithdrawals")}
                </h3>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {formatCurrency(totals.totalPendingWithdrawals, locale)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("summary.totalPendingWithdrawalsDesc")}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("summary.totalEarnings")}
                </h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totals.totalEarnings, locale)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("summary.totalEarningsDesc")}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                {isLoadingBranches ? (
                  <div className="w-[200px] h-10 bg-muted animate-pulse rounded-md"></div>
                ) : (
                  <Select value={clinicId} onValueChange={handleClinicChange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder={t("clinic.selectClinic")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>
                          {t("clinic.selectClinicLabel")}
                        </SelectLabel>
                        {clinics
                          .filter((clinic) => !clinic.isMainClinic)
                          .map((clinic) => (
                            <SelectItem key={clinic.id} value={clinic.id}>
                              {clinic.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
                <CardTitle className="text-xl font-bold">
                  {selectedClinic
                    ? t("clinic.walletTitle", {
                        clinicName: selectedClinic.name,
                      })
                    : t("clinic.selectToManage")}
                </CardTitle>
              </div>
              <CardDescription className="mt-1">
                {!selectedClinic
                  ? t("clinic.selectToManage")
                  : t("clinic.manageWallet")}
              </CardDescription>
            </div>
            <Button
              onClick={handleWithdrawalRequest}
              disabled={isLoadingBranches || !selectedClinic}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("actions.requestWithdrawal")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedClinic && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("clinic.currentBalance")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingBranches ? (
                    <div className="h-8 bg-muted animate-pulse rounded-md"></div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {formatCurrency(selectedClinic.balance, locale)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("clinic.availableForWithdrawal")}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("clinic.pendingWithdrawals")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingBranches ? (
                    <div className="h-8 bg-muted animate-pulse rounded-md"></div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {formatCurrency(
                          selectedClinic.pendingWithdrawals,
                          locale
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("clinic.beingProcessed")}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("clinic.totalEarnings")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingBranches ? (
                    <div className="h-8 bg-muted animate-pulse rounded-md"></div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {formatCurrency(selectedClinic.totalEarnings, locale)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("clinic.lifetimeEarnings")}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mb-6">
            <WalletBalanceChart clinicId={clinicId} />
          </div>

          <Tabs defaultValue="withdrawals">
            <TabsList className="mb-4">
              <TabsTrigger value="withdrawals">
                {t("tabs.withdrawalHistory")}
              </TabsTrigger>
              <TabsTrigger value="transactions">
                {t("tabs.transactionHistory")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
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
                            t("filters.dateRange")
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

                    {/* Status Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                          <Filter className="h-4 w-4 mr-2" />
                          {t("filters.status")}:{" "}
                          {statusFilter === "all"
                            ? t("filters.statusAll")
                            : statusFilter === "completed"
                            ? t("filters.statusCompleted")
                            : statusFilter === "pending"
                            ? t("filters.statusPending")
                            : statusFilter === "rejected"
                            ? t("filters.statusRejected")
                            : t("filters.statusWaitingForPayment")}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>
                          {t("filters.status")}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setStatusFilter("all")}
                        >
                          {t("filters.statusAll")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStatusFilter("completed")}
                        >
                          {t("filters.statusCompleted")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStatusFilter("pending")}
                        >
                          {t("filters.statusPending")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStatusFilter("rejected")}
                        >
                          {t("filters.statusRejected")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStatusFilter("waitingForPayment")}
                        >
                          {t("filters.statusWaitingForPayment")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Clear Filters Button */}
                    {(dateRange.from ||
                      statusFilter !== "all" ||
                      searchQuery) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-9"
                      >
                        {t("actions.clearFilters")}
                      </Button>
                    )}
                  </div>

                  {/* Search */}
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t("filters.searchWithdrawal")}
                      className="pl-8 w-full md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Withdrawal History Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          {t("table.date")}
                        </TableHead>
                        <TableHead>{t("table.amount")}</TableHead>
                        {clinicId === "all" && (
                          <TableHead>{t("table.clinic")}</TableHead>
                        )}
                        <TableHead>{t("table.bankAccount")}</TableHead>
                        <TableHead>{t("table.transactionId")}</TableHead>
                        <TableHead>{t("table.status")}</TableHead>
                        <TableHead className="text-right">
                          {t("table.actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan={clinicId === "all" ? 7 : 6}
                          className="h-24 text-center"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <CreditCard className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-lg font-medium">
                              {t("table.noWithdrawals")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {searchQuery
                                ? t("table.searchAdjust")
                                : t("table.transactionsAppear")}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="withdrawals">
              {/* Move the Transaction History content from WithdrawalApprovalPage here */}
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
                            t("filters.dateRange")
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
                        onClick={clearTransactionFilters}
                        className="h-9"
                      >
                        {t("actions.clearFilters")}
                      </Button>
                    )}
                  </div>

                  {/* Search */}
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t("filters.searchTransaction")}
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
                            {t("table.date")}
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("clinicName")}
                            className="flex items-center justify-center gap-1 font-semibold mx-auto"
                          >
                            {t("table.clinic")}
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("amount")}
                            className="flex items-center justify-center gap-1 font-semibold mx-auto"
                          >
                            {t("table.amount")}
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">
                          {t("table.type")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("table.status")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("table.description")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("table.actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              {t("table.loading")}
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
                              {formatCurrency(transaction.amount, locale)}
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
                                {transaction.status.toLowerCase() ===
                                  "pending" &&
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
                                        {t("actions.reject")}
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
                                        {t("actions.approve")}
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
                                {t("table.noTransactions")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {searchTerm
                                  ? t("table.searchAdjust")
                                  : t("table.transactionsAppear")}
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

                {/* Export Button */}
                {filteredTransactions.length > 0 && (
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Implementation for exporting withdrawal history
                        const dataToExport = filteredTransactions.map(
                          (transaction) => ({
                            date: format(
                              new Date(transaction.transactionDate),
                              "dd/MM/yyyy"
                            ),
                            time: format(
                              new Date(transaction.transactionDate),
                              "HH:mm"
                            ),
                            clinic: transaction.clinicName,
                            amount: formatCurrency(transaction.amount, locale),
                            type: transaction.transactionType,
                            status: transaction.status,
                            description: transaction.description,
                          })
                        );

                        // Create CSV content
                        const headers = [
                          t("table.date"),
                          t("table.time"),
                          t("table.clinic"),
                          t("table.amount"),
                          t("table.type"),
                          t("table.status"),
                          t("table.description"),
                        ];
                        const csvContent = [
                          headers.join(","),
                          ...dataToExport.map((row) =>
                            Object.values(row).join(",")
                          ),
                        ].join("\n");

                        // Create and download the file
                        const blob = new Blob([csvContent], {
                          type: "text/csv;charset=utf-8;",
                        });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.setAttribute("href", url);
                        link.setAttribute(
                          "download",
                          `withdrawal-history-${format(
                            new Date(),
                            "yyyy-MM-dd"
                          )}.csv`
                        );
                        link.style.visibility = "hidden";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        toast.success(t("notifications.exportSuccess"));
                      }}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {t("actions.export")}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Withdrawal Request Modal */}
      {selectedClinic && (
        <WithdrawalRequestModal
          isOpen={isWithdrawalModalOpen}
          onClose={() => setIsWithdrawalModalOpen(false)}
          onSuccess={handleWithdrawalSuccess} // Pass the success callback
          clinic={{
            id: selectedClinic.id,
            name: selectedClinic.name,
            balance: selectedClinic.balance,
            bankName: selectedClinic.bankName,
            bankAccountNumber: selectedClinic.bankAccountNumber,
          }}
        />
      )}

      {/* Withdrawal Details Modal */}
      {selectedWithdrawal && selectedClinic && (
        <WithdrawalDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => handleRefresh()}
          withdrawal={selectedWithdrawal}
          clinic={selectedClinic}
        />
      )}

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
              <DialogTitle>{t("transactionDetails.title")}</DialogTitle>
              <DialogDescription>
                {t("transactionDetails.detailsFor", {
                  type: selectedTransaction.transactionType.toLowerCase(),
                })}
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
                      {t("table.transactionId")}:{" "}
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
                    {t("transactionDetails.amount")}
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
                    {formatCurrency(selectedTransaction.amount, locale)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("transactionDetails.dateTime")}
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
                  {t("transactionDetails.clinic")}
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
                  {t("transactionDetails.description")}
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
                  {t("transactionDetails.createdBy")}
                </p>
                <p className="text-sm">
                  {selectedTransaction.isMakeBySystem
                    ? t("transactionDetails.system")
                    : t("transactionDetails.user")}
                </p>
              </div>

              {showRejectionInput && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("transactionDetails.rejectionReason")}
                  </p>
                  <Textarea
                    placeholder={t("transactionDetails.rejectionPlaceholder")}
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
                {t("actions.close")}
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
                            {t("transactionDetails.rejecting")}
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            {t("actions.confirmRejection")}
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={() => setShowRejectionInput(true)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        {t("actions.reject")}
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
                          {t("transactionDetails.approving")}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {t("actions.approve")}
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
