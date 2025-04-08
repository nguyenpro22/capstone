"use client";

import React from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store, { persistor } from "@/store";

import { ThemeProvider } from "next-themes";
import { QuizProvider } from "@/components/home/quiz/context";
import { PersistGate } from "redux-persist/integration/react";

const ClientProvider: React.FC<{ children: React.ReactNode }> = React.memo(
  ({ children }) => {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider attribute="class">
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
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
);

ClientProvider.displayName = "ClientProvider";

export default ClientProvider;
