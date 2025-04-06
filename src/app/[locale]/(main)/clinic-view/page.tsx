"use client";

import type React from "react";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Building } from "lucide-react";
import { useGetClinicsQuery } from "@/features/clinic/api";
import { ClinicCard } from "@/components/clinic-view/clinic-card";

export default function ClinicsPage() {
  const t = useTranslations("clinics");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Fetch data using the hook
  const { data, isLoading, error, refetch } = useGetClinicsQuery({
    pageIndex: currentPage,
    pageSize: pageSize,
    searchTerm: searchTerm,
  });

  // Get clinic list from response
  const clinicList = data?.value?.items || [];
  const totalPages = data?.value
    ? Math.ceil(data.value.totalCount / pageSize)
    : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <Badge
          variant="outline"
          className="mb-4 px-3 py-1 bg-primary/10 dark:bg-primary/20 border-primary/20 text-primary"
        >
          {t("badge") || "Our Network"}
        </Badge>
        <h1 className="text-4xl font-bold mb-4">
          {t("title") || "Find the Best Clinics"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("description") ||
            "Browse our curated selection of beauty and wellness clinics to find the perfect match for your needs."}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800/30 rounded-xl shadow-md p-6 mb-10">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={
                t("searchPlaceholder") || "Search by clinic name or location..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder={t("sortBy") || "Sort by"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">
                  {t("sortByRating") || "Rating (High to Low)"}
                </SelectItem>
                <SelectItem value="name">
                  {t("sortByName") || "Name (A-Z)"}
                </SelectItem>
                <SelectItem value="-name">
                  {t("sortByNameDesc") || "Name (Z-A)"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full md:w-auto">
            {t("search") || "Search"}
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-lg" />
            ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/40 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-600 dark:text-red-400"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-red-600 dark:text-red-400 font-medium">
              {t("errorLoading") || "Error loading clinics"}
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => refetch()}
            >
              {t("tryAgain") || "Try again"}
            </Button>
          </div>
        </div>
      ) : clinicList.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-xl border border-muted/50">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-muted/50 p-3">
              <Building className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">
              {t("noClinicsFound") || "No clinics found"}
            </h3>
            <p className="text-muted-foreground">
              {t("tryDifferentSearch") ||
                "Try different search terms or clear filters"}
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => {
                setSearchTerm("");
                setSortBy("rating");
                refetch();
              }}
            >
              {t("clearFilters") || "Clear filters"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clinicList.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </Button>

              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className={
                    currentPage === i + 1 ? "bg-primary text-white" : ""
                  }
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
