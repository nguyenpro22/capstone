"use client";

import { useAppointmentStore } from "@/components/doctor/store";
import { useEffect } from "react";

export function useAppointments() {
  const {
    appointments,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  } = useAppointmentStore();

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  };
}
