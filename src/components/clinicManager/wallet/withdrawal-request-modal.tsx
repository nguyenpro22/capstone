"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Check, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WithdrawalRequestModalProps {
  isOpen: boolean
  onClose: () => void
  clinic: {
    id: string
    name: string
    balance: number
  }
}

// Mock bank accounts
const bankAccounts = [
  { id: "1", name: "Vietcombank - 1234567890" },
  { id: "2", name: "Techcombank - 9876543210" },
  { id: "3", name: "BIDV - 5678912345" },
]

export default function WithdrawalRequestModal({ isOpen, onClose, clinic }: WithdrawalRequestModalProps) {
  const [amount, setAmount] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate amount
    const numAmount = Number(amount.replace(/[^0-9]/g, ""))
    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (numAmount > clinic.balance) {
      setError(`Withdrawal amount cannot exceed available balance (${formatCurrency(clinic.balance)})`)
      return
    }

    if (!bankAccount) {
      setError("Please select a bank account")
      return
    }

    setError(null)
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)

      // Close modal after showing success message
      setTimeout(() => {
        handleClose()
      }, 2000)
    }, 1500)
  }

  // Handle close and reset form
  const handleClose = () => {
    setAmount("")
    setBankAccount("")
    setNotes("")
    setError(null)
    setSuccess(false)
    onClose()
  }

  // Format input amount with currency
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    const value = e.target.value.replace(/[^0-9]/g, "")

    // Format with thousand separators
    if (value) {
      const numValue = Number.parseInt(value, 10)
      setAmount(numValue.toLocaleString("vi-VN"))
    } else {
      setAmount("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
          <DialogDescription>
            Request a withdrawal from {clinic.name}'s wallet. Available balance: {formatCurrency(clinic.balance)}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-green-800">Withdrawal Request Submitted</h3>
              <p className="text-sm text-gray-500 mt-2">
                Your withdrawal request has been submitted successfully. It will be processed within 1-3 business days.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Withdrawal Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₫</span>
                  <Input id="amount" className="pl-7" value={amount} onChange={handleAmountChange} placeholder="0" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bank-account">Bank Account</Label>
                <Select value={bankAccount} onValueChange={setBankAccount}>
                  <SelectTrigger id="bank-account">
                    <SelectValue placeholder="Select bank account" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this withdrawal"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
