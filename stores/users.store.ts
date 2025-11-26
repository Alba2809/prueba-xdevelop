import { create } from "zustand";

interface UserRolesState {
  roles: Record<number, string>; // mapa idUsuario -> rol
  setRole: (id: number, role: string) => void;
  deleteRole: (id: number) => void;
  updateRole: (id: number, role: string) => void;
}

export const useUserRolesStore = create<UserRolesState>((set) => ({
  roles: {},
  setRole: (id, role) =>
    set((state) => ({
      roles: { ...state.roles, [id]: role },
    })),
  deleteRole: (id) =>
    set((state) => {
      delete state.roles[id];
      return { roles: { ...state.roles } };
    }),
  updateRole: (id, role) =>
    set((state) => {
      state.roles[id] = role;
      return { roles: { ...state.roles } };
    }),
}));
