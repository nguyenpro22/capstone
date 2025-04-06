"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, ChevronDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data
const orders = [
  {
    id: "ORD-001",
    customer: "Emma Thompson",
    service: "Facial Treatment",
    date: "2025-03-28",
    total: "$120",
    status: "completed",
  },
  {
    id: "ORD-002",
    customer: "James Wilson",
    service: "Hair Styling",
    date: "2025-03-28",
    total: "$80",
    status: "pending",
  },
  {
    id: "ORD-003",
    customer: "Sophia Garcia",
    service: "Manicure & Pedicure",
    date: "2025-03-28",
    total: "$100",
    status: "completed",
  },
  {
    id: "ORD-004",
    customer: "Michael Brown",
    service: "Massage Therapy",
    date: "2025-03-28",
    total: "$150",
    status: "cancelled",
  },
  {
    id: "ORD-005",
    customer: "Olivia Martinez",
    service: "Skin Consultation",
    date: "2025-03-28",
    total: "$75",
    status: "pending",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
    case "pending":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
    case "cancelled":
      return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function OrderPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input className="w-64" placeholder="Search orders..." />
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
            <ChevronDown size={16} />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Manage customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.service}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

