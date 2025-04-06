"use client";

import { useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Loader2 } from "lucide-react";

export default function PopupCallbackPage() {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Log the current URL for debugging
        console.log("Popup callback URL:", window.location.href);
        console.log("Origin:", window.location.origin);

        // Get the session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session in popup:", error.message);

          // Send error message to parent window
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "AUTH_COMPLETE",
                success: false,
                error: error.message,
              },
              window.location.origin
            );
          }

          // Close the popup after a short delay
          setTimeout(() => window.close(), 1000);
          return;
        }

        if (data?.session) {
          console.log("Session found in popup, sending to parent window");

          // Send success message to parent window
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "AUTH_COMPLETE",
                success: true,
                session: {
                  accessToken: data.session.access_token,
                  refreshToken: data.session.refresh_token,
                },
              },
              window.location.origin
            );
          }
        } else {
          console.error("No session found in popup");

          // Send error message to parent window
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "AUTH_COMPLETE",
                success: false,
                error: "No session found",
              },
              window.location.origin
            );
          }
        }

        // Close the popup after a short delay
        setTimeout(() => window.close(), 1000);
      } catch (error) {
        console.error("Unexpected error in popup callback:", error);

        // Send error message to parent window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "AUTH_COMPLETE",
              success: false,
              error: "Unexpected error",
            },
            window.location.origin
          );
        }

        // Close the popup after a short delay
        setTimeout(() => window.close(), 1000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Đang xác thực...</p>
    </div>
  );
}
