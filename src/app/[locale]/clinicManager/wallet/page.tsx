"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar, ChevronDown, CreditCard, Download, Filter, Loader2, Plus, RefreshCw, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import WithdrawalRequestModal from "@/components/clinicManager/wallet/withdrawal-request-modal"
import WalletBalanceChart from "@/components/clinicManager/wallet/wallet-balance-chart"
import WithdrawalDetailsModal from "@/components/clinicManager/wallet/withdrawal-details-modal"

// Mock data for clinics
const clinics = [
  {
    id: "1",
    name: "Skin Care Đà Nẵng",
    logo: "/placeholder.svg?height=40&width=40",
    balance: 12500000,
    pendingWithdrawals: 2000000,
    totalEarnings: 45000000,
  },
  {
    id: "2",
    name: "Beauty Center Sài Gòn",
    logo: "/placeholder.svg?height=40&width=40",
    balance: 8750000,
    pendingWithdrawals: 1500000,
    totalEarnings: 32000000,
  },
  {
    id: "3",
    name: "Hanoi Beauty Spa",
    logo: "/placeholder.svg?height=40&width=40",
    balance: 15200000,
    pendingWithdrawals: 0,
    totalEarnings: 28000000,
  },
]

// Mock data for withdrawal history
const withdrawalHistory = [
  {
    id: "w1",
    clinicId: "1",
    amount: 5000000,
    status: "completed",
    date: "2023-11-15T10:30:00",
    bankAccount: "Vietcombank - 1234567890",
    transactionId: "TRX123456789",
    notes: "Monthly withdrawal",
  },
  {
    id: "w2",
    clinicId: "1",
    amount: 2000000,
    status: "pending",
    date: "2023-12-01T14:45:00",
    bankAccount: "Vietcombank - 1234567890",
    transactionId: "TRX987654321",
    notes: "Urgent withdrawal",
  },
  {
    id: "w3",
    clinicId: "2",
    amount: 3500000,
    status: "completed",
    date: "2023-11-20T09:15:00",
    bankAccount: "Techcombank - 9876543210",
    transactionId: "TRX567891234",
    notes: "Quarterly withdrawal",
  },
  {
    id: "w4",
    clinicId: "3",
    amount: 4200000,
    status: "rejected",
    date: "2023-11-25T16:20:00",
    bankAccount: "BIDV - 5678912345",
    transactionId: "TRX345678912",
    notes: "Insufficient balance",
  },
  {
    id: "w5",
    clinicId: "1",
    amount: 1800000,
    status: "completed",
    date: "2023-10-10T11:00:00",
    bankAccount: "Vietcombank - 1234567890",
    transactionId: "TRX234567891",
    notes: "Regular withdrawal",
  },
]

