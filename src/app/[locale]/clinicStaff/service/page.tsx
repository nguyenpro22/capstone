"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Filter, ChevronDown, MoreHorizontal, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetAllServicesQuery } from "@/features/services/api" // Adjust the import path as needed
import { useDebounce } from "@/hooks/use-debounce"
import Pagination from "@/components/common/Pagination/Pagination"
import { ServiceItem } from "@/features/services/types"


// Format currency function for Vietnamese Dong
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format duration in minutes to a readable format
const formatDuration = (minutes: number): string => {
  if (!minutes) return "N/A"

  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`
  }

  return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} min`
}

export default function ServicePage() {
  // State for pagination, search, and sorting
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortOrder, setSortOrder] = useState("")

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Fetch services using RTK Query
  const { data, isLoading, error } = useGetAllServicesQuery({
    pageIndex,
    pageSize,
    searchTerm: debouncedSearchTerm,
    sortColumn,
    sortOrder,
  })

  // Extract services and pagination info from the response
  const services = data?.value?.items || []
  const totalCount = data?.value?.totalCount || 0
  const hasNextPage = data?.value?.hasNextPage || false
  const hasPreviousPage = data?.value?.hasPreviousPage || false

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPageIndex(1) // Reset to first page when search changes
  }

  

  // Get price range as a string
  const getPriceRange = (service: ServiceItem): string => {
    if (service.minPrice === service.maxPrice) {
      return formatCurrency(service.minPrice)
    }

    return `${formatCurrency(service.minPrice)} - ${formatCurrency(service.maxPrice)}`
  }

  // Get discounted price range as a string
  const getDiscountedPriceRange = (service: ServiceItem): string => {
    if (!service.discountPercent || service.discountPercent === "0") {
      return ""
    }

    if (service.discountMinPrice === service.discountMaxPrice) {
      return formatCurrency(service.discountMinPrice)
    }

    return `${formatCurrency(service.discountMinPrice)} - ${formatCurrency(service.discountMaxPrice)}`
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Services</h1>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input className="w-64" placeholder="Search services..." value={searchTerm} onChange={handleSearchChange} />
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
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading services...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Failed to load services. Please try again later.</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No services found
                      </TableCell>
                    </TableRow>
                  ) : (
                    services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>{service.category?.name || "Uncategorized"}</TableCell>
                        
                        <TableCell>{getPriceRange(service)}</TableCell>
                        <TableCell>
                          {service.discountPercent && service.discountPercent !== "0" ? (
                            <div>
                              <Badge className="bg-red-500 hover:bg-red-600 mb-1">{service.discountPercent}% OFF</Badge>
                              <div className="text-sm text-muted-foreground">{getDiscountedPriceRange(service)}</div>
                            </div>
                          ) : (
                            "No discount"
                          )}
                        </TableCell>
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
                                <DropdownMenuItem>Add Discount</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {services.length > 0 && (
                <div className="mt-4">
                  <Pagination
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalCount={totalCount}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    onPageChange={setPageIndex}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
