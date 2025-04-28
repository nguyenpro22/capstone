export interface TransactionalRequest {
  id: string;
  clinicId: string;
  clinicName: string;
  amount: number;
  transactionType: string;
  status: string;
  isMakeBySystem: boolean;
  description: string;
  transactionDate: string;
  createOnUtc: string;
}

export interface CustomerWithdrawalRequest {
  transactionId: string;
  bankNumber: string;
  bankGateway: string;
  amount: number;
  orderDescription: string;
  qrUrl: string;
}
