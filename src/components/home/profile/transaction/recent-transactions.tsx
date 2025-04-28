"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetCustomerTransactionsQuery } from "@/features/customer-wallet/api";
import { TransactionCard } from "./transaction-card";
import { useTranslations } from "next-intl";

interface RecentTransactionsProps {
  onViewAllClick: () => void;
}

export function RecentTransactions({
  onViewAllClick,
}: RecentTransactionsProps) {
  const t = useTranslations("userProfileMessages");

  // Fetch only the most recent transactions
  const { data, isLoading } = useGetCustomerTransactionsQuery({
    pageIndex: 1,
    pageSize: 3,
    sortColumn: "transactionDate",
    sortOrder: "desc",
  });

  const transactions = data?.value?.items || [];

  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
          {t("wallet.recentTransactions.title")}
        </h3>
        <Button
          variant="ghost"
          className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 h-8 px-2"
          onClick={onViewAllClick}
        >
          {t("wallet.recentTransactions.viewAll")}
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            {t("wallet.recentTransactions.empty")}
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                compact
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
