import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILoginResponse } from "../types";
import { authApi } from "../api";
import { RootState } from "@/store";
import { IResCommon } from "@/lib/api";

interface AuthState {
  user: ILoginResponse | null;
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
    setCredentials: (
      state,
      action: PayloadAction<IResCommon<ILoginResponse>>
    ) => {
      const { value } = action.payload;
      // state.user = value.user;
      state.isAuthenticated = true;
      state.accessToken = value.accessToken;
      state.refreshToken = value.refreshToken;
    },
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        const { value } = payload;
        // state.user = value.user;
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

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
