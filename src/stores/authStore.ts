// src/stores/authStore.ts
import { create } from "zustand";
import api from "../api/axios";
import { secureDelete, secureGet, secureSave } from "../utils/secureStore";

type User = {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  avatar?: string;
} | null;

type AuthState = {
  user: User;
  token: string | null;
  loading: boolean;
  setUser: (u: User) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  tryAutoLogin: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,

  setUser: (u) => set({ user: u }),

  login: async (username: string, password: string) => {
    set({ loading: true });

    try {
      const res = await api.post("/api/v1/users/login", {
        username,
        password,
      });

      const token = res.data?.data?.accessToken;

      if (!token) {
        throw new Error("No token received from API");
      }

      // Save token securely
      await secureSave("auth_token", token);

      // Attach token to axios
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      const profile = res.data?.data?.user || null;

      set({
        user: profile,
        token,
        loading: false,
      });
    } catch (error) {
      console.log("Login error:", error);
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    await secureDelete("auth_token");

    delete api.defaults.headers.common.Authorization;

    set({
      user: null,
      token: null,
    });
  },

  tryAutoLogin: async () => {
    set({ loading: true });

    try {
      const token = await secureGet("auth_token");

      if (!token) {
        set({ loading: false });
        return;
      }

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      // Optional: validate token
      try {
        const res = await api.get("/api/v1/users/me");
        const profile = res.data?.data || null;

        set({
          user: profile,
          token,
          loading: false,
        });
      } catch {
        // Token invalid
        await secureDelete("auth_token");
        delete api.defaults.headers.common.Authorization;

        set({
          user: null,
          token: null,
          loading: false,
        });
      }
    } catch (error) {
      console.log("Auto login error:", error);
      set({ loading: false });
    }
  },
}));

// Call this once on app start
export const initializeAuth = async () => {
  const store = useAuthStore.getState();
  await store.tryAutoLogin();
};
