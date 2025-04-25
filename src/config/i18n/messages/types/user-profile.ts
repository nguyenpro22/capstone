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
  };
  messages: {
    success: string;
    error: string;
    imageSize: string;
  };
}
