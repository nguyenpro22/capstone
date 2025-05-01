"use client";
import { useState } from "react";
import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useCreateWalletWithdrawMutation } from "@/features/clinic-wallet/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAccessToken, GetDataByToken, TokenData } from "@/utils";

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Add this callback prop
  clinic: {
    id: string;
    name: string;
    balance: number;
    bankName: string;
    bankAccountNumber: string;
  };
}

export default function WithdrawalRequestModal({
  isOpen,
  onClose,
  onSuccess,
  clinic,
}: WithdrawalRequestModalProps) {
  const [createWalletWithdraw, { isLoading }] =
    useCreateWalletWithdrawMutation();
  const token = getAccessToken() as string;
  const { roleName } = GetDataByToken(token) as TokenData;
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [amountError, setAmountError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;

    // Validate amount
    if (!amount) {
      setAmountError("Amount is required");
      isValid = false;
    } else if (isNaN(Number(amount))) {
      setAmountError("Amount must be a number");
      isValid = false;
    } else if (Number(amount) <= 0) {
      setAmountError("Amount must be greater than 0");
      isValid = false;
    } else if (Number(amount) > clinic.balance) {
      setAmountError("Amount cannot exceed available balance");
      isValid = false;
    } else {
      setAmountError("");
    }

    // Validate description
    if (!description) {
      setDescriptionError("Description is required");
      isValid = false;
    } else if (description.length < 5) {
      setDescriptionError("Description must be at least 5 characters");
      isValid = false;
    } else if (description.length > 200) {
      setDescriptionError("Description must be less than 200 characters");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Call API to create withdrawal request

      if (roleName.toLowerCase() === "clinic admin") {
        await createWalletWithdraw({
          clinicId: clinic.id,
          amount: Number(amount),
          description,
        }).unwrap();
      } else {
        await createWalletWithdraw({
          amount: Number(amount),
          description,
        }).unwrap();
      }

      // Show success message
      toast.success("Request withdraw success");

      // Reset form and close modal
      resetForm();
      onClose();

      // Call the onSuccess callback to trigger data refetch in the parent component
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      // console.error("Failed to submit withdrawal request:", error);
      toast.error(error.data.detail);
    }
  };

  // Reset form
  const resetForm = () => {
    setAmount("");
    setDescription("");
    setAmountError("");
    setDescriptionError("");
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
          <DialogDescription>
            Enter the amount you want to withdraw from your clinic wallet.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="clinic">Clinic</Label>
            <Input id="clinic" value={clinic.name} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Available Balance</Label>
            <Input
              id="balance"
              value={formatCurrency(clinic.balance)}
              disabled
            />
          </div>

          {/* Bank Account Information */}
          <div className="space-y-2">
            <Label htmlFor="bankAccount">Bank Account</Label>
            <Input
              id="bankAccount"
              value={`${clinic.bankName} - ${clinic.bankAccountNumber}`}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Withdrawal will be processed to this bank account
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              Withdrawal Amount <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              placeholder="Enter amount in VND"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={amountError ? "border-red-500" : ""}
            />
            {amountError && (
              <p className="text-red-500 text-sm">{amountError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Reason for withdrawal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={descriptionError ? "border-red-500" : ""}
            />
            {descriptionError && (
              <p className="text-red-500 text-sm">{descriptionError}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
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
      </DialogContent>
    </Dialog>
  );
}
