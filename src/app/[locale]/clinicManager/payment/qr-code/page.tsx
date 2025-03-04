"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { formatCurrency } from "@/utils";
import type { TransactionDetails } from "@/features/clinic/types";
import { CountdownTimer } from "@/components/clinicManager/qr-payment/countDown-timer";
import { CopyButton } from "@/components/clinicManager/qr-payment/copy-button";
import paymentService from "@/components/clinicManager/payment-service";

export default function QRPaymentPage() {
  const [transaction, setTransaction] = useState<TransactionDetails | null>(
    null
  );
  const [isChecking, setIsChecking] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");

  // Load transaction data from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("transactionData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as TransactionDetails;
        setTransaction(parsedData);
      } catch (error) {
        console.error("Failed to parse transaction data:", error);
      }
    }
  }, []);

  // Set up SignalR connection for real-time payment updates
  useEffect(() => {
    if (!transaction?.transactionId) return;

    const setupConnection = async () => {
      try {
        await paymentService.startConnection();
        paymentService.joinPaymentSession(transaction.transactionId);

        // Set up the payment status listener
        paymentService.onPaymentStatusReceived((status: boolean) => {
          setPaymentStatus(status ? "success" : "failed");

          // If payment is successful, we can store this information or redirect
          if (status) {
            // You might want to save this to localStorage or redirect the user
            console.log("Payment successful!");
          }
        });
      } catch (error) {
        console.error("Failed to set up SignalR connection:", error);
      }
    };

    setupConnection();

    // Clean up the connection when component unmounts
    return () => {
      if (transaction?.transactionId) {
        paymentService.leavePaymentSession(transaction.transactionId);
      }
    };
  }, [transaction?.transactionId]);

  const handleCheckPayment = async () => {
    if (!transaction?.transactionId) return;

    setIsChecking(true);

    try {
      // Here you would typically make an API call to check the payment status
      // For now, we'll just use the current state after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // If the payment is still pending after checking, we keep it as pending
      // The real status updates should come from the SignalR connection
    } catch (error) {
      console.error("Failed to check payment status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleExpire = () => {
    setIsExpired(true);
    setPaymentStatus("failed");
  };

  const handleGenerateNewQR = () => {
    // This would typically make an API call to generate a new QR code
    // For now, we'll just reset the expired state
    setIsExpired(false);
    setPaymentStatus("pending");
  };

  if (!transaction) {
    return (
      <div className="container max-w-md mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Transaction Data</AlertTitle>
          <AlertDescription>
            No transaction data found. Please return to checkout and try again.
          </AlertDescription>
        </Alert>
        <Button variant="ghost" size="sm" className="mt-4" asChild>
          <a href="#">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checkout
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <a href="#">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Checkout
        </a>
      </Button>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">QR Payment</CardTitle>
              <CardDescription>
                {paymentStatus === "success"
                  ? "Your payment has been completed successfully"
                  : "Scan the QR code to complete your payment"}
              </CardDescription>
            </div>
            <Badge
              variant={
                paymentStatus === "success"
                  ? "default"
                  : paymentStatus === "failed"
                  ? "destructive"
                  : "outline"
              }
              className={
                paymentStatus === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : paymentStatus === "failed"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }
            >
              {paymentStatus === "success"
                ? "Completed"
                : paymentStatus === "failed"
                ? "Failed"
                : "Pending"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {paymentStatus === "success" ? (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Payment Successful</AlertTitle>
              <AlertDescription>
                Your payment of {formatCurrency(transaction.amount || 0)} has
                been processed successfully.
              </AlertDescription>
            </Alert>
          ) : isExpired ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment Session Expired</AlertTitle>
              <AlertDescription>
                Your payment session has expired. Please generate a new QR code.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex justify-center">
                <div className="relative border-4 border-white shadow-md rounded-lg overflow-hidden">
                  <Image
                    src={transaction.qrUrl || "/placeholder.svg"}
                    alt="Payment QR Code"
                    width={200}
                    height={200}
                    className={isExpired ? "opacity-50" : ""}
                  />
                  {isExpired && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Button variant="secondary" onClick={handleGenerateNewQR}>
                        Generate New QR
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {!isExpired && (
                <CountdownTimer initialMinutes={15} onExpire={handleExpire} />
              )}

              <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Amount</span>
                  <span className="font-medium">
                    {formatCurrency(transaction.amount || 0)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Bank</span>
                  <span className="font-medium">{transaction.bankGateway}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {transaction.bankNumber}
                    </span>
                    <CopyButton text={transaction.bankNumber || ""} />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Description</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-medium max-w-[150px] truncate"
                      title={transaction.orderDescription}
                    >
                      {transaction.orderDescription}
                    </span>
                    <CopyButton text={transaction.orderDescription || ""} />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Payment Instructions
                </h3>
                <ol className="text-sm text-blue-700 space-y-2 pl-5 list-decimal">
                  <li>Open your banking app on your mobile device</li>
                  <li>Scan the QR code above using your banking app</li>
                  <li>
                    Verify the payment details and confirm the transaction
                  </li>
                  <li>Wait for the payment confirmation on this page</li>
                </ol>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {paymentStatus === "success" ? (
            <Button className="w-full" asChild>
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={handleCheckPayment}
              disabled={isChecking || isExpired}
            >
              {isChecking ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Checking Payment Status...
                </>
              ) : (
                "Check Payment Status"
              )}
            </Button>
          )}
          <p className="text-xs text-center text-slate-500">
            Transaction ID:{" "}
            {transaction.transactionId
              ? `${transaction.transactionId.substring(0, 8)}...`
              : "Unknown"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
