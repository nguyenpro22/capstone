"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ArrowDownIcon,
  RefreshCwIcon,
  CopyIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";

import { useTopUpMutation } from "@/features/customer-wallet/api";
import { numberToWords } from "@/utils/vietnamese-text";
import PaymentService from "@/hooks/usePaymentStatus";
import type { Transaction as TransactionResponse } from "@/features/customer-wallet/types";
import { BOOKING_RETRY_URL_KEY } from "@/constants";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/utils";

type DepositStep = "amount" | "payment" | "result";
type TransactionStatus = "pending" | "completed" | "failed" | "expired";

interface DepositFlowProps {
  currentBalance: number;
  onBalanceUpdate: (newBalance: number) => void;
  onComplete: () => void;
  defaultAmount?: string;
}

export function DepositFlow({
  currentBalance,
  onBalanceUpdate,
  onComplete,
  defaultAmount,
}: DepositFlowProps) {
  const t = useTranslations("userProfileMessages");

  const [topUp] = useTopUpMutation();

  // Deposit flow state
  const [depositStep, setDepositStep] = useState<DepositStep>("amount");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [vietnameseNumber, setVietnameseNumber] = useState<string>("");
  const [transaction, setTransaction] = useState<TransactionResponse | null>(
    null
  );
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus>("pending");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fromBooking, setFromBooking] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(BOOKING_RETRY_URL_KEY);
    if (stored) {
      setFromBooking(stored);
    }
  }, []);
  useEffect(() => {
    if (defaultAmount && !isNaN(Number(defaultAmount))) {
      setDepositAmount(defaultAmount);
      setVietnameseNumber(defaultAmount);
    }
  }, [defaultAmount]);

  // Initialize SignalR connection
  useEffect(() => {
    PaymentService.startConnection();

    // Listen for payment status updates
    PaymentService.onPaymentStatusReceived((isSuccess) => {
      if (!transaction) return;

      if (isSuccess) {
        setTransactionStatus("completed");
        setDepositStep("result");

        // Update wallet balance
        const newBalance = currentBalance + (transaction?.amount || 0);
        onBalanceUpdate(newBalance);

        toast.success(
          t("wallet.deposit.success", {
            amount: formatCurrency(transaction.amount),
          }),
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } else {
        setTransactionStatus("failed");
        setDepositStep("result");
        toast.error(t("wallet.deposit.failed"), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });

    return () => {
      if (transaction) {
        PaymentService.leavePaymentSession(transaction.transactionId);
      }
    };
  }, [transaction, currentBalance, onBalanceUpdate]);

  // Join payment session when transaction is created
  useEffect(() => {
    if (transaction && depositStep === "payment") {
      PaymentService.joinPaymentSession(transaction.transactionId);
    }

    return () => {
      if (transaction && depositStep !== "payment") {
        PaymentService.leavePaymentSession(transaction.transactionId);
      }
    };
  }, [transaction, depositStep]);

  // Handle amount input change
  const handleAmountChange = (values: { value: string }) => {
    const value = values.value.replace(/[^0-9.-]+/g, "");
    setDepositAmount(value);
    setVietnameseNumber(value.toString());
  };

  // Handle quick amount selection
  const handleQuickAmount = (value: number) => {
    setDepositAmount(value.toString());
    setVietnameseNumber(value.toString());
  };

  // Create deposit transaction
  const createDepositTransaction = async () => {
    setIsLoading(true);
    try {
      const amount = Number.parseFloat(depositAmount.replace(/[^0-9.-]+/g, ""));
      if (isNaN(amount) || amount <= 0) {
        toast.error(t("wallet.deposit.invalidAmount"), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      const response = await topUp({ amount }).unwrap();

      if (response.isSuccess) {
        setTransaction(response.value);
        setDepositStep("payment");
      } else {
        toast.error(t("wallet.deposit.createFailed"), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error(t("wallet.deposit.error"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.info(t("wallet.deposit.copied", { label }), {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Reset deposit flow
  const resetDepositFlow = () => {
    if (transaction) {
      PaymentService.leavePaymentSession(transaction.transactionId);
    }
    setDepositStep("amount");
    setTransaction(null);
    setTransactionStatus("pending");
    setDepositAmount("");
    setVietnameseNumber("");
  };

  // Finish deposit process
  const finishDepositProcess = () => {
    if (transaction) {
      PaymentService.leavePaymentSession(transaction.transactionId);
    }

    if (transactionStatus === "completed") {
      console.log(fromBooking);

      if (fromBooking) {
        window.location.href = `${fromBooking}?booking=true`;
      } else {
        onComplete();
      }
    } else {
      resetDepositFlow();
    }
  };

  // Render deposit amount step
  const renderDepositAmountStep = () => (
    <div className="space-y-6">
      {/* Deposit Form */}
      <div className="bg-green-50/70 dark:bg-green-900/20 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">
          {t("wallet.deposit.enterAmount")}
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="depositAmount"
              className="text-gray-700 dark:text-gray-300"
            >
              {t("wallet.deposit.amountLabel")}
            </Label>
            <div className="relative">
              <NumericFormat
                id="price"
                value={depositAmount}
                onValueChange={(values) => handleAmountChange(values)}
                thousandSeparator=","
                decimalSeparator="."
                prefix="₫"
                allowNegative={false}
                className="border px-3 py-2 rounded-md w-full"
                placeholder={t("wallet.deposit.amountPlaceholder")}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[500000, 1000000, 2000000, 5000000].map((amount) => (
              <Button
                key={amount}
                type="button"
                variant="outline"
                className="border-green-200 dark:border-green-800/30 hover:bg-green-50 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400"
                onClick={() => handleQuickAmount(amount)}
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                }).format(amount)}
              </Button>
            ))}
          </div>

          <div className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            <span className="font-medium">{t("wallet.deposit.inWords")}:</span>{" "}
            {numberToWords(vietnameseNumber)}
          </div>

          <div className="pt-4">
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 h-12 text-lg"
              onClick={createDepositTransaction}
              disabled={
                !depositAmount ||
                Number.parseInt(depositAmount) < 1000 ||
                isLoading
              }
            >
              {isLoading ? (
                <>
                  <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                  {t("wallet.deposit.processing")}
                </>
              ) : (
                <>
                  <ArrowDownIcon className="h-5 w-5 mr-2" />
                  {t("wallet.deposit.continue")}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
          {t("wallet.deposit.paymentMethods")}
        </h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700/50">
            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-purple-600 dark:text-purple-400"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {t("wallet.deposit.bankTransfer")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("wallet.deposit.allBanks")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render payment step
  const renderDepositPaymentStep = () => {
    if (!transaction) return null;

    const formattedAmount = formatCurrency(transaction.amount);

    return (
      <div className="space-y-6">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800/30 mb-4">
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              {t("wallet.deposit.amountToPay")}
            </p>
            <p className="text-2xl font-bold text-green-800 dark:text-green-300">
              {formattedAmount}
            </p>
          </div>
        </div>
        <Tabs defaultValue="qr" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="qr">{t("wallet.deposit.qrTab")}</TabsTrigger>
            <TabsTrigger value="manual">
              {t("wallet.deposit.manualTab")}
            </TabsTrigger>
          </TabsList>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="space-y-4 pt-4">
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <Image
                  src={transaction.qrUrl || "/placeholder.svg"}
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="w-[200px] h-[200px]"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {t("wallet.deposit.qrInstruction")}
              </p>
            </div>
          </TabsContent>

          {/* Manual Transfer Tab */}
          <TabsContent value="manual" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("wallet.deposit.accountNumber")}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-green-600 dark:text-green-400"
                    onClick={() =>
                      copyToClipboard(
                        transaction.bankNumber,
                        t("wallet.deposit.accountNumber")
                      )
                    }
                  >
                    <CopyIcon className="h-4 w-4 mr-1" />
                    {t("wallet.deposit.copy")}
                  </Button>
                </div>
                <p className="text-lg font-medium text-gray-800 dark:text-white">
                  {transaction.bankNumber}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("wallet.deposit.bank")}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-green-600 dark:text-green-400"
                    onClick={() =>
                      copyToClipboard(
                        transaction.bankGateway,
                        t("wallet.deposit.bank")
                      )
                    }
                  >
                    <CopyIcon className="h-4 w-4 mr-1" />
                    {t("wallet.deposit.copy")}
                  </Button>
                </div>
                <p className="text-lg font-medium text-gray-800 dark:text-white">
                  {transaction.bankGateway}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("wallet.deposit.transferContent")}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-green-600 dark:text-green-400"
                    onClick={() =>
                      copyToClipboard(
                        transaction.orderDescription,
                        t("wallet.deposit.transferContent")
                      )
                    }
                  >
                    <CopyIcon className="h-4 w-4 mr-1" />
                    {t("wallet.deposit.copy")}
                  </Button>
                </div>
                <p className="text-lg font-medium text-gray-800 dark:text-white">
                  {transaction.orderDescription}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            <span className="font-medium">{t("wallet.deposit.noteTitle")}</span>{" "}
            {t("wallet.deposit.noteContent")}
          </p>
        </div>
      </div>
    );
  };

  // Render result step
  const renderDepositResultStep = () => {
    if (!transaction) return null;

    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center py-6">
          {transactionStatus === "completed" ? (
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <XCircleIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
          )}

          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
            {transactionStatus === "completed"
              ? t("wallet.deposit.result.success")
              : t("wallet.deposit.result.failed")}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            {transactionStatus === "completed"
              ? t("wallet.deposit.result.successDesc", {
                  amount: formatCurrency(transaction.amount),
                })
              : t("wallet.deposit.result.failedDesc")}
          </p>
          {transactionStatus === "completed" && (
            <div className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(transaction.amount)}
            </div>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t("wallet.deposit.transactionId")}
          </h3>
          <p className="text-base font-medium text-gray-800 dark:text-white break-all">
            {transaction.transactionId}
          </p>
        </div>

        <div className="flex justify-between">
          {transactionStatus === "completed" ? (
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
              onClick={finishDepositProcess}
            >
              {t("wallet.deposit.done")}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={finishDepositProcess}
                className="flex-1"
              >
                {t("wallet.deposit.cancel")}
              </Button>
              <Button
                className="flex-1 ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={resetDepositFlow}
              >
                {t("wallet.deposit.retry")}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render the appropriate step
  const renderDepositStep = () => {
    switch (depositStep) {
      case "amount":
        return renderDepositAmountStep();
      case "payment":
        return renderDepositPaymentStep();
      case "result":
        return renderDepositResultStep();
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="h-full border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl dark:shadow-purple-900/20 rounded-xl overflow-hidden flex flex-col">
        <CardHeader className="pb-2 px-6">
          <CardTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400">
            {t("wallet.deposit.title")}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {t("wallet.deposit.description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-4 flex-1 overflow-y-auto">
          {renderDepositStep()}
        </CardContent>
      </Card>
    </>
  );
}
