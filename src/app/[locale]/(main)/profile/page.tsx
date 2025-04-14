"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Image from "next/image";

// UI Components
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Add these imports at the top with the other imports
import { useTopUpMutation } from "@/features/customer-wallet/api";

// Replace the existing toast import with this
import { useToast } from "@/hooks/use-toast";
import PaymentService from "@/hooks/usePaymentStatus";
// Icons
import {
  PencilIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  AtSignIcon,
  UserIcon,
  WalletIcon,
  HomeIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  HistoryIcon,
  RefreshCwIcon,
  CopyIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";

// API and Utilities
import { useGetUserProfileQuery } from "@/features/home/api";
import { cn } from "@/lib/utils";
// Add the import for numberToWords utility
import { numberToWords } from "@/utils/vietnamese-text";
import { IUser } from "@/features/home/types";
import { Transaction as TransactionResponse } from "@/features/customer-wallet/types";
// Types
type TabType = "profile" | "wallet" | "deposit" | "withdraw" | "history";
type DepositStep = "amount" | "payment" | "result";
type TransactionStatus = "pending" | "completed" | "failed" | "expired";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

const mockTransactions: Transaction[] = [
  {
    id: "tx1",
    type: "deposit",
    amount: 500000,
    date: "2023-11-15T10:30:00",
    status: "completed",
  },
  {
    id: "tx2",
    type: "withdrawal",
    amount: 200000,
    date: "2023-11-10T14:45:00",
    status: "completed",
  },
  {
    id: "tx3",
    type: "deposit",
    amount: 1000000,
    date: "2023-10-28T09:15:00",
    status: "completed",
  },
];

const initialProfile: IUser = {
  id: "",
  firstName: "",
  lastName: "",
  fullName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  profilePicture: null,
  city: "",
  district: "",
  ward: "",
  address: "",
  fullAddress: "",
  balance: 0,
};

export default function ProfilePage() {
  // Replace the profile state initialization in the ProfilePage component
  const { toast } = useToast();
  const { data: profileData } = useGetUserProfileQuery();
  const [topUp] = useTopUpMutation();

  // Profile state
  const [profile, setProfile] = useState<IUser>(initialProfile);
  const [formData, setFormData] = useState<IUser>(initialProfile);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // Wallet operations
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  // Deposit flow state
  const [depositStep, setDepositStep] = useState<DepositStep>("amount");
  const [transaction, setTransaction] = useState<TransactionResponse | null>(
    null
  );
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus>("pending");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);

  // Add a new state for Vietnamese number text
  const [vietnameseNumber, setVietnameseNumber] = useState<string>("");

  // Initialize profile data
  useEffect(() => {
    if (profileData) {
      const mergedProfile: IUser = {
        ...initialProfile,
        ...profileData.value,
        city: profileData.value.city || null,
        district: profileData.value.district || null,
        ward: profileData.value.ward || null,
        address: profileData.value.address || null,
      };
      setProfile(mergedProfile);
      setFormData(mergedProfile);
    }
  }, [profileData]);

  // Reset deposit flow when changing tabs
  useEffect(() => {
    if (activeTab === "deposit") {
      resetDepositFlow();
    }
  }, [activeTab]);

  // Profile form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    // Here you would typically send the updated data to your API
    console.log("Saving profile:", formData);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  // Formatting helpers
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (value: string) => {
    const numberValue = Number.parseFloat(value.replace(/[^0-9.-]+/g, ""));
    if (isNaN(numberValue)) return "";
    return numberValue.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // Wallet operations
  const handleWithdraw = () => {
    const amount = Number.parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > (profile.balance || 0)) return;

    // Here you would typically call an API to process the withdrawal
    console.log(`Withdrawing ${amount} VND`);

    // For demo purposes, update the balance directly
    const newBalance = (profile.balance || 0) - amount;
    setProfile((prev) => ({ ...prev, balance: newBalance }));
    setWithdrawAmount("");
  };

  // Deposit flow handlers
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.-]+/g, "");
    setDepositAmount(value);
    setVietnameseNumber(value.toString());
  };

  const handleQuickAmount = (value: number) => {
    setDepositAmount(value.toString());
    setVietnameseNumber(value.toString());
  };

  useEffect(() => {
    // Mở kết nối SignalR khi component được mount
    PaymentService.startConnection();

    // Lắng nghe trạng thái thanh toán
    PaymentService.onPaymentStatusReceived((isSuccess) => {
      if (!transaction) return;

      if (isSuccess) {
        setTransactionStatus("completed");
        setDepositStep("result");

        // Cập nhật số dư ví
        const newBalance = (profile.balance || 0) + (transaction?.amount || 0);
        setProfile((prev) => ({ ...prev, balance: newBalance }));

        toast({
          title: "Nạp tiền thành công",
          description: `Số tiền ${new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
          }).format(transaction.amount)} đã được thêm vào ví của bạn`,
          variant: "default",
          className:
            "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800/30",
        });
      } else {
        setTransactionStatus("failed");
        setDepositStep("result");
        toast({
          title: "Nạp tiền thất bại",
          description:
            "Chúng tôi không nhận được thanh toán của bạn. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    });

    return () => {
      if (transaction) {
        PaymentService.leavePaymentSession(transaction.transactionId);
      }
    };
  }, [transaction]);

  // Add an effect to join payment session when transaction is created
  useEffect(() => {
    if (transaction && depositStep === "payment") {
      // Join the payment session to receive real-time updates
      PaymentService.joinPaymentSession(transaction.transactionId);
    }

    // Clean up when leaving the payment step
    return () => {
      if (transaction && depositStep !== "payment") {
        PaymentService.leavePaymentSession(transaction.transactionId);
      }
    };
  }, [transaction, depositStep]);

  // Replace the checkTransactionStatus function with this real-time version
  const checkTransactionStatus = async () => {
    if (!transaction) return;

    setCheckingStatus(true);

    try {
      // Instead of simulating, we'll manually check once and then rely on SignalR
      // This is a fallback in case the real-time update hasn't been received
      const response = await fetch(
        `/api/wallet/transaction/${transaction.transactionId}`
      );
      const data = await response.json();

      if (data.isSuccess) {
        const status = data.value.status;

        if (status === "completed") {
          setTransactionStatus("completed");
          setDepositStep("result");

          // Update wallet balance
          const newBalance = (profile.balance || 0) + transaction.amount;
          setProfile((prev) => ({ ...prev, balance: newBalance }));

          toast({
            title: "Nạp tiền thành công",
            description: `Số tiền ${new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              minimumFractionDigits: 0,
            }).format(transaction.amount)} đã được thêm vào ví của bạn`,
            variant: "default",
            className:
              "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800/30",
          });
        } else if (status === "failed" || status === "expired") {
          setTransactionStatus("failed");
          setDepositStep("result");
          toast({
            title: "Nạp tiền thất bại",
            description:
              "Chúng tôi không nhận được thanh toán của bạn. Vui lòng thử lại.",
            variant: "destructive",
          });
        } else {
          // Still pending, show a message
          toast({
            title: "Đang chờ thanh toán",
            description:
              "Giao dịch của bạn đang được xử lý. Vui lòng hoàn tất thanh toán.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          "Không thể kiểm tra trạng thái giao dịch. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setCheckingStatus(false);
    }
  };

  // Update the resetDepositFlow function to also leave the payment session
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

  // Add this to the finishDepositProcess function
  const finishDepositProcess = () => {
    if (transaction) {
      PaymentService.leavePaymentSession(transaction.transactionId);
    }

    if (transactionStatus === "completed") {
      setActiveTab("wallet"); // Chuyển sang tab ví
    } else {
      resetDepositFlow(); // Reset nếu giao dịch thất bại
    }
  };

  // Render components
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

  const createDepositTransaction = async () => {
    setIsLoading(true);
    try {
      const amount = Number.parseFloat(depositAmount.replace(/[^0-9.-]+/g, ""));
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập số tiền hợp lệ.",
          variant: "destructive",
        });
        return;
      }

      const response = await topUp({ amount }).unwrap();

      if (response.isSuccess) {
        setTransaction(response.value);
        setDepositStep("payment");
      } else {
        toast({
          title: "Lỗi",
          description:
            "Không thể tạo giao dịch nạp tiền. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi tạo giao dịch. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: `Đã sao chép ${label} vào clipboard`,
    });
  };

  const renderDepositAmountStep = () => (
    <div className="space-y-6">
      {/* Deposit Form */}
      <div className="bg-green-50/70 dark:bg-green-900/20 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">
          Nhập số tiền cần nạp
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="depositAmount"
              className="text-gray-700 dark:text-gray-300"
            >
              Số tiền (VND)
            </Label>
            <div className="relative">
              <Input
                id="depositAmount"
                type="text"
                placeholder="Nhập số tiền"
                value={depositAmount}
                onChange={handleAmountChange}
                className="pl-12 bg-white dark:bg-gray-800 border-green-200 dark:border-green-800/30 focus-visible:ring-green-500 dark:focus-visible:ring-green-400"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400">VND</span>
              </div>
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

          {/* Update the renderDepositAmountStep function to make the Vietnamese text larger */}
          <div className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            <span className="font-medium">Bằng chữ:</span>{" "}
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
                  Đang xử lý
                </>
              ) : (
                <>
                  <ArrowDownIcon className="h-5 w-5 mr-2" />
                  Tiếp tục
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Phương thức thanh toán
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
                Chuyển khoản ngân hàng
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tất cả ngân hàng nội địa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Xóa phần checkTransactionStatus đã cũ
  const renderDepositPaymentStep = () => {
    if (!transaction) return null;

    return (
      <div className="space-y-6">
        <Tabs defaultValue="qr" className="w-full">
          {/* Tabs nội dung */}
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
                Quét mã QR bằng ứng dụng ngân hàng để thanh toán
              </p>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Số tài khoản
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-green-600 dark:text-green-400"
                    onClick={() =>
                      copyToClipboard(transaction.bankNumber, "Số tài khoản")
                    }
                  >
                    <CopyIcon className="h-4 w-4 mr-1" />
                    Sao chép
                  </Button>
                </div>
                <p className="text-lg font-medium text-gray-800 dark:text-white">
                  {transaction.bankNumber}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

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
              ? "Giao dịch hoàn tất"
              : "Giao dịch thất bại"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            {transactionStatus === "completed"
              ? `Số tiền ${new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                }).format(transaction.amount)} đã được thêm vào ví của bạn`
              : "Vui lòng kiểm tra lại thông tin thanh toán và thử lại"}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Mã giao dịch
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
              Hoàn tất
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={finishDepositProcess}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                className="flex-1 ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={resetDepositFlow}
              >
                Thử lại
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-[90vh] overflow-hidden">
      <div className="max-w-6xl mx-auto pt-6 h-[90%]">
        <div className="flex h-full gap-4 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-xl dark:shadow-purple-900/20 p-4 flex flex-col">
            {/* User Profile Summary */}
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-12 w-12 border-2 border-purple-200 dark:border-purple-800">
                <AvatarImage
                  src={profile.profilePicture || ""}
                  alt={profile.fullName}
                />
                <AvatarFallback className="text-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                  {profile.firstName.charAt(0)}
                  {profile.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-gray-800 dark:text-white truncate">
                  {profile.fullName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="bg-purple-50/70 dark:bg-purple-900/20 rounded-lg p-3 mb-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Số dư ví
              </div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                }).format(profile.balance || 0)}
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-0 flex-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeTab === "profile"
                    ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                )}
                onClick={() => setActiveTab("profile")}
              >
                <UserIcon className="h-5 w-5 mr-3" />
                Thông tin cá nhân
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeTab === "wallet"
                    ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                )}
                onClick={() => setActiveTab("wallet")}
              >
                <WalletIcon className="h-5 w-5 mr-3" />
                Ví của tôi
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeTab === "deposit"
                    ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                )}
                onClick={() => setActiveTab("deposit")}
              >
                <ArrowDownIcon className="h-5 w-5 mr-3" />
                Nạp tiền
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeTab === "withdraw"
                    ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                )}
                onClick={() => setActiveTab("withdraw")}
              >
                <ArrowUpIcon className="h-5 w-5 mr-3" />
                Rút tiền
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeTab === "history"
                    ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                )}
                onClick={() => setActiveTab("history")}
              >
                <HistoryIcon className="h-5 w-5 mr-3" />
                Lịch sử giao dịch
              </Button>
            </nav>

            {/* Home Button */}
            <div className="">
              <Button
                variant="outline"
                className="w-full border-purple-200 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Quay lại trang chủ
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <Card className="h-full border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl dark:shadow-purple-900/20 rounded-xl overflow-hidden flex flex-col">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <>
                  <CardHeader className="pb-2 px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400">
                          Thông tin cá nhân
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Xem và quản lý thông tin cá nhân của bạn
                        </CardDescription>
                      </div>
                      {!isEditing ? (
                        <Button
                          onClick={() => setIsEditing(true)}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600"
                        >
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </Button>
                      ) : (
                        <div className="flex gap-3">
                          <Button
                            onClick={handleCancel}
                            variant="outline"
                            className="border-purple-200 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                          >
                            Hủy
                          </Button>
                          <Button
                            onClick={handleSave}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600"
                          >
                            Lưu thay đổi
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 py-4 flex-1 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Personal Information Section */}
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 shadow-sm">
                        <h2 className="text-base font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                          <UserIcon className="h-4 w-4 mr-2" />
                          Thông tin cá nhân
                        </h2>

                        {isEditing ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="firstName"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Tên
                              </Label>
                              <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="bg-white/50 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="lastName"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Họ
                              </Label>
                              <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="bg-white/50 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="dateOfBirth"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Ngày sinh
                              </Label>
                              <Input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                className="bg-white/50 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Họ và tên
                              </h3>
                              <p className="text-lg font-medium text-gray-800 dark:text-white">
                                {profile.fullName}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Ngày sinh
                              </h3>
                              <p className="text-gray-800 dark:text-white flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                {formatDate(profile.dateOfBirth)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Contact Information Section */}
                      <div className="bg-purple-50/70 dark:bg-purple-900/20 rounded-lg p-4 shadow-sm">
                        <h2 className="text-base font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-2" />
                          Thông tin liên hệ
                        </h2>

                        {isEditing ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="email"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Email
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="bg-white/80 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="phone"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Số điện thoại
                              </Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="bg-white/80 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-2">
                              <div className="bg-purple-100 dark:bg-purple-800/30 p-1.5 rounded-full shrink-0">
                                <AtSignIcon className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                                  Email
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm break-all">
                                  {profile.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="bg-purple-100 dark:bg-purple-800/30 p-1.5 rounded-full shrink-0">
                                <PhoneIcon className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                                  Số điện thoại
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                  {profile.phone}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Address Information Section */}
                      <div className="bg-indigo-50/70 dark:bg-indigo-900/20 rounded-lg p-4 shadow-sm">
                        <h2 className="text-base font-semibold text-indigo-800 dark:text-indigo-300 mb-3 flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          Thông tin địa chỉ
                        </h2>

                        {isEditing ? (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-1.5 md:col-span-1">
                              <Label
                                htmlFor="address"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Địa chỉ
                              </Label>
                              <Input
                                id="address"
                                name="address"
                                value={formData.address || ""}
                                onChange={handleInputChange}
                                placeholder="Nhập địa chỉ của bạn"
                                className="bg-white/80 dark:bg-gray-800/50 border-indigo-200 dark:border-indigo-800/30 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                              />
                            </div>
                            <div className="space-y-1.5 md:col-span-1">
                              <Label
                                htmlFor="ward"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Phường/Xã
                              </Label>
                              <Input
                                id="ward"
                                name="ward"
                                value={formData.ward || ""}
                                onChange={handleInputChange}
                                placeholder="Phường/Xã"
                                className="bg-white/80 dark:bg-gray-800/50 border-indigo-200 dark:border-indigo-800/30 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                              />
                            </div>
                            <div className="space-y-1.5 md:col-span-1">
                              <Label
                                htmlFor="district"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Quận/Huyện
                              </Label>
                              <Input
                                id="district"
                                name="district"
                                value={formData.district || ""}
                                onChange={handleInputChange}
                                placeholder="Quận/Huyện"
                                className="bg-white/80 dark:bg-gray-800/50 border-indigo-200 dark:border-indigo-800/30 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                              />
                            </div>
                            <div className="space-y-1.5 md:col-span-1">
                              <Label
                                htmlFor="city"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Thành phố
                              </Label>
                              <Input
                                id="city"
                                name="city"
                                value={formData.city || ""}
                                onChange={handleInputChange}
                                placeholder="Thành phố"
                                className="bg-white/80 dark:bg-gray-800/50 border-indigo-200 dark:border-indigo-800/30 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-start gap-2">
                              <div className="bg-indigo-100 dark:bg-indigo-800/30 p-1.5 rounded-full shrink-0">
                                <MapPinIcon className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                                  Địa chỉ
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                  {profile.address || ""}
                                </p>
                              </div>
                            </div>
                            <div className="md:ml-4">
                              <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                                Khu vực
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {[profile.ward, profile.district, profile.city]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </>
              )}

              {/* Wallet Tab */}
              {activeTab === "wallet" && (
                <>
                  <CardHeader className="pb-2 px-6">
                    <CardTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400">
                      Ví của tôi
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Quản lý ví và xem số dư của bạn
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-6 py-4 flex-1 overflow-y-auto">
                    <div className="space-y-6">
                      {/* Balance Card */}
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-white/90">
                            Số dư hiện tại
                          </h3>
                          <WalletIcon className="h-6 w-6 text-white/80" />
                        </div>
                        <div className="text-3xl font-bold mb-1">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            minimumFractionDigits: 0,
                          }).format(profile.balance || 0)}
                        </div>
                        <p className="text-white/80 text-sm">
                          Cập nhật lần cuối:{" "}
                          {format(new Date(), "dd/MM/yyyy HH:mm")}
                        </p>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          className="h-16 bg-green-500 hover:bg-green-600 text-white shadow-md"
                          onClick={() => setActiveTab("deposit")}
                        >
                          <ArrowDownIcon className="h-5 w-5 mr-2" />
                          Nạp tiền vào ví
                        </Button>
                        <Button
                          className="h-16 bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                          onClick={() => setActiveTab("withdraw")}
                        >
                          <ArrowUpIcon className="h-5 w-5 mr-2" />
                          Rút tiền từ ví
                        </Button>
                      </div>

                      {/* Recent Transactions */}
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Giao dịch gần đây
                          </h3>
                          <Button
                            variant="ghost"
                            className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 h-8 px-2"
                            onClick={() => setActiveTab("history")}
                          >
                            Xem tất cả
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {mockTransactions.slice(0, 3).map((transaction) => (
                            <div
                              key={transaction.id}
                              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700/50 shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-full ${
                                    transaction.type === "deposit"
                                      ? "bg-green-100 dark:bg-green-900/30"
                                      : "bg-blue-100 dark:bg-blue-900/30"
                                  }`}
                                >
                                  {transaction.type === "deposit" ? (
                                    <ArrowDownIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <ArrowUpIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-gray-200">
                                    {transaction.type === "deposit"
                                      ? "Nạp tiền"
                                      : "Rút tiền"}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {format(
                                      new Date(transaction.date),
                                      "dd/MM/yyyy HH:mm"
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div
                                className={`font-semibold ${
                                  transaction.type === "deposit"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-blue-600 dark:text-blue-400"
                                }`}
                              >
                                {transaction.type === "deposit" ? "+" : "-"}
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                  minimumFractionDigits: 0,
                                }).format(transaction.amount)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}

              {/* Deposit Tab */}
              {activeTab === "deposit" && (
                <>
                  <CardHeader className="pb-2 px-6">
                    <CardTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400">
                      Nạp tiền vào ví
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Nạp tiền vào ví của bạn để sử dụng các dịch vụ
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-6 py-4 flex-1 overflow-y-auto">
                    {renderDepositStep()}
                  </CardContent>
                </>
              )}

              {/* Withdraw Tab */}
              {activeTab === "withdraw" && (
                <>
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
                                type="number"
                                placeholder="Nhập số tiền"
                                value={withdrawAmount}
                                onChange={(e) =>
                                  setWithdrawAmount(e.target.value)
                                }
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
                                onClick={() =>
                                  setWithdrawAmount(amount.toString())
                                }
                                disabled={amount > (profile.balance || 0)}
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
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Bằng chữ:</span>{" "}
                              {numberToWords(withdrawAmount)}
                            </div>
                          )}

                          <div className="pt-4">
                            <Button
                              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 h-12 text-lg"
                              onClick={handleWithdraw}
                              disabled={
                                !withdrawAmount ||
                                Number.parseFloat(withdrawAmount) <= 0 ||
                                Number.parseFloat(withdrawAmount) >
                                  (profile.balance || 0)
                              }
                            >
                              <ArrowUpIcon className="h-5 w-5 mr-2" />
                              Rút tiền
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Bank Account */}
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 shadow-sm">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          Tài khoản ngân hàng
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700/50">
                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                              >
                                <rect
                                  width="20"
                                  height="14"
                                  x="2"
                                  y="5"
                                  rx="2"
                                />
                                <line x1="2" x2="22" y1="10" y2="10" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                Vietcombank
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                **** **** **** 1234
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 dark:text-blue-400"
                            >
                              Thay đổi
                            </Button>
                          </div>

                          <Button variant="outline" className="w-full">
                            + Thêm tài khoản ngân hàng mới
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}

              {/* Transaction History Tab */}
              {activeTab === "history" && (
                <>
                  <CardHeader className="pb-2 px-6">
                    <CardTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400">
                      Lịch sử giao dịch
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Xem lịch sử giao dịch của ví
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-6 py-4 flex-1 overflow-y-auto">
                    <div className="space-y-6">
                      {/* Filters */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          className="bg-purple-100/50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/30 text-purple-700 dark:text-purple-400"
                        >
                          Tất cả
                        </Button>
                        <Button
                          variant="outline"
                          className="border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400"
                        >
                          Nạp tiền
                        </Button>
                        <Button
                          variant="outline"
                          className="border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-400"
                        >
                          Rút tiền
                        </Button>
                      </div>

                      {/* Transactions List */}
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700/50">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                            Tất cả giao dịch
                          </h3>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                          {mockTransactions.map((transaction) => (
                            <div
                              key={transaction.id}
                              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-full ${
                                    transaction.type === "deposit"
                                      ? "bg-green-100 dark:bg-green-900/30"
                                      : "bg-blue-100 dark:bg-blue-900/30"
                                  }`}
                                >
                                  {transaction.type === "deposit" ? (
                                    <ArrowDownIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <ArrowUpIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-gray-200">
                                    {transaction.type === "deposit"
                                      ? "Nạp tiền vào ví"
                                      : "Rút tiền từ ví"}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {format(
                                      new Date(transaction.date),
                                      "dd/MM/yyyy HH:mm"
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p
                                  className={`font-semibold text-right ${
                                    transaction.type === "deposit"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-blue-600 dark:text-blue-400"
                                  }`}
                                >
                                  {transaction.type === "deposit" ? "+" : "-"}
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                    minimumFractionDigits: 0,
                                  }).format(transaction.amount)}
                                </p>
                                <p className="text-xs text-right text-gray-500 dark:text-gray-400">
                                  {transaction.status === "completed"
                                    ? "Hoàn thành"
                                    : "Đang xử lý"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
