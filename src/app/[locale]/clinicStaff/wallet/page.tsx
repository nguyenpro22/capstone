"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronDown, Download, Filter, Loader2, MapPin, Plus, RefreshCw, Search } from "lucide-react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import WithdrawalRequestModal from "@/components/clinicManager/wallet/withdrawal-request-modal"
import WalletBalanceChart from "@/components/clinicStaff/wallet/wallet-balance-chart"
import WithdrawalDetailsModal from "@/components/clinicManager/wallet/withdrawal-details-modal"

// Mock data for a single branch (in a real app, this would come from the user's session or API)
const branchData = {
  id: "b1",
  clinicId: "1",
  name: "Skin Care Đà Nẵng - Hải Châu",
  address: "123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
  logo: "/placeholder.svg?height=40&width=40",
  balance: 5500000,
  pendingWithdrawals: 1000000,
  totalEarnings: 22000000,
  status: "active",
  clinic: {
    id: "1",
    name: "Skin Care Đà Nẵng",
  },
}

// Mock data for transactions
const transactionsData = [
  {
    id: "t1",
    branchId: "b1",
    amount: 1200000,
    type: "income",
    status: "completed",
    date: "2023-12-05T10:30:00",
    description: "Service payment - Facial Treatment",
    customer: "Nguyễn Văn A",
  },
  {
    id: "t2",
    branchId: "b1",
    amount: 800000,
    type: "income",
    status: "completed",
    date: "2023-12-04T14:45:00",
    description: "Service payment - Skin Rejuvenation",
    customer: "Trần Thị B",
  },
  {
    id: "t3",
    branchId: "b1",
    amount: 500000,
    type: "expense",
    status: "completed",
    date: "2023-12-03T09:15:00",
    description: "Supply purchase - Skincare products",
    customer: "N/A",
  },
  {
    id: "t4",
    branchId: "b1",
    amount: 1500000,
    type: "income",
    status: "completed",
    date: "2023-12-05T16:20:00",
    description: "Service payment - Premium Facial",
    customer: "Lê Văn C",
  },
  {
    id: "t5",
    branchId: "b1",
    amount: 700000,
    type: "expense",
    status: "completed",
    date: "2023-12-02T11:00:00",
    description: "Equipment maintenance",
    customer: "N/A",
  },
  {
    id: "t6",
    branchId: "b1",
    amount: 900000,
    type: "income",
    status: "pending",
    date: "2023-12-04T13:30:00",
    description: "Service payment - Skin Analysis",
    customer: "Phạm Thị D",
  },
]

// Mock data for withdrawal history
const withdrawalHistoryData = [
  {
    id: "w1",
    branchId: "b1",
    amount: 2000000,
    status: "completed",
    date: "2023-11-15T10:30:00",
    bankAccount: "Vietcombank - 1234567890",
    transactionId: "TRX123456789",
    notes: "Monthly withdrawal",
  },
  {
    id: "w2",
    branchId: "b1",
    amount: 1000000,
    status: "pending",
    date: "2023-12-01T14:45:00",
    bankAccount: "Vietcombank - 1234567890",
    transactionId: "TRX987654321",
    notes: "Urgent withdrawal",
  },
  {
    id: "w3",
    branchId: "b1",
    amount: 1500000,
    status: "completed",
    date: "2023-11-20T09:15:00",
    bankAccount: "Techcombank - 9876543210",
    transactionId: "TRX567891234",
    notes: "Quarterly withdrawal",
  },
]

export default function BranchWalletPage() {
  // In a real application, you would get the branch ID from the user's session
  // For now, we'll use the mock data directly
  const [branch, setBranch] = useState(branchData)
  const [transactions, setTransactions] = useState(transactionsData)
  const [withdrawals, setWithdrawals] = useState(withdrawalHistoryData)

  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("transactions")

  // Fetch branch data
  useEffect(() => {
    // In a real application, you would fetch the branch data from an API
    // based on the logged-in user's branch ID
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setBranch(branchData)
      setTransactions(transactionsData)
      setWithdrawals(withdrawalHistoryData)
      setIsLoading(false)
    }, 500)
  }, [])

  // Filter transactions based on filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by type
    if (typeFilter !== "all" && transaction.type !== typeFilter) return false

    // Filter by status
    if (statusFilter !== "all" && transaction.status !== statusFilter) return false

    // Filter by date range
    if (dateRange.from || dateRange.to) {
      const transactionDate = new Date(transaction.date)
      if (dateRange.from && transactionDate < dateRange.from) return false
      if (dateRange.to) {
        const endDate = new Date(dateRange.to)
        endDate.setHours(23, 59, 59, 999)
        if (transactionDate > endDate) return false
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        transaction.description.toLowerCase().includes(query) ||
        transaction.customer.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Filter withdrawals based on filters
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
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

    // Filter by search query
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

  // Get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "income":
        return <Badge className="bg-green-500 hover:bg-green-600">Income</Badge>
      case "expense":
        return <Badge className="bg-red-500 hover:bg-red-600">Expense</Badge>
      default:
        return <Badge>{type}</Badge>
    }
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
    setTypeFilter("all")
    setSearchQuery("")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-medium">Loading branch wallet data...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branch Wallet</h1>
          <p className="text-muted-foreground mt-1">Manage financial transactions and withdrawals for {branch.name}</p>
        </div>
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

      {/* Branch Summary Card */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-100 dark:border-indigo-800/30 mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={branch.logo || "/placeholder.svg"} alt={branch.name} />
              <AvatarFallback>{branch.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-bold text-indigo-800 dark:text-indigo-300">{branch.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {branch.address}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Balance</h3>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(branch.balance)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Available for withdrawal</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Pending Withdrawals</h3>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(branch.pendingWithdrawals)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Being processed</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Earnings</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(branch.totalEarnings)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branch Analytics */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Wallet Analytics</CardTitle>
              <CardDescription>Financial performance over time</CardDescription>
            </div>
            <Button onClick={handleWithdrawalRequest}>
              <Plus className="h-4 w-4 mr-1" />
              Request Withdrawal
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
          <CardTitle>Financial Activity</CardTitle>
          <CardDescription>View all financial activities for {branch.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
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

                    {/* Type Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                          <Filter className="h-4 w-4 mr-2" />
                          Type:{" "}
                          {typeFilter === "all" ? "All" : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setTypeFilter("all")}>All</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTypeFilter("income")}>Income</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTypeFilter("expense")}>Expense</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

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
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Clear Filters Button */}
                    {(dateRange.from || statusFilter !== "all" || typeFilter !== "all" || searchQuery) && (
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
                      placeholder="Search transactions..."
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
                        <TableHead className="w-[100px]">Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              {format(new Date(transaction.date), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell className="font-semibold">{formatCurrency(transaction.amount)}</TableCell>
                            <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>{transaction.customer}</TableCell>
                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No transactions found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
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
                          <TableCell colSpan={6} className="h-24 text-center">
                            No withdrawal records found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
        clinic={{
          id: branch.id,
          name: branch.name,
          balance: branch.balance,
        }}
      />

      {/* Withdrawal Details Modal */}
      {selectedWithdrawal && (
        <WithdrawalDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          withdrawal={selectedWithdrawal}
          clinic={{
            id: branch.id,
            name: branch.name,
          }}
        />
      )}
    </div>
  )
}
