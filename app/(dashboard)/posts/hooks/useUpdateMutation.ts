import { Post, updatePost } from "@/services/posts.service";
import { useMutation } from "@tanstack/react-query";

/* export function useUpdatePostMutation(id: string, data: Partial<Post>) {
  return useMutation({
    mutationKey: ["updatePost", id, data],
    mutationFn: (id, data) => updatePost(id, data),
  });
} */
