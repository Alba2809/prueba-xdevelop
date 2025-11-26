import { create } from "zustand";

interface AuthState {
  user: any | null;
  role: "admin" | "user" | null;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,

  setUser: (user) => set({ user }),

  logout: () => set({ user: null, role: null }),
}));
