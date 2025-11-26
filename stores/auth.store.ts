import { create } from "zustand";

interface AuthState {
  role: "admin" | "user" | null;
  accessToken: string | null;
  userId: number | null;

  setRole: (role: "admin" | "user") => void;
  setAccessToken: (token: string) => void;
  setUserId: (id: number) => void;

  isAdmin: () => boolean;

  // setUser: (user: any) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  role: null,
  accessToken: null,
  userId: null,

  setRole: (role) => set({ role }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setUserId: (userId) => set({ userId }),

  isAdmin: () => get().role === "admin",

  clearAuth: () =>
    set({
      role: null,
      accessToken: null,
      userId: null,
    }),
}));
