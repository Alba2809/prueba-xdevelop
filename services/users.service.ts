import { apiReqRes } from "@/lib/axios";
import { useUserRolesStore } from "@/stores/users.store";
import { ROLES } from "@/utils/constants";

export interface ReqResUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  role?: string;
}

export interface ReqResUserResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ReqResUser[];
}

export async function getUsers(page: number): Promise<ReqResUserResponse> {
  const res = await apiReqRes.get(`/api/users?page=${page}`);

  return res.data;
}

// se asigna un rol aleatorio a los usuarios
export function useAssignRoles(users: ReqResUser[]) {
  const { roles, setRole } = useUserRolesStore.getState();

  return users.map((user) => {
    if (!roles[user.id]) {
      // se asigna el rol aleatorio
      const random = Math.floor(Math.random() * 100);
      const role = random < 50 ? ROLES.ADMIN : ROLES.USER;
      setRole(user.id, role);
      user.role = role;
    } else {
      user.role = roles[user.id];
    }

    return user;
  });
}

// se eliminan los usuarios de zustand
export function deleteUsers(users: ReqResUser[]) {
  const { deleteRole } = useUserRolesStore.getState();

  return users.map((user) => {
    deleteRole(user.id);

    return user;
  });
}

// se actualizan los roles de los usuarios de zustand
export function updateUsersRoles(users: ReqResUser[]) {
  const { updateRole } = useUserRolesStore.getState();

  return users.map((user) => {
    const oppositeRole = user.role === ROLES.ADMIN ? ROLES.USER : ROLES.ADMIN;
    updateRole(user.id, oppositeRole);

    return { ...user, role: oppositeRole };
  });
}
