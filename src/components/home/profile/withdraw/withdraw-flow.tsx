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
import { useToast } from "@/hooks/use-toast";
import { ArrowUpIcon, RefreshCwIcon, CheckCircleIcon } from "lucide-react";
import { numberToWords } from "@/utils/vietnamese-text";

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
  const { toast } = useToast();

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
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số tiền hợp lệ.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedBank) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ngân hàng.",
        variant: "destructive",
      });
      return;
    }

    if (!accountNumber) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số tài khoản.",
        variant: "destructive",
      });
      return;
    }

    if (!accountName) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên chủ tài khoản.",
        variant: "destructive",
      });
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

      toast({
        title: "Rút tiền thành công",
        description: `Số tiền ${new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
        }).format(amount)} đã được rút khỏi ví của bạn`,
        variant: "default",
        className:
          "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/30",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          "Đã xảy ra lỗi khi xử lý yêu cầu rút tiền. Vui lòng thử lại sau.",
        variant: "destructive",
      });
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
            Rút tiền từ ví
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Rút tiền từ ví của bạn về tài khoản ngân hàng
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-4 flex-1 overflow-y-auto">
          <div className="flex flex-col items-center py-12">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <CheckCircleIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>

            <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
              Rút tiền thành công
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
              Yêu cầu rút tiền của bạn đã được xử lý thành công. Số tiền sẽ được
              chuyển vào tài khoản ngân hàng của bạn trong vòng 24 giờ làm việc.
            </p>

            <div className="flex gap-4 w-full max-w-xs">
              <Button variant="outline" className="flex-1" onClick={resetForm}>
                Rút tiền khác
              </Button>

              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={onComplete}
              >
                Hoàn tất
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
          Rút tiền từ ví
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Rút tiền từ ví của bạn về tài khoản ngân hàng
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 py-4 flex-1 overflow-y-auto">
        <div className="space-y-6">
          {/* Withdraw Form */}
          <div className="bg-blue-50/70 dark:bg-blue-900/20 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
              Nhập số tiền cần rút
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="withdrawAmount"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Số tiền (VND)
                </Label>
                <div className="relative">
                  <Input
                    id="withdrawAmount"
                    type="text"
                    placeholder="Nhập số tiền"
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
                  <span className="font-medium">Bằng chữ:</span>{" "}
                  {numberToWords(withdrawAmount)}
                </div>
              )}
            </div>
          </div>

          {/* Bank Account Information */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
              Thông tin tài khoản nhận tiền
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="bank"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Ngân hàng
                </Label>
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger
                    id="bank"
                    className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
                  >
                    <SelectValue placeholder="Chọn ngân hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vcb">Vietcombank</SelectItem>
                    <SelectItem value="tcb">Techcombank</SelectItem>
                    <SelectItem value="bidv">BIDV</SelectItem>
                    <SelectItem value="vtb">VietinBank</SelectItem>
                    <SelectItem value="mb">MB Bank</SelectItem>
                    <SelectItem value="acb">ACB</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="accountNumber"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Số tài khoản
                </Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="Nhập số tài khoản"
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
                  Tên chủ tài khoản
                </Label>
                <Input
                  id="accountName"
                  type="text"
                  placeholder="Nhập tên chủ tài khoản"
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
                Đang xử lý
              </>
            ) : (
              <>
                <ArrowUpIcon className="h-5 w-5 mr-2" />
                Rút tiền
              </>
            )}
          </Button>

          {/* Information Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/30">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-medium">Lưu ý:</span> Yêu cầu rút tiền sẽ
              được xử lý trong vòng 24 giờ làm việc. Phí rút tiền: 0 VND.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
