// src/stores/authStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";
import { secureDelete, secureGet, secureSave } from "../utils/secureStore";

// Helper to retry secure storage with delay and retry logic
const secureSaveWithRetry = async (
  key: string,
  value: string,
  maxRetries = 3,
  delayMs = 100,
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
      await secureSave(key, value);
      return;
    } catch (e) {
      console.warn(
        `Attempt ${i + 1}/${maxRetries} to save token failed:`,
        (e as any).message,
      );
      if (i === maxRetries - 1) throw e;
    }
  }
};

const secureGetWithRetry = async (
  key: string,
  maxRetries = 3,
  delayMs = 100,
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
      return await secureGet(key);
    } catch (e) {
      console.warn(
        `Attempt ${i + 1}/${maxRetries} to get token failed:`,
        (e as any).message,
      );
      if (i === maxRetries - 1) throw e;
    }
  }
};

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
          console.log("Attempting login with:", { username });
          const res = await api.post("/api/v1/users/login", {
            username,
            password,
          });

          console.log("Login response:", JSON.stringify(res.data, null, 2));

          // Try common token locations:
          const token =
            res.data?.token ||
            res.data?.data?.token ||
            res.data?.accessToken ||
            null;

          console.log("Extracted token:", token ? "present" : "missing");

          if (!token) {
            // If backend returns full object, adapt here as needed
            throw new Error(
              `No token in response. Got: ${JSON.stringify(res.data)}`,
            );
          }

          // Persist token securely with retry logic
          try {
            await secureSaveWithRetry("auth_token", token);
          } catch (e) {
            console.warn(
              "Failed to save token to secure storage after retries:",
              e,
            );
          }

          // Attach to axios defaults
          api.defaults.headers.common.Authorization = `Bearer ${token}`;

          // Try to fetch profile (if API provides /me)
          let profile = null;
          try {
            const me = await api.get("/api/v1/users/me");
            profile = me.data?.data || me.data || null;
            console.log("Fetched profile:", profile);
          } catch (e) {
            console.warn("Failed to fetch profile, using fallback:", e);
            // fallback: if login response contains user object
            profile = res.data?.user || res.data?.data?.user || null;
          }

          if (!profile) {
            console.warn("No profile found, setting minimal user object");
            profile = { username, id: username };
          }

          console.log("Setting user:", profile);
          set({ user: profile, token, loading: false });
        } catch (error: any) {
          console.error("Login failed:", error?.message, error?.response?.data);
          set({ loading: false });
          throw error;
        }
      },
      logout: async () => {
        try {
          await secureDelete("auth_token");
        } catch (e) {
          console.warn("Failed to delete token from secure storage:", e);
        }
        delete api.defaults.headers.common.Authorization;
        set({ user: null, token: null });
      },
      tryAutoLogin: async () => {
        set({ loading: true });
        try {
          let token: string | null = null;
          try {
            token = await secureGetWithRetry("auth_token");
          } catch (e) {
            console.warn("Failed to retrieve token from secure storage:", e);
            set({ loading: false });
            return;
          }

          if (!token) {
            console.log("No stored token found");
            set({ loading: false });
            return;
          }

          console.log("Found stored token, validating...");
          api.defaults.headers.common.Authorization = `Bearer ${token}`;

          // Validate token by fetching profile (optional)
          try {
            const me = await api.get("/api/v1/users/me");
            const profile = me.data?.data || me.data || null;
            console.log("Auto-login successful, profile:", profile);
            set({ token, user: profile, loading: false });
          } catch (e: any) {
            console.warn(
              "Token validation failed:",
              e?.message,
              e?.response?.data,
            );
            // token invalid -> clear
            try {
              await secureDelete("auth_token");
            } catch (deleteError) {
              console.warn("Failed to delete token:", deleteError);
            }
            delete api.defaults.headers.common.Authorization;
            set({ token: null, user: null, loading: false });
          }
        } catch (e) {
          console.warn("Auto-login error:", e);
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => AsyncStorage,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn("Rehydrate error:", error);
        }
      },
    },
  ),
);
