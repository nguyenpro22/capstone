import { Messages } from "../types";

export const register: Messages["register"] = {
  form: {
    title: {
      createAccount: "Create an Account",
      fillDetails: "Fill in your details to get started",
    },
    labels: {
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      firstName: "First Name",
      lastName: "Last Name",
      phoneNumber: "Phone Number",
      dateOfBirth: "Date of Birth",
      address: "Address",
    },
    placeholders: {
      email: "Enter your email",
      password: "Enter your password",
      confirmPassword: "Confirm your password",
      firstName: "Enter your first name",
      lastName: "Enter your last name",
      phoneNumber: "Enter your phone number",
      address: "Enter your address",
    },
    buttons: {
      register: "Register",
      registering: "Registering...",
      signIn: "Sign In",
      confirm: "Confirm",
      verifying: "Verifying...",
    },
    validation: {
      required: "This field is required",
      email: {
        invalid: "Please enter a valid email address",
      },
      password: {
        min: "Password must be at least 8 characters",
        max: "Maximum password length 20 characters",
        uppercase: "Password must contain at least one uppercase letter",
        lowercase: "Password must contain at least one lowercase letter",
        number: "Password must contain at least one number",
        special:
          "Password must contain at least one special character (@$!%*?&)",
        noSpaces: "Password cannot contain spaces or whitespace characters",
        strength:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      },
      confirmPassword: {
        match: "Passwords do not match",
      },
      firstName: {
        min: "First Name must be at least 2 characters",
        lettersOnly: "First name should only contain letters",
      },
      lastName: {
        required: "Last Name is required",
        lettersOnly: "Last name should only contain letters",
      },
      phoneNumber: {
        format: "Phone number must have 10 digits",
      },
      dateOfBirth: {
        invalid: "Invalid date format",
        age: "You must be at least 18 years old to register",
        note: "You must be at least 18 years old",
      },
      address: {
        min: "Address must be at least 8 characters",
      },
    },
    verification: {
      title: "Enter Verification Code",
      success: "Registration Successful",
      codeSent: "A verification code has been sent to your email",
      enterCode: "Enter Verification Code",
      checkEmail: "Please check your email for the verification code",
      codePlaceholder: "Enter 5-digit code",
      timeRemaining: "Time remaining",
      invalidCode: "Invalid verification code",
      pleaseEnter: "Please enter verification code",
    },
    messages: {
      alreadyHaveAccount: "Already have an account?",
      unexpectedError: "An unexpected error occurred. Please try again.",
      verificationSuccess: "Verification successful",
      verificationFailed: "Verification failed. Please try again.",
    },
    terms: {
      text: "I agree to the",
      link: "Terms and Services",
    },
  },
};
