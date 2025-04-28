"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpIcon, RefreshCwIcon, CheckCircleIcon } from "lucide-react";
import { numberToWords } from "@/utils/vietnamese-text";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

interface WithdrawFlowProps {
  currentBalance: number;
  onBalanceUpdate: (newBalance: number) => void;
  onComplete: () => void;
}

export function WithdrawFlow({
  currentBalance,
  onBalanceUpdate,
  onComplete,
}: WithdrawFlowProps) {
  const t = useTranslations("userProfileMessages");

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Handle withdraw amount change
  const handleWithdrawAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^0-9.-]+/g, "");
    setWithdrawAmount(value);
  };

  // Handle quick amount selection
  const handleQuickAmount = (value: number) => {
    if (value <= currentBalance) {
      setWithdrawAmount(value.toString());
    }
  };

  // Process withdrawal
  const processWithdrawal = async () => {
    const amount = Number.parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > currentBalance) {
      toast.error(
        <>
          <b>{t("wallet.withdraw.errorTitle")}</b>
          <div>{t("wallet.withdraw.invalidAmount")}</div>
        </>
      );
      return;
    }

    if (!selectedBank) {
      toast.error(
        <>
          <b>{t("wallet.withdraw.errorTitle")}</b>
          <div>{t("wallet.withdraw.selectBank")}</div>
        </>
      );
      return;
    }

    if (!accountNumber) {
      toast.error(
        <>
          <b>{t("wallet.withdraw.errorTitle")}</b>
          <div>{t("wallet.withdraw.enterAccountNumber")}</div>
        </>
      );
      return;
    }

    if (!accountName) {
      toast.error(
        <>
          <b>{t("wallet.withdraw.errorTitle")}</b>
          <div>{t("wallet.withdraw.enterAccountName")}</div>
        </>
      );
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update balance
      const newBalance = currentBalance - amount;
      onBalanceUpdate(newBalance);

      setIsSuccess(true);

      toast.success(
        <>
          <b>{t("wallet.withdraw.successTitle")}</b>
          <div>
            {t("wallet.withdraw.successDesc", {
              amount: new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0,
              }).format(amount),
            })}
          </div>
        </>
      );
    } catch (error) {
      toast.error(
        <>
          <b>{t("wallet.withdraw.errorTitle")}</b>
          <div>{t("wallet.withdraw.errorDesc")}</div>
        </>
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setWithdrawAmount("");
    setSelectedBank("");
    setAccountNumber("");
    setAccountName("");
    setIsSuccess(false);
  };

  // Render success state
  if (isSuccess) {
    return (
      <Card className="h-full border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl dark:shadow-purple-900/20 rounded-xl overflow-hidden flex flex-col">
        <CardHeader className="pb-2 px-6">
          <CardTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            {t("wallet.withdraw.title")}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {t("wallet.withdraw.description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-4 flex-1 overflow-y-auto">
          <div className="flex flex-col items-center py-12">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <CheckCircleIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>

            <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
              {t("wallet.withdraw.successTitle")}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
              {t("wallet.withdraw.successNote")}
            </p>

            <div className="flex gap-4 w-full max-w-xs">
              <Button variant="outline" className="flex-1" onClick={resetForm}>
                {t("wallet.withdraw.withdrawAnother")}
              </Button>

              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={onComplete}
              >
                {t("wallet.withdraw.done")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render withdraw form
  return (
    <Card className="h-full border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl dark:shadow-purple-900/20 rounded-xl overflow-hidden flex flex-col">
      <CardHeader className="pb-2 px-6">
        <CardTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          {t("wallet.withdraw.title")}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {t("wallet.withdraw.description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 py-4 flex-1 overflow-y-auto">
        <div className="space-y-6">
          {/* Withdraw Form */}
          <div className="bg-blue-50/70 dark:bg-blue-900/20 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
              {t("wallet.withdraw.enterAmount")}
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="withdrawAmount"
                  className="text-gray-700 dark:text-gray-300"
                >
                  {t("wallet.withdraw.amountLabel")}
                </Label>
                <div className="relative">
                  <Input
                    id="withdrawAmount"
                    type="text"
                    placeholder={t("wallet.withdraw.amountPlaceholder")}
                    value={withdrawAmount}
                    onChange={handleWithdrawAmountChange}
                    className="pl-12 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">
                      VND
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[100000, 200000, 500000, 1000000].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    className="border-blue-200 dark:border-blue-800/30 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    onClick={() => handleQuickAmount(amount)}
                    disabled={amount > currentBalance}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    }).format(amount)}
                  </Button>
                ))}
              </div>

              {withdrawAmount && (
                <div className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                  <span className="font-medium">
                    {t("wallet.withdraw.inWords")}:
                  </span>{" "}
                  {numberToWords(withdrawAmount)}
                </div>
              )}
            </div>
          </div>

          {/* Bank Account Information */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
              {t("wallet.withdraw.bankInfoTitle")}
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="bank"
                  className="text-gray-700 dark:text-gray-300"
                >
                  {t("wallet.withdraw.bankLabel")}
                </Label>
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger
                    id="bank"
                    className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
                  >
                    <SelectValue
                      placeholder={t("wallet.withdraw.bankPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vcb">
                      {t("wallet.withdraw.banks.vcb")}
                    </SelectItem>
                    <SelectItem value="tcb">
                      {t("wallet.withdraw.banks.tcb")}
                    </SelectItem>
                    <SelectItem value="bidv">
                      {t("wallet.withdraw.banks.bidv")}
                    </SelectItem>
                    <SelectItem value="vtb">
                      {t("wallet.withdraw.banks.vtb")}
                    </SelectItem>
                    <SelectItem value="mb">
                      {t("wallet.withdraw.banks.mb")}
                    </SelectItem>
                    <SelectItem value="acb">
                      {t("wallet.withdraw.banks.acb")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="accountNumber"
                  className="text-gray-700 dark:text-gray-300"
                >
                  {t("wallet.withdraw.accountNumberLabel")}
                </Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder={t("wallet.withdraw.accountNumberPlaceholder")}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="accountName"
                  className="text-gray-700 dark:text-gray-300"
                >
                  {t("wallet.withdraw.accountNameLabel")}
                </Label>
                <Input
                  id="accountName"
                  type="text"
                  placeholder={t("wallet.withdraw.accountNamePlaceholder")}
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 h-12 text-lg"
            onClick={processWithdrawal}
            disabled={
              isProcessing ||
              !withdrawAmount ||
              Number.parseFloat(withdrawAmount) <= 0 ||
              Number.parseFloat(withdrawAmount) > currentBalance ||
              !selectedBank ||
              !accountNumber ||
              !accountName
            }
          >
            {isProcessing ? (
              <>
                <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                {t("wallet.withdraw.processing")}
              </>
            ) : (
              <>
                <ArrowUpIcon className="h-5 w-5 mr-2" />
                {t("wallet.withdraw.submit")}
              </>
            )}
          </Button>

          {/* Information Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/30">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-medium">
                {t("wallet.withdraw.noteTitle")}
              </span>{" "}
              {t("wallet.withdraw.noteContent")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
