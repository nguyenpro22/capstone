"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  CreditCard,
  Wallet,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  User,
  Stethoscope,
  Building,
  Clock,
  Phone,
  Mail,
  Percent,
  Receipt,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useCreateOrderPaymentMutation } from "@/features/payment/api";
import { useGetUserBalanceQuery } from "@/features/user/api";

import type { CustomerSchedule } from "@/features/customer-schedule/types";
import PaymentService from "@/hooks/usePaymentStatus";
import { useUpdateScheduleStatusMutation } from "@/features/customer-schedule/api";
import { useGenerateSchedulesMutation } from "@/features/customer-schedule/api";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";

interface SchedulePaymentModalProps {
  schedule: CustomerSchedule | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SchedulePaymentModal({
  schedule,
  isOpen,
  onClose,
  onSuccess,
}: SchedulePaymentModalProps) {
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [useWalletBalance, setUseWalletBalance] = useState<boolean | null>(
    null
  );
  const [showBalanceConfirmation, setShowBalanceConfirmation] =
    useState<boolean>(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("qr");
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const [createOrderPayment, { isLoading }] = useCreateOrderPaymentMutation();
  const router = useRouter();
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showPaymentResult, setShowPaymentResult] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    amount: number | null;
    timestamp: string | null;
    message: string | null;
  }>({
    amount: null,
    timestamp: null,
    message: null,
  });
  const [updateScheduleStatus, { isLoading: isUpdatingStatus }] =
    useUpdateScheduleStatusMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(30);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [generateSchedules, { isLoading: isGeneratingSchedules }] =
    useGenerateSchedulesMutation();
  const t = useTranslations("customerSchedule");
  // Track the remaining amount to pay (after deducting wallet balance)
  const [remainingAmount, setRemainingAmount] = useState<number | null>(null);
  // Track the current schedule ID to detect changes
  const [currentScheduleId, setCurrentScheduleId] = useState<string | null>(
    null
  );

