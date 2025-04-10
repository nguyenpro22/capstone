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
import { useLocale } from "next-intl";
import { useDispatch } from "react-redux";
import { setUser } from "../slice";

import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { firebaseApp } from "../../../utils/firebaseClient";

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
  
  // Initialize Firebase auth
  const auth = getAuth(firebaseApp);
  const googleProvider = new GoogleAuthProvider();

  // Refined states
  const [authStatus, setAuthStatus] = useState<AuthStatus>("idle");
  const [authError, setAuthError] = useState<string | null>(null);
  const [userData, setUserData] = useState<TokenData | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [processingAuth, setProcessingAuth] = useState(false);
  const [hasShownLoginSuccess, setHasShownLoginSuccess] = useState(false);

  // References for handling timeouts
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
      dispatch,
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
          // Firebase will handle session state through onAuthStateChanged
          // We just need to verify our cached token is valid
          const user = auth.currentUser;
          
          if (user) {
            // Valid token, get user data
            const userData = GetDataByToken(token) as TokenData;
            setUserData(userData);
            setAuthStatus("authenticated");
            setHasShownLoginSuccess(checkLoginSuccessShown());
          } else {
            // Invalid or expired token
            clearToken();
            setAuthStatus("idle");
            localStorage.removeItem(LOGIN_SUCCESS_SHOWN_KEY);
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          clearToken();
          setAuthStatus("idle");
          localStorage.removeItem(LOGIN_SUCCESS_SHOWN_KEY);
        }
      }
    };

    checkAuth();
  }, [auth, checkLoginSuccessShown]);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? "SIGNED_IN" : "SIGNED_OUT");

      if (user && user.uid) {
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

          // Get ID token from Firebase
          const idToken = await user.getIdToken();
          console.log("Got Firebase ID token");

          // Exchange Firebase token for your backend token
          const loginGoogleResponse = await loginGoogle({
            googleToken: idToken,
          }).unwrap();

          // Process authentication success
          const provider = user.providerData[0]?.providerId || "Firebase";
          const userName = user.displayName || user.email || "";

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
      } else if (!user) {
        // User is signed out
        clearToken();
        setUserData(null);
        setAuthStatus("idle");
        setAuthError(null);
        setHasShownLoginSuccess(false);
        localStorage.removeItem(AUTH_STATE_KEY);
        localStorage.removeItem(LOGIN_SUCCESS_SHOWN_KEY);
        initialSignInProcessedRef.current = false;
      }
    });

    // Clean up listener when component unmounts
    return () => {
      unsubscribe();

      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [
    t,
    auth,
    handleRedirectByRole,
    loginGoogle,
    shouldProcessAuthEvent,
    markAuthEventProcessed,
    processAuthSuccess,
    authStatus,
  ]);

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

        // First sign in with Firebase
        try {
          await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
          // Firebase auth state change listener will handle the rest
        } catch (firebaseError: any) {
          console.error("Firebase login error:", firebaseError);
          
          // Handle Firebase-specific errors
          if (firebaseError.code === 'auth/invalid-credential' || 
              firebaseError.code === 'auth/wrong-password') {
            setAuthStatus("error");
            setAuthError(t("invalidCredentials"));
            showError(t("invalidCredentials"));
          } else if (firebaseError.code === 'auth/user-not-found') {
            setAuthStatus("error");
            setAuthError(t("userNotFound"));
            showError(t("userNotFound"));
          } else {
            // Fall back to backend authentication for other errors
            const response = await login(credentials).unwrap();

            if (response.isSuccess) {
              // Process authentication success
              await processAuthSuccess(response.value);
            } else {
              setAuthStatus("error");
              setAuthError(t("loginError"));
              showError(t("loginError"));
            }
          }
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
    [auth, login, t, shouldProcessAuthEvent, processAuthSuccess]
  );

  // Function to logout
  const handleLogout = useCallback(async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);


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
  }, [auth, router, t]);

  // Function to sign in with Google
  const signInWithProvider = useCallback(
    async (provider: "github" | "google") => {
      if (authStatus === "authenticating" || processingAuth) {
        console.log("Authentication already in progress, ignoring request");
        return;
      }

      try {
        setProcessingAuth(true);

        setHasShownLoginSuccess(false);
        localStorage.removeItem(LOGIN_SUCCESS_SHOWN_KEY);

        setAuthStatus("authenticating");
        setAuthError(null);

        if (provider === "google") {
          googleProvider.setCustomParameters({
            prompt: 'select_account',
          });
          
          await signInWithPopup(auth, googleProvider);
          
        } else if (provider === "github") {
          setAuthStatus("error");
          setAuthError(t("providerNotSupported", { provider }));
          showError(t("providerNotSupported", { provider }));
        }
      } catch (error: any) {
        console.error("Unexpected error during provider auth:", error);
        
        if (error.code === 'auth/popup-closed-by-user') {
          setAuthStatus("error");
          setAuthError(t("authCancelled"));
          showError(t("authCancelled"));
        } else if (error.code === 'auth/popup-blocked') {
          setAuthStatus("error");
          setAuthError(t("popupBlocked"));
          showError(t("popupBlocked"));
        } else {
          setAuthStatus("error");
          setAuthError(t("providerLoginError", { provider }));
          showError(t("providerLoginError", { provider }));
        }

        setProcessingAuth(false);
      }
    },
    [auth, googleProvider, t, authStatus, processingAuth]
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