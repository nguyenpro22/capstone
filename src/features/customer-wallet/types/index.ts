export type Transaction = {
  transactionId: string;
  bankNumber: string;
  bankGateway: string;
  amount: number;
  orderDescription: string;
  qrUrl: string;
};
