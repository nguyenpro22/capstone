"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  Clock,
  Check,
  X,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Zap,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react"
import { useGetPackagesQuery } from "@/features/package/api"
import { useCreatePaymentMutation } from "@/features/payment/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { toast } from "react-toastify"
import type { Package } from "@/features/package/types"
import Pagination from "@/components/common/Pagination/Pagination"
import { useRouter } from "next/navigation"
import PaymentService from "@/hooks/usePaymentStatus"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function PackageList() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [pageIndex, setPageIndex] = useState(1)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending")
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const pageSize = 6
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

  const { data, isLoading, error } = useGetPackagesQuery({
    pageIndex,
    pageSize,
    searchTerm,
  })

  const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation()
 // const [activatePackage, { isLoading: isActivating }] = useActivatePackageMutation()
  const router = useRouter()

  useEffect(() => {
    if (!transactionId) return

    const setupConnection = async () => {
      try {
        await PaymentService.startConnection()
        await PaymentService.joinPaymentSession(transactionId)

        // Set up the payment status listener
        PaymentService.onPaymentStatusReceived((status: boolean, details?: {
          amount?: number
          timestamp?: string
          message?: string
        }) => {
          setPaymentStatus(status ? "success" : "failed")

          // Store payment details if available
          if (details) {
            setPaymentDetails({
              amount: details.amount || null,
              timestamp: details.timestamp || new Date().toISOString(),
              message: details.message || null
            })
          }

          // If payment is successful, activate the package
          if (status) {
            toast.success("Payment successful!")
            // Close the QR dialog and show payment result
            setShowQR(false)
            setShowPaymentResult(true)

            

            // Refresh the page after a delay to show updated package status
            setTimeout(() => {
              router.push("/clinicManager/dashboard")
            }, 5000)
          } else {
            toast.error(details?.message || "Payment failed. Please try again.")
            // Show payment result with failure details
            setShowQR(false)
            setShowPaymentResult(true)
          }
        })
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
  }, [transactionId, router, selectedPackage])

  const packages = data?.value?.items || []
  const totalCount = data?.value?.totalCount || 0
  const hasNextPage = data?.value?.hasNextPage
  const hasPreviousPage = data?.value?.hasPreviousPage

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPageIndex(1) // Reset to first page when searching
  }

  const handlePurchase = async (pkg: Package) => {
    try {
      setSelectedPackage(pkg)
      setPaymentStatus("pending")

      const result = await createPayment({ subscriptionId: pkg.id }).unwrap()
      if (result.isSuccess && result.value.qrUrl) {
        setQrUrl(result.value.qrUrl)
        // Store the transaction ID for SignalR connection
        if (result.value.transactionId) {
          setTransactionId(result.value.transactionId)
        }
        setShowQR(true)
      } else {
        toast.error("Failed to generate payment QR code")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Failed to initiate payment")
    }
  }

  const handleRetryPayment = async () => {
    if (!selectedPackage) return

    setShowPaymentResult(false)
    setPaymentStatus("pending")

    try {
      const result = await createPayment({ subscriptionId: selectedPackage.id }).unwrap()
      if (result.isSuccess && result.value.qrUrl) {
        setQrUrl(result.value.qrUrl)
        if (result.value.transactionId) {
          setTransactionId(result.value.transactionId)
        }
        setShowQR(true)
      } else {
        toast.error("Failed to generate payment QR code")
      }
    } catch (error) {
      console.error("Payment retry error:", error)
      toast.error("Failed to retry payment")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border bg-white p-6 shadow-lg">
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-6 w-24 mb-6" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Packages</h3>
          <p className="text-gray-600 mb-4">Please try again later or contact support.</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full bg-white shadow-md"
          >
            <Sparkles className="h-5 w-5 text-pink-500" />
            <span className="text-sm font-medium text-gray-600">Premium Beauty Packages</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif font-semibold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
          >
            Enhance Your Beauty Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto mb-8"
          >
            Choose from our exclusive range of packages designed to elevate your clinics offerings and provide
            exceptional value to your customers
          </motion.p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full rounded-full border-gray-200 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: ShieldCheck,
              title: "Premium Quality",
              description: "All packages are carefully curated to ensure the highest quality of service",
            },
            {
              icon: Zap,
              title: "Instant Activation",
              description: "Start using your package immediately after successful payment",
            },
            {
              icon: RefreshCw,
              title: "Flexible Duration",
              description: "Choose packages with durations that suit your business needs",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm"
            >
              <div className="p-3 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 mb-4">
                <feature.icon className="h-6 w-6 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {packages.map((pkg: any, index: number) => (
            <motion.div
              key={pkg.documentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative overflow-hidden rounded-2xl border bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl",
                pkg.isActivated ? "border-pink-200" : "border-gray-200",
              )}
            >
              {/* Package Status Badge */}
              <div
                className={cn(
                  "absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-medium",
                  pkg.isActivated ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-600",
                )}
              >
                {pkg.isActivated ? (
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3" /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <X className="h-3 w-3" /> Inactive
                  </span>
                )}
              </div>

              {/* Package Content */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-pink-500" />
                  <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {pkg.duration} days</span>
                </div>
              </div>

              {/* Price and Action */}
              <div className="mt-auto">
                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-900">{formatPrice(pkg.price)}</p>
                  <p className="text-sm text-gray-500">One-time payment</p>
                </div>
                <Button
                  onClick={() => handlePurchase(pkg)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                  disabled={!pkg.isActivated || isCreatingPayment}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {isCreatingPayment ? "Processing..." : "Purchase Now"}
                </Button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 opacity-50 blur-2xl" />
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalCount={totalCount}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onPageChange={setPageIndex}
        />

        {/* QR Payment Dialog */}
        <Dialog
          open={showQR}
          onOpenChange={(open) => {
            if (!open && transactionId) {
              // When closing the dialog, leave the payment session
              PaymentService.leavePaymentSession(transactionId)
            }
            setShowQR(open)
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center font-serif">Payment QR Code</DialogTitle>
              <DialogDescription className="text-center">
                Scan this QR code to complete your purchase of {selectedPackage?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center p-6">
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
                  {selectedPackage && formatPrice(selectedPackage.price)}
                </p>
                <p className="text-sm text-gray-500">Scan with your banking app to complete the payment</p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                  <Clock className="h-4 w-4" />
                  <span>QR code expires in 15:00 minutes</span>
                </div>
                {/* Payment Status Indicator */}
                <div className="mt-4">
                  {paymentStatus === "pending" && (
                    <div className="flex items-center justify-center gap-2 text-amber-500">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Waiting for payment...</span>
                    </div>
                  )}
                  {paymentStatus === "success" && (
                    <div className="flex items-center justify-center gap-2 text-green-500">
                      <Check className="h-4 w-4" />
                      <span>Payment successful!</span>
                    </div>
                  )}
                  {paymentStatus === "failed" && (
                    <div className="flex items-center justify-center gap-2 text-red-500">
                      <X className="h-4 w-4" />
                      <span>Payment failed. Please try again.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Payment Result Dialog */}
        <Dialog
          open={showPaymentResult}
          onOpenChange={(open) => {
            if (!open) {
              setShowPaymentResult(false)
              // Reset payment status if dialog is closed
              setPaymentStatus("pending")
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center font-serif">
                {paymentStatus === "success" ? "Payment Successful" : "Payment Failed"}
              </DialogTitle>
            </DialogHeader>
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
                          : selectedPackage
                            ? formatPrice(selectedPackage.price)
                            : "N/A"}{" "}
                        has been processed successfully.
                      </p>
                      {paymentDetails.timestamp && (
                        <p className="text-sm text-green-600 mb-4">
                          Transaction time: {new Date(paymentDetails.timestamp).toLocaleString()}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                        <Button onClick={() => setShowPaymentResult(false)} variant="outline" className="flex-1">
                          Close
                        </Button>
                        <Button
                          asChild
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                          <Link href="/clinicManager/dashboard">
                            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
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
                      <h3 className="text-xl font-semibold text-red-700 mb-2">Payment Failed</h3>
                      <p className="text-red-600 mb-4">
                        {paymentDetails.message || "We couldn't process your payment. Please try again."}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                        <Button onClick={() => setShowPaymentResult(false)} variant="outline" className="flex-1">
                          Close
                        </Button>
                        <Button
                          onClick={handleRetryPayment}
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
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

