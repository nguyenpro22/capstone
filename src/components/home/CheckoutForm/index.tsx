"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CheckoutForm() {
  const searchParams = useSearchParams()
  const packageId = searchParams.get("packageId")
  const doctorId = searchParams.get("doctorId")
  const router = useRouter()

  const [paymentMethod, setPaymentMethod] = useState<"qr" | "bank">("qr")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement payment processing logic here
    console.log("Processing payment for package", packageId, "with doctor", doctorId)
    console.log("Payment method:", paymentMethod)
    // After successful payment, redirect to order confirmation
    router.push(`/orders/${packageId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value: "qr" | "bank") => setPaymentMethod(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="qr" id="qr" />
                <Label htmlFor="qr">QR Code Payment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank">Bank Transfer</Label>
              </div>
            </RadioGroup>
          </div>
          {paymentMethod === "qr" && (
            <div className="space-y-2">
              <Label>Scan QR Code</Label>
              <div className="bg-gray-200 h-64 flex items-center justify-center">[QR Code Placeholder]</div>
            </div>
          )}
          {paymentMethod === "bank" && (
            <div className="space-y-2">
              <Label>Bank Transfer Details</Label>
              <p>Bank: Example Bank</p>
              <p>Account Number: 1234567890</p>
              <p>Account Name: Beauty Clinic</p>
              <p>Reference: Package {packageId}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Complete Purchase
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

