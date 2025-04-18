// AuthDialogProvider.tsx
import { ReactNode } from "react";
import AuthExpiryDialog from "./AuthExpiryDialog";
import { useAuthDialogStore } from "./authDialogService";

interface AuthDialogProviderProps {
  children: ReactNode;
}

export const AuthDialogProvider = ({ children }: AuthDialogProviderProps) => {
  const { isOpen, redirectUrl, countdownTime, handleRedirect, closeDialog } =
    useAuthDialogStore();

  return (
    <>
      {children}
      <AuthExpiryDialog
        open={isOpen}
        onOpenChange={closeDialog}
        redirectUrl={redirectUrl}
        countdownTime={countdownTime}
        onRedirect={handleRedirect}
      />
    </>
  );
};

export default AuthDialogProvider;
