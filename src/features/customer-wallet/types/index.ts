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
  transactionType: "Deposit" | "Withdraw"; // or other values depending on your use case
  status: "Completed" | "Pending" | "Failed"; // or other values depending on your use case
  isMakeBySystem: boolean;
  description: string | null;
  transactionDate: string; // You could use Date type if you plan to parse this into a Date object
  createdOnUtc: string; // Same here, if you parse into Date, you can use `Date` type
};
