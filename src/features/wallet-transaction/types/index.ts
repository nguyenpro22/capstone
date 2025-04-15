export interface TransactionalRequest{
    id: string
    clinicId: string
    clinicName: string
    amount: number
    transactionType: string
    status: string
    isMakeBySystem: boolean
    description: string
    transactionDate: string
    createOnUtc: string
}
