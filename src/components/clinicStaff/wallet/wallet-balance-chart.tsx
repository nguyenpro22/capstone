"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from "recharts"

interface WalletBalanceChartProps {
  branchId: string
}

// Mock data for charts
const generateMockData = (branchId: string) => {
  // Generate different data based on branch ID to simulate different branches
  const multiplier = Number.parseInt(branchId.replace(/\D/g, ""), 10) || 1

  return {
    balanceHistory: Array.from({ length: 12 }, (_, i) => ({
      month: `${i + 1}/2023`,
      balance: Math.floor(200000 * multiplier + Math.random() * 500000 * multiplier + i * 100000 * multiplier),
    })),

    earningsHistory: Array.from({ length: 12 }, (_, i) => ({
      month: `${i + 1}/2023`,
      earnings: Math.floor(50000 * multiplier + Math.random() * 200000 * multiplier),
      withdrawals: Math.floor(20000 * multiplier + Math.random() * 100000 * multiplier),
    })),

    transactionHistory: Array.from({ length: 12 }, (_, i) => ({
      month: `${i + 1}/2023`,
      income: Math.floor(50000 * multiplier + Math.random() * 200000 * multiplier),
      expense: Math.floor(10000 * multiplier + Math.random() * 80000 * multiplier),
    })),
  }
}

export default function WalletBalanceChart({ branchId }: WalletBalanceChartProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setChartData(generateMockData(branchId))
      setIsLoading(false)
    }, 1000)
  }, [branchId])

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <Tabs defaultValue="balance">
        <TabsList className="mb-4">
          <TabsTrigger value="balance">Balance History</TabsTrigger>
          <TabsTrigger value="earnings">Earnings & Withdrawals</TabsTrigger>
          <TabsTrigger value="transactions">Income vs Expense</TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.balanceHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorBalance)"
                name="Balance"
              />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="earnings" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.earningsHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="earnings" stroke="#4ade80" activeDot={{ r: 8 }} name="Earnings" />
              <Line type="monotone" dataKey="withdrawals" stroke="#f43f5e" name="Withdrawals" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="transactions" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.transactionHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="income" fill="#4ade80" name="Income" />
              <Bar dataKey="expense" fill="#f43f5e" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  )
}
