"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Filter,
  ChevronDown,
  Eye,
  Loader2,
  X,
  Search,
  Clock,
  DollarSign,
  Tag,
  Layers,
  Users,
  Info,
  ArrowRight,
} from "lucide-react"
import { useGetAllServicesQuery, useGetServiceByIdQuery } from "@/features/services/api"
import { useDebounce } from "@/hooks/use-debounce"
import Pagination from "@/components/common/Pagination/Pagination"
import type { ServiceItem, Procedure } from "@/features/services/types"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

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
  const [pageSize, setPageSize] = useState(9)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  // State for service detail dialog
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  // Add this state for managing active tab
  const [activeTab, setActiveTab] = useState<"overview" | "procedures" | "doctors">("overview")

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

  // Fetch service detail when a service is selected
  const {
    data: serviceDetail,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useGetServiceByIdQuery(selectedServiceId || "", {
    skip: !selectedServiceId,
  })

  // Extract services and pagination info from the response
  const services = data?.value?.items || []
  const totalCount = data?.value?.totalCount || 0
  const hasNextPage = data?.value?.hasNextPage || false
  const hasPreviousPage = data?.value?.hasPreviousPage || false

  // Get the selected service detail
  const serviceDetailData = serviceDetail?.value

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPageIndex(1) // Reset to first page when search changes
  }

  // Handle view detail button click
  const handleViewDetail = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setIsDetailDialogOpen(true)
  }

  // Handle dialog close
  const handleCloseDialog = () => {
    setIsDetailDialogOpen(false)
    // Optional: Clear the selected service ID after a delay to avoid flickering
    setTimeout(() => setSelectedServiceId(null), 300)
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

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Service Management</h1>
        <p className="text-purple-100 max-w-2xl">
          Browse and manage all services offered at your clinic. View detailed information, procedures, and assigned
          doctors.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              className="pl-10 pr-4 py-2 border-gray-200 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Search services..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="gap-2 rounded-full border-gray-200 dark:border-gray-700">
              <Filter size={16} />
              Filter
              <ChevronDown size={16} />
            </Button>

            <div className="flex items-center gap-2 ml-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                className="rounded-l-full rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <Layers size={16} />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                className="rounded-r-full rounded-l-none"
                onClick={() => setViewMode("table")}
              >
                <Layers size={16} />
              </Button>
            </div>

            <Button className="gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
              <Plus size={16} />
              Add Service
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading services...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 mb-4">
              <X className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Failed to load services</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Please try again later or contact support.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No services found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
          </div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="h-full"
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold line-clamp-1">{service.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full">
                        {service.category?.name || "Uncategorized"}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <DollarSign className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Price Range</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{getPriceRange(service)}</p>
                        </div>
                      </div>

                      {service.discountPercent && service.discountPercent !== "0" && (
                        <div className="flex items-start gap-2">
                          <Tag className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Discount</p>
                              <Badge className="bg-red-500 hover:bg-red-600">{service.discountPercent}% OFF</Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {getDiscountedPriceRange(service)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 dark:bg-gray-800/50 pt-4">
                    <Button
                      variant="outline"
                      className="w-full gap-2 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/20 dark:hover:text-purple-400 transition-colors"
                      onClick={() => handleViewDetail(service.id)}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          // Table View
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service, index) => (
                    <TableRow key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-full">
                          {service.category?.name || "Uncategorized"}
                        </Badge>
                      </TableCell>
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
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/20 dark:hover:text-purple-400 transition-colors"
                          onClick={() => handleViewDetail(service.id)}
                        >
                          <Eye className="h-4 w-4" />
                          View Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {services.length > 0 && (
          <div className="mt-6 flex justify-center">
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
      </div>

      {/* Service Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
          {isLoadingDetail ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
              <span className="ml-2">Loading service details...</span>
            </div>
          ) : detailError ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 mb-4">
                <X className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Failed to load service details
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Please try again later or contact support.</p>
            </div>
          ) : serviceDetailData ? (
            <>
              {/* Fixed Header Section */}
              <div className="flex-none">
                {/* Service Header - Fixed */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white relative">
                  
                  <h2 className="text-2xl font-bold mb-1">{serviceDetailData.name}</h2>
                  <div className="flex items-center gap-2 text-purple-100">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white">
                      {serviceDetailData.category.name}
                    </Badge>
                    {serviceDetailData.discountPercent && serviceDetailData.discountPercent !== "0" && (
                      <Badge className="bg-red-500 hover:bg-red-600">{serviceDetailData.discountPercent}% OFF</Badge>
                    )}
                  </div>
                </div>

                {/* Tabs - Fixed */}
                <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex px-6">
                    <button
                      className={`flex items-center gap-2 px-4 py-4 border-b-2 ${
                        activeTab === "overview"
                          ? "border-purple-500 text-purple-600 dark:text-purple-400"
                          : "border-transparent text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                      }`}
                      onClick={() => setActiveTab("overview")}
                    >
                      <Info className="h-4 w-4" />
                      Overview
                    </button>
                    <button
                      className={`flex items-center gap-2 px-4 py-4 border-b-2 ${
                        activeTab === "procedures"
                          ? "border-purple-500 text-purple-600 dark:text-purple-400"
                          : "border-transparent text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                      }`}
                      onClick={() => setActiveTab("procedures")}
                    >
                      <Layers className="h-4 w-4" />
                      Procedures
                    </button>
                    <button
                      className={`flex items-center gap-2 px-4 py-4 border-b-2 ${
                        activeTab === "doctors"
                          ? "border-purple-500 text-purple-600 dark:text-purple-400"
                          : "border-transparent text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                      }`}
                      onClick={() => setActiveTab("doctors")}
                    >
                      <Users className="h-4 w-4" />
                      Doctors
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-grow overflow-y-auto">
                {/* Overview Tab Content */}
                {activeTab === "overview" && (
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-purple-500" />
                              Pricing Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
                              <span className="text-gray-500 dark:text-gray-400">Price Range:</span>
                              <span className="font-semibold text-lg">
                                {serviceDetailData.minPrice === serviceDetailData.maxPrice
                                  ? formatCurrency(serviceDetailData.minPrice)
                                  : `${formatCurrency(serviceDetailData.minPrice)} - ${formatCurrency(serviceDetailData.maxPrice)}`}
                              </span>
                            </div>

                            {serviceDetailData.discountPercent && serviceDetailData.discountPercent !== "0" && (
                              <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-gray-500 dark:text-gray-400">Discount:</span>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-red-500">{serviceDetailData.discountPercent}% OFF</Badge>
                                  <span className="font-semibold">
                                    {serviceDetailData.discountMinPrice === serviceDetailData.discountMaxPrice
                                      ? formatCurrency(serviceDetailData.discountMinPrice)
                                      : `${formatCurrency(serviceDetailData.discountMinPrice)} - ${formatCurrency(serviceDetailData.discountMaxPrice)}`}
                                  </span>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Info className="h-5 w-5 text-purple-500" />
                              Service Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
                              <span className="text-gray-500 dark:text-gray-400">Category:</span>
                              <Badge variant="outline">{serviceDetailData.category.name}</Badge>
                            </div>

                            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
                              <span className="text-gray-500 dark:text-gray-400">Branding:</span>
                              <span className="font-medium">{serviceDetailData.branding.name}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Info className="h-5 w-5 text-purple-500" />
                            Description
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p
                            className="text-gray-700 dark:text-gray-300 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: serviceDetailData.description || "No description available.",
                            }}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Procedures Tab Content */}
                {activeTab === "procedures" && (
                  <div className="p-6">
                    {serviceDetailData.procedures.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
                          <Layers className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                          No procedures available
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          This service does not have any defined procedures.
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                        <div className="space-y-8">
                          {[...serviceDetailData.procedures]
                            .sort((a, b) => a.stepIndex - b.stepIndex)
                            .map((procedure: Procedure, index) => (
                              <div key={procedure.id} className="relative">
                                <Card className="ml-16 hover:shadow-md transition-shadow">
                                  <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg">{procedure.name}</CardTitle>
                                      </div>
                                    </div>
                                    <CardDescription dangerouslySetInnerHTML={{ __html: procedure.description }} />
                                  </CardHeader>
                                  <CardContent>
                                    <h4 className="text-sm font-medium mb-3 text-gray-500 dark:text-gray-400">
                                      Price Options:
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {procedure.procedurePriceTypes.map((priceType) => (
                                        <div
                                          key={priceType.id}
                                          className={`p-4 border rounded-lg ${
                                            priceType.isDefault
                                              ? "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800"
                                              : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                          }`}
                                        >
                                          <div className="flex justify-between">
                                            <span className="font-medium">{priceType.name}</span>
                                            {priceType.isDefault && (
                                              <Badge
                                                variant="outline"
                                                className="border-purple-500 text-purple-500 dark:border-purple-400 dark:text-purple-400"
                                              >
                                                Default
                                              </Badge>
                                            )}
                                          </div>
                                          <div className="flex justify-between mt-2 text-sm">
                                            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                              <Clock className="h-3.5 w-3.5" /> Duration:
                                            </span>
                                            <span>{formatDuration(priceType.duration)}</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                              <DollarSign className="h-3.5 w-3.5" /> Price:
                                            </span>
                                            <span className="font-medium">{formatCurrency(priceType.price)}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Step number bubble */}
                                <div className="absolute left-0 top-4 flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 border-4 border-white dark:border-gray-900 z-10">
                                  <span className="text-purple-600 dark:text-purple-300 font-bold">
                                    {procedure.stepIndex}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Doctors Tab Content */}
                {activeTab === "doctors" && (
                  <div className="p-6">
                    {serviceDetailData.doctorServices.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
                          <Users className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                          No doctors available
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          This service does not have any assigned doctors.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {serviceDetailData.doctorServices.map((doctorService) => (
                          <Card key={doctorService.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                              <div className="flex items-center gap-3 mb-4">
                                <Avatar className="h-14 w-14 border-2 border-purple-100 dark:border-purple-900">
                                  <AvatarImage
                                    src={doctorService.doctor.profilePictureUrl || ""}
                                    alt={doctorService.doctor.fullName}
                                  />
                                  <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                                    {getInitials(doctorService.doctor.fullName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-lg">{doctorService.doctor.fullName}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {doctorService.doctor.email}
                                  </div>
                                </div>
                              </div>

                              {doctorService.doctor.phoneNumber && (
                                <div className="flex justify-between text-sm py-2 border-t border-gray-100 dark:border-gray-800">
                                  <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                                  <span className="font-medium">{doctorService.doctor.phoneNumber}</span>
                                </div>
                              )}

                              {doctorService.doctor.doctorCertificates &&
                                doctorService.doctor.doctorCertificates.length > 0 && (
                                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                      Certificates:
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {doctorService.doctor.doctorCertificates.map((cert, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                                        >
                                          {cert.certificateName || "Certificate"}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
                <Info className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No service details available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">The requested service information could not be found.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
