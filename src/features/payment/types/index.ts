export interface PaymentResponse {
    value: {
      transactionId: string
      bankNumber: string
      bankGateway: string
      amount: number
      orderDescription: string
      qrUrl: string
    }
    isSuccess: boolean
    isFailure: boolean
    error: {
      code: string
      message: string
    }
  }
  
  export interface CreatePaymentRequest {
    subscriptionId: string,
    currentAmount: number
  }
  
  // Add this interface to your types file
export interface SubscriptionOverPaymentRequest {
  subscriptionId: string
  currentAmount: number
  additionBranch: number
  additionLiveStream: number
}
