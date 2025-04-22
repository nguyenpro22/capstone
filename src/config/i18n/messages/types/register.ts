export type RegistrationTranslations = {
  createAccount: string;
  fillDetails: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  firstName: string;
  firstNamePlaceholder: string;
  lastName: string;
  lastNamePlaceholder: string;
  phoneNumber: string;
  phoneNumberPlaceholder: string;
  dateOfBirth: string;
  address: string;
  addressPlaceholder: string;
  register: string;
  registering: string;
  alreadyHaveAccount: string;
  signIn: string;
  registrationSuccess: string;
  verificationCodeSent: string;
  enterVerificationCode: string;
  checkEmail: string;
  verificationCodePlaceholder: string;
  timeRemaining: string;
  confirm: string;
  emailAlreadyExists: string;
  // New translation fields
  mustBe18YearsOld: string;
  selectYourBirthday: string;
  validationError: string;
  unexpectedError: string;
  verificationFailed: string;
  // Backend validation error messages
  invalidEmailFormat: string;
  passwordTooShort: string;
  passwordTooLong: string;
  firstNameOnlyLetters: string;
  firstNameTooShort: string;
  firstNameTooLong: string;
  lastNameOnlyLetters: string;
  lastNameTooShort: string;
  lastNameTooLong: string;
  mustBeAtLeast18: string;
  addressTooShort: string;
  addressTooLong: string;

  // New verification messages
  pleaseEnterVerificationCode: string
  verifying: string
  verificationSuccessful: string
  // Password validation messages
  passwordNoSpaces: string;
  passwordRequirements: string;
  passwordRequiresUppercase: string;
  passwordRequiresLowercase: string;
  passwordRequiresNumber: string;
  passwordRequiresSpecial: string;
  passwordsDoNotMatch: string;
  
  // Email validation
  invalidEmail: string;
  
  // Phone validation
  invalidPhoneNumber: string;
  
  // Verification code validation
  invalidVerificationCode: string;
  
  // Form submission
  formSubmissionError: string;
  serverError: string;
  
  // Address validation
  invalidAddress: string;
};