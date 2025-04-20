export type walletMessages = {
  clinicWallet : {
    title: string
    actions: {
      refresh: string
      export: string
      requestWithdrawal: string
      viewDetails: string
      close: string
      approve: string
      reject: string
      confirmRejection: string
      clearFilters: string
    }
    summary: {
      title: string
      description: string
      totalBalance: string
      totalBalanceDesc: string
      totalPendingWithdrawals: string
      totalPendingWithdrawalsDesc: string
      totalEarnings: string
      totalEarningsDesc: string
    }
    clinic: {
      selectClinic: string
      selectClinicLabel: string
      walletTitle: string
      selectToManage: string
      manageWallet: string
      currentBalance: string
      availableForWithdrawal: string
      pendingWithdrawals: string
      beingProcessed: string
      totalEarnings: string
      lifetimeEarnings: string
    }
    tabs: {
      withdrawalHistory: string
      transactionHistory: string
    }
    filters: {
      dateRange: string
      status: string
      statusAll: string
      statusCompleted: string
      statusPending: string
      statusRejected: string
      statusWaitingForPayment: string
      searchWithdrawal: string
      searchTransaction: string
    }
    table: {
      id: string
      date: string
      amount: string
      clinic: string
      bankAccount: string
      transactionId: string
      status: string
      actions: string
      type: string
      description: string
      noWithdrawals: string
      noTransactions: string
      searchAdjust: string
      transactionsAppear: string
      loading: string
    }
    transactionTypes: {
      withdrawal: string
      deposit: string
      payment: string
    }
    status: {
      completed: string
      pending: string
      rejected: string
      waitingForPayment: string
    }
    transactionDetails: {
      title: string
      detailsFor: string
      amount: string
      dateTime: string
      clinic: string
      description: string
      createdBy: string
      system: string
      user: string
      rejectionReason: string
      rejectionPlaceholder: string
      approving: string
      rejecting: string
    }
    notifications: {
      processingApproval: string
      approvalSuccess: string
      approvalFailed: string
      processingRejection: string
      rejectionSuccess: string
      rejectionFailed: string
    }
  }  
  branchWallet : {
    title: string
    description: string
    loading: {
      branchWallet: string
      transactions: string
    }
    summary: {
      currentBalance: string
      availableForWithdrawal: string
      pendingWithdrawals: string
      beingProcessed: string
      totalEarnings: string
      lifetimeEarnings: string
    }
    analytics: {
      title: string
      description: string
    }
    financialActivity: {
      title: string
      description: string
    }
    tabs: {
      transactions: string
      withdrawals: string
    }
    filters: {
      dateRange: string
      type: string
      typeAll: string
      status: string
      statusAll: string
      filterByType: string
      filterByStatus: string
      searchTransactions: string
      searchWithdrawal: string
    }
    table: {
      id: string
      date: string
      amount: string
      type: string
      description: string
      customer: string
      status: string
      bankAccount: string
      transactionId: string
      actions: string
      noTransactions: string
      noWithdrawals: string
    }
    transactionTypes: {
      income: string
      withdrawal: string
    }
    status: {
      completed: string
      pending: string
      rejected: string
      waiting: string
    }
    actions: {
      refresh: string
      export: string
      requestWithdrawal: string
      viewDetails: string
      clearFilters: string
    }
    notifications: {
      error: string
      branchDataUnavailable: string
      exportFunctionality: string
    }
  }
  
}