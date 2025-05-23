"use client"

import { useState } from "react"
import { useGetClinicSchedulesQuery, useApproveScheduleMutation } from "@/features/customer-schedule/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X, Loader2, Calendar, Clock, User, Phone } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useTranslations } from "next-intl"

export default function ScheduleApproval() {
  const t = useTranslations("scheduleApproval")
  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 10
  const { toast } = useToast()

  // Fetch schedules that need approval
  const { data, isLoading, isError, refetch } = useGetClinicSchedulesQuery({
    pageIndex,
    pageSize,
    searchTerm: "Waiting Approval",
    sortColumn: "createdAt",
    sortOrder: "desc",
  })

  // Mutation for approving or rejecting schedules
  const [approveSchedule, { isLoading: isApproving }] = useApproveScheduleMutation()

  // Handle approve/reject actions
  const handleApproveReject = async (customerScheduleId: string, status: "Approved" | "Rejected") => {
    try {
      await approveSchedule({
        customerScheduleId,
        status,
      }).unwrap()

      toast({
        title: status === "Approved" ? t("approveSuccess") : t("rejectSuccess"),
        variant: status === "Approved" ? "default" : "destructive",
      })

      // Refresh the list
      refetch()
    } catch (error) {
      toast({
        title: t("error"),
        description: status === "Approved" ? t("approveError") : t("rejectError"),
        variant: "destructive",
      })
      refetch()
    }
  }

  // Check if we have data and it's successful
  const schedules = data?.isSuccess ? data.value.items : []
  const totalCount = data?.isSuccess ? data.value.totalCount : 0
  const totalPages = Math.ceil(totalCount / pageSize) || 1
  const hasNextPage = data?.isSuccess ? data.value.hasNextPage : false
  const hasPreviousPage = data?.isSuccess ? data.value.hasPreviousPage : false

  // Check for error in the response
  const responseError = data?.isFailure && data.error.message

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("pageTitle")}</CardTitle>
        <CardDescription>{t("pageDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError || responseError ? (
          <div className="text-center py-8 text-destructive">
            <p>
              {t("loadError")} {responseError || t("tryAgain")}
            </p>
            <Button variant="outline" onClick={() => refetch()} className="mt-4">
              {t("retry")}
            </Button>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t("noSchedules")}</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("customer")}</TableHead>
                  <TableHead>{t("contact")}</TableHead>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead>{t("time")}</TableHead>
                  <TableHead>{t("service")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {schedule.customerName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {schedule.customerPhoneNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {schedule.bookingDate
                          ? format(new Date(schedule.bookingDate), "MMM dd, yyyy")
                          : t("notAvailable")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {schedule.startTime || t("notAvailable")}
                      </div>
                    </TableCell>
                    <TableCell>{schedule.serviceName || t("notAvailable")}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        {t("waitingApproval")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleApproveReject(schedule.id, "Approved")}
                          disabled={isApproving}
                        >
                          {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          <span className="ml-1">{t("approve")}</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleApproveReject(schedule.id, "Rejected")}
                          disabled={isApproving}
                        >
                          {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                          <span className="ml-1">{t("reject")}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
                      className={!hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Show current page and surrounding pages
                    let pageNum = pageIndex - 2 + i
                    if (pageNum <= 0) pageNum = i + 1
                    if (pageNum > totalPages) return null
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink onClick={() => setPageIndex(pageNum)} isActive={pageIndex === pageNum}>
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages))}
                      className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
