import { deletePost } from "@/services/posts.service";
import { useMutation } from "@tanstack/react-query";

export function useDeletePostMutation() {
  return useMutation({
    mutationFn: deletePost,
  });
}
