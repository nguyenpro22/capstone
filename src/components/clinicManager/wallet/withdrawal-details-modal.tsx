"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  ArrowDownToLine,
  Calendar,
  CreditCard,
  FileText,
  User,
} from "lucide-react";

interface WithdrawalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawal: {
    id: string;
    amount: number;
    status: string;
    date: string;
    bankAccount: string;
    transactionId: string;
    notes: string;
  };
  clinic: {
    id: string;
    name: string;
    bankName?: string;
    bankAccountNumber?: string;
  };
}

export default function WithdrawalDetailsModal({
  isOpen,
  onClose,
  withdrawal,
  clinic,
}: WithdrawalDetailsModalProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
        );
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle download receipt
  const handleDownloadReceipt = () => {
    // Implementation for downloading receipt
    alert("Download receipt functionality would be implemented here");
  };

  // Determine which bank account to display
  const displayBankAccount =
    clinic.bankName && clinic.bankAccountNumber
      ? `${clinic.bankName} - ${clinic.bankAccountNumber}`
      : withdrawal.bankAccount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Withdrawal Details</DialogTitle>
          <DialogDescription>
            Details for withdrawal from {clinic.name}'s wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="font-medium">Status</div>
              <div>{getStatusBadge(withdrawal.status)}</div>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <div className="font-medium">Amount</div>
              <div className="font-bold">
                {formatCurrency(withdrawal.amount)}
              </div>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <div className="font-medium">Date</div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                {format(new Date(withdrawal.date), "PPP p")}
              </div>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <div className="font-medium">Bank Account</div>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-1 text-gray-500" />
                {displayBankAccount}
              </div>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <div className="font-medium">Transaction ID</div>
              <div className="font-mono text-sm">
                {withdrawal.transactionId}
              </div>
            </div>

            {withdrawal.notes && (
              <div className="pb-2 border-b">
                <div className="font-medium mb-1">Notes</div>
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <FileText className="h-4 w-4 inline-block mr-1 text-gray-500" />
                  {withdrawal.notes}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pb-2 border-b">
              <div className="font-medium">Clinic</div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1 text-gray-500" />
                {clinic.name}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          {withdrawal.status === "completed" && (
            <Button
              variant="outline"
              onClick={handleDownloadReceipt}
              className="mr-auto"
            >
              <ArrowDownToLine className="h-4 w-4 mr-1" />
              Download Receipt
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
