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
  
  