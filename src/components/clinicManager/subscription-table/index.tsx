"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { IListResponse, IResCommon } from "@/lib/api";
import { SubscriptionResponse } from "@/features/clinic/types";

// Format price from cents to dollars/currency
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price / 100);
};
interface SubscriptionTableProps {
  mockData: IResCommon<IListResponse<SubscriptionResponse>> | undefined;
}

export function SubscriptionTable({ mockData }: SubscriptionTableProps) {
  const [currentPage, setCurrentPage] = useState<number>(
    mockData?.value.pageIndex ?? 1
  );

  const handlePreviousPage = (): void => {
    if (mockData?.value.hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = (): void => {
    if (mockData?.value.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleToggleActivation = (
    packageId: string,
    currentStatus: boolean
  ): void => {
    console.log(
      `Toggle package ${packageId} from ${
        currentStatus ? "active" : "inactive"
      } to ${!currentStatus ? "active" : "inactive"}`
    );
    // In a real application, you would call an API to update the status
  };

  return (
    <div className="space-y-8">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration (days)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData?.value.items.map((pkg) => (
              <TableRow key={pkg.documentId}>
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell
                  className="max-w-[200px] truncate"
                  title={pkg.description}
                >
                  {pkg.description}
                </TableCell>
                <TableCell>{formatPrice(pkg.price)}</TableCell>
                <TableCell>{pkg.duration}</TableCell>
                <TableCell>
                  <Badge variant={pkg.isActivated ? "default" : "secondary"}>
                    {pkg.isActivated ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleActivation(
                            pkg.documentId,
                            pkg.isActivated
                          )
                        }
                      >
                        {pkg.isActivated ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls using shadcn/ui Pagination component */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {mockData?.value.items.length} of {mockData?.value.totalCount}{" "}
          packages
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePreviousPage}
                className={
                  !mockData?.value.hasPreviousPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                aria-disabled={!mockData?.value.hasPreviousPage}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink isActive>{currentPage}</PaginationLink>
            </PaginationItem>

            {mockData?.value.hasNextPage && (
              <>
                <PaginationItem>
                  <PaginationLink>{currentPage + 1}</PaginationLink>
                </PaginationItem>

                {currentPage + 1 <
                  Math.ceil(
                    mockData?.value.totalCount / mockData?.value.pageSize
                  ) && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                className={
                  !mockData?.value.hasNextPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                aria-disabled={!mockData?.value.hasNextPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
