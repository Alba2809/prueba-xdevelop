import { getComments, getPost } from "@/services/posts.service";
import { useQuery } from "@tanstack/react-query";

export function usePostDetailsQuery(id: number, options = {}) {
  // Se eliminó el uso de la query para obtener el post
  // ya que se está pasando el post directamente al sheet
  // pero, dependiendo del contexto, puede ser necesario tener la query
  const post = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
    enabled: !!id, // Solo se ejecuta si hay un id
    ...options, // Permite pasar opciones adicionales como `enabled`
  });

  const comments = useQuery({
    queryKey: ["posts", id, "comments"],
    queryFn: () => getComments(id),
    enabled: !!id, // Solo se ejecuta si hay un id
    ...options, // Permite pasar opciones adicionales como `enabled`
  });

  return {
    post,
    comments,
  };
}
