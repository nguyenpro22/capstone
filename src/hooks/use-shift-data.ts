"use client";

import { useGetDoctorSchedulesQuery } from "@/features/doctor/api";
import { DoctorWorkingSchedule } from "@/features/doctor/types";
import { useState, useEffect } from "react";

// Helper function to format date range
const formatDateRange = (startDate: Date, endDate: Date) => {
  const formatToYYYYMMDD = (date: Date) => {
    return date.toISOString().split("T")[0];
  };
  return `${formatToYYYYMMDD(startDate)} to ${formatToYYYYMMDD(endDate)}`;
};

export function useShiftData(startDate: Date, endDate: Date) {
  const [shifts, setShifts] = useState<DoctorWorkingSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch schedule data from the API with date range
  const {
    data,
    isLoading: apiLoading,
    error: apiError,
  } = useGetDoctorSchedulesQuery(
    {
      pageNumber: 1,
      pageSize: 1000,
      searchTerm: formatDateRange(startDate, endDate),
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    const loadShifts = async () => {
      try {
        setIsLoading(true);

        if (apiLoading || apiError || !data?.value) {
          return;
        }

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
