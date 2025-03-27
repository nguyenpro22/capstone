"use client";

import { useUserStore } from "@/components/doctor/store";

export function useUser() {
  const { user, updateUser, updateNotificationSettings } = useUserStore();

  return {
    user,
    updateUser,
    updateNotificationSettings,
  };
}
