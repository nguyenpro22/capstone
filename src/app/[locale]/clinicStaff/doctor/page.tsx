"use client"
import { useState } from "react"
import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Filter, Plus, ChevronDown, MoreHorizontal, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetDoctorsQuery } from "@/features/clinic/api" // Adjust the import path as needed
import { useDebounce } from "@/hooks/use-debounce"
import Pagination from "@/components/common/Pagination/Pagination"
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils" // Adjust the import path as needed

// Define the Doctor interface
export interface Doctor {
  id: string
  clinicId: string
  employeeId: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  city: string | null
  district: string | null
  ward: string | null
  address: string | null
  phoneNumber: string | null
  fullAddress: string
  profilePictureUrl: string | null
  role: string
  doctorCertificates: any | null
  branchs?: Array<{
    id: string
    name: string
  }>
}

// Remove the getStatusBadge function since we only have doctors
// Replace with a simpler function or remove it entirely if not needed
const getDoctorSpecialty = (doctor: Doctor) => {
  // You might want to extract specialty from certificates or other fields
  // For now, just return the role as "Doctor"
  return "Doctor"
}

export default function DoctorsPage() {
  // State for pagination, search, and filtering
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(9) // Show 9 doctors per page for the grid
  const [searchTerm, setSearchTerm] = useState("")

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Get clinicId from token
  const token = getAccessToken()
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null
  const clinicId = tokenData?.clinicId || ""

  // Fetch doctors using RTK Query
  const { data, isLoading, error } = useGetDoctorsQuery({
    clinicId,
    pageIndex,
    pageSize,
    searchTerm: debouncedSearchTerm,
    role: 1, // Assuming 1 is the role ID for doctors
  })

  // Extract doctors and pagination info from the response
  const doctors = data?.value?.items || []
  const totalCount = data?.value?.totalCount || 0
  const hasNextPage = data?.value?.hasNextPage || false
  const hasPreviousPage = data?.value?.hasPreviousPage || false

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPageIndex(1) // Reset to first page when search changes
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get branch names for a doctor
  const getBranchNames = (doctor: Doctor) => {
    if (!doctor.branchs || doctor.branchs.length === 0) {
      return "No branches assigned"
    }

    return doctor.branchs.map((branch) => branch.name).join(", ")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Branch Doctors</h1>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input className="w-64" placeholder="Search doctors..." value={searchTerm} onChange={handleSearchChange} />
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

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading doctors...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">Failed to load doctors. Please try again later.</div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No doctors found. Try adjusting your search criteria.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor.employeeId} className="overflow-hidden">
                <div className="h-1 bg-green-500" />
                {/* In the card header, replace the status badge with specialty or remove it */}
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={doctor.profilePictureUrl || "/placeholder.svg?height=40&width=40"} />
                        <AvatarFallback>{getInitials(doctor.fullName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{doctor.fullName}</CardTitle>
                        <CardDescription>Doctor</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="truncate max-w-[180px]">{doctor.email}</span>
                    </div>
                    {doctor.phoneNumber && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phone:</span>
                        <span>{doctor.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Branches:</span>
                      <span className="truncate max-w-[180px]">{getBranchNames(doctor)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 dark:bg-gray-800 flex justify-between">
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

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              pageIndex={pageIndex}
              pageSize={pageSize}
              totalCount={totalCount}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onPageChange={setPageIndex}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Doctor Schedules</CardTitle>
              <CardDescription>Manage doctor availability</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                {/* In the table, replace the Role column with something more relevant */}
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Branches</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.employeeId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={doctor.profilePictureUrl || "/placeholder.svg?height=40&width=40"} />
                            <AvatarFallback>{getInitials(doctor.fullName)}</AvatarFallback>
                          </Avatar>
                          <span>{doctor.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="truncate max-w-[180px]">{doctor.email}</TableCell>
                      <TableCell>{doctor.phoneNumber || "N/A"}</TableCell>
                      <TableCell className="truncate max-w-[180px]">{getBranchNames(doctor)}</TableCell>
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
                              <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit Schedule</DropdownMenuItem>
                              <DropdownMenuItem>Assign to Branch</DropdownMenuItem>
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
        </>
      )}
    </div>
  )
}
