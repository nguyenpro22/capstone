import { format } from "date-fns";

export function formatCurrency(amount: number): string {
  return amount?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const formatDateRange = (start: string, end: string) =>
  `${format(new Date(start), "dd-MM")} - ${format(new Date(end), "dd-MM")}`;
export const formatMonth = (date: string) => format(new Date(date), "MMM");

export const currentMonthYear = `${
  new Date().getMonth() + 1
}-${new Date().getFullYear()}`;
export const currentYear = `${new Date().getFullYear()}`;
