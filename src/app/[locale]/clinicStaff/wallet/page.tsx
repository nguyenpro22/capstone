"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Filter,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import WithdrawalRequestModal from "@/components/clinicManager/wallet/withdrawal-request-modal";
import WalletBalanceChart from "@/components/clinicStaff/wallet/wallet-balance-chart";
import WithdrawalDetailsModal from "@/components/clinicManager/wallet/withdrawal-details-modal";
import { useGetBranchDetailByIdQuery } from "@/features/clinic/api"; // Import API hook
import { useToast } from "@/hooks/use-toast";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";
import { useGetWalletTransactionsForBranchQuery } from "@/features/wallet-transaction/api"; // Import wallet transactions API hook
import type { TransactionalRequest } from "@/features/wallet-transaction/types";
import Pagination from "@/components/common/Pagination/Pagination";
import { useTranslations, useLocale } from "next-intl";

// Language Switcher Component

export default function BranchWalletPage() {
  const t = useTranslations("wallet.branchWallet");
  const locale = useLocale();

  // Get the token and extract clinicId
  const token = getAccessToken();
  // Add null check for token
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  const clinicId = tokenData?.clinicId || "";
  // State for pagination and filtering
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("createOnUtc");
  const [sortOrder, setSortOrder] = useState("desc");
  // Fetch branch data using the API
  const {
    data: branchData,
    isLoading: isLoadingBranch,
    refetch,
  } = useGetBranchDetailByIdQuery(clinicId);

  // Fetch wallet transactions using the API
  const {
    data: transactionsResponse,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useGetWalletTransactionsForBranchQuery({
    pageIndex,
    pageSize,
    searchTerm: debouncedSearchTerm,
    sortColumn,
    sortOrder,
  });
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

  // Map API response to component state
  const [transactions, setTransactions] = useState<any[]>([]);

  const { toast } = useToast();

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("transactions");

  // Get the branch from API response
  const branch = branchData?.value || null;

  // Process transactions data when API response changes
  useEffect(() => {
    if (transactionsResponse?.isSuccess && transactionsResponse.value) {
      const mappedTransactions = transactionsResponse.value.items.map(
        (item: TransactionalRequest) => ({
          id: item.id,
          branchId: item.clinicId,
          amount: item.amount,
          type:
            item.transactionType.toLowerCase() === "withdrawal"
              ? "withdrawal"
              : "income",
          status: item.status.toLowerCase().includes("completed")
            ? "completed"
            : item.status.toLowerCase().includes("waiting")
            ? "waiting"
            : item.status.toLowerCase().includes("pending")
            ? "pending"
            : "rejected",
          date: item.transactionDate,
          description: item.description,
          customer: item.clinicName,
        })
      );
      setTransactions(mappedTransactions);
    }
  }, [transactionsResponse]);

  // Filter transactions based on filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by type
    if (typeFilter !== "all" && transaction.type !== typeFilter) return false;

    // Filter by status
    if (statusFilter !== "all" && transaction.status !== statusFilter)
      return false;

    // Filter by date range
    if (dateRange.from || dateRange.to) {
      const transactionDate = new Date(transaction.date);
      if (dateRange.from && transactionDate < dateRange.from) return false;
      if (dateRange.to) {
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999);
        if (transactionDate > endDate) return false;
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(query) ||
        transaction.customer.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
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

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            {t("status.completed")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            {t("status.pending")}
          </Badge>
        );
      case "waiting":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            {t("status.waiting") || "Waiting for Payment"}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            {t("status.rejected")}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "income":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            {t("transactionTypes.income")}
          </Badge>
        );
      case "withdrawal":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            {t("transactionTypes.withdrawal")}
          </Badge>
        );
      default:
        return <Badge>{type}</Badge>;
    }
  };

  // Handle withdrawal request
  const handleWithdrawalRequest = () => {
    if (!branch) {
      toast({
        title: t("notifications.error"),
        description: t("notifications.branchDataUnavailable"),
        variant: "destructive",
      });
      return;
    }
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
    refetchTransactions();
  };

  // Handle export data
  const handleExport = () => {
    // Implementation for exporting data
    alert(t("notifications.exportFunctionality"));
  };

  // Clear all filters
  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setStatusFilter("all");
    setTypeFilter("all");
    setSearchQuery("");
    setPageIndex(1);
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // If already sorting by this column, toggle the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If sorting by a new column, set it as the sort column with default desc order
      setSortColumn(column);
      setSortOrder("desc");
    }

    // Reset to first page when sort changes
    setPageIndex(1);

    // Refetch transactions with new sort parameters
    refetchTransactions();
  };

  useEffect(() => {
    setPageIndex(1);
  }, [debouncedSearchTerm]);

  if (isLoadingBranch || !branch) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-medium">{t("loading.branchWallet")}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("description", { branchName: branch.name })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoadingBranch}
          >
            {isLoadingBranch ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            {t("actions.refresh")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            {t("actions.export")}
          </Button>
        </div>
      </div>

      {/* Branch Summary Card */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-100 dark:border-indigo-800/30 mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={branch.logo || "/placeholder.svg"}
                alt={branch.name}
              />
              <AvatarFallback>{branch.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-bold text-indigo-800 dark:text-indigo-300">
                {branch.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {branch.bankName} - {branch.bankAccountNumber}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t("summary.currentBalance")}
              </h3>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(branch.balance)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("summary.availableForWithdrawal")}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t("summary.pendingWithdrawals")}
              </h3>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(branch.pendingWithdrawals)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("summary.beingProcessed")}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t("summary.totalEarnings")}
              </h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(branch.totalEarnings)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("summary.lifetimeEarnings")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branch Analytics */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{t("analytics.title")}</CardTitle>
              <CardDescription>{t("analytics.description")}</CardDescription>
            </div>
            <Button onClick={handleWithdrawalRequest}>
              <Plus className="h-4 w-4 mr-1" />
              {t("actions.requestWithdrawal")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <WalletBalanceChart branchId={branch.id} />
        </CardContent>
      </Card>

      {/* Transactions and Withdrawals */}
      <Card>
        <CardHeader>
          <CardTitle>{t("financialActivity.title")}</CardTitle>
          <CardDescription>
            {t("financialActivity.description", { branchName: branch.name })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="transactions"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="transactions">
                {t("tabs.transactions")}
              </TabsTrigger>
              <TabsTrigger value="withdrawals">
                {t("tabs.withdrawals")}
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

                    {/* Type Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                          <Filter className="h-4 w-4 mr-2" />
                          {t("filters.type")}:{" "}
                          {typeFilter === "all"
                            ? t("filters.typeAll")
                            : typeFilter === "income"
                            ? t("transactionTypes.income")
                            : t("transactionTypes.withdrawal")}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>
                          {t("filters.filterByType")}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                          {t("filters.typeAll")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setTypeFilter("income")}
                        >
                          {t("transactionTypes.income")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setTypeFilter("withdrawal")}
                        >
                          {t("transactionTypes.withdrawal")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Status Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                          <Filter className="h-4 w-4 mr-2" />
                          {t("filters.status")}:{" "}
                          {statusFilter === "all"
                            ? t("filters.statusAll")
                            : statusFilter === "completed"
                            ? t("status.completed")
                            : statusFilter === "pending"
                            ? t("status.pending")
                            : t("status.rejected")}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>
                          {t("filters.filterByStatus")}
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
                          {t("status.completed")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStatusFilter("pending")}
                        >
                          {t("status.pending")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Clear Filters Button */}
                    {(dateRange.from ||
                      statusFilter !== "all" ||
                      typeFilter !== "all" ||
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
                      placeholder={t("filters.searchTransactions")}
                      className="pl-8 w-full md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] text-center">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("transactionDate")}
                            className="flex items-center justify-center gap-1 p-0 h-auto font-semibold hover:bg-transparent mx-auto"
                          >
                            {t("table.date")}
                            {sortColumn === "transactionDate" &&
                              (sortOrder === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              ))}
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">
                          {t("table.amount")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("table.type")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("table.description")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("table.customer")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("table.status")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingTransactions ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="mt-2">{t("loading.transactions")}</p>
                          </TableCell>
                        </TableRow>
                      ) : filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium text-center">
                              <div className="flex flex-col items-center">
                                <span>
                                  {format(
                                    new Date(transaction.date),
                                    "dd/MM/yyyy"
                                  )}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(transaction.date), "HH:mm")}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-center">
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell className="text-center">
                              {getTypeBadge(transaction.type)}
                            </TableCell>
                            <TableCell className="text-center">
                              {transaction.description}
                            </TableCell>
                            <TableCell className="text-center">
                              {transaction.customer}
                            </TableCell>
                            <TableCell className="text-center">
                              {getStatusBadge(transaction.status)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            {t("table.noTransactions")}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {filteredTransactions.length > 0 &&
                  transactionsResponse?.value && (
                    <div className="mt-4">
                      <Pagination
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalCount={transactionsResponse.value.totalCount || 0}
                        hasNextPage={
                          pageIndex <
                          Math.ceil(
                            (transactionsResponse.value.totalCount || 0) /
                              pageSize
                          )
                        }
                        hasPreviousPage={pageIndex > 1}
                        onPageChange={(newPage) => setPageIndex(newPage)}
                      />
                    </div>
                  )}
              </div>
            </TabsContent>

            <TabsContent value="withdrawals">
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
                            ? t("status.completed")
                            : statusFilter === "pending"
                            ? t("status.pending")
                            : t("status.rejected")}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>
                          {t("filters.filterByStatus")}
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
                          {t("status.completed")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStatusFilter("pending")}
                        >
                          {t("status.pending")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStatusFilter("rejected")}
                        >
                          {t("status.rejected")}
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
                        <TableHead className="w-[100px] text-center">
                          {t("table.date")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("table.amount")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("table.bankAccount")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("table.transactionId")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("table.status")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("table.actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* We're using the transactions API data for withdrawals as well */}
                      {isLoadingTransactions ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="mt-2">{t("loading.transactions")}</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            {t("table.noWithdrawals")}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {/* Pagination for withdrawals would go here if we had withdrawal data */}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Withdrawal Request Modal */}
      {branch && (
        <WithdrawalRequestModal
          isOpen={isWithdrawalModalOpen}
          onClose={() => setIsWithdrawalModalOpen(false)}
          onSuccess={() => handleRefresh()}
          clinic={{
            id: branch.id,
            name: branch.name,
            balance: branch.balance,
            bankName: branch.bankName,
            bankAccountNumber: branch.bankAccountNumber,
          }}
        />
      )}

      {/* Withdrawal Details Modal */}
      {selectedWithdrawal && branch && (
        <WithdrawalDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => handleRefresh()}
          withdrawal={selectedWithdrawal}
          clinic={{
            id: branch.id,
            name: branch.name,
            bankName: branch.bankName,
            bankAccountNumber: branch.bankAccountNumber,
          }}
        />
      )}
    </div>
  );
}
