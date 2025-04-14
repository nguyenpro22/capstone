export type Transaction = {
  transactionId: string;
  bankNumber: string;
  bankGateway: string;
  amount: number;
  orderDescription: string;
  qrUrl: string;
};

export type WalletTransaction = {
  id: string;
  clinicId: string | null;
  clinicName: string | null;
  amount: number;
  transactionType: "Deposit" | "Withdrawal" | "Transfer";
  status: "Completed" | "Pending" | "Failed" | "Cancelled";
  isMakeBySystem: boolean;
  description: string | null;
  transactionDate: string;
  createdOnUtc: string;
};
