import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { firebaseApp } from "@/utils/firebaseClient";
import {
  setAccessToken,
  setRefreshToken,
  clearToken,
  getAccessToken,
  GetDataByToken,
  showError,
  showSuccess,
} from "@/utils";
import { handleRedirectByRole } from "./auth-redirect";
import type { TokenData } from "@/utils";
import { setUser } from "../slice";
import type { IResCommon, ValidationErrorResponse } from "@/lib/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ILoginRequest, ILoginResponse } from "../types";
// Constants
const LOGIN_SUCCESS_SHOWN_KEY = "login_success_shown";
const AUTH_STATE_KEY = "auth_state";

// Initialize Firebase auth
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
type LoginFunctionType = (credentials: ILoginRequest) => Promise<{
  data: IResCommon<ILoginResponse>;
}>;
/**
 * Xử lý đăng nhập với email và mật khẩu
 */
export const handleLogin = async ({
  email,
  password,
  t,
  login,
  dispatch,
  router,
  rememberMe,
  setRememberMeCookie,
  getCookie,
  CookieStorageKey,
}: {
  email: string;
  password: string;
  t: any; // Translation function
  login: any; // Login mutation function
  dispatch: any; // Redux dispatch
  router: any; // Next.js router
  rememberMe: boolean;
  setRememberMeCookie: (token: string, refreshToken: string) => void;
  getCookie: (key: string) => string | null;
  CookieStorageKey: { REFRESH_TOKEN: string };
}): Promise<{
  success: boolean;
  error?: string;
  errorData?: ValidationErrorResponse;
}> => {
  try {
    // Đánh dấu thời gian xử lý để tránh xử lý trùng lặp
    localStorage.setItem(AUTH_STATE_KEY, Date.now().toString());
    localStorage.removeItem(LOGIN_SUCCESS_SHOWN_KEY);

    // Thử đăng nhập với backend trước
    try {
      const response = await login({ email, password });
      const loginData = response.data;
      const { isFirstLogin } = GetDataByToken(
        loginData.value.accessToken
      ) as TokenData;
      console.log("log ne", isFirstLogin);

      if (loginData.isSuccess) {
        // Nếu backend thành công, đồng bộ với Firebase
        try {
          // Kiểm tra xem đã đăng nhập Firebase chưa
          const currentUser = auth.currentUser;
          if (!currentUser) {
            await signInWithEmailAndPassword(auth, email, password);
          }
        } catch (firebaseError: any) {
          // Ghi log lỗi Firebase nhưng vẫn tiếp tục với token từ backend
          console.warn(
            "Firebase sync warning (không ảnh hưởng đến đăng nhập):",
            firebaseError
          );
        }

        // Xử lý đăng nhập thành công
        await processAuthSuccess({
          loginResponse: loginData.value,
          t,
          dispatch,
          router,
          isFirstLogin,
        });

        // Xử lý "Remember Me"
        if (rememberMe) {
          const token = getAccessToken();
          const refreshToken = getCookie(CookieStorageKey.REFRESH_TOKEN);
          if (token && refreshToken) {
            setRememberMeCookie(token, refreshToken);
          }
        }

        return { success: true };
      } else {
        return {
          success: false,
          error: t("loginError") || "Đăng nhập thất bại",
        };
      }
    } catch (error: any) {
      console.error("Backend login error:", error);

      // Xử lý lỗi từ RTK Query
      if (error && error.data) {
        const errorData = error.data as ValidationErrorResponse;

        // Trả về dữ liệu lỗi chi tiết để xử lý ở component
        return {
          success: false,
          error: errorData.detail || t("generalError") || "Lỗi đăng nhập",
          errorData: errorData,
        };
      }

      // Thử đăng nhập với Firebase nếu backend thất bại
      try {
        await signInWithEmailAndPassword(auth, email, password);

        // Nếu Firebase thành công nhưng backend thất bại, xử lý lỗi
        const errorMessage = t("generalError") || "Lỗi đăng nhập";
        // showError(errorMessage)
        return { success: false, error: errorMessage };
      } catch (firebaseError: any) {
        console.error("Firebase login error:", firebaseError);

        let errorMessage = t("generalError") || "Lỗi đăng nhập";

        if (
          firebaseError.code === "auth/invalid-credential" ||
          firebaseError.code === "auth/wrong-password"
        ) {
          errorMessage =
            t("invalidCredentials") || "Thông tin đăng nhập không hợp lệ";
        } else if (firebaseError.code === "auth/user-not-found") {
          errorMessage = t("userNotFound") || "Không tìm thấy người dùng";
        }

        // showError(errorMessage)
        return { success: false, error: errorMessage };
      }
    }
  } catch (error: any) {
    console.error("Login error:", error);
    const errorMessage = t("generalError") || "Lỗi đăng nhập";
    // showError(errorMessage)
    return { success: false, error: errorMessage };
  }
};

