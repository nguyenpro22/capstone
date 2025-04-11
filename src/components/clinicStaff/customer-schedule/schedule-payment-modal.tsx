"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
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
} from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import { useRouter } from "next/navigation"
import { useCreateOrderPaymentMutation } from "@/features/payment/api"
import type { CustomerSchedule } from "@/features/customer-schedule/types"
import PaymentService from "@/hooks/usePaymentStatus"
import { useUpdateScheduleStatusMutation } from "@/features/customer-schedule/api"
// Alternative implementation using the RTK Query mutation
// You can use this approach instead of the PaymentService method

// Add this import at the top of your file
import { useGenerateSchedulesMutation } from "@/features/customer-schedule/api"

interface SchedulePaymentModalProps {
  schedule: CustomerSchedule | null
  isOpen: boolean
  onClose: () => void
}

export default function SchedulePaymentModal({ schedule, isOpen, onClose }: SchedulePaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("qr")
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const [createOrderPayment, { isLoading }] = useCreateOrderPaymentMutation()
  const router = useRouter()
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [showPaymentResult, setShowPaymentResult] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<{
    amount: number | null
    timestamp: string | null
    message: string | null
  }>({
    amount: null,
    timestamp: null,
    message: null,
  })
  const [updateScheduleStatus, { isLoading: isUpdatingStatus }] = useUpdateScheduleStatusMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number>(30)
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false)
  // Add this inside your component, near the other hooks
  const [generateSchedules, { isLoading: isGeneratingSchedules }] = useGenerateSchedulesMutation()

  useEffect(() => {
    if (!transactionId) return

    const setupConnection = async () => {
      try {
        await PaymentService.startConnection()
        await PaymentService.joinPaymentSession(transactionId)

        // Set up the payment status listener
        PaymentService.onPaymentStatusReceived(
          (
            status: boolean,
            details?: {
              amount?: number
              timestamp?: string
              message?: string
            },
          ) => {
            setPaymentStatus(status ? "success" : "failed")

            // Store payment details if available
            if (details) {
              setPaymentDetails({
                amount: details.amount || null,
                timestamp: details.timestamp || new Date().toISOString(),
                message: details.message || null,
              })
            }

            // If payment is successful, show success message and update schedule status
            if (status) {
              toast.success("Payment successful!")
              // Close the QR dialog and show payment result
              setShowQR(false)
              setShowPaymentResult(true)

              // Update schedule status to Completed
              if (schedule && schedule.id) {
                updateScheduleStatus({
                  scheduleId: schedule.id,
                  status: "Completed",
                })
                  .unwrap()
                  .then(() => {
                    console.log("Schedule status updated to Completed")

                    // Generate follow-up schedules after successful payment
                    if (schedule.id) {
                      generateSchedules(schedule.id)
                        .unwrap()
                        .then(() => {
                          console.log("Follow-up schedules generated successfully")
                        })
                        .catch((error) => {
                          console.error("Failed to generate follow-up schedules:", error)
                        })
                    }

                    // Automatically close the modal after 2 seconds on successful payment
                    setTimeout(() => {
                      onClose()
                      router.push("/clinicStaff/customer-schedule")
                    }, 3000)
                  })
                  .catch((error: any) => {
                    console.error("Failed to update schedule status:", error)
                    // Extract error detail if available
                    const errorDetail = error?.data?.detail || "Failed to update schedule status"
                    setErrorMessage(errorDetail)

                    // If the error is "Order already completed", we can still show success
                    if (errorDetail.includes("already completed")) {
                      toast.info("This order was already marked as completed")

                      // Automatically close the modal after 2 seconds even if already completed
                      setTimeout(() => {
                        onClose()
                        router.push("/schedules")
                      }, 2000)
                    } else {
                      toast.error(errorDetail)
                    }
                  })
              }
            } else {
              const errorMsg = details?.message || "Payment failed. Please try again."
              setErrorMessage(errorMsg)
              toast.error(errorMsg)
              // Show payment result with failure details
              setShowQR(false)
              setShowPaymentResult(true)
            }
          },
        )
      } catch (error) {
        console.error("Failed to set up SignalR connection:", error)
        toast.error("Failed to connect to payment service")
      }
    }

    setupConnection()

    // Clean up the connection when component unmounts
    return () => {
      if (transactionId) {
        PaymentService.leavePaymentSession(transactionId)
      }
    }
  }, [transactionId, schedule, updateScheduleStatus, onClose, router, generateSchedules])

  // Keep the countdown effect, but simplify it to use the existing method:
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (showQR && transactionId && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }

    // When countdown reaches 0, cancel the payment session
    if (countdown === 0 && !isTimedOut && transactionId) {
      setIsTimedOut(true)

      // Call the existing method to cancel payment session
      PaymentService.onCancelPaymentSession(transactionId)
        .then(() => {
          toast.warning("Payment session expired. Please try again.")
          setShowQR(false)
          setPaymentStatus("failed")
          setShowPaymentResult(true)
          setErrorMessage("Payment session expired. Please try again.")
        })
        .catch((error) => {
          console.error("Failed to cancel payment session:", error)
        })
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown, showQR, transactionId, isTimedOut])

  if (!schedule) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`
  }

  const handlePayment = async () => {
    if (!schedule) return

    try {
      setPaymentStatus("processing")
      setErrorMessage(null)

      // Assuming the schedule has a price field, or you can set a default amount
      const amount = schedule.amount || 100000 // Default amount if price is not available

      const result = await createOrderPayment({
        id: schedule.orderId,
        amount: amount,
        paymentMethod: paymentMethod,
      }).unwrap()

      if (result.isSuccess && result.value.qrUrl) {
        setQrUrl(result.value.qrUrl)

        // Store the transaction ID for SignalR connection
        if (result.value.transactionId) {
          setTransactionId(result.value.transactionId)
        }

        setShowQR(true)
        setCountdown(59) // Reset countdown to 30 seconds
        setIsTimedOut(false)
      } else if (paymentMethod === "cash") {
        // For cash payments, show success immediately
        setPaymentStatus("success")
        setShowPaymentResult(true)
        toast.success("Cash payment recorded successfully!")

        // Update schedule status to Completed for cash payments
        if (schedule && schedule.id) {
          try {
            await updateScheduleStatus({
              scheduleId: schedule.id,
              status: "Completed",
            }).unwrap()
            console.log("Schedule status updated to Completed")

            // Generate follow-up schedules for cash payments
            if (schedule.id) {
              try {
                await generateSchedules(schedule.id).unwrap()
                console.log("Follow-up schedules generated successfully")
              } catch (error) {
                console.error("Failed to generate follow-up schedules:", error)
              }
            }

            // Automatically close the modal after 2 seconds for cash payments
            setTimeout(() => {
              onClose()
              router.push("/clinicStaff/customer-schedule")
            }, 2000)
          } catch (error: any) {
            console.error("Failed to update schedule status:", error)
            // Extract error detail if available
            const errorDetail = error?.data?.detail || "Failed to update schedule status"
            setErrorMessage(errorDetail)

            // If the error is "Order already completed", we can still show success
            if (errorDetail.includes("already completed")) {
              toast.info("This order was already marked as completed")

              // Automatically close the modal after 2 seconds even if already completed
              setTimeout(() => {
                onClose()
                router.push("/schedules")
              }, 2000)
            } else {
              toast.error(errorDetail)
            }
          }
        }
      } else {
        setPaymentStatus("failed")
        setShowPaymentResult(true)
        setErrorMessage("Failed to generate payment QR code")
        toast.error("Failed to generate payment QR code")
      }
    } catch (error: any) {
      console.error("Payment failed:", error)
      setPaymentStatus("failed")
      setShowPaymentResult(true)

      // Extract error detail if available
      const errorDetail = error?.data?.detail || "Payment failed. Please try again."
      setErrorMessage(errorDetail)
      toast.error(errorDetail)
    }
  }

  const handleRetry = () => {
    setPaymentStatus("idle")
    setShowPaymentResult(false)
    setErrorMessage(null)
    setCountdown(30)
    setIsTimedOut(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && transactionId) {
          // When closing the dialog, leave the payment session
          PaymentService.leavePaymentSession(transactionId)
          setCountdown(30)
          setIsTimedOut(false)
        }
        onClose()
      }}
    >
       <ToastContainer/>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl min-h-[500px] h-[calc(100vh-80px)] max-h-[800px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Schedule Payment</DialogTitle>
          <DialogDescription>Complete your payment for the scheduled service</DialogDescription>
        </DialogHeader>

        {paymentStatus === "idle" && !showQR && !showPaymentResult && (
          <>
            <div className="space-y-4 overflow-y-auto pr-1">
              {/* Schedule Details */}
              <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-none">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-pink-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Customer</p>
                      <p className="text-sm text-gray-600">{schedule.customerName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Stethoscope className="h-5 w-5 text-pink-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Service</p>
                      <p className="text-sm text-gray-600">{schedule.serviceName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-pink-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Doctor</p>
                      <p className="text-sm text-gray-600">{schedule.doctorName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-pink-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Date & Time</p>
                      <p className="text-sm text-gray-600">
                        {schedule.bookingDate}, {formatTimeRange(schedule.startTime, schedule.endTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge
                      className={
                        schedule.status.toLowerCase() === "confirmed"
                          ? "bg-green-500"
                          : schedule.status.toLowerCase() === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }
                    >
                      {schedule.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Amount */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Amount</span>
                  <span className="text-xl font-bold text-pink-700">
                    {formatPrice(schedule.amount || schedule.amount || 100000)}
                  </span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-700 mb-3">Select Payment Method</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
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
                    <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
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
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* QR Code Display */}
        {showQR && (
          <div className="flex flex-col items-center p-6">
            <DialogHeader>
              <DialogTitle className="text-center font-serif">Payment QR Code</DialogTitle>
              <DialogDescription className="text-center">Scan this QR code to complete your payment</DialogDescription>
            </DialogHeader>

            {qrUrl ? (
              <div className="relative w-64 h-64 mb-4">
                <Image
                  src={qrUrl || "/placeholder.svg"}
                  alt="Payment QR Code"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="w-64 h-64 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-center px-4">Loading QR Code...</p>
              </div>
            )}

            <div className="text-center space-y-2">
              <p className="font-semibold text-lg text-gray-900">
                {formatPrice(schedule.amount || schedule.amount || 100000)}
              </p>
              <p className="text-sm text-gray-500">Scan with your banking app to complete the payment</p>
              {/* Replace the existing Clock section with this countdown display */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                <Clock className="h-4 w-4" />
                <span className={countdown <= 10 ? "text-red-500 font-bold" : ""}>
                  QR code expires in {countdown} seconds
                </span>
              </div>

              {/* Payment Status Indicator */}
              <div className="mt-4">
                <div className="flex items-center justify-center gap-2 text-amber-500">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Waiting for payment...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Result Display */}
        {showPaymentResult && (
          <div className="flex flex-col items-center p-6">
            {paymentStatus === "success" ? (
              <Card className="w-full bg-green-50 border-green-100">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold text-green-700 mb-2">Payment Successful!</h3>
                    <p className="text-green-600 mb-4">
                      Your payment of{" "}
                      {paymentDetails.amount
                        ? formatPrice(paymentDetails.amount)
                        : formatPrice(schedule.amount || schedule.amount || 100000)}{" "}
                      has been processed successfully.
                    </p>
                    {paymentDetails.timestamp && (
                      <p className="text-sm text-green-600 mb-4">
                        Transaction time: {new Date(paymentDetails.timestamp).toLocaleString()}
                      </p>
                    )}
                    <p className="text-sm text-green-600 animate-pulse">Redirecting to schedules...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full bg-red-50 border-red-100">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                    <h3 className="text-xl font-semibold text-red-700 mb-2">Payment Failed</h3>
                    <p className="text-red-600 mb-4">
                      {errorMessage || paymentDetails.message || "We couldn't process your payment. Please try again."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                      <Button onClick={onClose} variant="outline" className="flex-1">
                        Close
                      </Button>
                      <Button
                        onClick={handleRetry}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      >
                        Try Again <RefreshCw className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {paymentStatus === "processing" && !showQR && !showPaymentResult && (
          <div className="flex flex-col items-center justify-center py-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-full border-4 border-t-pink-500 border-pink-200 animate-spin mb-4"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment</h3>
            <p className="text-gray-500 text-center">Please wait while we process your payment...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

