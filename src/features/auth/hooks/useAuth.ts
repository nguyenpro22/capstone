import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { setAccessToken, setRefreshToken } from "@/utils";
import { showError, showSuccess } from "@/utils";
import { publicRoutes } from "@/constants";
import { useLoginMutation } from "../api";
import { ILoginRequest } from "../types";
import { useTranslations } from "next-intl";
import { supabase } from "../../../utils/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

export const useAuth = () => {
  const router = useRouter();
  const t = useTranslations("api.auth.login");
  const [login] = useLoginMutation();

  const handleLogin = useCallback(
    async (credentials: ILoginRequest) => {
      try {
        const response = await login(credentials).unwrap();
        if (response.isSuccess) {
          const { accessToken, refreshToken } = response.value;
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          showSuccess(t("loginSuccess"));
          router.push(publicRoutes.HOME);
        }
      } catch (error) {
        showError(t("loginError"));
        console.error(error);
      }
    },
    [login, router, t]
  );

  const handleLogout = useCallback(async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        showError(t("logoutError"));
        console.error("Error signing out:", error.message);
        return;
      }

      showSuccess(t("logoutSuccess"));
      // Optionally, redirect the user after logout
      router.push("/login");
    } catch (error) {
      showError(t("logoutError"));
      console.error("Unexpected error:", error);
    }
  }, [router, t]);

  const signInWithProvider = useCallback(
    async (provider: "github" | "google") => {
      try {
        // Đăng nhập vs supabase ("github" | "google")
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            // redirectTo: window.location.origin,
            // skipBrowserRedirect: true, // Chặn redirect trên browser
          },
        });

        // Xử lý lỗi
        if (error) {
          showError(t("providerLoginError", { provider }));
          console.error("Error signing in with provider:", error.message);
          return;
        }

        // Lấy dữ liệu session của supabase
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error fetching session:", sessionError.message);
          showError(t("fetchSessionError"));
          return;
        }

        const session: Session | null = sessionData?.session ?? null;
        const user: User | null = session?.user ?? null;

        if (user) {
          // log ra thông tin user
          console.log("Logged-in user:", user);
          showSuccess(
            t("providerLoginSuccess", {
              provider,
              userName: user.user_metadata.full_name || user.email,
            })
          );
        } else {
          showError(t("userNotFoundError"));
        }
      } catch (error) {
        showError(t("providerLoginError", { provider }));
        console.error("Unexpected error:", error);
      }
    },
    [t]
  );

  return { handleLogin, handleLogout, signInWithProvider };
};
