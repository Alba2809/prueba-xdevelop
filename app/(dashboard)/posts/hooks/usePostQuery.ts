import { getPost } from "@/services/posts.service";
import { useQuery } from "@tanstack/react-query";

export function usePostQuery(
  id: number,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
    enabled: options?.enabled ?? true, // Solo se ejecuta si hay un id
  });
}