export default function ClinicWalletPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clinicId = searchParams.get("clinicId") || "1" // Default to first clinic if none selected

  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Get the selected clinic
  const selectedClinic = clinics.find((clinic) => clinic.id === clinicId) || clinics[0]

  // Calculate total amounts across all clinics
  const totals = useMemo(() => {
    return clinics.reduce(
      (acc, clinic) => {
        acc.totalBalance += clinic.balance
        acc.totalPendingWithdrawals += clinic.pendingWithdrawals
        acc.totalEarnings += clinic.totalEarnings
        return acc
      },
      { totalBalance: 0, totalPendingWithdrawals: 0, totalEarnings: 0 },
    )
  }, [])

  // Filter withdrawals based on selected clinic and filters
  const filteredWithdrawals = withdrawalHistory.filter((withdrawal) => {
    // Filter by clinic
    if (clinicId !== "all" && withdrawal.clinicId !== clinicId) return false

    // Filter by status
    if (statusFilter !== "all" && withdrawal.status !== statusFilter) return false

    // Filter by date range
    if (dateRange.from || dateRange.to) {
      const withdrawalDate = new Date(withdrawal.date)
      if (dateRange.from && withdrawalDate < dateRange.from) return false
      if (dateRange.to) {
        const endDate = new Date(dateRange.to)
        endDate.setHours(23, 59, 59, 999)
        if (withdrawalDate > endDate) return false
      }
    }

    // Filter by search query (transaction ID or notes)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        withdrawal.transactionId.toLowerCase().includes(query) ||
        withdrawal.notes.toLowerCase().includes(query) ||
        withdrawal.bankAccount.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Handle clinic change
  const handleClinicChange = (value: string) => {
    router.push(`/clinicManager/wallet?clinicId=${value}`)
  }

  // Handle withdrawal request
  const handleWithdrawalRequest = () => {
    setIsWithdrawalModalOpen(true)
  }

  // Handle view withdrawal details
  const handleViewDetails = (withdrawal: any) => {
    setSelectedWithdrawal(withdrawal)
    setIsDetailsModalOpen(true)
  }

  // Handle refresh data
  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Handle export data
  const handleExport = () => {
    // Implementation for exporting data
    alert("Export functionality would be implemented here")
  }

  // Clear all filters
  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined })
    setStatusFilter("all")
    setSearchQuery("")
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Clinic Wallet Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Total Summary Card */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-100 dark:border-indigo-800/30 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-indigo-800 dark:text-indigo-300">
            Total Clinic Finances
          </CardTitle>
          <CardDescription>Summary of all clinics financial data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Balance</h3>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(totals.totalBalance)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Combined balance across all clinics</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Pending Withdrawals</h3>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(totals.totalPendingWithdrawals)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Pending withdrawals across all clinics</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Earnings</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totals.totalEarnings)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Lifetime earnings across all clinics</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Select value={clinicId} onValueChange={handleClinicChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a clinic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Clinics</SelectLabel>
                      <SelectItem value="all">All Clinics</SelectItem>
                      {clinics.map((clinic) => (
                        <SelectItem key={clinic.id} value={clinic.id}>
                          {clinic.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <CardTitle className="text-xl font-bold">
                  {clinicId === "all" ? "All Clinics" : selectedClinic.name} Wallet
                </CardTitle>
              </div>
              <CardDescription className="mt-1">
                {clinicId === "all"
                  ? "Manage wallet balances and withdrawals for all clinics"
                  : "Manage wallet balance and withdrawals"}
              </CardDescription>
            </div>
            <Button onClick={handleWithdrawalRequest}>
              <Plus className="h-4 w-4 mr-1" />
              Request Withdrawal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {clinicId !== "all" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(selectedClinic.balance)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Available for withdrawal</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Withdrawals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(selectedClinic.pendingWithdrawals)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Being processed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(selectedClinic.totalEarnings)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mb-6">
            <WalletBalanceChart clinicId={clinicId} />
          </div>

          <Tabs defaultValue="withdrawals">
            <TabsList className="mb-4">
              <TabsTrigger value="withdrawals">Withdrawal History</TabsTrigger>
              <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            </TabsList>

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
                                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
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
                              setDateRange({ from: range.from, to: range.to })
                            } else {
                              setDateRange({ from: undefined, to: undefined })
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
                          Status:{" "}
                          {statusFilter === "all"
                            ? "All"
                            : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>Rejected</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Clear Filters Button */}
                    {(dateRange.from || statusFilter !== "all" || searchQuery) && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
                        Clear Filters
                      </Button>
                    )}
                  </div>

                  {/* Search */}
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by transaction ID or notes..."
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
                        <TableHead className="w-[100px]">Date</TableHead>
                        <TableHead>Amount</TableHead>
                        {clinicId === "all" && <TableHead>Clinic</TableHead>}
                        <TableHead>Bank Account</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWithdrawals.length > 0 ? (
                        filteredWithdrawals.map((withdrawal) => (
                          <TableRow key={withdrawal.id}>
                            <TableCell className="font-medium">
                              {format(new Date(withdrawal.date), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell className="font-semibold">{formatCurrency(withdrawal.amount)}</TableCell>
                            {clinicId === "all" && (
                              <TableCell>
                                {clinics.find((c) => c.id === withdrawal.clinicId)?.name || "Unknown"}
                              </TableCell>
                            )}
                            <TableCell>{withdrawal.bankAccount}</TableCell>
                            <TableCell>
                              <span className="font-mono text-xs">{withdrawal.transactionId}</span>
                            </TableCell>
                            <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleViewDetails(withdrawal)}>
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={clinicId === "all" ? 7 : 6} className="h-24 text-center">
                            No withdrawal records found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <div className="flex items-center justify-center h-40 border rounded-md">
                <div className="text-center">
                  <CreditCard className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Transaction History</h3>
                  <p className="text-sm text-muted-foreground">Detailed transaction history will be available here.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Withdrawal Request Modal */}
      <WithdrawalRequestModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
        clinic={selectedClinic}
      />

      {/* Withdrawal Details Modal */}
      {selectedWithdrawal && (
        <WithdrawalDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          withdrawal={selectedWithdrawal}
          clinic={selectedClinic}
        />
      )}
    </div>
  )
}
