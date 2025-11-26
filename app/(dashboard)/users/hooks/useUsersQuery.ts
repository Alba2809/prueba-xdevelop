import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/users.service";

export function useUsersQuery(page: number) {
  return useQuery({
    queryKey: ["users", page],
    queryFn: () => getUsers(page),
    staleTime: 1000 * 60, // 1 minuto para evitar refrescar la consulta
  });
}
