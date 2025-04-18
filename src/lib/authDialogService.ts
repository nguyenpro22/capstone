// authDialogService.ts
import { create } from "zustand";

interface AuthDialogState {
  isOpen: boolean;
  redirectUrl: string;
  countdownTime: number;
  openDialog: (redirectUrl?: string, countdownTime?: number) => void;
  closeDialog: () => void;
  handleRedirect: (url: string) => void;
}

export const useAuthDialogStore = create<AuthDialogState>((set, get) => ({
  isOpen: false,
  redirectUrl: "/login",
  countdownTime: 5,

  openDialog: (redirectUrl = "/login", countdownTime = 5) =>
    set({ isOpen: true, redirectUrl, countdownTime }),

  closeDialog: () => set({ isOpen: false }),

  // Default redirect handler - can be overridden by the application
  handleRedirect: (url: string) => {
    window.location.href = url;
    get().closeDialog();
  },
}));

// Hàm tiện ích để mở dialog từ bất kỳ đâu trong ứng dụng
export const openAuthExpiryDialog = (
  redirectUrl?: string,
  countdownTime?: number
) => {
  useAuthDialogStore.getState().openDialog(redirectUrl, countdownTime);
};

// Hàm tiện ích để đóng dialog
export const closeAuthExpiryDialog = () => {
  useAuthDialogStore.getState().closeDialog();
};

// Thiết lập hàm redirect tùy chỉnh (gọi trong App.tsx)
export const setAuthRedirectHandler = (handler: (url: string) => void) => {
  const state = useAuthDialogStore.getState();
  useAuthDialogStore.setState({
    ...state,
    handleRedirect: handler,
  });
};
