export type registerClinic = {
  title: string;
  description: string;
  form: {
    sections: {
      clinicInfo: string;
      contactInfo: string;
      address: string;
      bankInfo: string;
      licenseInfo: string;
      documents: string;
    };
    fields: {
      name: string;
      email: string;
      phoneNumber: string;
      taxCode: string;
      address: string;
      city: string;
      district: string;
      ward: string;
      bankName: string;
      bankAccountNumber: string;
      operatingLicenseExpiryDate: string;
      operatingLicense: string;
      businessLicense: string;
      profilePictureUrl: string;
    };
    placeholders: {
      name: string;
      email: string;
      phoneNumber: string;
      taxCode: string;
      address: string;
      city: string;
      district: string;
      ward: string;
      bankName: string;
      bankAccountNumber: string;
      selectCityFirst: string;
      selectDistrictFirst: string;
    };
    fileUpload: {
      clickToUpload: string;
      orDragAndDrop: string;
      fileTypes: string;
      remove: string;
      change: string;
      sizeError: string;
    };
    validation: {
      nameRequired: string;
      emailInvalid: string;
      phoneRequired: string;
      taxCodeRequired: string;
      addressRequired: string;
      cityRequired: string;
      districtRequired: string;
      phoneInvalid: string;
      wardRequired: string;
      bankNameRequired: string;
      bankAccountRequired: string;
      expiryDateRequired: string;
      emailExists: string;
      taxCodeExists: string;
      phoneNumberExists: string;
      profilePictureRequired: string;
      businessLicenseRequired: string;
      operatingLicenseRequired: string;
    };
    terms: {
      text: string;
      link: string;
      required: string;
    };
    toast: {
      missingFiles: {
        title: string;
        description: string;
      };
      success: {
        title: string;
        description: string;
      };
      error: {
        title: string;
        description: string;
        pendingRequest: string;
        duplicateInfo: string;
        validation: string;
      };
    };
    submit: string;
    submitting: string;
  };
  reRegister: {
    title: string;
    description: string;
    loading: string;
    rejectedInformation: string;
    updateInformation: string;
    loadError: string;
    rejectionReason: string;
    logout: string;
    success: {
      title: string;
      message: string;
      goHome: string;
    };
    form: {
      sections: {
        clinicInfo: string;
        contactInfo: string;
        address: string;
        bankInfo: string;
        licenseInfo: string;
        documents: string;
      };
      fields: {
        name: string;
        email: string;
        phoneNumber: string;
        taxCode: string;
        address: string;
        city: string;
        district: string;
        ward: string;
        bankName: string;
        bankAccountNumber: string;
        operatingLicenseExpiryDate: string;
        operatingLicense: string;
        businessLicense: string;
        profilePictureUrl: string;
      };
      placeholders: {
        name: string;
        email: string;
        phoneNumber: string;
        taxCode: string;
        address: string;
        city: string;
        district: string;
        ward: string;
        bankName: string;
        bankAccountNumber: string;
        selectCityFirst: string;
        selectDistrictFirst: string;
      };
      fileUpload: {
        clickToUpload: string;
        orDragAndDrop: string;
        fileTypes: string;
        remove: string;
        change: string;
        sizeError: string;
      };
      validation: {
        nameRequired: string;
        emailInvalid: string;
        phoneRequired: string;
        taxCodeRequired: string;
        addressRequired: string;
        cityRequired: string;
        districtRequired: string;
        phoneInvalid: string;
        wardRequired: string;
        bankNameRequired: string;
        bankAccountRequired: string;
        expiryDateRequired: string;
        emailExists: string;
        taxCodeExists: string;
        phoneNumberExists: string;
        profilePictureRequired: string;
        businessLicenseRequired: string;
        operatingLicenseRequired: string;
      };
      toast: {
        missingFiles: {
          title: string;
          description: string;
        };
        success: {
          title: string;
          description: string;
        };
        error: {
          title: string;
          description: string;
          pendingRequest: string;
          duplicateInfo: string;
          validation: string;
        };
      };
      submit: string;
      submitting: string;
    };
  };
  dialog: {
    success: {
      title: string;
      description: string;
      emailSent: string;
      checkEmail: string;
      close: string;
      nextSteps: string;
      processingTime: string;
      contactSupport: string;
    };
  };
};
