"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  clinicId: string
}

// Mock data for charts
const generateMockData = (clinicId: string) => {
  // Generate different data based on clinic ID to simulate different clinics
  const multiplier = Number.parseInt(clinicId, 10) || 1

  return {
    balanceHistory: Array.from({ length: 12 }, (_, i) => ({
      month: `${i + 1}/2023`,
      balance: Math.floor(500000 * multiplier + Math.random() * 1000000 * multiplier + i * 200000 * multiplier),
    })),

    earningsHistory: Array.from({ length: 12 }, (_, i) => ({
      month: `${i + 1}/2023`,
      earnings: Math.floor(100000 * multiplier + Math.random() * 500000 * multiplier),
      withdrawals: Math.floor(50000 * multiplier + Math.random() * 300000 * multiplier),
    })),

    withdrawalHistory: Array.from({ length: 12 }, (_, i) => ({
      month: `${i + 1}/2023`,
      completed: Math.floor(50000 * multiplier + Math.random() * 200000 * multiplier),
      pending: Math.floor(10000 * multiplier + Math.random() * 100000 * multiplier),
      rejected: Math.floor(Math.random() * 50000 * multiplier),
    })),
  }
}

export default function WalletBalanceChart({ clinicId }: WalletBalanceChartProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setChartData(generateMockData(clinicId))
      setIsLoading(false)
    }, 1000)
  }, [clinicId])

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
      <Card>
        <CardHeader>
          <CardTitle>Wallet Analytics</CardTitle>
          <CardDescription>Loading wallet data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Analytics</CardTitle>
        <CardDescription>View wallet balance and transaction trends</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="balance">
          <TabsList className="mb-4">
            <TabsTrigger value="balance">Balance History</TabsTrigger>
            <TabsTrigger value="earnings">Earnings & Withdrawals</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawal Status</TabsTrigger>
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

          <TabsContent value="withdrawals" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.withdrawalHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#4ade80" name="Completed" />
                <Bar dataKey="pending" stackId="a" fill="#facc15" name="Pending" />
                <Bar dataKey="rejected" stackId="a" fill="#f43f5e" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
