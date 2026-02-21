// src/stores/authStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";
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

export const useAuthStore = create<AuthState>(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      setUser: (u) => set({ user: u }),
      login: async (username: string, password: string) => {
        set({ loading: true });
        try {
          // Login request: POST { username, password }
          const res = await api.post("/api/v1/users/login", {
            username,
            password,
          });

          // Try common token locations:
          const token =
            res.data?.token ||
            res.data?.data?.token ||
            res.data?.accessToken ||
            null;

          if (!token) {
            // If backend returns full object, adapt here as needed
            throw new Error("No token returned from login");
          }

          // Persist token securely
          await secureSave("auth_token", token);

          // Attach to axios defaults
          api.defaults.headers.common.Authorization = `Bearer ${token}`;

          // Try to fetch profile (if API provides /me)
          let profile = null;
          try {
            const me = await api.get("/api/v1/users/me");
            profile = me.data?.data || me.data || null;
          } catch (e) {
            // fallback: if login response contains user object
            profile = res.data?.user || res.data?.data?.user || null;
          }

          set({ user: profile, token, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      logout: async () => {
        try {
          await secureDelete("auth_token");
        } catch (e) {
          // ignore
        }
        delete api.defaults.headers.common.Authorization;
        set({ user: null, token: null });
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

          // Validate token by fetching profile (optional)
          try {
            const me = await api.get("/api/v1/users/me");
            const profile = me.data?.data || me.data || null;
            set({ token, user: profile, loading: false });
          } catch (e) {
            // token invalid -> clear
            await secureDelete("auth_token");
            delete api.defaults.headers.common.Authorization;
            set({ token: null, user: null, loading: false });
          }
        } catch (e) {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => AsyncStorage,
    },
  ),
);
