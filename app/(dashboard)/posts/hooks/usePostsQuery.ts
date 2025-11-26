import { getPosts } from "@/services/posts.service";
import { useQuery } from "@tanstack/react-query";

export function usePostsQuery() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    staleTime: 1000 * 60, // 1 minuto para evitar refrescar la consulta
  });
}
