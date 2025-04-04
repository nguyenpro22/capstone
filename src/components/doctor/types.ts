export enum AppointmentStatus {
  CONFIRMED = "confirmed",
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum AppointmentType {
  CONSULTATION = "consultation",
  TREATMENT = "treatment",
  FOLLOW_UP = "follow-up",
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address?: string;
  medicalHistory?: string;
}

export interface TreatmentResult {
  notes: string;
  recommendations: string;
  followUpDate?: string;
  images: string[];
  completedAt: string;
}

export interface Appointment {
  id: string;
  patient: Patient;
  date: string;
  time: string;
  service: string;
  status: AppointmentStatus;
  notes?: string;
  treatmentResults?: TreatmentResult;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  notifications: NotificationSettings;
}
