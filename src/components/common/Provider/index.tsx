"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store, { persistor } from "@/store";
import { useRouter } from "next/navigation"; // Thay đổi này
import { ThemeProvider } from "next-themes";
import { QuizProvider } from "@/components/home/quiz/context";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthDialogProvider from "@/lib/AuthDialogProvider";
import { setAuthRedirectHandler } from "@/lib/authDialogService";

// Tách AuthRedirectSetup thành client component riêng
const AuthRedirectSetup = () => {
  const router = useRouter();

  useEffect(() => {
    // Thiết lập hàm redirect sử dụng Next router
    setAuthRedirectHandler((url) => {
      router.push(url);
    });
  }, [router]);

  return null;
};

const ClientProvider: React.FC<{ children: React.ReactNode }> = React.memo(
  ({ children }) => {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider attribute="class">
            <AuthDialogProvider>
              <AuthRedirectSetup />
              <QuizProvider>{children}</QuizProvider>
              <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    icon: "🚀",
                  },
                  error: {
                    duration: 3000,
                    icon: "🚨",
                  },
                }}
              />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </AuthDialogProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
);

ClientProvider.displayName = "ClientProvider";

export default ClientProvider;
