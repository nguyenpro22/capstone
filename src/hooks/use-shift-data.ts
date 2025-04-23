"use client";

import { useGetDoctorSchedulesQuery } from "@/features/doctor/api";
import { DoctorWorkingSchedule } from "@/features/doctor/types";
import { useState, useEffect } from "react";
const getStartAndEndOfCurrentMonth = () => {
  const today = new Date();

  // Lấy ngày bắt đầu của tháng hiện tại
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startDate = startOfMonth.toISOString().split("T")[0]; // Định dạng yyyy-MM-dd

  // Lấy ngày kết thúc của tháng hiện tại
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const endDate = endOfMonth.toISOString().split("T")[0]; // Định dạng yyyy-MM-dd

  // Tạo searchTerm
  const searchTerm = `${startDate} to ${endDate}`;

  return searchTerm;
};

// Helper function to format date
function format(date: Date, formatStr: string): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return formatStr
    .replace("yyyy", year.toString())
    .replace("MM", month)
    .replace("dd", day);
}

export function useShiftData() {
  const [shifts, setShifts] = useState<DoctorWorkingSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch schedule data from the API
  const {
    data,
    isLoading: apiLoading,
    error: apiError,
  } = useGetDoctorSchedulesQuery({
    pageNumber: 1,
    pageSize: 1000,
    searchTerm: getStartAndEndOfCurrentMonth(),
  });

  useEffect(() => {
    const loadShifts = async () => {
      try {
        setIsLoading(true);

        // If the API is loading or failed, or there's no valid data, exit early
        if (apiLoading || apiError || !data?.value) {
          return;
        }

        // Directly use the data from the API
        const shiftsFromApi = data.value.items || [];
        setShifts(shiftsFromApi);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch shift data")
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadShifts();
  }, [apiLoading, apiError, data]);

  return { shifts, isLoading, error };
}
