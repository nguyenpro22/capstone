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
import type { ILoginRequest, ILoginResponse } from "../types";
import { useTranslations } from "next-intl";
import { supabase } from "../../../utils/supabaseClient";
import { useLocale } from "next-intl";
import { useDispatch } from "react-redux";
import { setUser } from "../slice";

// Types for authentication status
type AuthStatus = "idle" | "authenticating" | "authenticated" | "error";

// Constants
const AUTH_STATE_KEY = "auth_state";
const REDIRECT_TIMEOUT = 5000; // 5 seconds
const AUTH_TIMEOUT = 120000; // 2 minutes for OAuth authentication
// New key for tracking login success message display
const LOGIN_SUCCESS_SHOWN_KEY = "login_success_shown";

export const useAuth = () => {
  const router = useRouter();
  const t = useTranslations("api.auth.login");
  const [login] = useLoginMutation();
  const locale = useLocale();
  const [loginGoogle] = useLoginWithGoogleMutation();
  // Move the dispatch hook to the top level
  const dispatch = useDispatch();

  // Refined states
  const [authStatus, setAuthStatus] = useState<AuthStatus>("idle");
  const [authError, setAuthError] = useState<string | null>(null);
  const [userData, setUserData] = useState<TokenData | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [processingAuth, setProcessingAuth] = useState(false);
  const [hasShownLoginSuccess, setHasShownLoginSuccess] = useState(false);

  // References for handling timeouts and popups
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popupRef = useRef<Window | null>(null);
  const authCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialAuthCheckRef = useRef(false);
  const initialSignInProcessedRef = useRef(false);

  // Check if an auth event should be processed
  const shouldProcessAuthEvent = useCallback(() => {
    if (processingAuth) {
      console.log("Already processing auth event, ignoring");
      return false;
    }

    // Check for recent auth event
    const lastAuthTime = localStorage.getItem(AUTH_STATE_KEY);
    if (lastAuthTime) {
      const elapsed = Date.now() - Number.parseInt(lastAuthTime);
      if (elapsed < REDIRECT_TIMEOUT) {
        console.log(`Recent auth event detected (${elapsed}ms ago), ignoring`);
        return false;
      }
    }
    return true;
  }, [processingAuth]);

  // Mark auth event as processed
  const markAuthEventProcessed = useCallback(() => {
    localStorage.setItem(AUTH_STATE_KEY, Date.now().toString());
    // Also mark that we've shown login success message in this session
    localStorage.setItem(LOGIN_SUCCESS_SHOWN_KEY, "true");
  }, []);

  // Check if login success message has been shown
  const checkLoginSuccessShown = useCallback(() => {
    return localStorage.getItem(LOGIN_SUCCESS_SHOWN_KEY) === "true";
  }, []);

  // Check if on an auth page (login, register, etc.)
  const isOnAuthPage = useCallback(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      // Use regex for exact path matching rather than includes()
      return /^\/(login|auth|register|)$/.test(
        path.replace(`/${locale}/`, "/")
      );
    }
    return false;
  }, [locale]);

  // Function to redirect based on role
  const handleRedirectByRole = useCallback(
    (role: string) => {
      // Skip if already redirected recently
      if (hasRedirected) {
        console.log("Already redirected recently, ignoring");
        return;
      }

      // Skip if not on auth page
      if (!isOnAuthPage()) {
        console.log("Not on auth page, skipping redirect");
        return;
      }

      const roleRouteMap: Record<string, string | undefined> = {
        [ROLE.SYSTEM_ADMIN]: systemAdminRoutes.DEFAULT,
        [ROLE.DOCTOR]: doctorRoutes.DEFAULT,
        [ROLE.CUSTOMER]: customerRoutes.DEFAULT,
        [ROLE.CLINIC_STAFF]: clinicStaffRoutes.DEFAULT,
        [ROLE.CLINIC_ADMIN]: clinicAdminRoutes.DEFAULT,
        [ROLE.SYSTEM_STAFF]: systemStaffRoutes.DEFAULT,
      };

      const redirectPath = roleRouteMap[role] || "/";

      // Mark as redirected
      setHasRedirected(true);
      console.log(`Redirecting to ${redirectPath} based on role ${role}`);

      // Perform redirect
      router.push(redirectPath);

      // Reset state after timeout
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }

      redirectTimeoutRef.current = setTimeout(() => {
        setHasRedirected(false);
      }, REDIRECT_TIMEOUT);
    },
    [router, hasRedirected, isOnAuthPage]
  );

  // Centralized function to process authentication success
  const processAuthSuccess = useCallback(
    async (
      loginResponse: ILoginResponse,
      provider?: string,
      userName?: string,
      isInitialLoad = false
    ) => {
      try {
        // Set processing flag
        // REMOVED: const dispatch = useDispatch(); - This was causing the error
        setProcessingAuth(true);

        // Save tokens
        setAccessToken(loginResponse.accessToken);
        setRefreshToken(loginResponse.refreshToken);

        // Get user data
        dispatch(setUser(loginResponse));

        const { accessToken } = loginResponse;
        const userData = GetDataByToken(accessToken) as TokenData;
        setUserData(userData);

        // Update state
        setAuthStatus("authenticated");
        setAuthError(null);

        // Show success message only for fresh logins, not for session restores
        const shouldShowSuccessMessage =
          !isInitialLoad && !hasShownLoginSuccess && !checkLoginSuccessShown();

        if (shouldShowSuccessMessage) {
          // Mark that we've shown the success message
          setHasShownLoginSuccess(true);
          markAuthEventProcessed();

          if (provider) {
            showSuccess(
              t("providerLoginSuccess", { provider, userName: userName || "" })
            );
          } else {
            showSuccess(t("loginSuccess"));
          }
          console.log("Authentication successful:", userData);

          // Only redirect for new logins
          handleRedirectByRole(userData.roleName);
        }

        // Clean up timeouts
        if (authTimeoutRef.current) {
          clearTimeout(authTimeoutRef.current);
          authTimeoutRef.current = null;
        }

        if (authCheckIntervalRef.current) {
          clearInterval(authCheckIntervalRef.current);
          authCheckIntervalRef.current = null;
        }
      } catch (error) {
        console.error("Error processing authentication:", error);
        setAuthStatus("error");
        setAuthError(t("loginError"));
        showError(t("loginError"));
      } finally {
        // Clear processing flag
        setProcessingAuth(false);
      }
    },
    [
      t,
      handleRedirectByRole,
      markAuthEventProcessed,
      hasShownLoginSuccess,
      checkLoginSuccessShown,
      dispatch, // Add dispatch to dependencies
    ]
  );

  // Check if user is already authenticated on component load
  useEffect(() => {
    const checkAuth = async () => {
      // Prevent multiple initial auth checks
      if (initialAuthCheckRef.current) return;
      initialAuthCheckRef.current = true;

      const token = getAccessToken();

      if (token) {
        try {
          // Verify if token is valid
          const { data, error } = await supabase.auth.getSession();

          if (data?.session) {
            // Valid token, get user data
            const userData = GetDataByToken(token) as TokenData;
            setUserData(userData);
            setAuthStatus("authenticated");
            setHasShownLoginSuccess(checkLoginSuccessShown());
          } else {
            // Invalid or expired token
            // clearToken();
            setAuthStatus("idle");
            localStorage.removeItem(LOGIN_SUCCESS_SHOWN_KEY);
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          // clearToken();
          setAuthStatus("idle");
          localStorage.removeItem(LOGIN_SUCCESS_SHOWN_KEY);
        }
      }
    };

    checkAuth();
  }, [checkLoginSuccessShown]);

  // Listen for Supabase auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);

      if (event === "SIGNED_IN" && session) {
        // Skip if we've already processed a SIGNED_IN event and user is authenticated
        if (
          initialSignInProcessedRef.current &&
          authStatus === "authenticated"
        ) {
          console.log("Skipping redundant SIGNED_IN event");
          return;
        }

        // Check if we should process this event
        if (!shouldProcessAuthEvent()) {
          return;
        }

        try {
          // Set processing flag and mark as processed
          setProcessingAuth(true);
          initialSignInProcessedRef.current = true;

          // Log environment info for debugging
          console.log("Current domain:", window.location.origin);
          console.log("Environment:", process.env.NODE_ENV);
          console.log("Current path:", window.location.pathname);

          // Get Google token from session
          const loginGoogleResponse = await loginGoogle({
            googleToken: session.access_token,
          }).unwrap();

          // Process authentication success
          const provider = session.user?.app_metadata?.provider || "OAuth";
          const userName =
            session.user?.user_metadata?.full_name || session.user?.email || "";

          await processAuthSuccess(
            loginGoogleResponse.value,
            provider,
            userName
          );
        } catch (error) {
          console.error("Error processing authentication:", error);
          setAuthStatus("error");
          setAuthError(t("loginError"));
          showError(t("loginError"));
        } finally {
          // Clear processing flag
          setProcessingAuth(false);
        }
      } else if (event === "SIGNED_OUT") {
        clearToken();
        setUserData(null);
        setAuthStatus("idle");
        setAuthError(null);
        setHasShownLoginSuccess(false);
        localStorage.removeItem(AUTH_STATE_KEY);
        localStorage.removeItem(LOGIN_SUCCESS_SHOWN_KEY);
        initialSignInProcessedRef.current = false;
      } else if (event === "TOKEN_REFRESHED" && session) {
        // Update tokens without changing auth state or showing messages
        console.log("Token refreshed, updating without redirect");
        setAccessToken(session.access_token);
        if (session.refresh_token) {
          setRefreshToken(session.refresh_token);
        }
      }
    });

    // Clean up listener when component unmounts
    return () => {
      subscription.unsubscribe();

      // Clean up timeouts
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }

      if (authCheckIntervalRef.current) {
        clearInterval(authCheckIntervalRef.current);
      }

      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }

      // Close popup if open
      if (popupRef.current && !popupRef.current.closed) {
        try {
          popupRef.current.close();
        } catch (e) {
          // Ignore errors when closing popup
        }
      }
    };
  }, [
    t,
    handleRedirectByRole,
    loginGoogle,
    shouldProcessAuthEvent,
    markAuthEventProcessed,
    processAuthSuccess,
    authStatus,
  ]);

  // Listen for messages from popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify message origin
      if (event.origin !== window.location.origin) return;

      console.log(
        "Received message:",
        event.data,
        "from origin:",
        event.origin
      );

      // Verify message type
      if (event.data?.type === "AUTH_COMPLETE") {
        console.log("Received AUTH_COMPLETE message from popup", event.data);

        // Check if we should process this event
        if (!shouldProcessAuthEvent()) {
          return;
        }

        // Verify session
        supabase.auth.getSession();

        // Clear intervals
        if (authCheckIntervalRef.current) {
          clearInterval(authCheckIntervalRef.current);
          authCheckIntervalRef.current = null;
        }

        // Handle error
        if (event.data?.error) {
          setAuthStatus("error");
          setAuthError(event.data.error);
          showError(event.data.error);
        }

        // Note: Token processing is now handled by the Supabase auth listener
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [t, handleRedirectByRole, shouldProcessAuthEvent]);

  // Function to login with credentials
  const handleLogin = useCallback(
    async (credentials: ILoginRequest) => {
      // Check if we should process this event
      if (!shouldProcessAuthEvent()) {
        return;
      }

      try {
        // Set processing flag
        setProcessingAuth(true);

        // Update state
        setAuthStatus("authenticating");
        setAuthError(null);
        setHasShownLoginSuccess(false);
        localStorage.removeItem(LOGIN_SUCCESS_SHOWN_KEY);

        const response = await login(credentials).unwrap();

        if (response.isSuccess) {
          // Process authentication success
          await processAuthSuccess(response.value);
        } else {
          setAuthStatus("error");
          setAuthError(t("loginError"));
          showError(t("loginError"));
        }
      } catch (error: any) {
        console.error("Login error:", error);
        setAuthStatus("error");

        // Handle different error types
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
      } finally {
        // Clear processing flag
        setProcessingAuth(false);
      }
    },
    [login, t, shouldProcessAuthEvent, processAuthSuccess]
  );

  // Function to logout
  const handleLogout = useCallback(async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error signing out:", error.message);
        showError(t("logoutError"));
        return;
      }

      // Clear tokens and state
      // clearToken();
      await fetch("/api/logout", { method: "POST" });
      setUserData(null);
      setAuthStatus("idle");
      setAuthError(null);
      setHasShownLoginSuccess(false);
      initialSignInProcessedRef.current = false;
      localStorage.removeItem(AUTH_STATE_KEY);
      localStorage.removeItem(LOGIN_SUCCESS_SHOWN_KEY);

      // Show success message
      showSuccess(t("logoutSuccess"));

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      showError(t("logoutError"));
    }
  }, [router, t]);

  // Function to sign in with providers (Google, GitHub, etc.)
  const signInWithProvider = useCallback(
    async (provider: "github" | "google") => {
      // Check if authentication is already in progress
      if (authStatus === "authenticating" || processingAuth) {
        console.log("Authentication already in progress, ignoring request");
        return;
      }

      try {
        // Set processing flag
        setProcessingAuth(true);

        // Reset login message state for new login attempts
        setHasShownLoginSuccess(false);
        localStorage.removeItem(LOGIN_SUCCESS_SHOWN_KEY);

        // Update state
        setAuthStatus("authenticating");
        setAuthError(null);

        // Create callback URL with language prefix
        const currentDomain = window.location.origin;
        const popupCallbackUrl = `${currentDomain}/${locale}/popup-callback`;

        console.log("Using callback URL:", popupCallbackUrl);
        console.log("Environment:", process.env.NODE_ENV);
        console.log("Current domain:", currentDomain);

        // Start authentication flow
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

        // Handle errors
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

        // Open popup
        if (data?.url) {
          // Close previous popup if exists
          if (popupRef.current && !popupRef.current.closed) {
            try {
              popupRef.current.close();
            } catch (e) {
              // Ignore errors when closing popup
            }
          }

          // Calculate popup dimensions
          const width = 600;
          const height = 600;
          const left = window.innerWidth / 2 - width / 2;
          const top = window.innerHeight / 2 - height / 2;

          // Open new popup
          popupRef.current = window.open(
            data.url,
            "Login",
            `width=${width},height=${height},top=${top},left=${left},status=yes,toolbar=no,menubar=no,location=no`
          );

          // Check if popup opened successfully
          if (!popupRef.current) {
            setAuthStatus("error");
            setAuthError(t("popupBlocked"));
            showError(t("popupBlocked"));
            return;
          }

          // Set timeout to cancel authentication
          if (authTimeoutRef.current) {
            clearTimeout(authTimeoutRef.current);
          }

          authTimeoutRef.current = setTimeout(() => {
            setAuthStatus("error");
            setAuthError(t("authTimeout"));
            showError(t("authTimeout"));

            // Close popup if still open
            if (popupRef.current && !popupRef.current.closed) {
              try {
                popupRef.current.close();
              } catch (e) {
                // Ignore errors when closing popup
              }
            }

            // Clear processing flag
            setProcessingAuth(false);
          }, AUTH_TIMEOUT);

          // Periodically check if popup is closed
          if (authCheckIntervalRef.current) {
            clearInterval(authCheckIntervalRef.current);
          }

          authCheckIntervalRef.current = setInterval(() => {
            if (popupRef.current && popupRef.current.closed) {
              clearInterval(authCheckIntervalRef.current!);
              authCheckIntervalRef.current = null;

              // Verify if authentication was successful
              supabase.auth.getSession().then(({ data }) => {
                if (!data.session) {
                  // If no session after closing popup, authentication failed
                  setAuthStatus("error");
                  setAuthError(t("authCancelled"));
                  showError(t("authCancelled"));

                  // Clear processing flag
                  setProcessingAuth(false);
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

        // Clear processing flag
        setProcessingAuth(false);
      }
    },
    [t, locale, authStatus, processingAuth]
  );

  // Check if user is authenticated
  const isAuthenticated = authStatus === "authenticated" && !!userData;

  // Check if authentication is in progress
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
