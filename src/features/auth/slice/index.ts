import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ILoginResponse } from "../types";
import { authApi } from "../api";
import type { RootState } from "@/store";
import type { IResCommon } from "@/lib/api";
import { GetDataByToken, type TokenData } from "@/utils";

interface AuthState {
  user: TokenData | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<ILoginResponse>) => {
      const { accessToken, refreshToken } = action.payload;
      const user = GetDataByToken(accessToken);
      console.log("User data set in Redux:", user);

      state.user = user;
      state.isAuthenticated = true;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        const { value } = payload;
        // Extract user data from token, consistent with setCredentials
        const user = GetDataByToken(value.accessToken);
        state.user = user;
        state.isAuthenticated = true;
        state.accessToken = value.accessToken;
        state.refreshToken = value.refreshToken;
      }
    );
  },
});

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
