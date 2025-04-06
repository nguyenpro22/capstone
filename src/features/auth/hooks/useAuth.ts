"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  setAccessToken,
  setRefreshToken,
  clearToken,
  getAccessToken,
  GetDataByToken,
  showError,
  showSuccess,
  type TokenData,
} from "@/utils";
import {
  clinicAdminRoutes,
  clinicStaffRoutes,
  customerRoutes,
  doctorRoutes,
  ROLE,
  systemAdminRoutes,
  systemStaffRoutes,
} from "@/constants";
import { useLoginMutation, useLoginWithGoogleMutation } from "../api";
import type { ILoginRequest } from "../types";
import { useTranslations } from "next-intl";
import { supabase } from "../../../utils/supabaseClient";
import { useLocale } from "next-intl";
import { get } from "http";

// Tipos para el estado de autenticación
type AuthStatus = "idle" | "authenticating" | "authenticated" | "error";

export const useAuth = () => {
  const router = useRouter();
  const t = useTranslations("api.auth.login");
  const [login] = useLoginMutation();
  const locale = useLocale(); // Obtener el idioma actual
  const [loginGoogle] = useLoginWithGoogleMutation();
  // Estados refinados
  const [authStatus, setAuthStatus] = useState<AuthStatus>("idle");
  const [authError, setAuthError] = useState<string | null>(null);
  const [userData, setUserData] = useState<TokenData | null>(null);

  // Referencias para manejar timeouts y popups
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popupRef = useRef<Window | null>(null);
  const authCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Función para redirigir según el rol
  const handleRedirectByRole = useCallback(
    (role: string) => {
      const roleRouteMap: Record<string, string | undefined> = {
        [ROLE.SYSTEM_ADMIN]: systemAdminRoutes.DEFAULT,
        [ROLE.DOCTOR]: doctorRoutes.DEFAULT,
        [ROLE.CUSTOMER]: customerRoutes.DEFAULT,
        [ROLE.CLINIC_STAFF]: clinicStaffRoutes.DEFAULT,
        [ROLE.CLINIC_ADMIN]: clinicAdminRoutes.DEFAULT,
        [ROLE.SYSTEM_STAFF]: systemStaffRoutes.DEFAULT,
      };

      const redirectPath = roleRouteMap[role] || "/";
      router.push(redirectPath);
    },
    [router]
  );

  // Verificar si el usuario ya está autenticado al cargar el componente
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();

      if (token) {
        try {
          // Verificar si el token es válido
          const { data, error } = await supabase.auth.getSession();

          if (data?.session) {
            // Token válido, obtener datos del usuario
            const userData = GetDataByToken(token) as TokenData;
            setUserData(userData);
            setAuthStatus("authenticated");
          } else {
            // Token inválido o expirado
            clearToken();
            setAuthStatus("idle");
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          clearToken();
          setAuthStatus("idle");
        }
      }
    };

    checkAuth();
  }, []);

  // Escuchar cambios en la sesión de Supabase
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);

      if (event === "SIGNED_IN" && session) {
        try {
          // Guardar tokens
          const loginGoogleResponse = await loginGoogle({
            googleToken: session.access_token,
          }).unwrap();
          setAccessToken(loginGoogleResponse.value.accessToken);
          setRefreshToken(loginGoogleResponse.value.refreshToken);
          // Obtener datos del usuario
          const userData = GetDataByToken(
            loginGoogleResponse.value.accessToken
          ) as TokenData;
          setUserData(userData);

          // Actualizar estado
          setAuthStatus("authenticated");
          setAuthError(null);

          // Mostrar mensaje de éxito
          const provider = session.user?.app_metadata?.provider || "OAuth";
          const userName =
            session.user?.user_metadata?.full_name || session.user?.email || "";

          showSuccess(t("providerLoginSuccess", { provider, userName }));

          // Limpiar timeouts
          if (authTimeoutRef.current) {
            clearTimeout(authTimeoutRef.current);
            authTimeoutRef.current = null;
          }

          if (authCheckIntervalRef.current) {
            clearInterval(authCheckIntervalRef.current);
            authCheckIntervalRef.current = null;
          }

          // Redirigir según el rol
          handleRedirectByRole(userData.role);
        } catch (error) {
          console.error("Error processing authentication:", error);
          setAuthStatus("error");
          setAuthError(t("loginError"));
          showError(t("loginError"));
        }
      } else if (event === "SIGNED_OUT") {
        clearToken();
        setUserData(null);
        setAuthStatus("idle");
        setAuthError(null);
      } else if (event === "TOKEN_REFRESHED" && session) {
        // Actualizar tokens
        setAccessToken(session.access_token);
        if (session.refresh_token) {
          setRefreshToken(session.refresh_token);
        }
      }
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      subscription.unsubscribe();

      // Limpiar timeouts
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }

      if (authCheckIntervalRef.current) {
        clearInterval(authCheckIntervalRef.current);
      }

      // Cerrar popup si está abierto
      if (popupRef.current && !popupRef.current.closed) {
        try {
          popupRef.current.close();
        } catch (e) {
          // Ignorar errores al cerrar el popup
        }
      }
    };
  }, [t, handleRedirectByRole]);

  // Escuchar mensajes de la ventana popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verificar origen del mensaje
      if (event.origin !== window.location.origin) return;

      // Verificar tipo de mensaje
      if (event.data?.type === "AUTH_COMPLETE") {
        console.log("Received AUTH_COMPLETE message from popup", event.data);

        // Si el mensaje contiene datos de sesión, procesarlos
        if (event.data.success && event.data.session) {
          const { accessToken, refreshToken } = event.data.session;
          console.log("Access Token:", event);
          // Guardar tokens
          // if (accessToken) {
          //   setAccessToken(accessToken);

          //   if (refreshToken) {
          //     setRefreshToken(refreshToken);
          //   }

          //   // Obtener datos del usuario
          //   try {
          //     const userData = GetDataByToken(accessToken) as TokenData;
          //     setUserData(userData);

          //     // Actualizar estado
          //     setAuthStatus("authenticated");
          //     setAuthError(null);

          //     // Mostrar mensaje de éxito
          //     showSuccess(
          //       t("providerLoginSuccess", {
          //         provider: userData.app_metadata?.provider || "OAuth",
          //         userName: userData.name || userData.email || "",
          //       })
          //     );

          //     // Limpiar timeouts
          //     if (authTimeoutRef.current) {
          //       clearTimeout(authTimeoutRef.current);
          //       authTimeoutRef.current = null;
          //     }

          //     if (authCheckIntervalRef.current) {
          //       clearInterval(authCheckIntervalRef.current);
          //       authCheckIntervalRef.current = null;
          //     }

          //     // Redirigir según el rol
          //     handleRedirectByRole(userData.role);
          //   } catch (error) {
          //     console.error("Error processing token from popup:", error);
          //     setAuthStatus("error");
          //     setAuthError(t("tokenProcessingError"));
          //     showError(t("tokenProcessingError"));
          //   }
          // }
        }

        // Verificar la sesión
        supabase.auth.getSession();

        // Limpiar intervalos
        if (authCheckIntervalRef.current) {
          clearInterval(authCheckIntervalRef.current);
          authCheckIntervalRef.current = null;
        }

        // Si el mensaje indica error
        if (event.data?.error) {
          setAuthStatus("error");
          setAuthError(event.data.error);
          showError(event.data.error);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [t, handleRedirectByRole]);

  // Función para iniciar sesión con credenciales
  const handleLogin = useCallback(
    async (credentials: ILoginRequest) => {
      try {
        setAuthStatus("authenticating");
        setAuthError(null);

        const response = await login(credentials).unwrap();

        if (response.isSuccess) {
          const { accessToken, refreshToken } = response.value;

          // Guardar tokens
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          console.log("accesstoken:", getAccessToken());

          // Obtener datos del usuario
          const userData = GetDataByToken(accessToken) as TokenData;
          setUserData(userData);

          // Actualizar estado
          setAuthStatus("authenticated");

          // Mostrar mensaje de éxito
          showSuccess(t("loginSuccess"));
          console.log("Login successful:", userData);

          // Redirigir según el rol
          handleRedirectByRole(userData.role);
        } else {
          setAuthStatus("error");
          setAuthError(t("loginError"));
          showError(t("loginError"));
        }
      } catch (error: any) {
        console.error("Login error:", error);
        setAuthStatus("error");

        // Manejar diferentes tipos de errores
        if (error?.data?.status === 500) {
          setAuthError(t("invalidCredentials"));
          showError(t("invalidCredentials"));
        } else if (error?.data?.status === 400) {
          setAuthError(t("userNotFound"));
          showError(t("userNotFound"));
        } else {
          setAuthError(t("generalError"));
          showError(t("generalError"));
        }
      }
    },
    [login, router, t, handleRedirectByRole]
  );

  // Función para cerrar sesión
  const handleLogout = useCallback(async () => {
    try {
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error signing out:", error.message);
        showError(t("logoutError"));
        return;
      }

      // Limpiar tokens y estado
      // clearToken();
      setUserData(null);
      setAuthStatus("idle");
      setAuthError(null);

      // Mostrar mensaje de éxito
      showSuccess(t("logoutSuccess"));

      // Redirigir a la página de inicio de sesión
      router.push("/login");
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      showError(t("logoutError"));
    }
  }, [router, t]);

  // Función para iniciar sesión con proveedores (Google, GitHub, etc.)
  const signInWithProvider = useCallback(
    async (provider: "github" | "google") => {
      try {
        // Actualizar estado
        setAuthStatus("authenticating");
        setAuthError(null);

        // Crear URL de callback con el prefijo de idioma
        const popupCallbackUrl = `${window.location.origin}/${locale}/popup-callback`;
        console.log("Using callback URL:", popupCallbackUrl);

        // Iniciar flujo de autenticación
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: popupCallbackUrl,
            skipBrowserRedirect: true,
            queryParams: {
              access_type: "offline",
              prompt: "select_account",
            },
          },
        });

        // Manejar errores
        if (error) {
          console.error(
            "Error initiating sign in with provider:",
            error.message
          );
          setAuthStatus("error");
          setAuthError(t("providerLoginError", { provider }));
          showError(t("providerLoginError", { provider }));
          return;
        }

        // Abrir popup
        if (data?.url) {
          // Cerrar popup anterior si existe
          if (popupRef.current && !popupRef.current.closed) {
            try {
              popupRef.current.close();
            } catch (e) {
              // Ignorar errores al cerrar el popup
            }
          }

          // Calcular dimensiones del popup
          const width = 600;
          const height = 600;
          const left = window.innerWidth / 2 - width / 2;
          const top = window.innerHeight / 2 - height / 2;

          // Abrir nuevo popup
          popupRef.current = window.open(
            data.url,
            "Login",
            `width=${width},height=${height},top=${top},left=${left},status=yes,toolbar=no,menubar=no,location=no`
          );

          // Verificar si el popup se abrió correctamente
          if (!popupRef.current) {
            setAuthStatus("error");
            setAuthError(t("popupBlocked"));
            showError(t("popupBlocked"));
            return;
          }

          // Establecer timeout para cancelar la autenticación
          if (authTimeoutRef.current) {
            clearTimeout(authTimeoutRef.current);
          }

          authTimeoutRef.current = setTimeout(() => {
            setAuthStatus("error");
            setAuthError(t("authTimeout"));
            showError(t("authTimeout"));

            // Cerrar popup si sigue abierto
            if (popupRef.current && !popupRef.current.closed) {
              try {
                popupRef.current.close();
              } catch (e) {
                // Ignorar errores al cerrar el popup
              }
            }
          }, 120000); // 2 minutos

          // Verificar periódicamente si el popup se cerró
          if (authCheckIntervalRef.current) {
            clearInterval(authCheckIntervalRef.current);
          }

          authCheckIntervalRef.current = setInterval(() => {
            if (popupRef.current && popupRef.current.closed) {
              clearInterval(authCheckIntervalRef.current!);
              authCheckIntervalRef.current = null;

              // Verificar si la autenticación fue exitosa
              supabase.auth.getSession().then(({ data }) => {
                if (!data.session) {
                  // Si no hay sesión después de cerrar el popup, la autenticación falló
                  setAuthStatus("error");
                  setAuthError(t("authCancelled"));
                  showError(t("authCancelled"));
                }
              });
            }
          }, 1000);
        }
      } catch (error) {
        console.error("Unexpected error during provider auth:", error);
        setAuthStatus("error");
        setAuthError(t("providerLoginError", { provider }));
        showError(t("providerLoginError", { provider }));
      }
    },
    [t, locale, handleRedirectByRole]
  );

  // Verificar si el usuario está autenticado
  const isAuthenticated = authStatus === "authenticated" && !!userData;

  // Verificar si la autenticación está en proceso
  const isAuthenticating = authStatus === "authenticating";

  return {
    handleLogin,
    handleLogout,
    signInWithProvider,
    isAuthenticated,
    isAuthenticating,
    authStatus,
    authError,
    userData,
  };
};
