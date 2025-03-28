"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Filter, Plus, ChevronDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Dermatologist",
    availability: "Mon-Fri, 9AM-5PM",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Dr. Robert Chen",
    specialty: "Cosmetic Surgeon",
    availability: "Tue-Sat, 10AM-6PM",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Dr. Maria Rodriguez",
    specialty: "Aesthetician",
    availability: "Mon-Wed, 8AM-4PM",
    status: "on leave",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
    case "on leave":
      return <Badge className="bg-gray-500 hover:bg-gray-600">On Leave</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Branch Doctors</h1>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input className="w-64" placeholder="Search doctors..." />
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
            <ChevronDown size={16} />
          </Button>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Add Doctor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden">
            <div className={`h-1 ${doctor.status === "active" ? "bg-green-500" : "bg-gray-500"}`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={doctor.avatar} />
                    <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(doctor.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Availability:</span>
                  <span>{doctor.availability}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Appointments Today:</span>
                  <span>4</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 flex justify-between">
              <Button variant="outline" size="sm">
                View Schedule
              </Button>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doctor Schedules</CardTitle>
          <CardDescription>Manage doctor availability</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={doctor.avatar} />
                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{doctor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>{doctor.availability}</TableCell>
                  <TableCell>{getStatusBadge(doctor.status)}</TableCell>
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
                          <DropdownMenuItem>Edit Schedule</DropdownMenuItem>
                          <DropdownMenuItem>Assign Patients</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Set as On Leave</DropdownMenuItem>
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

