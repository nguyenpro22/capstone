"use client"

import { useCallback } from "react"
import { APP_CONFIG } from "@/config/app-config"

/**
 * Custom hook that creates a delayed refetch function
 * @param refetchFn The original refetch function to delay
 * @param delayMs The delay in milliseconds (defaults to global config)
 * @returns A function that will call the refetch function after the specified delay
 */
export function useDelayedRefetch<T extends (...args: any[]) => Promise<any>>(
  refetchFn: T,
  delayMs: number = APP_CONFIG.REFETCH_DELAY_MS,
) {
  const delayedRefetch = useCallback(
    (...args: Parameters<T>) => {
      return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
        setTimeout(async () => {
          try {
            const result = await refetchFn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delayMs);
      });
    },
    [refetchFn, delayMs],
  );

  return delayedRefetch;
}