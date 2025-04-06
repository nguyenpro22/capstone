"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data
const schedules = [
  {
    id: 1,
    customer: "Emma Thompson",
    service: "Facial Treatment",
    time: "10:00 AM",
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    customer: "James Wilson",
    service: "Hair Styling",
    time: "11:30 AM",
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    customer: "Sophia Garcia",
    service: "Manicure & Pedicure",
    time: "2:00 PM",
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    customer: "Michael Brown",
    service: "Massage Therapy",
    time: "3:30 PM",
    status: "cancelled",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    customer: "Olivia Martinez",
    service: "Skin Consultation",
    time: "5:00 PM",
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>
    case "pending":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
    case "cancelled":
      return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">+8% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-xs text-green-500 mt-1">75% confirmation rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">2 on leave today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={schedule.avatar} />
                        <AvatarFallback>{schedule.customer.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{schedule.customer}</span>
                    </div>
                  </TableCell>
                  <TableCell>{schedule.service}</TableCell>
                  <TableCell>{schedule.time}</TableCell>
                  <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Appointment</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

