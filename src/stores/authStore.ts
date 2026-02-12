import AsyncStorage from "@react-native-async-storage/async-storage";
import create from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";
import { secureDelete, secureGet, secureSave } from "../utils/secureStore";

type User = { id: string; name: string; email: string; avatar?: string } | null;

type AuthState = {
  user: User;
  token: string | null;
  loading: boolean;
  setUser: (u: User) => void;
  login: (email: string, password: string) => Promise<void>;
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
      login: async (email, password) => {
        set({ loading: true });
        try {
          // replace with real endpoint
          const res = await api.post("/api/v1/users/login", {
            email,
            password,
          });
          const token = res.data?.token || "demo-token";
          await secureSave("auth_token", token);
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          // fetch profile (fake)
          const profile = { id: "1", name: "Demo User", email };
          set({ user: profile, token, loading: false });
        } catch (e) {
          set({ loading: false });
          throw e;
        }
      },
      logout: async () => {
        await secureDelete("auth_token");
        delete api.defaults.headers.common.Authorization;
        set({ user: null, token: null });
      },
      tryAutoLogin: async () => {
        const token = await secureGet("auth_token");
        if (token) {
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          // optionally validate token
          set({
            token,
            user: { id: "1", name: "Demo User", email: "demo@example.com" },
          });
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => AsyncStorage,
    },
  ),
);
