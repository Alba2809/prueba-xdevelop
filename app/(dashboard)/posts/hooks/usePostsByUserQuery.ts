import { getPostsByUser } from "@/services/posts.service";
import { useQuery } from "@tanstack/react-query";

export function usePostsByUserQuery(userId: number) {
  return useQuery({
    queryKey: ["posts", "user", userId],
    queryFn: () => getPostsByUser(userId),
  });
}
