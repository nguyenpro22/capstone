"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Filter, ChevronDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data
const services = [
  {
    id: 1,
    name: "Facial Treatment",
    category: "Skincare",
    duration: "60 min",
    price: "$120",
    status: "active",
  },
  {
    id: 2,
    name: "Hair Styling",
    category: "Hair",
    duration: "45 min",
    price: "$80",
    status: "active",
  },
  {
    id: 3,
    name: "Manicure & Pedicure",
    category: "Nail Care",
    duration: "90 min",
    price: "$100",
    status: "active",
  },
  {
    id: 4,
    name: "Massage Therapy",
    category: "Wellness",
    duration: "60 min",
    price: "$150",
    status: "active",
  },
  {
    id: 5,
    name: "Skin Consultation",
    category: "Skincare",
    duration: "30 min",
    price: "$75",
    status: "inactive",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
    case "inactive":
      return <Badge className="bg-gray-500 hover:bg-gray-600">Inactive</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function ServicePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Services</h1>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input className="w-64" placeholder="Search services..." />
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
            <ChevronDown size={16} />
          </Button>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Add Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Services</CardTitle>
          <CardDescription>Manage services offered at your branch</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.duration}</TableCell>
                  <TableCell>{service.price}</TableCell>
                  <TableCell>{getStatusBadge(service.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Update Price</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
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

