export type ProfileMessages = {
  title: string;
  subtitle: string;
  tabs: {
    general: string;
    password: string;
    notifications: string;
  };
  general: {
    title: string;
    description: string;
    name: {
      label: string;
      placeholder: string;
    };
    email: {
      label: string;
      placeholder: string;
    };
    phone: {
      label: string;
      placeholder: string;
    };
    specialization: {
      label: string;
      placeholder: string;
    };
    saveButton: string;
    saving: string;
    successTitle: string;
    successMessage: string;
  };
  password: {
    title: string;
    description: string;
    currentPassword: {
      label: string;
      placeholder: string;
    };
    newPassword: {
      label: string;
      placeholder: string;
      description: string;
    };
    confirmPassword: {
      label: string;
      placeholder: string;
    };
    updateButton: string;
    updating: string;
    successTitle: string;
    successMessage: string;
  };
  notifications: {
    title: string;
    description: string;
    emailNotifications: {
      label: string;
      description: string;
    };
    pushNotifications: {
      label: string;
      description: string;
    };
    appointmentReminders: {
      label: string;
      description: string;
    };
    marketingEmails: {
      label: string;
      description: string;
    };
    saveButton: string;
    saving: string;
    successTitle: string;
    successMessage: string;
  };
};