/**
 * Xử lý đăng nhập với Google
 */
export const handleGoogleLogin = async ({
  t,
  loginGoogle,
  dispatch,
  router,
  rememberMe,
  setRememberMeCookie,
  getCookie,
  CookieStorageKey,
}: {
  t: any;
  loginGoogle: any;
  dispatch: any;
  router: any;
  rememberMe: boolean;
  setRememberMeCookie: (token: string, refreshToken: string) => void;
  getCookie: (key: string) => string | null;
  CookieStorageKey: { REFRESH_TOKEN: string };
}): Promise<{
  success: boolean;
  error?: string;
  errorData?: ValidationErrorResponse;
}> => {
  try {
    localStorage.setItem(AUTH_STATE_KEY, Date.now().toString());
    localStorage.removeItem(LOGIN_SUCCESS_SHOWN_KEY);

    // Cấu hình Google provider
    googleProvider.setCustomParameters({ prompt: "select_account" });

    // Mở popup đăng nhập Google
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (user) {
      try {
        // Lấy token từ Firebase
        const idToken = await user.getIdToken();

        // Gọi API backend để xác thực
        const loginGoogleResponse = await loginGoogle({
          googleToken: idToken,
        }).unwrap();

        // Xử lý đăng nhập thành công
        const provider = user.providerData[0]?.providerId || "Google";
        const userName = user.displayName || user.email || "";

        await processAuthSuccess({
          loginResponse: loginGoogleResponse.value,
          t,
          dispatch,
          router,
          provider,
          userName,
        });

        // Xử lý "Remember Me"
        if (rememberMe) {
          const token = getAccessToken();
          const refreshToken = getCookie(CookieStorageKey.REFRESH_TOKEN);
          if (token && refreshToken) {
            setRememberMeCookie(token, refreshToken);
          }
        }

        return { success: true };
      } catch (error: any) {
        console.error("Error processing Google authentication:", error);

        // Xử lý lỗi từ RTK Query
        if (error && error.data) {
          const errorData = error.data as ValidationErrorResponse;

          return {
            success: false,
            error:
              errorData.detail ||
              t("providerLoginError", { provider: "Google" }) ||
              "Đăng nhập với Google thất bại",
            errorData: errorData,
          };
        }

        const errorMessage =
          t("providerLoginError", { provider: "Google" }) ||
          "Đăng nhập với Google thất bại";
        showError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } else {
      const errorMessage =
        t("providerLoginError", { provider: "Google" }) ||
        "Đăng nhập với Google thất bại";
      showError(errorMessage);
      return { success: false, error: errorMessage };
    }
  } catch (error: any) {
    console.error("Google login error:", error);

    let errorMessage =
      t("providerLoginError", { provider: "Google" }) ||
      "Đăng nhập với Google thất bại";

    if (error.code === "auth/popup-closed-by-user") {
      errorMessage = t("authCancelled") || "Đăng nhập đã bị hủy";
    } else if (error.code === "auth/popup-blocked") {
      errorMessage = t("popupBlocked") || "Cửa sổ đăng nhập bị chặn";
    }

    showError(errorMessage);
    return { success: false, error: errorMessage };
  }
};

/**
 * Xử lý đăng xuất
 */
export const handleLogout = async ({
  router,
}: {
  router?: any;
}): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Đăng xuất khỏi Firebase
    await signOut(auth);

    // Gọi API đăng xuất của backend (nếu có)
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (apiError) {
      console.warn(
        "API logout error (không ảnh hưởng đến đăng xuất):",
        apiError
      );
    }

    // Xóa token và dữ liệu lưu trữ
    clearToken();
    localStorage.removeItem(AUTH_STATE_KEY);
    localStorage.removeItem(LOGIN_SUCCESS_SHOWN_KEY);
    document.cookie =
      "jwt-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict";
    // Hiển thị thông báo thành công
    try {
      showSuccess("Đăng xuất thành công");
    } catch (translationError) {
      showSuccess("Đăng xuất thành công");
    }

    window.location.href = "/login";

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    const errorMessage = "Đăng xuất thất bại";
    showError(errorMessage);
    return { success: false, error: errorMessage };
  }
};

