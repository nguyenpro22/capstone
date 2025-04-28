export interface UserProfileMessages {
  header: {
    profile: {
      title: string;
      description: string;
    };
    wallet: {
      title: string;
      description: string;
    };
  };
  sidebar: {
    balance: string;
    navigation: {
      profile: string;
      wallet: string;
      deposit: string;
      withdraw: string;
      history: string;
    };
    backHome: string;
  };
  profile: {
    actions: {
      edit: string;
      cancel: string;
      save: string;
      saving: string;
    };
    sections: {
      personal: {
        title: string;
        fullName: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        avatar: string;
      };
      contact: {
        title: string;
        email: string;
        phone: string;
      };
      address: {
        title: string;
        province: string;
        district: string;
        ward: string;
        detail: string;
        fullAddress: string;
        area: string;
        selectProvince: string;
        selectDistrict: string;
        selectWard: string;
        selectDistrictFirst: string;
        selectWardFirst: string;
        placeholder: string;
      };
    };
  };
  wallet: {
    balance: {
      title: string;
      current: string;
      lastUpdate: string;
    };
    actions: {
      deposit: string;
      withdraw: string;
    };
    recentTransactions: {
      title: string;
      viewAll: string;
      empty: string;
    };
    deposit: {
      title: string;
      description: string;
      success: string;
      failed: string;
      invalidAmount: string;
      createFailed: string;
      error: string;
      copied: string;
      enterAmount: string;
      amountLabel: string;
      amountPlaceholder: string;
      inWords: string;
      processing: string;
      continue: string;
      paymentMethods: string;
      bankTransfer: string;
      allBanks: string;
      amountToPay: string;
      qrTab: string;
      manualTab: string;
      qrInstruction: string;
      accountNumber: string;
      bank: string;
      transferContent: string;
      copy: string;
      noteTitle: string;
      noteContent: string;
      result: {
        success: string;
        failed: string;
        successDesc: string;
        failedDesc: string;
      };
      transactionId: string;
      done: string;
      cancel: string;
      retry: string;
    };
    withdraw: {
      title: string;
      description: string;
      errorTitle: string;
      invalidAmount: string;
      selectBank: string;
      enterAccountNumber: string;
      enterAccountName: string;
      errorDesc: string;
      successTitle: string;
      successDesc: string;
      successNote: string;
      withdrawAnother: string;
      done: string;
      enterAmount: string;
      amountLabel: string;
      amountPlaceholder: string;
      inWords: string;
      bankInfoTitle: string;
      bankLabel: string;
      bankPlaceholder: string;
      banks: {
        vcb: string;
        tcb: string;
        bidv: string;
        vtb: string;
        mb: string;
        acb: string;
      };
      accountNumberLabel: string;
      accountNumberPlaceholder: string;
      accountNameLabel: string;
      accountNamePlaceholder: string;
      processing: string;
      submit: string;
      noteTitle: string;
      noteContent: string;
    };
  };
  messages: {
    success: string;
    error: string;
    imageSize: string;
  };
  transaction: {
    deposit: string;
    withdrawal: string;
    transfer: string;
    paymentTo: string;
    default: string;
    code: string;
    amount: string;
    time: string;
    status: {
      label: string;
      completed: string;
      pending: string;
      failed: string;
      cancelled: string;
    };
  };
  transactionHistory: {
    title: string;
    description: string;
    tabs: {
      all: string;
      deposit: string;
      withdrawal: string;
      transfer: string;
    };
    searchPlaceholder: string;
    statusPlaceholder: string;
    status: {
      all: string;
    };
    fromDate: string;
    toDate: string;
    reset: string;
    apply: string;
    list: {
      all: string;
      deposit: string;
      withdrawal: string;
      transfer: string;
    };
    total: string;
    table: {
      info: string;
      amount: string;
      time: string;
      status: string;
    };
    emptyTitle: string;
    emptyDesc: string;
  };
}
