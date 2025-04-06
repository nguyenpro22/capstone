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
      wardRequired: string;
      bankNameRequired: string;
      bankAccountRequired: string;
      expiryDateRequired: string;
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