  const {
    data: balanceData,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useGetUserBalanceQuery(schedule?.userId || "", {
    skip: !schedule?.userId,
  });

  // Reset all payment states when the modal is closed
  const resetAllStates = () => {
    setWalletBalance(null);
    setUseWalletBalance(null);
    setShowBalanceConfirmation(false);
    setShowPaymentMethods(false);
    setPaymentMethod("qr");
    setPaymentStatus("idle");
    setQrUrl(null);
    setTransactionId(null);
    setShowQR(false);
    setShowPaymentResult(false);
    setPaymentDetails({
      amount: null,
      timestamp: null,
      message: null,
    });
    setErrorMessage(null);
    setCountdown(30);
    setIsTimedOut(false);
    setRemainingAmount(null);
  };

  // Reset states when schedule changes
  useEffect(() => {
    if (schedule?.id && schedule.id !== currentScheduleId) {
      setCurrentScheduleId(schedule.id);
      resetAllStates();
    }
  }, [schedule, currentScheduleId]);

  // Reset states when modal is opened
  useEffect(() => {
    if (isOpen) {
      resetAllStates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!transactionId) return;

    const setupConnection = async () => {
      try {
        await PaymentService.startConnection();
        await PaymentService.joinPaymentSession(transactionId);

        // Set up the payment status listener
        PaymentService.onPaymentStatusReceived(
          (
            status: boolean,
            details?: {
              amount?: number;
              timestamp?: string;
              message?: string;
            }
          ) => {
            setPaymentStatus(status ? "success" : "failed");

            // Store payment details if available
            if (details) {
              setPaymentDetails({
                amount: details.amount || null,
                timestamp: details.timestamp || new Date().toISOString(),
                message: details.message || null,
              });
            }

            // If payment is successful, show success message and update schedule status
            if (status) {
              toast.success("Payment successful!");
              // Close the QR dialog and show payment result
              setShowQR(false);
              setShowPaymentMethods(false); // Add this line to hide payment methods
              setShowBalanceConfirmation(false); // Add this line to hide balance confirmation
              setShowPaymentResult(true);
              if (onSuccess) {
                onSuccess();
              }
              // Update schedule status to Completed
              if (schedule && schedule.id) {
                updateScheduleStatus({
                  scheduleId: schedule.id,
                  status: "Completed",
                })
                  .unwrap()
                  .then(() => {
                    console.log("Schedule status updated to Completed");

                    // Generate follow-up schedules after successful payment
                    if (schedule.id) {
                      generateSchedules(schedule.id)
                        .unwrap()
                        .then(() => {
                          console.log(
                            "Follow-up schedules generated successfully"
                          );
                        })
                        .catch((error) => {
                          console.error(
                            "Failed to generate follow-up schedules:",
                            error
                          );
                        });
                    }

                    if (onSuccess) {
                      onSuccess();
                    }
                  })
                  .catch((error: any) => {
                    console.error("Failed to update schedule status:", error);
                    // Extract error detail if available
                    const errorDetail =
                      error?.data?.detail || "Failed to update schedule status";
                    setErrorMessage(errorDetail);

                    // If the error is "Order already completed", we can still show success
                    if (errorDetail.includes("already completed")) {
                      toast.info("This order was already marked as completed");

                      // Automatically close the modal after 2 seconds even if already completed
                      setTimeout(() => {
                        onClose();
                        router.push("/schedules");
                      }, 2000);
                    } else {
                      toast.error(errorDetail);
                    }
                  });
              }
            } else {
              const errorMsg =
                details?.message || "Payment failed. Please try again.";
              setErrorMessage(errorMsg);
              toast.error(errorMsg);
              // Show payment result with failure details
              setShowQR(false);
              setShowPaymentMethods(false); // Add this line to hide payment methods
              setShowBalanceConfirmation(false); // Add this line to hide balance confirmation
              setShowPaymentResult(true);
            }
          }
        );
      } catch (error) {
        console.error("Failed to set up SignalR connection:", error);
        toast.error("Failed to connect to payment service");
      }
    };

    setupConnection();

    // Clean up the connection when component unmounts
    return () => {
      if (transactionId) {
        PaymentService.leavePaymentSession(transactionId);
      }
    };
  }, [
    transactionId,
    schedule,
    updateScheduleStatus,
    onClose,
    router,
    generateSchedules,
    onSuccess,
  ]);

  // Keep the countdown effect, but simplify it to use the existing method:
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showQR && transactionId && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    // When countdown reaches 0, cancel the payment session
    if (countdown === 0 && !isTimedOut && transactionId) {
      setIsTimedOut(true);

      // Call the existing method to cancel payment session
      PaymentService.onCancelPaymentSession(transactionId)
        .then(() => {
          toast.warning("Payment session expired. Please try again.");
          setShowQR(false);
          setPaymentStatus("failed");
          setShowPaymentResult(true);
          setErrorMessage("Payment session expired. Please try again.");
        })
        .catch((error) => {
          console.error("Failed to cancel payment session:", error);
        });
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, showQR, transactionId, isTimedOut]);

  // Calculate remaining amount when wallet balance or useWalletBalance changes
  useEffect(() => {
    if (schedule && useWalletBalance && walletBalance) {
      const totalAmount = schedule.amount || 0;
      const balance = Number.parseFloat(walletBalance);

      if (balance < totalAmount) {
        setRemainingAmount(totalAmount - balance);
      } else {
        setRemainingAmount(0);
      }
    } else {
      setRemainingAmount(null);
    }
  }, [walletBalance, useWalletBalance, schedule]);

  if (!schedule) return null;

