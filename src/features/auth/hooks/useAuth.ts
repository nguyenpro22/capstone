import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { setAccessToken, setRefreshToken } from "@/utils/tokenUtils";
import { showError, showSuccess } from "@/utils/toast";
import { publicRoutes } from "@/constants";
import { useLoginMutation } from "../api";
import { ILoginRequest } from "../types";

export const useAuth = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  // const [register] = useRegisterMutation();

  const handleLogin = useCallback(
    async (credentials: ILoginRequest) => {
      try {
        const response = await login(credentials).unwrap();
        if (response.isSuccess) {
          const { accessToken, refreshToken } = response.value;
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          showSuccess("Login successful");
          router.push(publicRoutes.HOME);
        }
      } catch (error) {
        showError("Login failed");
        console.log(error);
      }
    },
    [login, router]
  );

  return { handleLogin };
};
