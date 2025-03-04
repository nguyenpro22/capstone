"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CheckCircle, XCircle, Clock, Tag } from "lucide-react";
import type { IListResponse, IResCommon } from "@/lib/api";
import type { SubscriptionResponse } from "@/features/clinic/types";
import { useBuySubscriptionMutation } from "@/features/clinic/api";
import { useRouter } from "next/navigation";

// Format price to Vietnamese currency
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0, // VND doesn't use decimal places
  }).format(price);
};

interface SubscriptionPackagesProps {
  mockData: IResCommon<IListResponse<SubscriptionResponse>> | undefined;
}

export function SubscriptionPackages({ mockData }: SubscriptionPackagesProps) {
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

  if (!mockData || !mockData.value.items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-slate-50 p-6 mb-4">
          <Tag className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-medium mb-2">No subscription packages</h3>
        <p className="text-slate-500 max-w-md">
          There are no subscription packages available at the moment. Please
          check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockData.value.items.map((pkg) => (
          <SubscriptionCard key={pkg.documentId} pkg={pkg} />
        ))}
      </div>

      {/* Pagination controls using shadcn/ui Pagination component */}
      {mockData.value.totalCount > mockData.value.pageSize && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            Showing {mockData.value.items.length} of {mockData.value.totalCount}{" "}
            packages
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  className={
                    !mockData.value.hasPreviousPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  aria-disabled={!mockData.value.hasPreviousPage}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink isActive>{currentPage}</PaginationLink>
              </PaginationItem>

              {mockData.value.hasNextPage && (
                <>
                  <PaginationItem>
                    <PaginationLink>{currentPage + 1}</PaginationLink>
                  </PaginationItem>

                  {currentPage + 1 <
                    Math.ceil(
                      mockData.value.totalCount / mockData.value.pageSize
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
                    !mockData.value.hasNextPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  aria-disabled={!mockData.value.hasNextPage}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

function SubscriptionCard({ pkg }: { pkg: SubscriptionResponse }) {
  const [buySubsciption] = useBuySubscriptionMutation();
  const router = useRouter();

  const handleBuySubscription = async (documentId: string) => {
    try {
      const res = await buySubsciption({ subscriptionId: documentId }).unwrap();
      if (res.isSuccess) {
        localStorage.setItem("transactionData", JSON.stringify(res.value));
        router.push(`/clinicManager/payment/qr-code`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <CardTitle
              className="text-lg font-medium line-clamp-1"
              title={pkg.name}
            >
              {pkg.name}
            </CardTitle>
            <CardDescription
              className="text-slate-500 line-clamp-2"
              title={pkg.description}
            >
              {pkg.description || "No description available"}
            </CardDescription>
          </div>
          <Badge
            variant={pkg.isActivated ? "outline" : "secondary"}
            className={`whitespace-nowrap ${
              pkg.isActivated
                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-100"
            }`}
          >
            {pkg.isActivated ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-6">
        <div className="space-y-5">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-2xl font-medium text-slate-800">
              {formatPrice(pkg.price)}
            </p>
            <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              <span>{pkg.duration} days subscription</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {pkg.isActivated ? (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 px-3 py-2 rounded-md w-full border border-emerald-100">
                <CheckCircle className="h-4 w-4" />
                <span>Currently active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50/50 px-3 py-2 rounded-md w-full border border-slate-100">
                <XCircle className="h-4 w-4" />
                <span>Currently inactive</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {pkg.isActivated ? (
          <Button
            className="w-full"
            variant="outline"
            size="default"
            disabled={pkg.isActivated}
          >
            Manage Subscription
          </Button>
        ) : (
          <Button
            className="w-full"
            variant={"default"}
            size="default"
            onClick={() => handleBuySubscription(pkg.documentId)}
          >
            Subscribe Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
