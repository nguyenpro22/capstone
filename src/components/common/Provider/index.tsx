"use client";

import React from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "@/store";

import { ThemeProvider } from "next-themes";
import { LivestreamProvider } from "@/components/clinicManager/livestream/context";

const ClientProvider: React.FC<{ children: React.ReactNode }> = React.memo(
  ({ children }) => {
    return (
      <Provider store={store}>
        <ThemeProvider attribute="class">
          <LivestreamProvider>{children}</LivestreamProvider>
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
      </Provider>
    );
  }
);

ClientProvider.displayName = "ClientProvider";

export default ClientProvider;
