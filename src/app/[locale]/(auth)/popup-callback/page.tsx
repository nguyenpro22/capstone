"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabaseClient";

export default function AuthPopupCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    // Modificar la función handleCallback para extraer los parámetros del fragmento de URL
    const handleCallback = async () => {
      try {
        // Extraer los parámetros del fragmento de URL
        const hashParams = window.location.hash.substring(1);
        const params = new URLSearchParams(hashParams);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken) {
          console.log(
            "Authentication successful - token found in URL fragment"
          );
          setStatus("success");

          // Intentar enviar un mensaje a la ventana principal
          try {
            if (window.opener && window.opener.postMessage) {
              window.opener.postMessage(
                {
                  type: "AUTH_COMPLETE",
                  success: true,
                  session: {
                    accessToken,
                    refreshToken,
                  },
                },
                window.location.origin
              );
              console.log("Success message sent to parent window");
            }
          } catch (msgError) {
            console.error(
              "Error sending success message to parent window:",
              msgError
            );
          }

          // Iniciar cuenta regresiva para cerrar
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                window.close();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          // Limpiar el temporizador si el componente se desmonta
          return () => clearInterval(timer);
        } else {
          // Si no hay token en el fragmento, intentar obtener la sesión de Supabase
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            console.error("Error getting session:", error.message);
            setStatus("error");
            setErrorMessage(error.message);

            // Enviar mensaje de error a la ventana principal
            if (window.opener && window.opener.postMessage) {
              try {
                window.opener.postMessage(
                  {
                    type: "AUTH_COMPLETE",
                    success: false,
                    error: error.message,
                  },
                  window.location.origin
                );
              } catch (msgError) {
                console.error(
                  "Error sending error message to parent window:",
                  msgError
                );
              }
            }
            return;
          }

          if (data?.session) {
            console.log("Authentication successful - session found via API");
            setStatus("success");

            // Intentar enviar un mensaje a la ventana principal
            try {
              if (window.opener && window.opener.postMessage) {
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
                console.log("Success message sent to parent window");
              }
            } catch (msgError) {
              console.error(
                "Error sending success message to parent window:",
                msgError
              );
            }

            // Iniciar cuenta regresiva para cerrar
            const timer = setInterval(() => {
              setCountdown((prev) => {
                if (prev <= 1) {
                  clearInterval(timer);
                  window.close();
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);

            // Limpiar el temporizador si el componente se desmonta
            return () => clearInterval(timer);
          } else {
            setStatus("error");
            setErrorMessage("No session found");

            // Enviar mensaje de error a la ventana principal
            if (window.opener && window.opener.postMessage) {
              try {
                window.opener.postMessage(
                  {
                    type: "AUTH_COMPLETE",
                    success: false,
                    error: "No session found",
                  },
                  window.location.origin
                );
              } catch (msgError) {
                console.error(
                  "Error sending error message to parent window:",
                  msgError
                );
              }
            }
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setStatus("error");
        setErrorMessage("An unexpected error occurred");

        // Enviar mensaje de error a la ventana principal
        if (window.opener && window.opener.postMessage) {
          try {
            window.opener.postMessage(
              {
                type: "AUTH_COMPLETE",
                success: false,
                error: "An unexpected error occurred",
              },
              window.location.origin
            );
          } catch (msgError) {
            console.error(
              "Error sending error message to parent window:",
              msgError
            );
          }
        }
      }
    };

    handleCallback();
  }, []);

  const closeWindow = () => {
    window.close();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Đang xác thực...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Vui lòng đợi trong khi chúng tôi hoàn tất quá trình đăng nhập.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Đăng nhập thành công!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Bạn đã đăng nhập thành công. Cửa sổ này sẽ tự động đóng sau{" "}
              {countdown} giây.
            </p>
            <div className="pt-2">
              <Button
                onClick={closeWindow}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Đóng cửa sổ ngay
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Đăng nhập thất bại
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {errorMessage ||
                "Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại."}
            </p>
            <div className="pt-2">
              <Button
                onClick={closeWindow}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Đóng cửa sổ
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
