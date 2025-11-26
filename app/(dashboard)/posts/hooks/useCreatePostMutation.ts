import { createPost } from "@/services/posts.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreatePostMutation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // se invalida caché para que se actualice el estado de la lista de posts
      qc.invalidateQueries({ queryKey: ["posts"] });
    }
  });
}