  const formatPrice = (price: number) => {
    // Nếu giá trị là 0, trả về "0 đ" thay vì "0 đ" hoặc "-0 đ"
    if (price === 0) return "0 đ";

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      signDisplay: "auto",
    }).format(price);
  };

  // Format time from hh:mm:ss to hh:mm
  const formatTime = (time: string) => {
    if (!time) return "";
    // Check if time has seconds (hh:mm:ss format)
    if (time.split(":").length === 3) {
      // Return only hours and minutes
      return time.split(":").slice(0, 2).join(":");
    }
    return time;
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = () => {
    if (!schedule.servicePrice || !schedule.discountAmount) return 0;
    return Math.round((schedule.discountAmount / schedule.servicePrice) * 100);
  };

  const handleProceedToPayment = async () => {
    if (!schedule || !schedule.userId) return;

    setPaymentStatus("processing");

    try {
      // Fetch the latest balance
      await refetchBalance().unwrap();

      if (balanceData?.isSuccess && balanceData?.value) {
        setWalletBalance(balanceData.value);
        setShowBalanceConfirmation(true);
        setPaymentStatus("idle");
      } else {
        // If we can't get the balance, proceed directly to payment methods
        setShowPaymentMethods(true);
        setPaymentStatus("idle");
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      // If balance fetch fails, still allow payment methods
      setShowPaymentMethods(true);
      setPaymentStatus("idle");
    }
  };

  const handlePayment = async () => {
    if (!schedule) return;

    try {
      setPaymentStatus("processing");
      setErrorMessage(null);

      // For cash payments, skip the payment API call and directly update the status
      if (paymentMethod === "cash") {
        // Show success immediately for cash payments
        setPaymentStatus("success");
        setShowPaymentResult(true);
        setShowQR(false);
        setShowPaymentMethods(false);
        setShowBalanceConfirmation(false);
        toast.success("Cash payment recorded successfully!");

        // Update schedule status to Completed for cash payments
        if (schedule && schedule.id) {
          try {
            await updateScheduleStatus({
              scheduleId: schedule.id,
              status: "Completed",
            }).unwrap();
            console.log("Schedule status updated to Completed");

            // Generate follow-up schedules for cash payments
            if (schedule.id) {
              try {
                await generateSchedules(schedule.id).unwrap();
                console.log("Follow-up schedules generated successfully");
              } catch (error) {
                console.error("Failed to generate follow-up schedules:", error);
              }
            }

            // Refetch data to update UI with latest status
            if (onSuccess) {
              onSuccess(); // This should trigger any parent component refetches
            }

            // Automatically close the modal after 2 seconds for cash payments
            setTimeout(() => {
              onClose();
              router.push("/clinicStaff/customer-schedule");
            }, 2000);
          } catch (error: any) {
            console.error("Failed to update schedule status:", error);
            // Extract error detail if available
            const errorDetail =
              error?.data?.detail || "Failed to update schedule status";
            setErrorMessage(errorDetail);

            // If the error is "Order already completed", we can still show success
            if (errorDetail.includes("already completed")) {
              toast.info("This order was already marked as completed");

              // Automatically close the modal after 2 seconds even if already completed
              setTimeout(() => {
                onClose();
                router.push("/schedules");
              }, 2000);
            } else {
              toast.error(errorDetail);
              setPaymentStatus("failed");
              setShowPaymentResult(true);
            }
          }
        }
        return;
      }

      // For other payment methods, continue with the existing flow
      // Use the amount field which is the total amount to be paid
      const amount = schedule.amount || 100000; // Default amount if not available

      // IMPORTANT: Force isDeductFromCustomerBalance to true when useWalletBalance is true
      // This is a workaround for the state timing issue
      const currentUseWalletBalance = useWalletBalance;
      const isDeductFromCustomerBalance = currentUseWalletBalance === true;

      // Debug log to verify the value
      console.log("Current useWalletBalance state:", currentUseWalletBalance);
      console.log("isDeductFromCustomerBalance:", isDeductFromCustomerBalance);

      // IMPORTANT: If using wallet balance, set paymentMethod to "balance"
      // Otherwise, use the selected payment method
      const effectivePaymentMethod =
        currentUseWalletBalance === true ? "balance" : paymentMethod;

      // Debug log for payment method
      console.log("effectivePaymentMethod:", effectivePaymentMethod);

      // Calculate the amount to be paid via the selected payment method
      // If using wallet balance and it's insufficient, use the remaining amount
      // Otherwise, use the full amount
      const amountToPay =
        currentUseWalletBalance === true &&
        walletBalance &&
        Number.parseFloat(walletBalance) < amount &&
        remainingAmount !== null
          ? remainingAmount
          : amount;

      console.log("Amount to pay:", amountToPay);

      // Make sure isDeductFromCustomerBalance is always true when useWalletBalance is true
      const paymentParams = {
        orderId: schedule.orderId,
        paymentMethod: effectivePaymentMethod,
        // Force to true if we know the user selected to use wallet balance
        isDeductFromCustomerBalance: currentUseWalletBalance === true,
        // Add the amount to pay if it's different from the total amount
        amount: amountToPay !== amount ? amountToPay : undefined,
      };

      console.log("Payment params:", paymentParams);

      const result = await createOrderPayment(paymentParams).unwrap();

      if (result.isSuccess && result.value.qrUrl) {
        setQrUrl(result.value.qrUrl);

        // Store the transaction ID for SignalR connection
        if (result.value.transactionId) {
          setTransactionId(result.value.transactionId);
        }

        setShowQR(true);
        setShowPaymentMethods(false); // Add this line to ensure payment methods are hidden
        setCountdown(59); // Reset countdown to 59 seconds
        setIsTimedOut(false);
      } else if (effectivePaymentMethod === "balance") {
        // For wallet payments, show success immediately
        setPaymentStatus("success");
        setShowPaymentResult(true);
        setShowQR(false); // Add this line to ensure QR is hidden
        setShowPaymentMethods(false); // Add this line to ensure payment methods are hidden
        setShowBalanceConfirmation(false); // Add this line to ensure balance confirmation is hidden
        toast.success("Wallet payment successful!");

        // Update schedule status to Completed for wallet payments
        if (schedule && schedule.id) {
          try {
            await updateScheduleStatus({
              scheduleId: schedule.id,
              status: "Completed",
            }).unwrap();
            console.log("Schedule status updated to Completed");

            // Generate follow-up schedules for wallet payments
            if (schedule.id) {
              try {
                await generateSchedules(schedule.id).unwrap();
                console.log("Follow-up schedules generated successfully");
              } catch (error) {
                console.error("Failed to generate follow-up schedules:", error);
              }
            }

            // Refetch data to update UI with latest status
            if (onSuccess) {
              onSuccess(); // This should trigger any parent component refetches
            }

            // If there are any specific queries that need refetching, do it here
            try {
              // Refetch balance to show updated wallet amount
              refetchBalance();
            } catch (error) {
              console.error("Failed to refetch data:", error);
            }

            // Automatically close the modal after 2 seconds for wallet payments
            setTimeout(() => {
              onClose();
              router.push("/clinicStaff/customer-schedule");
            }, 2000);
          } catch (error: any) {
            console.error("Failed to update schedule status:", error);
            // Extract error detail if available
            const errorDetail =
              error?.data?.detail || "Failed to update schedule status";
            setErrorMessage(errorDetail);

            // If the error is "Order already completed", we can still show success
            if (errorDetail.includes("already completed")) {
              toast.info("This order was already marked as completed");

              // Automatically close the modal after 2 seconds even if already completed
              setTimeout(() => {
                onClose();
                router.push("/schedules");
              }, 2000);
            } else {
              toast.error(errorDetail);
            }
          }
        }
      } else {
        setPaymentStatus("failed");
        setShowPaymentResult(true);
        setErrorMessage("Failed to generate payment QR code");
        toast.error("Failed to generate payment QR code");
      }
    } catch (error: any) {
      console.error("Payment failed:", error);
      setPaymentStatus("failed");
      setShowPaymentResult(true);

      // Extract error detail if available
      const errorDetail =
        error?.data?.detail || "Payment failed. Please try again.";
      setErrorMessage(errorDetail);
      toast.error(errorDetail);
    }
  };

  const handleRetry = () => {
    resetAllStates();
  };

  // Get status badge with updated colors
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            {t("completed")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            {t("pending")}
          </Badge>
        );
      case "in progress":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            {t("inProgress")}
          </Badge>
        );
      case "uncompleted":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            {t("uncompleted")}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Modified to ensure state is updated before proceeding
  const handleWalletBalanceChoice = (useBalance: boolean) => {
    // Explicitly set useWalletBalance to true or false (not null)
    setUseWalletBalance(useBalance);
    console.log("Setting useWalletBalance to:", useBalance);

    setShowBalanceConfirmation(false);

    if (useBalance) {
      // Calculate remaining amount if wallet balance is insufficient
      if (walletBalance) {
        const totalAmount = schedule.amount || 0;
        const balance = Number.parseFloat(walletBalance);

        if (balance < totalAmount) {
          setRemainingAmount(totalAmount - balance);
        } else {
          setRemainingAmount(0);
        }
      }

      // If balance is sufficient, proceed directly with payment
      if (
        walletBalance &&
        Number.parseFloat(walletBalance) >= (schedule?.amount || 0)
      ) {
        // Instead of calling handlePayment directly, use a timeout to ensure state is updated
        setTimeout(() => {
          // Create a direct payment with wallet balance
          handleDirectWalletPayment(useBalance);
        }, 0);
      } else {
        // If balance is insufficient but user wants to use it, show payment methods for remaining amount
        setShowPaymentMethods(true);
      }
    } else {
      // If user doesn't want to use wallet, show payment methods
      setShowPaymentMethods(true);
    }
  };

  // New function to handle direct wallet payments
  const handleDirectWalletPayment = (useWalletBalanceValue: boolean) => {
    if (!schedule) return;

    try {
      setPaymentStatus("processing");
      setErrorMessage(null);

      // Use the amount field which is the total amount to be paid
      const amount = schedule.amount || 100000; // Default amount if not available

      // IMPORTANT: Always use the passed value, not the state
      const isDeductFromCustomerBalance = useWalletBalanceValue;

      console.log(
        "Direct payment - useWalletBalanceValue:",
        useWalletBalanceValue
      );
      console.log(
        "Direct payment - isDeductFromCustomerBalance:",
        isDeductFromCustomerBalance
      );

      // IMPORTANT: For wallet payments, use "balance" as payment method
      const effectivePaymentMethod = "balance";

      console.log(
        "Direct payment - effectivePaymentMethod:",
        effectivePaymentMethod
      );

      // Make sure isDeductFromCustomerBalance is always true for wallet payments
      const paymentParams = {
        orderId: schedule.orderId,
        paymentMethod: effectivePaymentMethod,
        isDeductFromCustomerBalance: true, // Force to true for direct wallet payments
      };

      console.log("Direct payment - Payment params:", paymentParams);

      createOrderPayment(paymentParams)
        .unwrap()
        .then((result) => {
          // For wallet payments, show success immediately
          setPaymentStatus("success");
          setShowPaymentResult(true);
          setShowQR(false); // Add this line to ensure QR is hidden
          setShowPaymentMethods(false); // Add this line to ensure payment methods are hidden
          setShowBalanceConfirmation(false); // Add this line to ensure balance confirmation is hidden
          toast.success("Wallet payment successful!");

          // Update schedule status to Completed
          if (schedule && schedule.id) {
            updateScheduleStatus({
              scheduleId: schedule.id,
              status: "Completed",
            })
              .unwrap()
              .then(() => {
                console.log("Schedule status updated to Completed");

                // Generate follow-up schedules
                if (schedule.id) {
                  generateSchedules(schedule.id)
                    .unwrap()
                    .then(() => {
                      console.log("Follow-up schedules generated successfully");
                    })
                    .catch((error) => {
                      console.error(
                        "Failed to generate follow-up schedules:",
                        error
                      );
                    });
                }

                // Refetch data to update UI with latest status
                if (onSuccess) {
                  onSuccess(); // This should trigger any parent component refetches
                }

                // If there are any specific queries that need refetching, do it here
                try {
                  // Refetch balance to show updated wallet amount
                  refetchBalance();
                } catch (error) {
                  console.error("Failed to refetch data:", error);
                }

                // Automatically close the modal after 2 seconds
                setTimeout(() => {
                  onClose();
                  router.push("/clinicStaff/customer-schedule");
                }, 2000);
              })
              .catch((error: any) => {
                console.error("Failed to update schedule status:", error);
                // Extract error detail if available
                const errorDetail =
                  error?.data?.detail || "Failed to update schedule status";
                setErrorMessage(errorDetail);

                // If the error is "Order already completed", we can still show success
                if (errorDetail.includes("already completed")) {
                  toast.info("This order was already marked as completed");

                  // Automatically close the modal after 2 seconds even if already completed
                  setTimeout(() => {
                    onClose();
                    router.push("/schedules");
                  }, 2000);
                } else {
                  toast.error(errorDetail);
                }
              });
          }
        })
        .catch((error: any) => {
          console.error("Payment failed:", error);
          setPaymentStatus("failed");
          setShowPaymentResult(true);

          // Extract error detail if available
          const errorDetail =
            error?.data?.detail || "Payment failed. Please try again.";
          setErrorMessage(errorDetail);
          toast.error(errorDetail);
        });
    } catch (error: any) {
      console.error("Payment failed:", error);
      setPaymentStatus("failed");
      setShowPaymentResult(true);

      // Extract error detail if available
      const errorDetail =
        error?.data?.detail || "Payment failed. Please try again.";
      setErrorMessage(errorDetail);
      toast.error(errorDetail);
    }
  };

  // Handle going back to previous screen
  const handleGoBack = () => {
    if (showPaymentMethods) {
      // Go back to wallet balance confirmation
      setShowPaymentMethods(false);
      setShowBalanceConfirmation(true);
      setUseWalletBalance(null);
      setRemainingAmount(null);
    } else if (showBalanceConfirmation) {
      // Go back to initial screen
      setShowBalanceConfirmation(false);
      setWalletBalance(null);
      setRemainingAmount(null);
    } else if (showQR) {
      // Go back to payment methods
      setShowQR(false);
      setShowPaymentMethods(true);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // When closing the dialog, leave the payment session and reset all states
          if (transactionId) {
            PaymentService.leavePaymentSession(transactionId);
          }
          resetAllStates();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-serif">
            {t("schedulePayment")}
          </DialogTitle>
          <DialogDescription>
            {t("completePaymentForService")}
          </DialogDescription>
        </DialogHeader>

        {/* Only show payment details and proceed button if payment is not successful */}
        {paymentStatus !== "success" &&
          paymentStatus === "idle" &&
          !showQR &&
          !showPaymentResult &&
          !showBalanceConfirmation &&
          !showPaymentMethods && (
            <>
              <div className="overflow-y-auto pr-1 max-h-[60vh]">
                <div className="space-y-4">
                  {/* Booking ID */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {t("bookingId")}:
                      </span>
                      <span className="text-sm text-gray-600">
                        {schedule.id}
                      </span>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-none">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-pink-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">
                            {t("customer")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {schedule.customerName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-pink-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">
                            {t("phone")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {schedule.customerPhoneNumber || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-pink-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">
                            {t("email")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {schedule.customerEmail || "N/A"}
                          </p>
                        </div>
                      </div>

                      <Separator className="my-1" />

                      <div className="flex items-start gap-3">
                        <Stethoscope className="h-5 w-5 text-pink-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">
                            {t("service")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {schedule.serviceName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Tag className="h-5 w-5 text-pink-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">
                            {t("serviceType")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {schedule.procedureName || ""} -{" "}
                            {schedule.procedurePriceTypeName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Building className="h-5 w-5 text-pink-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">
                            {t("doctor")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {schedule.doctorName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-pink-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">
                            {t("dateAndTime")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {schedule.bookingDate},{" "}
                            {formatTimeRange(
                              schedule.startTime,
                              schedule.endTime
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        {getStatusBadge(schedule.status)}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Amount */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-700 mb-3">
                      {t("priceInformation")}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {t("servicePrice")}
                        </span>
                        <span className="font-medium">
                          {formatPrice(schedule.servicePrice || 0)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">{t("discount")}</span>
                          <Percent className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            ({calculateDiscountPercentage()}%)
                          </span>
                        </div>
                        <span className="font-medium text-red-500">
                          {schedule.discountAmount > 0 ? "-" : ""}
                          {formatPrice(schedule.discountAmount || 0)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t("deposit")}</span>
                        <span className="font-medium text-blue-500">
                          {schedule.depositAmount > 0 ? "-" : ""}
                          {formatPrice(schedule.depositAmount || 0)}
                        </span>
                      </div>

                      <Separator className="my-2" />

                      <div className="flex justify-between items-center pt-1">
                        <span className="text-gray-700 font-medium">
                          {t("totalAmount")}
                        </span>
                        <span className="text-xl font-bold text-pink-700">
                          {formatPrice(schedule.amount || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-4 pt-2 border-t">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleProceedToPayment}
                  disabled={isLoading || isLoadingBalance}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  {isLoading || isLoadingBalance ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      {t("processing")}
                    </>
                  ) : (
                    <>
                      {t("proceedToPayment")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}

        {/* Wallet Balance Confirmation */}
        {showBalanceConfirmation && walletBalance && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <div className="text-center">
                <Wallet className="h-12 w-12 text-pink-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium">{t("walletBalance")}</h3>
                <p className="text-2xl font-bold text-pink-700 mt-2">
                  {formatPrice(Number.parseFloat(walletBalance))}
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <p className="text-center text-gray-700">
                  {Number.parseFloat(walletBalance) >= (schedule?.amount || 0)
                    ? t("sufficientBalanceMessage") ||
                      "Your wallet balance is sufficient to cover this payment. Would you like to use your wallet balance?"
                    : t("insufficientBalanceMessage") ||
                      "Your wallet balance is insufficient to cover the full amount. Would you like to use your available balance and pay the remaining amount?"}
                </p>

                {Number.parseFloat(walletBalance) < (schedule?.amount || 0) && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>{t("walletAmount") || "Wallet Amount"}</span>
                      <span className="font-medium">
                        {formatPrice(Number.parseFloat(walletBalance))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span>{t("remainingAmount") || "Remaining Amount"}</span>
                      <span className="font-medium">
                        {formatPrice(
                          (schedule?.amount || 0) -
                            Number.parseFloat(walletBalance)
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => handleWalletBalanceChoice(false)}
                className="flex-1"
              >
                {t("payWithoutWallet") || "No, Pay Without Wallet"}
              </Button>
              <Button
                onClick={() => handleWalletBalanceChoice(true)}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {Number.parseFloat(walletBalance) >= (schedule?.amount || 0)
                  ? t("useWalletBalance") || "Yes, Use Wallet Balance"
                  : t("usePartialWalletBalance") ||
                    "Yes, Use Partial Wallet Balance"}
              </Button>
            </div>
          </div>
        )}

        {/* Payment Method Selection - Only shown after wallet balance decision if needed */}
        {showPaymentMethods && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-medium text-gray-700 mb-3">
                {t("selectPaymentMethod")}
              </h3>

              {useWalletBalance &&
                walletBalance &&
                Number.parseFloat(walletBalance) < (schedule?.amount || 0) && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700">
                      {t("partialWalletPaymentInfo", {
                        walletAmount: formatPrice(
                          Number.parseFloat(walletBalance)
                        ),
                        remainingAmount: formatPrice(
                          (schedule?.amount || 0) -
                            Number.parseFloat(walletBalance)
                        ),
                      }) ||
                        `${formatPrice(
                          Number.parseFloat(walletBalance)
                        )} will be deducted from your wallet. Please select a payment method for the remaining ${formatPrice(
                          (schedule?.amount || 0) -
                            Number.parseFloat(walletBalance)
                        )}.`}
                    </p>
                  </div>
                )}

              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="qr" id="qr" className="peer sr-only" />
                  <Label
                    htmlFor="qr"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-pink-500 [&:has([data-state=checked])]:border-pink-500"
                  >
                    <CreditCard className="mb-3 h-6 w-6 text-pink-500" />
                    QR
                  </Label>
                </div>

                <div>
                  <RadioGroupItem
                    value="cash"
                    id="cash"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="cash"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-pink-500 [&:has([data-state=checked])]:border-pink-500"
                  >
                    <Wallet className="mb-3 h-6 w-6 text-pink-500" />
                    Cash
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Added back button */}
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("back") || "Back"}
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {t("processing")}
                  </>
                ) : (
                  <>
                    {t("confirmPayment") || "Confirm Payment"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* QR Code Display */}
        {showQR && (
          <div className="flex flex-col items-center p-2 max-h-[70vh] overflow-y-auto">
            <div className="text-center mb-2">
              <h3 className="text-lg font-medium">{t("paymentQRCode")}</h3>
              <p className="text-sm text-gray-500">
                {t("scanQRCodeToComplete")}
              </p>
            </div>

            {qrUrl ? (
              <div className="relative w-56 h-56 mb-3">
                <Image
                  src={qrUrl || "/placeholder.svg"}
                  alt="Payment QR Code"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="w-56 h-56 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg mb-3 flex items-center justify-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-center px-4">
                  {t("loadingQRCode")}
                </p>
              </div>
            )}

            <div className="text-center space-y-1">
              {/* Display the remaining amount if using wallet balance, otherwise show full amount */}
              <p className="font-semibold text-lg text-gray-900">
                {remainingAmount !== null && useWalletBalance
                  ? formatPrice(remainingAmount)
                  : formatPrice(schedule.amount || 0)}
              </p>
              <p className="text-xs text-gray-500">{t("scanWithBankingApp")}</p>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-1">
                <Clock className="h-3 w-3" />
                <span
                  className={countdown <= 10 ? "text-red-500 font-bold" : ""}
                >
                  {t("qrCodeExpiresIn")} {countdown} {t("seconds")}
                </span>
              </div>

              {/* Payment Status Indicator */}
              <div className="mt-1">
                <div className="flex items-center justify-center gap-1 text-amber-500">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span className="text-xs">{t("waitingForPayment")}</span>
                </div>
              </div>
            </div>

            {/* Added back button for QR screen */}
            <Button variant="outline" onClick={handleGoBack} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("back") || "Back"}
            </Button>
          </div>
        )}

        {/* Payment Result Display */}
        {showPaymentResult && (
          <div className="flex flex-col items-center p-4">
            {paymentStatus === "success" ? (
              <Card className="w-full bg-green-50 border-green-100">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold text-green-700 mb-2">
                      {t("paymentSuccessful")}
                    </h3>
                    <p className="text-green-600 mb-4">
                      {t("yourPaymentOf")}{" "}
                      {paymentDetails.amount
                        ? formatPrice(paymentDetails.amount)
                        : formatPrice(schedule.amount || 0)}{" "}
                      {t("hasBeenProcessedSuccessfully")}
                    </p>
                    {paymentDetails.timestamp && (
                      <p className="text-sm text-green-600 mb-4">
                        {t("transactionTime")}{" "}
                        {new Date(paymentDetails.timestamp).toLocaleString()}
                      </p>
                    )}
                    <div className="mt-4">
                      <Button
                        onClick={onClose}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      >
                        {t("close")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full bg-red-50 border-red-100">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                    <h3 className="text-xl font-semibold text-red-700 mb-2">
                      {t("paymentFailed")}
                    </h3>
                    <p className="text-red-600 mb-4">
                      {errorMessage ||
                        paymentDetails.message ||
                        t("couldntProcessPayment")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                      <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1"
                      >
                        {t("close")}
                      </Button>
                      <Button
                        onClick={handleRetry}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      >
                        {t("tryAgain")} <RefreshCw className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {paymentStatus === "processing" && !showQR && !showPaymentResult && (
          <div className="flex flex-col items-center justify-center py-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-full border-4 border-t-pink-500 border-pink-200 animate-spin mb-4"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("processingPayment")}
            </h3>
            <p className="text-gray-500 text-center">
              {t("pleaseWaitWhileProcessing")}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
