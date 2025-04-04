import { create } from "zustand";
import type { Appointment, NotificationSettings, User } from "./types";
import { generateSampleData } from "./sample-data";

// Sample data
const { sampleAppointments, mockUser } = generateSampleData();

// Appointment store
interface AppointmentStore {
  appointments: Appointment[];
  fetchAppointments: () => Promise<void>;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: sampleAppointments,
  fetchAppointments: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ appointments: sampleAppointments });
  },
  addAppointment: (appointment) => {
    set((state) => ({
      appointments: [...state.appointments, appointment],
    }));
  },
  updateAppointment: (appointment) => {
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === appointment.id ? appointment : a
      ),
    }));
  },
  deleteAppointment: (id) => {
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id),
    }));
  },
}));

// User store
interface UserStore {
  user: User;
  updateUser: (user: User) => void;
  updateNotificationSettings: (settings: NotificationSettings) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: mockUser,
  updateUser: (user) => {
    set({ user });
  },
  updateNotificationSettings: (settings) => {
    set((state) => ({
      user: {
        ...state.user,
        notifications: settings,
      },
    }));
  },
}));