/**
 * Kiểm tra trạng thái đăng nhập hiện tại
 */
export const checkAuthStatus = (): {
  isAuthenticated: boolean;
  userData: TokenData | null;
} => {
  const token = getAccessToken();
  if (token) {
    try {
      const userData = GetDataByToken(token) as TokenData;
      return {
        isAuthenticated: true,
        userData,
      };
    } catch (error) {
      console.error("Error parsing token:", error);
      clearToken();
    }
  }

  return {
    isAuthenticated: false,
    userData: null,
  };
};

/**
 * Hàm xử lý đăng nhập thành công (private)
 */
export const processAuthSuccess = async ({
  loginResponse,
  t,
  dispatch,
  router,
  provider,
  userName,
  isFirstLogin,
}: {
  loginResponse: any;
  t: any;
  dispatch: any;
  router: any;
  provider?: string;
  userName?: string;
  isFirstLogin?: string;
}): Promise<void> => {
  // Lưu token
  setAccessToken(loginResponse.accessToken);
  setRefreshToken(loginResponse.refreshToken);

  // Cập nhật Redux store
  dispatch(setUser(loginResponse));

  // Lấy thông tin người dùng từ token
  const { accessToken } = loginResponse;
  const userData = GetDataByToken(accessToken) as TokenData;

  // Đánh dấu đã hiển thị thông báo thành công
  localStorage.setItem(LOGIN_SUCCESS_SHOWN_KEY, "true");

  // Hiển thị thông báo thành công
  try {
    if (provider) {
      showSuccess(
        t("providerLoginSuccess", { provider, userName: userName || "" }) ||
          `Đăng nhập thành công với ${provider}${
            userName ? ` (${userName})` : ""
          }`
      );
    } else {
      showSuccess(t("loginSuccess") || "Đăng nhập thành công");
    }
  } catch (translationError) {
    // Fallback nếu thiếu bản dịch
    showSuccess(
      provider
        ? `Đăng nhập thành công với ${provider}${
            userName ? ` (${userName})` : ""
          }`
        : "Đăng nhập thành công"
    );
  }
  const protectAction = localStorage.getItem("redirect") as string;
  if (protectAction) {
    localStorage.removeItem("redirect");
    router.back();
  }
  if (isFirstLogin == "True") {
    return;
  }
  // Chuyển hướng dựa trên vai trò
  else handleRedirectByRole(userData.roleName, router);
};

/**
 * Bảo vệ hành động cần đăng nhập, gọi callback nếu đã login, gọi `onRequireLogin` nếu chưa.
 */
export const handleProtectedAction = (
  callback: () => void,
  onRequireLogin: () => void
) => {
  const isLoggedIn = Boolean(getAccessToken());

  if (isLoggedIn) {
    callback();
  } else {
    onRequireLogin();
  }
};
