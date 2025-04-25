export interface RegisterMessages {
  form: {
    title: {
      createAccount: string;
      fillDetails: string;
    };
    labels: {
      email: string;
      password: string;
      confirmPassword: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      dateOfBirth: string;
      address: string;
    };
    placeholders: {
      email: string;
      password: string;
      confirmPassword: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      address: string;
    };
    buttons: {
      register: string;
      registering: string;
      signIn: string;
      confirm: string;
      verifying: string;
    };
    validation: {
      required: string;
      email: {
        invalid: string;
      };
      password: {
        min: string;
        max: string;
        uppercase: string;
        lowercase: string;
        number: string;
        special: string;
        noSpaces: string;
        strength: string;
      };
      confirmPassword: {
        match: string;
      };
      firstName: {
        min: string;
        lettersOnly: string;
      };
      lastName: {
        required: string;
        lettersOnly: string;
      };
      phoneNumber: {
        format: string;
      };
      dateOfBirth: {
        invalid: string;
        age: string;
        note: string;
      };
      address: {
        min: string;
      };
    };
    verification: {
      title: string;
      success: string;
      codeSent: string;
      enterCode: string;
      checkEmail: string;
      codePlaceholder: string;
      timeRemaining: string;
      invalidCode: string;
      pleaseEnter: string;
    };
    messages: {
      alreadyHaveAccount: string;
      unexpectedError: string;
      verificationSuccess: string;
      verificationFailed: string;
    };
    terms: {
      text: string;
      link: string;
    };
  };
}
