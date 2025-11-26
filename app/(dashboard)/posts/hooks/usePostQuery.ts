import { getPost } from "@/services/posts.service";
import { useQuery } from "@tanstack/react-query";

export function usePostQuery(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });
}
